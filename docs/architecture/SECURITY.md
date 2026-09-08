# SECURITY — SAND WORKS

Status: **SPECIFIED.** Backend-enforced; never rely on UI restrictions as security.

## 1. Identity & auth
- Firebase Authentication (email/password). Session management; sign-out; password reset via backend.
- App Check enabled to gate backend access to the genuine app.
- Approved users only get operational access; approval backend-enforced.

## 2. Authorization & Firestore Security Rules
- Role enforcement (OWNER/DRIVER/LABOURER), owner-only operations, driver authorization (own scope), labourer read-only enforcement.
- Org scoping + user scoping at the rule level. No cross-org/cross-user private-money reads.
- Temporary access enforced with server time + expiry; no permanent escalation.

## 3. Server authority
- Money, trip numbering, approval, closure, leaderboards, audit, expiry, alert/message delivery are Cloud-Functions-authoritative; rules deny client writes to those fields.

## 4. Session, least privilege, data isolation
- Least privilege per role matrix; data isolation per org/user.
- Disabled/suspended/expired session truthfully denies.

## 5. Input & output validation
- Validate on server (not just client). Output-filtered reads (rules). No injection.

## 6. Abuse prevention
- Rate limiting on callable functions; duplicate-submission protection (idempotency keys + in-flight guard); replay protection for idempotent ops; notification-abuse prevention (owner-only send; per-recipient). Export protection (owner-only). Profile-image security (rules + size/MIME/dim).

## 7. Secrets & transport
- Secrets never committed (tokens, service keys, signing). TLS/HTTPS enforced by Firebase. Android network security config appropriate for the domain; certificate handling standard.

## 8. Logging & auditability
- Audit events server-written; append-only; owner read. No client audit writes. No PII in analytics.

## 9. Privacy & retention
- Private/family data; retention window per org prefs; delete/export per documented policy.

## 10. Incident handling
- Owner + maintainers process; documented in DEPLOYMENT.md (rollback, monitoring).

## 11. Dependency & device security
- Dependency scanning in CI; secure Android storage (EncryptedSharedPreferences/Keystore for tokens where needed); release signing dedicated SAND WORKS keystore.

## Attack posture test list (mapped to TESTING)
Role escalation, cross-org by id change, forging role/approval/rate/number/closure/audit/timestamp, disabled/expired access, deep-link authz, storage abuse, idempotency/retry duplication, notification forgery/broadcast of another's money.
