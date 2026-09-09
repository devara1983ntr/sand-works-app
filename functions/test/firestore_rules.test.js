const { initializeTestEnvironment, assertFails, assertSucceeds } = require('@firebase/rules-unit-testing');
const fs = require('fs');
const path = require('path');
const test = require('node:test');
const assert = require('node:assert');

const PROJECT_ID = 'demo-sand-works';

test('Firestore Security Rules Hostile Verification', async (t) => {
  const rulesPath = path.resolve(__dirname, '../../firestore.rules');
  const testEnv = await initializeTestEnvironment({
    projectId: PROJECT_ID,
    firestore: {
      rules: fs.readFileSync(rulesPath, 'utf8'),
      host: '127.0.0.1',
      port: 8088,
    },
  });


  // Setup initial fixture data using admin context
  await testEnv.withSecurityRulesDisabled(async (context) => {
    const adminDb = context.firestore();
    
    // Seed Owner
    await adminDb.collection('users').doc('owner_ramesh').set({
      uid: 'owner_ramesh',
      fullName: 'Ramesh Sahu',
      role: 'OWNER',
      status: 'ACTIVE',
      email: 'ramesh@sandworks.local'
    });

    // Seed Approved Driver
    await adminDb.collection('users').doc('driver_mansingh').set({
      uid: 'driver_mansingh',
      fullName: 'Mansingh Rana',
      role: 'DRIVER',
      status: 'ACTIVE',
      email: 'mansingh@sandworks.local'
    });

    // Seed Approved Labourer
    await adminDb.collection('users').doc('labourer_bikas').set({
      uid: 'labourer_bikas',
      fullName: 'Bikas Kumar',
      role: 'LABOURER',
      status: 'ACTIVE',
      email: 'bikas@sandworks.local'
    });

    // Seed Active Tractor
    await adminDb.collection('tractors').doc('tr_sonalika').set({
      id: 'tr_sonalika',
      name: 'Sonalika DI 745',
      registrationNumber: 'OD-02-S-1001',
      isActive: true,
      totalTrips: 5
    });

    // Seed a Closed Date
    await adminDb.collection('daily_closures').doc('closure_2026-09-01').set({
      id: 'closure_2026-09-01',
      date: '2026-09-01',
      totalTrips: 10,
      totalPoolPaise: 200000,
      closedAt: 1725200000000,
      summaryNotice: 'Daily accrued-money summary'
    });

    // Seed an Active Temporary Driver Assignment for Labourer
    await adminDb.collection('temp_assignments').doc('temp_assign_bikas').set({
      id: 'temp_assign_bikas',
      assigningOwnerId: 'owner_ramesh',
      targetUserId: 'labourer_bikas',
      targetUserName: 'Bikas Kumar',
      tractorId: 'tr_sonalika',
      assignedRole: 'DRIVER',
      startTime: Date.now() - 3600000,
      expiryTime: Date.now() + 14400000, // 4 hours in future
      status: 'ACTIVE'
    });
  });

  await t.test('1. Unauthenticated read to users collection is denied', async () => {
    const unauthDb = testEnv.unauthenticatedContext().firestore();
    await assertFails(unauthDb.collection('users').doc('owner_ramesh').get());
  });

  await t.test('2. Unauthenticated write to trips collection is denied', async () => {
    const unauthDb = testEnv.unauthenticatedContext().firestore();
    await assertFails(unauthDb.collection('trips').doc('fake_trip').set({
      tripNumber: 1,
      rateSnapshotPaise: 20000
    }));
  });

  await t.test('3. Hostile self-escalation: User registering with role=OWNER is denied', async () => {
    const maliciousUserDb = testEnv.authenticatedContext('attacker_uid').firestore();
    await assertFails(maliciousUserDb.collection('users').doc('attacker_uid').set({
      uid: 'attacker_uid',
      fullName: 'Attacker',
      role: 'OWNER',
      status: 'PENDING',
      email: 'attacker@evil.com'
    }));
  });

  await t.test('4. Hostile self-activation: User registering with status=ACTIVE is denied', async () => {
    const maliciousUserDb = testEnv.authenticatedContext('attacker_uid').firestore();
    await assertFails(maliciousUserDb.collection('users').doc('attacker_uid').set({
      uid: 'attacker_uid',
      fullName: 'Attacker',
      role: 'DRIVER',
      status: 'ACTIVE',
      email: 'attacker@evil.com'
    }));
  });

  await t.test('5. Legitimate registration: role=DRIVER, status=PENDING is allowed', async () => {
    const applicantDb = testEnv.authenticatedContext('new_applicant_uid').firestore();
    await assertSucceeds(applicantDb.collection('users').doc('new_applicant_uid').set({
      uid: 'new_applicant_uid',
      fullName: 'New Driver',
      role: 'DRIVER',
      status: 'PENDING',
      email: 'newdriver@sandworks.local'
    }));
  });

  await t.test('6. Non-owner trying to approve user is denied', async () => {
    const driverDb = testEnv.authenticatedContext('driver_mansingh').firestore();
    await assertFails(driverDb.collection('users').doc('new_applicant_uid').update({
      status: 'ACTIVE'
    }));
  });

  await t.test('7. Owner approving user is allowed', async () => {
    const ownerDb = testEnv.authenticatedContext('owner_ramesh').firestore();
    await assertSucceeds(ownerDb.collection('users').doc('new_applicant_uid').update({
      status: 'ACTIVE'
    }));
  });

  await t.test('8. Retroactive trip addition on closed date is denied', async () => {
    const driverDb = testEnv.authenticatedContext('driver_mansingh').firestore();
    await assertFails(driverDb.collection('trips').doc('trip_retroactive').set({
      id: 'trip_retroactive',
      tripNumber: 99,
      tractorId: 'tr_sonalika',
      driverId: 'driver_mansingh',
      labourerIds: ['labourer_bikas'],
      rateSnapshotPaise: 20000,
      totalPoolPaise: 20000,
      date: '2026-09-01', // Date is CLOSED in daily_closures
      status: 'ACTIVE',
      timestamp: Date.now()
    }));
  });

  await t.test('9. Labourer WITHOUT temporary assignment creating trip is denied', async () => {
    const randomLabourerDb = testEnv.authenticatedContext('unauthorized_labourer').firestore();
    await assertFails(randomLabourerDb.collection('trips').doc('trip_unauth').set({
      id: 'trip_unauth',
      tripNumber: 1,
      tractorId: 'tr_sonalika',
      driverId: 'unauthorized_labourer',
      labourerIds: [],
      rateSnapshotPaise: 20000,
      totalPoolPaise: 20000,
      date: '2026-09-08',
      status: 'ACTIVE',
      timestamp: Date.now()
    }));
  });

  await t.test('10. Labourer WITH active temporary assignment creating trip is allowed', async () => {
    const tempDriverDb = testEnv.authenticatedContext('labourer_bikas').firestore();
    await assertSucceeds(tempDriverDb.collection('trips').doc('trip_temp_driver').set({
      id: 'trip_temp_driver',
      tripNumber: 11,
      tractorId: 'tr_sonalika',
      driverId: 'labourer_bikas',
      labourerIds: [],
      tempAssignmentId: 'temp_assign_bikas',
      rateSnapshotPaise: 20000,
      totalPoolPaise: 20000,
      date: '2026-09-08',
      status: 'ACTIVE',
      timestamp: Date.now()
    }));
  });

  await t.test('11. Non-owner trying to void a trip is denied', async () => {
    const driverDb = testEnv.authenticatedContext('driver_mansingh').firestore();
    await assertFails(driverDb.collection('trips').doc('trip_temp_driver').update({
      status: 'VOIDED',
      voidReason: 'Driver tried to void'
    }));
  });

  await t.test('12. Owner voiding trip without a reason is denied', async () => {
    const ownerDb = testEnv.authenticatedContext('owner_ramesh').firestore();
    await assertFails(ownerDb.collection('trips').doc('trip_temp_driver').update({
      status: 'VOIDED',
      voidReason: '' // Empty reason prohibited
    }));
  });

  await t.test('13. Owner voiding trip with valid reason is allowed', async () => {
    const ownerDb = testEnv.authenticatedContext('owner_ramesh').firestore();
    await assertSucceeds(ownerDb.collection('trips').doc('trip_temp_driver').update({
      status: 'VOIDED',
      voidReason: 'Operator error: duplicate trip recorded'
    }));
  });

  await t.test('14. Hostile un-voiding of an already voided trip is denied', async () => {
    const ownerDb = testEnv.authenticatedContext('owner_ramesh').firestore();
    await assertFails(ownerDb.collection('trips').doc('trip_temp_driver').update({
      status: 'ACTIVE'
    }));
  });

  await t.test('15. Tampering with financial fields (rateSnapshotPaise) on update is denied', async () => {
    const ownerDb = testEnv.authenticatedContext('owner_ramesh').firestore();
    await assertFails(ownerDb.collection('trips').doc('trip_temp_driver').update({
      rateSnapshotPaise: 999999
    }));
  });

  await t.test('16. Non-owner modifying daily_closures is denied', async () => {
    const driverDb = testEnv.authenticatedContext('driver_mansingh').firestore();
    await assertFails(driverDb.collection('daily_closures').doc('closure_2026-09-08').set({
      date: '2026-09-08',
      totalTrips: 1
    }));
  });

  await t.test('17. Non-owner writing to metadata/trip_counter is denied', async () => {
    const driverDb = testEnv.authenticatedContext('driver_mansingh').firestore();
    await assertFails(driverDb.collection('metadata').doc('trip_counter').set({
      lastTripNumber: 0
    }));
  });

  await testEnv.cleanup();
});
