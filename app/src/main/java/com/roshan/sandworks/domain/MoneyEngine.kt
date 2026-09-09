package com.roshan.sandworks.domain

import com.roshan.sandworks.model.DistributionRule
import kotlin.math.abs

/**
 * Money Engine — Authoritative implementation.
 *
 * Rules:
 * 1. Integer paise only (₹200 = 20000 paise).
 * 2. Default trip rate ₹200 snapshot immutable per trip.
 * 3. Daily accrued-money summary, never labeled as "payment/paid".
 * 4. Deterministic remainder distribution: sum of shares ALWAYS equals pool.
 */
object MoneyEngine {
    const val DEFAULT_TRIP_RATE_PAISE: Long = 20_000L // ₹200.00

    fun formatPaise(paise: Long): String {
        val isNegative = paise < 0
        val absPaise = abs(paise)
        val rupees = absPaise / 100
        val remainder = absPaise % 100
        val prefix = if (isNegative) "-₹" else "₹"
        return if (remainder == 0L) {
            "$prefix$rupees"
        } else {
            "$prefix$rupees.${remainder.toString().padStart(2, '0')}"
        }
    }

    /**
     * Deterministically splits [poolPaise] among [driverId] and [labourerIds].
     * Invariant: sum of all returned values == [poolPaise].
     */
    fun calculateDistribution(
        poolPaise: Long,
        driverId: String,
        labourerIds: List<String>,
        rule: DistributionRule = DistributionRule.EQUAL
    ): Map<String, Long> {
        if (poolPaise <= 0L || driverId.isBlank()) return emptyMap()

        val cleanLabourers = labourerIds.filter { it.isNotBlank() && it != driverId }.distinct().sorted()
        val allParticipants = listOf(driverId) + cleanLabourers
        val count = allParticipants.size

        if (count == 1) {
            // Driver receives the entire pool if no labourers present
            return mapOf(driverId to poolPaise)
        }

        val result = mutableMapOf<String, Long>()

        when (rule) {
            DistributionRule.EQUAL -> {
                val base = poolPaise / count
                var remainder = poolPaise % count
                // Distribute remainder 1 paise at a time in stable order
                for (id in allParticipants) {
                    val extra = if (remainder > 0) {
                        remainder--
                        1L
                    } else 0L
                    result[id] = base + extra
                }
            }
            DistributionRule.DRIVER_LABOUR_RATIO -> {
                // Fixed ratio: Driver gets 40%, remaining 60% split equally among labourers
                val driverBase = (poolPaise * 40L) / 100L
                val labourPool = poolPaise - driverBase
                val labourCount = cleanLabourers.size
                if (labourCount > 0) {
                    val labourBase = labourPool / labourCount
                    var remainder = labourPool % labourCount
                    result[driverId] = driverBase
                    for (id in cleanLabourers) {
                        val extra = if (remainder > 0) {
                            remainder--
                            1L
                        } else 0L
                        result[id] = labourBase + extra
                    }
                } else {
                    result[driverId] = poolPaise
                }
            }
            else -> {
                // Default equal
                val base = poolPaise / count
                var remainder = poolPaise % count
                for (id in allParticipants) {
                    val extra = if (remainder > 0) {
                        remainder--
                        1L
                    } else 0L
                    result[id] = base + extra
                }
            }
        }

        // Integrity assertion check: verify sum reconciles exactly to pool
        val sum = result.values.sum()
        if (sum != poolPaise) {
            val diff = poolPaise - sum
            result[driverId] = (result[driverId] ?: 0L) + diff
        }

        return result
    }
}
