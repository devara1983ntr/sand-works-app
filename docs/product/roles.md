# Roles — SAND WORKS

SAND WORKS has exactly three roles. There is **no** admin/delegate role and exactly **one owner** per organisation.

## OWNER
The single operator (e.g. Ramesh Sahu). Full visibility and control of the organisation.
- Registers tractors, drivers and labourer records.
- Approves new driver/labourer account registrations.
- Configures the trip rate and the money distribution rule.
- Corrects attendance with a reason.
- Views reports and exports (PDF/CSV).
- Sends operational alerts.
- Sees the full audit trail (read-only).

## DRIVER
Operates trips and is accountable to the owner.
- Sees their own trips and today's working summary.
- Adds and edits trips within their scope (date/time, tractor from the owner's registry, participating labourers, rate snapshot, total).
- Cannot change the money distribution rule, rates, registrations, or approvals.
- Sees their own totals and can share today's trip count.

## LABOURER
A daily worker attached to trips.
- **Operationally read-only.**
- Sees their own totals: total trips, total accrued, remaining money, working days, absent days, working/absent dates, weekly + monthly rank.
- Sees their own profile and notifications.
- Cannot create/edit trips, records, rates, or any organisation data.

## Approval model
- A new driver or labourer **signs up / is registered**, then must be **approved by the owner** before gaining access to their role's data.
- Until approved, the account has no privileged/operational access.
- Approval is enforced by the **backend**, not by the client.

## Temporary assignment (labourer in a driver-like operational role)
- The owner (or an authorised driver, within limits) may temporarily assign a labourer to an operational role for a limited period: start, end, reason, scope, status.
- Expiry is **enforced by the backend** — access ends automatically; there is no permanent escalation.

## What a role may NOT do (summary guard)
- Only the owner may approve, configure money, manage the registry, or export.
- No role may read another person's private money figures.
- Labourers never write operational data.
