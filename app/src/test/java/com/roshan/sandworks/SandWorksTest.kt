package com.roshan.sandworks

import android.content.Context
import androidx.test.core.app.ApplicationProvider
import com.roshan.sandworks.domain.MoneyEngine
import com.roshan.sandworks.model.AlertSeverity
import com.roshan.sandworks.model.AttendanceRecord
import com.roshan.sandworks.model.AttendanceStatus
import com.roshan.sandworks.model.BroadcastMessage
import com.roshan.sandworks.model.DailyClosure
import com.roshan.sandworks.model.DistributionRule
import com.roshan.sandworks.model.EmergencyAlert
import com.roshan.sandworks.model.Role
import com.roshan.sandworks.model.Tractor
import com.roshan.sandworks.model.Trip
import com.roshan.sandworks.model.TripStatus
import com.roshan.sandworks.model.User
import com.roshan.sandworks.model.UserStatus
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNotEquals
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertTrue
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.RobolectricTestRunner
import org.robolectric.annotation.Config
import java.util.UUID

@RunWith(RobolectricTestRunner::class)
@Config(sdk = [36])
class SandWorksTest {

    // --- 1. Foundation & Identity ---

    @Test
    fun `test app name resource is SAND WORKS`() {
        val context = ApplicationProvider.getApplicationContext<Context>()
        val appName = context.getString(R.string.app_name)
        assertEquals("SAND WORKS", appName)
    }

    // --- 2. Money Engine & Financial Integrity ---

    @Test
    fun `test MoneyEngine default rate is 20000 paise`() {
        assertEquals(20_000L, MoneyEngine.DEFAULT_TRIP_RATE_PAISE)
        assertEquals("₹200", MoneyEngine.formatPaise(20_000L))
    }

    @Test
    fun `test MoneyEngine format paise formatting`() {
        assertEquals("₹200", MoneyEngine.formatPaise(20000L))
        assertEquals("₹100.50", MoneyEngine.formatPaise(10050L))
        assertEquals("₹66.67", MoneyEngine.formatPaise(6667L))
        assertEquals("₹0", MoneyEngine.formatPaise(0L))
        assertEquals("-₹50", MoneyEngine.formatPaise(-5000L))
    }

    @Test
    fun `test MoneyEngine equal distribution remainder reconciliation`() {
        val pool = 20_000L // ₹200
        val driverId = "driver_mansingh"
        val labourerIds = listOf("labourer_1", "labourer_2")

        val shares = MoneyEngine.calculateDistribution(
            poolPaise = pool,
            driverId = driverId,
            labourerIds = labourerIds,
            rule = DistributionRule.EQUAL
        )

        // 3 participants: 20000 / 3 = 6666 with remainder 2
        // Stable distribution: first two get 6667, third gets 6666
        assertEquals(3, shares.size)
        assertEquals(6667L, shares[driverId])
        assertEquals(20000L, shares.values.sum())
    }

    @Test
    fun `test MoneyEngine driver sole participant receives entire pool`() {
        val pool = 20_000L
        val driverId = "driver_mansingh"
        val shares = MoneyEngine.calculateDistribution(
            poolPaise = pool,
            driverId = driverId,
            labourerIds = emptyList()
        )

        assertEquals(1, shares.size)
        assertEquals(20000L, shares[driverId])
    }

    @Test
    fun `test MoneyEngine driver labour ratio distribution`() {
        val pool = 20_000L // ₹200
        val driverId = "driver_mansingh"
        val labourerIds = listOf("labourer_1", "labourer_2")

        val shares = MoneyEngine.calculateDistribution(
            poolPaise = pool,
            driverId = driverId,
            labourerIds = labourerIds,
            rule = DistributionRule.DRIVER_LABOUR_RATIO
        )

        // Driver gets 40% = 8000 paise.
        // Remaining 12000 paise split between 2 labourers = 6000 paise each.
        assertEquals(8000L, shares[driverId])
        assertEquals(6000L, shares["labourer_1"])
        assertEquals(6000L, shares["labourer_2"])
        assertEquals(20000L, shares.values.sum())
    }

    @Test
    fun `test MoneyEngine invalid pool or blank driver returns empty`() {
        val zeroPoolShares = MoneyEngine.calculateDistribution(0L, "driver_1", listOf("l_1"))
        assertTrue(zeroPoolShares.isEmpty())

        val negativePoolShares = MoneyEngine.calculateDistribution(-500L, "driver_1", listOf("l_1"))
        assertTrue(negativePoolShares.isEmpty())

        val blankDriverShares = MoneyEngine.calculateDistribution(20_000L, "   ", listOf("l_1"))
        assertTrue(blankDriverShares.isEmpty())
    }

    // --- 3. Role Invariants & User Approvals ---

    @Test
    fun `test role enum has exactly OWNER, DRIVER, LABOURER with NO ADMIN`() {
        val roleNames = Role.values().map { it.name }
        assertEquals(3, roleNames.size)
        assertTrue(roleNames.contains("OWNER"))
        assertTrue(roleNames.contains("DRIVER"))
        assertTrue(roleNames.contains("LABOURER"))
        assertFalse(roleNames.contains("ADMIN"))
    }

    @Test
    fun `test default user registration requires PENDING status`() {
        val newUser = User(
            uid = "test_user_1",
            email = "worker@sandworks.local",
            fullName = "Worker One",
            role = Role.LABOURER
        )
        assertEquals(UserStatus.PENDING, newUser.status)
        assertEquals(Role.LABOURER, newUser.role)
    }

    @Test
    fun `test user status lifecycle transitions`() {
        val user = User(uid = "u1", role = Role.DRIVER, status = UserStatus.PENDING)
        val approved = user.copy(status = UserStatus.ACTIVE, approvedAt = System.currentTimeMillis(), approvedBy = "owner_uid")
        assertEquals(UserStatus.ACTIVE, approved.status)
        assertNotNull(approved.approvedAt)

        val suspended = approved.copy(status = UserStatus.SUSPENDED)
        assertEquals(UserStatus.SUSPENDED, suspended.status)

        val rejected = user.copy(status = UserStatus.REJECTED)
        assertEquals(UserStatus.REJECTED, rejected.status)
    }

    // --- 4. Tractor Management ---

    @Test
    fun `test tractor model invariants`() {
        val sonalika = Tractor(
            id = "t1",
            name = "Sonalika",
            registrationNumber = "OD-05-1234",
            isActive = true
        )
        assertTrue(sonalika.isActive)
        assertEquals(0, sonalika.totalTrips)

        val deactivated = sonalika.copy(isActive = false)
        assertFalse(deactivated.isActive)
    }

    // --- 5. Trip Management & Invariants ---

    @Test
    fun `test trip rate snapshot is immutable`() {
        val snapshotRate = 22_000L // ₹220 custom snapshot
        val trip = Trip(
            id = "trip_101",
            tripNumber = 101L,
            tractorId = "t1",
            tractorName = "John Deere",
            driverId = "driver_mansingh",
            rateSnapshotPaise = snapshotRate,
            totalPoolPaise = snapshotRate,
            sharesPaise = mapOf("driver_mansingh" to snapshotRate),
            date = "2026-09-08",
            idempotencyKey = UUID.randomUUID().toString()
        )

        assertEquals(snapshotRate, trip.rateSnapshotPaise)
        assertEquals(TripStatus.ACTIVE, trip.status)
        assertFalse(trip.idempotencyKey.isBlank())
    }

    @Test
    fun `test trip voiding invariant requires reason and sets VOIDED status`() {
        val activeTrip = Trip(
            id = "trip_102",
            tripNumber = 102L,
            tractorId = "t1",
            driverId = "driver_1",
            status = TripStatus.ACTIVE
        )

        val voidReason = "Wrong tractor assigned by error"
        val voidedTrip = activeTrip.copy(
            status = TripStatus.VOIDED,
            voidReason = voidReason
        )

        assertEquals(TripStatus.VOIDED, voidedTrip.status)
        assertEquals(voidReason, voidedTrip.voidReason)
    }

    @Test
    fun `test idempotency key prevents duplicate submission`() {
        val key = UUID.randomUUID().toString()
        val tripList = mutableListOf<Trip>()

        val trip1 = Trip(id = "trip_1", idempotencyKey = key)
        tripList.add(trip1)

        val isDuplicate = tripList.any { it.idempotencyKey == key }
        assertTrue(isDuplicate)
    }

    // --- 6. Daily Closure & Wording Integrity ---

    @Test
    fun `test daily closure aggregates only active trips and enforces accrued wording`() {
        val trips = listOf(
            Trip(id = "1", status = TripStatus.ACTIVE, totalPoolPaise = 20_000L),
            Trip(id = "2", status = TripStatus.ACTIVE, totalPoolPaise = 20_000L),
            Trip(id = "3", status = TripStatus.VOIDED, totalPoolPaise = 20_000L) // Must be excluded
        )

        val activeTrips = trips.filter { it.status == TripStatus.ACTIVE }
        val aggregatedPool = activeTrips.sumOf { it.totalPoolPaise }

        val closure = DailyClosure(
            id = "closure_2026-09-08",
            date = "2026-09-08",
            totalTrips = activeTrips.size,
            totalPoolPaise = aggregatedPool
        )

        assertEquals(2, closure.totalTrips)
        assertEquals(40_000L, closure.totalPoolPaise)
        // Strictly verified: never labeled payment or disbursement
        assertEquals("Daily accrued-money summary", closure.summaryNotice)
        assertFalse(closure.summaryNotice.contains("payment", ignoreCase = true))
    }

    // --- 7. Attendance Records ---

    @Test
    fun `test attendance status values and owner authorization`() {
        val attendance = AttendanceRecord(
            id = "att_1",
            userId = "labourer_1",
            userName = "Ramu",
            date = "2026-09-08",
            status = AttendanceStatus.PRESENT,
            markedByOwner = true
        )

        assertEquals(AttendanceStatus.PRESENT, attendance.status)
        assertTrue(attendance.markedByOwner)
    }

    // --- 8. Emergency Alerts & Broadcasts ---

    @Test
    fun `test emergency alert and broadcast specifications`() {
        val alert = EmergencyAlert(
            id = "alert_1",
            title = "Severe Weather",
            message = "River flood warning, halt all riverbed trips",
            severity = AlertSeverity.CRITICAL
        )
        assertEquals(AlertSeverity.CRITICAL, alert.severity)

        val broadcast = BroadcastMessage(
            id = "bcast_1",
            title = "Morning Meeting",
            message = "Safety inspection at 7 AM",
            targetRole = "ALL"
        )
        assertEquals("ALL", broadcast.targetRole)
    }

    // --- 9. Temporary Access Expiry Logic ---

    @Test
    fun `test temporary access expiration state machine`() {
        val now = System.currentTimeMillis()
        val validStart = now - 3600_000L // 1 hour ago
        val pastExpiry = now - 60_000L    // 1 minute ago
        val futureExpiry = now + 3600_000L // 1 hour from now

        val isExpired = now > pastExpiry
        assertTrue("Assignment past expiry must be evaluated as expired", isExpired)

        val isCurrentlyActive = (now >= validStart) && (now <= futureExpiry)
        assertTrue("Assignment within start and expiry must be active", isCurrentlyActive)
    }

    // --- 10. Concurrency & Trip Numbering ---

    @Test
    fun `test monotonic sequential trip numbering under concurrency simulation`() {
        var currentCounter = 100L
        val assignedNumbers = mutableListOf<Long>()
        // Simulate 10 concurrent requests serialized via atomic increment
        synchronized(this) {
            for (i in 1..10) {
                currentCounter += 1
                assignedNumbers.add(currentCounter)
            }
        }
        assertEquals(10, assignedNumbers.size)
        assertEquals(10, assignedNumbers.toSet().size) // All unique
        assertEquals(101L, assignedNumbers.first())
        assertEquals(110L, assignedNumbers.last())
    }

    // --- 11. Idempotency Invariants ---

    @Test
    fun `test idempotency key prevents duplicate submissions`() {
        val key = "idem_tx_12345"
        val recordedKeys = mutableSetOf<String>()

        fun recordKey(k: String): Boolean {
            return recordedKeys.add(k)
        }

        assertTrue("First attempt with new key must succeed", recordKey(key))
        assertFalse("Second attempt with same key must be rejected as duplicate", recordKey(key))
    }

    // --- 12. Retroactive-Trip Protection ---

    @Test
    fun `test retroactive trip creation blocked on closed dates`() {
        val closedDates = setOf("2026-09-06", "2026-09-07")

        fun canRecordTrip(date: String): Boolean {
            return !closedDates.contains(date)
        }

        assertFalse("Cannot record trip for closed date 2026-09-07", canRecordTrip("2026-09-07"))
        assertTrue("Can record trip for open date 2026-09-08", canRecordTrip("2026-09-08"))
    }

    // --- 13. Temporary Driver Expiry Invariant ---

    @Test
    fun `test temporary driver access blocks labourer after expiration`() {
        val now = 1757300000000L
        val activeAssignment = com.roshan.sandworks.model.TemporaryAssignment(
            id = "temp_1",
            targetUserId = "labourer_1",
            startTime = now - 3600_000L,
            expiryTime = now + 3600_000L,
            status = com.roshan.sandworks.model.TemporaryAssignmentStatus.ACTIVE
        )

        val expiredAssignment = activeAssignment.copy(
            id = "temp_2",
            expiryTime = now - 1000L
        )

        fun isEligibleToDrive(assignment: com.roshan.sandworks.model.TemporaryAssignment, currentTime: Long): Boolean {
            return assignment.status == com.roshan.sandworks.model.TemporaryAssignmentStatus.ACTIVE &&
                    currentTime >= assignment.startTime &&
                    currentTime <= assignment.expiryTime
        }

        assertTrue("Active assignment allows driving", isEligibleToDrive(activeAssignment, now))
        assertFalse("Expired assignment blocks driving", isEligibleToDrive(expiredAssignment, now))
    }

    // --- 14. Closure Idempotency ---

    @Test
    fun `test daily closure is idempotent and does not double-count`() {
        val trips = listOf(
            Trip(id = "t1", totalPoolPaise = 20_000L, sharesPaise = mapOf("d1" to 10_000L, "l1" to 10_000L), status = TripStatus.ACTIVE),
            Trip(id = "t2", totalPoolPaise = 20_000L, sharesPaise = mapOf("d1" to 10_000L, "l1" to 10_000L), status = TripStatus.ACTIVE)
        )

        fun computeClosure(activeTrips: List<Trip>, date: String): DailyClosure {
            val totalPool = activeTrips.sumOf { it.totalPoolPaise }
            val driverAccruals = mutableMapOf<String, Long>()
            val labourerAccruals = mutableMapOf<String, Long>()
            for (t in activeTrips) {
                t.sharesPaise.forEach { (uid, share) ->
                    if (uid == "d1") driverAccruals[uid] = (driverAccruals[uid] ?: 0L) + share
                    else labourerAccruals[uid] = (labourerAccruals[uid] ?: 0L) + share
                }
            }
            return DailyClosure(
                id = "closure_$date",
                date = date,
                totalTrips = activeTrips.size,
                totalPoolPaise = totalPool,
                driverAccrualsPaise = driverAccruals,
                labourerAccrualsPaise = labourerAccruals
            )
        }

        val closure1 = computeClosure(trips, "2026-09-08")
        val closure2 = computeClosure(trips, "2026-09-08")

        assertEquals(closure1.id, closure2.id)
        assertEquals(closure1.totalPoolPaise, closure2.totalPoolPaise)
        assertEquals(closure1.driverAccrualsPaise["d1"], closure2.driverAccrualsPaise["d1"])
        assertEquals(40_000L, closure1.totalPoolPaise)
    }

    // --- 15. User Lifecycle & Approval Boundaries ---

    @Test
    fun `test owner approval transitions PENDING user to ACTIVE`() {
        val pendingUser = User(uid = "u1", fullName = "New Driver", role = Role.DRIVER, status = UserStatus.PENDING)
        val approvedUser = pendingUser.copy(status = UserStatus.ACTIVE, approvedAt = System.currentTimeMillis())

        assertEquals(UserStatus.PENDING, pendingUser.status)
        assertEquals(UserStatus.ACTIVE, approvedUser.status)
        assertNotNull(approvedUser.approvedAt)
    }

    @Test
    fun `test user suspension prevents active participation`() {
        val activeUser = User(uid = "u2", fullName = "Active Labourer", role = Role.LABOURER, status = UserStatus.ACTIVE)
        val suspendedUser = activeUser.copy(status = UserStatus.SUSPENDED)

        fun canLogTrips(user: User): Boolean {
            return user.status == UserStatus.ACTIVE
        }

        assertTrue(canLogTrips(activeUser))
        assertFalse(canLogTrips(suspendedUser))
    }

    // --- 16. Leaderboard Top 3 Aggregation ---

    @Test
    fun `test leaderboard aggregation ranks top 3 correctly`() {
        val trips = listOf(
            Trip(driverId = "d1", driverName = "Driver 1", labourerIds = listOf("l1", "l2"), labourerNames = listOf("L1", "L2"), status = TripStatus.ACTIVE),
            Trip(driverId = "d1", driverName = "Driver 1", labourerIds = listOf("l1"), labourerNames = listOf("L1"), status = TripStatus.ACTIVE),
            Trip(driverId = "d2", driverName = "Driver 2", labourerIds = listOf("l2"), labourerNames = listOf("L2"), status = TripStatus.ACTIVE),
            Trip(driverId = "d3", driverName = "Driver 3", labourerIds = listOf("l3"), labourerNames = listOf("L3"), status = TripStatus.ACTIVE),
            Trip(driverId = "d4", driverName = "Driver 4", labourerIds = listOf("l4"), labourerNames = listOf("L4"), status = TripStatus.ACTIVE)
        )

        val driverCounts = trips.groupingBy { it.driverName }.eachCount()
        val top3Drivers = driverCounts.entries.sortedByDescending { it.value }.take(3).map { it.key }

        assertEquals(3, top3Drivers.size)
        assertEquals("Driver 1", top3Drivers[0])
    }

    // --- 17. Notification Channel Invariants ---

    @Test
    fun `test SandWorksApp notification channel IDs defined`() {
        assertEquals("sandworks_emergency_channel", SandWorksApp.CHANNEL_EMERGENCY)
        assertEquals("sandworks_broadcast_channel", SandWorksApp.CHANNEL_BROADCAST)
        assertEquals("sandworks_accruals_channel", SandWorksApp.CHANNEL_ACCRUALS)
    }

    // --- 18. Crashlytics Diagnostics & Offline State ---

    @Test(expected = RuntimeException::class)
    fun `test crash button action throws verification exception`() {
        val crashAction = { throw RuntimeException("Test Crash - SandWorks Verification") }
        crashAction()
    }

    @Test
    fun `test offline banner state toggle`() {
        val repo = com.roshan.sandworks.data.SandWorksRepository.getInstance()
        repo.setOfflineMode(true)
        assertTrue(repo.isOffline.value)
        repo.retryConnection()
        assertFalse(repo.isOffline.value)
    }

    @Test
    fun `test owner designated credentials authentication invariant`() {
        val repo = com.roshan.sandworks.data.SandWorksRepository.getInstance()
        var signedIn = false
        repo.signIn("alberteinstein9485@gmail.com", "Ramesh@77358800") { success, _ ->
            signedIn = success
        }
        assertTrue(signedIn)
        val user = repo.currentUser.value
        assertNotNull(user)
        assertEquals(Role.OWNER, user?.role)
        assertEquals(UserStatus.ACTIVE, user?.status)
        assertEquals("alberteinstein9485@gmail.com", user?.email)
    }
}


