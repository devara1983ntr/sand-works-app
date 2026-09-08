# Data Model — SAND WORKS

The authoritative data lives in Cloud Firestore, organised per organisation. Only owner-level collections are organisation-wide; people collections are scoped per user.

## Entities
| Entity | Key fields | Who writes |
|---|---|---|
| **Organization** | id, name, owner (uid), settings (defaultRate ₹200, distributionRule, summaryTime default 19:30), createdAt | owner / backend |
| **User/Account** (driver, labourer; owner separate) | uid, name, role (OWNER/DRIVER/LABOURER), phone, orgId, status (active/pending/disabled/suspended), approvedBy, approvedAt | backend (registration/approval) |
| **Tractor** | id, orgId, name/model (e.g. Sonalika, John Deere), active, createdAt | owner |
| **Trip** | id, orgId, date, time, tractorId, driverUid, labourerUids, rateSnapshot (paise), total (paise), tripNumber, revision, createdAt | driver (own) / owner / backend (number, snapshot) |
| **TripLabour** (participation) | tripId, labourerUid, present | via trip write |
| **Attendance / WorkDay** | orgId, labourerUid, date, state (working/absent), correctedBy, reason, revision | backend / owner correction |
| **RateConfig** | orgId, effectiveFrom, ratePaise, setBy | owner / backend |
| **DistributionRule** | orgId, type (equal / driver+labour / customPercent / fixed), params, effectiveFrom, setBy | owner / backend |
| **EarningCalculation** | orgId, periodKey, entries, revision, createdBy | backend (idempotent) |
| **Earnings / DailyClosure** | orgId, date, summary, status, generatedAt | backend |
| **LeaderboardWeek / LeaderboardMonth** | orgId, period, top3, generatedAt | backend |
| **TemporaryAssignment** | id, orgId, labourerUid, scope, start, end, reason, status | owner / authorised driver / backend (expiry) |
| **Notification** | id, recipientUid, type, payload, readAt, sentAt | backend |
| **Alert** | id, orgId, senderUid, message, recipients, acknowledgedBy[], sentAt | owner / backend |
| **AuditEntry** | id, orgId, actorUid, action, target, before/after, timestamp | backend only |

## Money representation
- All money is **integer paise** (₹ amounts stored as paise). No floating point anywhere.
- Display formatting converts paise → ₹ only at the UI boundary.

## Rate snapshot immutability
- A trip records `rateSnapshot` at the time it is recorded. Changing the organisation's `defaultRate` afterwards never rewrites historical trips.

## Daily closure & idempotency
- Boundary: one closure per **organisation + date**.
- Closure is idempotent: re-running the same closure never double-counts trips or accruals.
- It snapshots eligible trips, computes per-user accrued totals, writes earnings/closure, notifies eligible users, and audits.
- Wording: accrued totals ("summary"), never "payment completed".

## Retention & privacy
- Private/family use, one organisation. Profile photos and exports live in Cloud Storage where enabled (Blaze), with size/MIME/dimension rules.
- No analytics PII.
- Exact retention window for history/audit is an operator preference (non-blocking default retained).
