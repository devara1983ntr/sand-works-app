# API / Backend Operations — SAND WORKS

Status: **SPECIFIED.** Logical API contract. Implemented via Firebase Cloud Functions (callable) + Firestore Security Rules. Backend-authoritative.

For every operation we specify: name, caller roles, input, validation, authorization, server behaviour, output, errors, idempotency, audit, retry, transaction requirements.

## Operations

### auth-provision-owner
Caller: provisioning (operator/CLI). Behaviour: create org + owner (Ramesh Sahu) + set role OWNER. Idempotent by email/uid. Audit.

### register-user (driver/labourer)
Caller: self (via Sign Up). Input: name, role request (DRIVER/LABOURER), phone, email. Validation. Behaviour: create pending user; notify owner. Output: pending. Audit.

### approve-user / reject-user / set-user-status
Caller: OWNER. Input: target uid, decision. Authorization: owner. Behaviour: set status active/rejected/disabled/suspended; notify (C); audit. Idempotent.

### create-temp-assignment / revoke-temp-assignment
Caller: OWNER (authorized DRIVER for create within limits). Input: labourer uid, start, expiry, scope, reason. Backend enforces expiry (server time). Audit. Revoke by owner.

### create-trip / edit-trip / void-trip
Caller: DRIVER (own), OWNER (any). Input fields. Authorization: role + own scope + active tractor/labourers + approval. Behaviour: assign trip number (collision-safe), snapshot rate, compute totalPaise, revision. Idempotent by idemKey (no duplicate). Audit. Transaction.

### configure-rate
Caller: OWNER. Set defaultRatePaise. Validation integer>0. Future trips snapshot new; history unchanged. Audit.

### configure-distribution
Caller: OWNER. Set rule (equal/driver+labour/custom %/fixed). Validate sums. Audit.

### run-daily-closure(date, org)
Caller: scheduled/trigger or owner fallback. Behaviour: snapshot eligible trips, compute per-user accrued (integer paise), write closures/{org}_{date} idempotently (exactly-once), notify daily accrued-money summary to eligible, audit. Idempotency: same (org,date) → no double count. Transaction. Honest fallback documented if no scheduled server path.

### compute-leaderboard(period)
Backend at week/month boundary. top-3 honest; deterministic tie; audit.

### mark-attendance / correct-attendance
Caller: OWNER (correct requires reason). Revision/conflict. Audit.

### send-alert / send-message (owner broadcast)
Caller: OWNER. Input: message, recipients. Behaviour: authorize, FCM deliver strongest-compliant urgent (alert) / normal (message), record delivery state/history/audit. Duplicate prevention. Never claims silent/DND override.

### export-data
Caller: OWNER. Generate PDF/CSV (server-side where plan supports; honest fallback otherwise). Audit.

### profile-photo operations
Self/owner. Validate/compress; Storage rules (plan-dependent). Audit.

### audit-read
Caller: OWNER, read-only.

## Error contract (common)
auth/permission-denied, not-found, validation, conflict(revision), duplicate, rate-limited, timeout, backend-unavailable, feature-unavailable(plan), session-expired, assignment-expired. See ERROR-STATES.md.

## Firestore Security Rules summary
- users: owner may write status/role via CF only; user reads own.
- trips: driver may create/own-edit; owner any; labourer no write.
- closures/accruals/leaderboards/audit/alerts: server/CF write; reads by role/org.
- attendance: owner write.
- tractors: owner write; active readable by org D/L as authorized.
- org settings: owner write.
Rules enforce the matrix; queries match rules (rules are not filters).
