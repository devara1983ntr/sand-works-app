# Temporary Labourer Access — SAND WORKS (state machine + security)

Status: **SPECIFIED.**

## 1. Purpose
If the regular driver is absent, the OWNER (or an authorized DRIVER, within documented limits) may temporarily assign a specific LABOURER the access needed to perform the driver's operational duties. This must **not** permanently change the person's role and must **not** create an admin.

## 2. Assignment entity
| Field | Type | Notes |
|---|---|---|
| id | string | auto |
| orgId | string | scope |
| targetUserId | string | the labourer being assigned |
| grantedRoleFor | enum | DRIVER-duties (the only supported grant) |
| scope | string | e.g. which tractor(s)/trips |
| start | timestamp | explicit |
| expiry | timestamp | explicit |
| reason | string | required |
| status | enum | active / expired / revoked |
| createdBy | uid | owner or authorized driver |
| createdAt | timestamp | server |
| auditRef | — | audit trail |

## 3. State machine
`draft → active (start reached) → expired | revoked`
- A proposed assignment is valid only between `start` and `expiry`.
- **Active:** the labourer may perform the assigned driver duties.
- **Expired:** (backend-enforced by time) the labourer no longer has the granted duties.
- **Revoked:** the OWNER may revoke early; status → revoked.
- Overlap resolution: an active assignment is superseded/denied if a newer conflicting one is granted; the effective grant is the latest valid active assignment. Documented, backend-enforced.

## 4. Backend enforcement
- Authorization is enforced by backend Security Rules / Cloud Functions using server time, **not** the client clock.
- After expiry: a user logging in receives no granted duties (Assignment Expired state), role returns to LABOURER.
- No privilege escalation: the grant is limited to the documented driver-duties scope and time window.

## 5. Audit
- Every create/revoke/expiry is audited (who, target, window, reason).

## 6. Notification
- Optional type-E (expiry) notification to the assignee; type-D assignment notification when granted.

## 7. Failure/edge behaviour
- Assigning to a non-labourer → rejected.
- Assignment without expiry → rejected.
- Overlapping active assignment → defined resolution (documented above); user informed.
- Access after expiry → truthful denied state, never silent access.
