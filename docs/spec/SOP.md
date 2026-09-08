# SOP — Standard Operating Procedures (OWNER), SAND WORKS

Status: **SPECIFIED.** Operational procedures for the owner and primary staff.

## Identity
Owner: Ramesh Sahu. Primary driver: Mansingh Rana (DRIVER). If a procedure says "owner," it means the OWNER role only.

## Procedures

### 1. Approve a user
1. Open Approvals/Pending Users.
2. Review the applicant's details (name, role request: driver/labourer, contact).
3. Approve (or Reject with optional note).
4. Result recorded to audit; applicant notified (type C). On approval the user may sign in to their role dashboard.

### 2. Reject / block a user
1. Open the user's record in Manage Users.
2. Reject (pending) or set disabled/suspended (active).
3. Reason recorded; audit; no operational access thereafter.

### 3. Add a tractor
1. Owner → Tractors → Add.
2. Enter name (e.g. Sonalika, John Deere, model), optional identifier.
3. Save. New tractor appears for new trips. Duplicate name rejected.

### 4. Deactivate / reactivate a tractor
1. Owner → Tractors → the tractor → Deactivate (or Reactivate).
2. Deactivated tractors are not offered on new trips; history is retained.

### 5. Add / edit a trip (owner or authorized driver)
1. Open Trip screen → Add Trip (or edit an own/permitted trip).
2. Choose date/time, tractor (active), driver (self or recorded), participating labourers, verify rate snapshot.
3. Submit → backend validates, assigns trip number, snapshots rate.
4. On success the trip is recorded; if a duplicate or conflict occurs, follow the on-screen guidance (never resubmit blindly).

### 6. Correct an erroneous trip
1. Owner (or driver for own error) opens the trip.
2. Correct the permitted fields within scope; if before closure, follow owner/audit governance; never alter an immutable snapshot unless it is an approved correction.
3. Save; conflict handling if the trip changed concurrently.

### 7. Configure the rate
1. Owner → Rates/Rate Configuration.
2. Set new per-trip rate (default ₹200).
3. Confirm. New trips use the new rate; historical trips keep their snapshot.

### 8. Configure distribution rule
1. Owner → Money-rule settings.
2. Choose equal (default) / driver+labour share / custom % / fixed. Set parameters.
3. Confirm; applies to future trips/closures.

### 9. Inspect daily accrual / summaries
1. Owner → Money/Accrual overview and Daily Summary.
2. Review accrued totals; verify a closure ran (19:30 Asia/Kolkata default). If a scheduled closure did not run and no server path is available, use the documented honest fallback (idempotent; never double-count).

### 10. Inspect weekly / monthly leaderboards
1. Owner → Leaderboards; select week/month.
2. Review top ranks (real data). No fabricated ranks.

### 11. Send an emergency warning
1. Owner → Emergency Warning.
2. Compose optional message; select recipients; confirm (confirmation step).
3. Backend authorizes and sends the strongest Android-compliant urgent notification (high-importance channel; sound/vibration/heads-up where the OS permits). Never expect full-volume override of Silent/DND.
4. Delivery state + history + audit; retry if needed; duplicate prevention.

### 12. Send a message (broadcast, owner only)
1. Owner → Message Composer; pick recipients; send. Recorded to history/audit.

### 13. Export data
1. Owner → Export Center; choose range, breakdown, format (PDF/CSV).
2. Generate; download/share. Recorded.

### 14. Manage profile & recover account
1. Owner → Profile: edit own fields; change password (backend); recover account via password reset if locked out.
2. Lost phone → reinstall, sign in with same account; data is in the backend (online-first). No local-only data loss path is the authority.

### 15. Handle network failure
1. Screens show a truthful offline/error state with retry. No "saved successfully" unless the backend accepted the write. Wait for connectivity and retry.

### 16. Handle notification failure
1. Check device permission (notifications enabled); verify FCM configured; retry/send again from history; if real FCM is not provisioned (plan), use the documented fallback and do not claim delivery.

### 17. Handle a temporary driver assignment (driver absent)
1. Owner → Temporary Access → create assignment for a specific labourer (start, expiry, reason, scope).
2. Backend enforces expiry. If regular driver (e.g. Mansingh Rana) returns, revoke or let it expire.

### 18. Handle an absent driver (operational)
1. Determine whether a temporary assignment is needed (procedure 17) or another approved driver takes the trip.
2. Ensure labourer performing driver duties does so only under a valid assignment.

### 19. Review audit history
1. Owner → Audit/Activity → filter by user/action/date. Read-only.

### 20. Prepare a private APK release
1. Confirm owner-provided Firebase project + plan; deploy Firestore, Auth, App Check, FCM, Security Rules, indexes, Cloud Functions (as applicable).
2. Build with the dedicated SAND WORKS release keystore (never legacy; never committed).
3. Sign, verify, and distribute the APK privately (sideload/private channel). Document version + release notes.
