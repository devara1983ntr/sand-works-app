import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();

export const DEFAULT_TRIP_RATE_PAISE = 20000; // ₹200.00

/**
 * Deterministic integer-paise distribution with remainder reconciliation.
 * Invariant: Sum of all distributed shares MUST exactly equal poolPaise.
 */
export function calculateDistribution(
  poolPaise: number,
  driverId: string,
  labourerIds: string[],
  rule: "EQUAL" | "DRIVER_LABOUR_RATIO" = "EQUAL"
): { [uid: string]: number } {
  if (poolPaise <= 0 || !driverId || driverId.trim() === "") return {};

  const cleanLabourers = Array.from(
    new Set(labourerIds.filter((id) => id && id.trim() !== "" && id !== driverId))
  ).sort();

  const allParticipants = [driverId, ...cleanLabourers];
  const count = allParticipants.length;

  if (count === 1) {
    return { [driverId]: poolPaise };
  }

  const result: { [uid: string]: number } = {};

  if (rule === "DRIVER_LABOUR_RATIO") {
    // Driver gets 40%, remaining 60% split equally among labourers
    const driverBase = Math.floor((poolPaise * 40) / 100);
    const labourPool = poolPaise - driverBase;
    const labourCount = cleanLabourers.length;

    if (labourCount > 0) {
      const labourBase = Math.floor(labourPool / labourCount);
      let remainder = labourPool % labourCount;
      result[driverId] = driverBase;
      for (const id of cleanLabourers) {
        const extra = remainder > 0 ? 1 : 0;
        if (remainder > 0) remainder--;
        result[id] = labourBase + extra;
      }
    } else {
      result[driverId] = poolPaise;
    }
  } else {
    // EQUAL distribution
    const base = Math.floor(poolPaise / count);
    let remainder = poolPaise % count;
    for (const id of allParticipants) {
      const extra = remainder > 0 ? 1 : 0;
      if (remainder > 0) remainder--;
      result[id] = base + extra;
    }
  }

  // Integrity assertion: reconcile remainder
  const sum = Object.values(result).reduce((acc, curr) => acc + curr, 0);
  if (sum !== poolPaise) {
    const diff = poolPaise - sum;
    result[driverId] = (result[driverId] || 0) + diff;
  }

  return result;
}

/**
 * 1. Server-Authoritative Trip Creation with Concurrency-Safe Trip Numbering & Idempotency
 */
export const createTrip = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "Authentication required");
  }

  const callerUid = context.auth.uid;
  const {
    tractorId,
    tractorName,
    driverId,
    driverName,
    labourerIds = [],
    labourerNames = [],
    idempotencyKey,
    distributionRule = "EQUAL",
  } = data;

  if (!tractorId || !driverId || !idempotencyKey) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Missing required fields: tractorId, driverId, or idempotencyKey"
    );
  }

  // Concurrency-safe Firestore transaction
  return await db.runTransaction(async (transaction) => {
    // A. Idempotency Check
    const idemDocRef = db.collection("idempotency_keys").doc(idempotencyKey);
    const idemSnap = await transaction.get(idemDocRef);
    if (idemSnap.exists) {
      const existingTripId = idemSnap.data()?.tripId;
      if (existingTripId) {
        const tripDoc = await transaction.get(db.collection("trips").doc(existingTripId));
        return { success: true, trip: tripDoc.data(), duplicate: true };
      }
    }

    // B. Authorization Check
    const callerDoc = await transaction.get(db.collection("users").doc(callerUid));
    if (!callerDoc.exists) {
      throw new functions.https.HttpsError("permission-denied", "Caller profile not found");
    }
    const callerData = callerDoc.data()!;
    const isOwner = callerData.role === "OWNER";
    const isActive = callerData.status === "ACTIVE";

    // Verify caller is driver or owner, or has active temporary assignment
    if (!isOwner) {
      if (callerUid !== driverId || !isActive) {
        throw new functions.https.HttpsError("permission-denied", "Unauthorized to record trip");
      }
      // Check if driver role or active temp assignment
      if (callerData.role !== "DRIVER") {
        const now = Date.now();
        const tempAssigns = await db
          .collection("temp_assignments")
          .where("targetUserId", "==", callerUid)
          .where("status", "==", "ACTIVE")
          .get();

        const hasValidAssignment = tempAssigns.docs.some((doc) => {
          const d = doc.data();
          return d.startTime <= now && d.expiryTime >= now;
        });

        if (!hasValidAssignment) {
          throw new functions.https.HttpsError(
            "permission-denied",
            "Temporary driver assignment has expired or is invalid"
          );
        }
      }
    }

    // C. Retroactive Trip Creation Guard (Closed Accounting Date Invariant)
    const todayStr = new Date().toISOString().split("T")[0];
    const tripDate = data.date || todayStr;
    const closureRef = db.collection("daily_closures").doc(`closure_${tripDate}`);
    const closureSnap = await transaction.get(closureRef);
    if (closureSnap.exists) {
      throw new functions.https.HttpsError(
        "failed-precondition",
        `Accounting for date ${tripDate} has already been closed. Retroactive trip addition is prohibited.`
      );
    }

    // D. Validate Active Tractor
    const tractorRef = db.collection("tractors").doc(tractorId);
    const tractorSnap = await transaction.get(tractorRef);
    if (!tractorSnap.exists || !tractorSnap.data()?.isActive) {
      throw new functions.https.HttpsError("not-found", "Tractor is inactive or does not exist");
    }

    // E. Monotonic Collision-Safe Trip Numbering
    const counterRef = db.collection("metadata").doc("trip_counter");
    const counterSnap = await transaction.get(counterRef);
    let nextTripNumber = 1;
    if (counterSnap.exists) {
      nextTripNumber = (counterSnap.data()?.lastTripNumber || 0) + 1;
    }
    transaction.set(counterRef, { lastTripNumber: nextTripNumber, updatedAt: Date.now() }, { merge: true });

    // F. Calculate Money Distribution with Immutable Rate Snapshot
    const rateSnapshotPaise = DEFAULT_TRIP_RATE_PAISE; // Authoritative ₹200 (20000 paise)
    const sharesPaise = calculateDistribution(
      rateSnapshotPaise,
      driverId,
      labourerIds,
      distributionRule
    );

    const tripId = `trip_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const tripRef = db.collection("trips").doc(tripId);

    const tripData = {
      id: tripId,
      tripNumber: nextTripNumber,
      tractorId,
      tractorName: tractorName || tractorSnap.data()?.name || "Tractor",
      driverId,
      driverName: driverName || "Driver",
      labourerIds,
      labourerNames,
      rateSnapshotPaise,
      totalPoolPaise: rateSnapshotPaise,
      distributionRule,
      sharesPaise,
      date: tripDate,
      timestamp: Date.now(),
      status: "ACTIVE",
      idempotencyKey,
      revision: 1,
    };

    // Save trip, record idempotency key, increment tractor count
    transaction.set(tripRef, tripData);
    transaction.set(idemDocRef, { tripId, createdAt: Date.now() });
    transaction.update(tractorRef, {
      totalTrips: admin.firestore.FieldValue.increment(1),
      updatedAt: Date.now(),
    });

    // Server-Authoritative Audit Log
    const auditRef = db.collection("audit_logs").doc();
    transaction.set(auditRef, {
      id: auditRef.id,
      userId: callerUid,
      userName: callerData.fullName || "User",
      action: "TRIP_RECORDED_BACKEND",
      details: `Trip #${nextTripNumber} recorded on tractor ${tractorName} with pool ₹${rateSnapshotPaise / 100}`,
      timestamp: Date.now(),
    });

    return { success: true, trip: tripData, duplicate: false };
  });
});

/**
 * 2. Server-Authoritative Trip Voiding
 */
export const voidTrip = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "Authentication required");
  }

  const callerUid = context.auth.uid;
  const { tripId, voidReason } = data;

  if (!tripId || !voidReason || voidReason.trim() === "") {
    throw new functions.https.HttpsError("invalid-argument", "tripId and non-empty voidReason are required");
  }

  return await db.runTransaction(async (transaction) => {
    const callerDoc = await transaction.get(db.collection("users").doc(callerUid));
    if (!callerDoc.exists || callerDoc.data()?.role !== "OWNER") {
      throw new functions.https.HttpsError("permission-denied", "Only OWNER may void trips");
    }

    const tripRef = db.collection("trips").doc(tripId);
    const tripSnap = await transaction.get(tripRef);
    if (!tripSnap.exists) {
      throw new functions.https.HttpsError("not-found", "Trip not found");
    }

    const currentTrip = tripSnap.data()!;
    if (currentTrip.status === "VOIDED") {
      return { success: true, message: "Trip is already voided" };
    }

    transaction.update(tripRef, {
      status: "VOIDED",
      voidReason: voidReason.trim(),
      voidedAt: Date.now(),
      voidedBy: callerUid,
      revision: admin.firestore.FieldValue.increment(1),
    });

    // Audit log
    const auditRef = db.collection("audit_logs").doc();
    transaction.set(auditRef, {
      id: auditRef.id,
      userId: callerUid,
      userName: callerDoc.data()?.fullName || "Owner",
      action: "TRIP_VOIDED_BACKEND",
      details: `Trip #${currentTrip.tripNumber} voided. Reason: ${voidReason.trim()}`,
      timestamp: Date.now(),
    });

    return { success: true };
  });
});

/**
 * 3. Daily Accrued-Money Closure Scheduled at 19:30 IST (14:00 UTC)
 */
export const scheduledDailyClosure = functions.pubsub
  .schedule("30 19 * * *")
  .timeZone("Asia/Kolkata")
  .onRun(async () => {
    const todayDate = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" }); // YYYY-MM-DD
    await executeDailyClosure(todayDate, "SYSTEM_SCHEDULED_19_30_IST");
  });

export const manualDailyClosure = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "Authentication required");
  }

  const callerDoc = await db.collection("users").doc(context.auth.uid).get();
  if (!callerDoc.exists || callerDoc.data()?.role !== "OWNER") {
    throw new functions.https.HttpsError("permission-denied", "Only OWNER may trigger manual closure");
  }

  const { date } = data;
  const targetDate = date || new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
  return await executeDailyClosure(targetDate, context.auth.uid);
});

async function executeDailyClosure(dateStr: string, actorId: string) {
  const closureRef = db.collection("daily_closures").doc(`closure_${dateStr}`);
  const existingSnap = await closureRef.get();

  if (existingSnap.exists && existingSnap.data()?.isFinalized) {
    return { success: true, message: `Closure for ${dateStr} already finalized`, closure: existingSnap.data() };
  }

  const tripsSnap = await db
    .collection("trips")
    .where("date", "==", dateStr)
    .where("status", "==", "ACTIVE")
    .get();

  let totalPool = 0;
  const driverAccruals: { [uid: string]: number } = {};
  const labourerAccruals: { [uid: string]: number } = {};
  const tripIds: string[] = [];

  tripsSnap.forEach((doc) => {
    const trip = doc.data();
    tripIds.push(doc.id);
    totalPool += trip.totalPoolPaise || 0;
    const shares: { [uid: string]: number } = trip.sharesPaise || {};

    for (const [uid, share] of Object.entries(shares)) {
      if (uid === trip.driverId) {
        driverAccruals[uid] = (driverAccruals[uid] || 0) + share;
      } else {
        labourerAccruals[uid] = (labourerAccruals[uid] || 0) + share;
      }
    }
  });

  const closureData = {
    id: `closure_${dateStr}`,
    date: dateStr,
    totalTrips: tripsSnap.size,
    totalPoolPaise: totalPool,
    driverAccrualsPaise: driverAccruals,
    labourerAccrualsPaise: labourerAccruals,
    tripIds,
    closedAt: Date.now(),
    closedBy: actorId,
    isFinalized: true,
    summaryNotice: `Daily accrued-money summary for ${dateStr}`,
  };

  await closureRef.set(closureData);

  // Server audit log
  await db.collection("audit_logs").add({
    userId: actorId,
    userName: actorId.startsWith("SYSTEM") ? "Cloud Scheduler" : "Owner",
    action: "DAILY_CLOSURE_FINALIZED",
    details: `Finalized daily closure for ${dateStr}: ${tripsSnap.size} trips, total ₹${totalPool / 100} accrued`,
    timestamp: Date.now(),
  });

  return { success: true, closure: closureData };
}

/**
 * 4. Authoritative Leaderboard Aggregation (Weekly on Monday 00:00 IST & Monthly on 1st 00:00 IST)
 */
export const scheduledWeeklyLeaderboard = functions.pubsub
  .schedule("0 0 * * 1")
  .timeZone("Asia/Kolkata")
  .onRun(async () => {
    await computeLeaderboardInternal("WEEKLY");
  });

export const scheduledMonthlyLeaderboard = functions.pubsub
  .schedule("0 0 1 * *")
  .timeZone("Asia/Kolkata")
  .onRun(async () => {
    await computeLeaderboardInternal("MONTHLY");
  });

export const computeLeaderboards = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "Authentication required");
  }
  const period = data.period === "MONTHLY" ? "MONTHLY" : "WEEKLY";
  return await computeLeaderboardInternal(period);
});

async function computeLeaderboardInternal(period: "WEEKLY" | "MONTHLY") {
  const now = Date.now();
  const windowDays = period === "WEEKLY" ? 7 : 30;
  const startTime = now - windowDays * 24 * 60 * 60 * 1000;

  const tripsSnap = await db
    .collection("trips")
    .where("timestamp", ">=", startTime)
    .where("status", "==", "ACTIVE")
    .get();

  const driverCounts: { [id: string]: { name: string; count: number } } = {};
  const labourerCounts: { [id: string]: { name: string; count: number } } = {};

  tripsSnap.forEach((doc) => {
    const t = doc.data();
    if (t.driverId) {
      if (!driverCounts[t.driverId]) driverCounts[t.driverId] = { name: t.driverName || "Driver", count: 0 };
      driverCounts[t.driverId].count++;
    }
    if (Array.isArray(t.labourerIds)) {
      t.labourerIds.forEach((id: string, idx: number) => {
        const name = (t.labourerNames && t.labourerNames[idx]) || "Labourer";
        if (!labourerCounts[id]) labourerCounts[id] = { name, count: 0 };
        labourerCounts[id].count++;
      });
    }
  });

  const sortRank = (map: { [id: string]: { name: string; count: number } }) => {
    return Object.entries(map)
      .map(([id, info]) => ({ id, name: info.name, count: info.count }))
      .sort((a, b) => b.count - a.count);
  };

  const topDrivers = sortRank(driverCounts).slice(0, 3);
  const topLabourers = sortRank(labourerCounts).slice(0, 3);

  const leaderboardDocId = `${period.toLowerCase()}_${new Date().toISOString().split("T")[0]}`;
  const record = {
    id: leaderboardDocId,
    period,
    computedAt: now,
    topDrivers,
    topLabourers,
  };

  await db.collection("leaderboards").doc(leaderboardDocId).set(record);
  return record;
}

/**
 * 5. Temporary Driver Access State Machine & Auto-Expiry
 */
export const grantTemporaryAccess = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new functions.https.HttpsError("unauthenticated", "Auth required");

  const callerDoc = await db.collection("users").doc(context.auth.uid).get();
  if (!callerDoc.exists || callerDoc.data()?.role !== "OWNER") {
    throw new functions.https.HttpsError("permission-denied", "Only OWNER may grant temporary driver access");
  }

  const { targetUserId, tractorId, durationHours = 8, reason = "Seasonal peak driver assignment" } = data;
  if (!targetUserId || !tractorId) {
    throw new functions.https.HttpsError("invalid-argument", "targetUserId and tractorId required");
  }

  const now = Date.now();
  const expiry = now + durationHours * 3600 * 1000;
  const assignmentId = `temp_${Date.now()}_${targetUserId.substring(0, 5)}`;

  const assignment = {
    id: assignmentId,
    assigningOwnerId: context.auth.uid,
    targetUserId,
    tractorId,
    assignedRole: "DRIVER",
    startTime: now,
    expiryTime: expiry,
    reason: reason.trim(),
    status: "ACTIVE",
    createdAt: now,
  };

  await db.collection("temp_assignments").doc(assignmentId).set(assignment);

  await db.collection("audit_logs").add({
    userId: context.auth.uid,
    userName: callerDoc.data()?.fullName || "Owner",
    action: "TEMP_ACCESS_GRANTED",
    details: `Granted temporary driver access to worker ${targetUserId} until ${new Date(expiry).toISOString()}`,
    timestamp: now,
  });

  return { success: true, assignment };
});

export const checkExpiredTemporaryAssignments = functions.pubsub
  .schedule("every 15 minutes")
  .onRun(async () => {
    const now = Date.now();
    const activeAssignments = await db
      .collection("temp_assignments")
      .where("status", "==", "ACTIVE")
      .where("expiryTime", "<=", now)
      .get();

    const batch = db.batch();
    activeAssignments.forEach((doc) => {
      batch.update(doc.ref, { status: "EXPIRED", expiredAt: now });
    });

    if (!activeAssignments.empty) {
      await batch.commit();
      console.log(`Expired ${activeAssignments.size} temporary assignments.`);
    }
  });
