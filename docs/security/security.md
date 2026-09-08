# Security & RBAC — SAND WORKS

## Trust model
The **backend is authoritative**. Roles, approvals, membership, ownership, money, numbering, closure, audit and expiry are enforced server-side and cannot be changed by the client.

## Roles → capability (RBAC summary)
| Operation | OWNER | DRIVER | LABOURER |
|---|---|---|---|
| Sign in / manage own session | ✓ | ✓ | ✓ |
| Approve driver/labourer | ✓ | ✗ | ✗ |
| Manage tractors / users / labourers | ✓ | ✗ | ✗ |
| Configure rate + distribution rule | ✓ | ✗ | ✗ |
| Add/edit own trips | ✓ (any) | ✓ (own) | ✗ |
| Correct attendance | ✓ | ✗ | ✗ |
| Reports & export (PDF/CSV) | ✓ | ✗ | ✗ |
| Audit viewer | ✓ | ✗ | ✗ |
| Send operational alert | ✓ | ✗ | ✗ |
| See own totals/accrual/rank | ✓ | ✓ | ✓ |
| Create/edit operational records | ✓ | own only | ✗ (read-only) |

## Rules of enforcement
1. **Auth first.** Everything is behind sign-in with a valid, approved, active session.
2. **Org scoping.** Every read/write is scoped to the organisation; cross-org access is denied by rules.
3. **Ownership scoping.** Drivers/labourers only ever touch their own records; the client cannot read another person's money.
4. **Approval before access.** Pending users have no operational access.
5. **Server authority.** Privileged/money/numbering/approval/closure/audit/expiry operations go through Cloud Functions; security rules deny the client from writing those.
6. **Temp assignment expiry** is enforced by backend time; it cannot be extended by the assignee.
7. **Audit is append-only** and created by the backend; the client cannot write audit entries.
8. **Deep links re-validate** auth + role + org + ownership + existence before showing content.
9. **App Check** is enabled to gate backend access to the genuine app.
10. **Storage rules** restrict profile photos/export files to the owner (and self for own profile), with size/MIME/dimension checks.

## Attack posture (must be covered in tests)
- Role escalation (labourer trying to write, driver trying to approve).
- Cross-org access by changing an id.
- Forging role/approval/rate/trip-number/closure/audit/timestamp in a client write.
- Accessing a disabled/suspended/expired account.
- Deep-link authz bypass.
- Storage abuse (oversized/wrong-type/another user's file).
- Idempotency/retry duplication (double closure).

## Secrets & signing
- No secrets in source. Firebase config is injected via environment/ignored file; never commit `key.properties`, keystores, or service keys.
- New dedicated native release signing identity; same key for all future private APK updates; never a legacy keystore.
- Security rules and App Check are deployed with the project; the app is never shipped with backend access effectively open.
