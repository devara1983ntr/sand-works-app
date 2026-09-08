# Money Engine — SAND WORKS

SAND WORKS tracks **accrued totals only**. It never disburses money and never claims a "payment completed".

## Defaults (locked)
- **Rate:** ₹200 per trip, owner-configurable.
- **Distribution:** equal split among the driver + eligible (present) labourers on the trip — default. Configurable to: equal / driver+labour share / custom % / fixed allocation.
- **Currency:** integer paise; no floating point.

## Rate & snapshot
1. The organisation has a `defaultRate`. A per-trip snapshot is taken when the trip is recorded.
2. Once recorded, that trip's rate snapshot is **immutable**. Future rate changes never rewrite historical trips.

## Distribution rule
At each trip, compute the money pool = rate × trip (or the recorded total). Then apply the active distribution rule:
- **Equal:** pool split equally among the driver and each eligible present labourer.
- **Driver+labour share:** predefined share classes for driver vs labourers.
- **Custom %:** configured percentages.
- **Fixed allocation:** configured fixed amounts.
- Integer remainder policy: any leftover paise is assigned by a deterministic, documented rule so totals always reconcile exactly to the pool.

## Daily accrual & closure
- Each day's eligible trips are snapshotted.
- Per-user accrued totals are computed from the distribution rules applied to those trips.
- One **daily closure** per organisation+date is produced: an idempotent, exactly-once summary. Re-running it never double-counts.
- Closure output is accrued totals per user + a daily summary, then eligible users are notified.
- **Wording:** daily summaries and notifications say "earnings added / summary" — never "payment".

## Leaderboards
- **Weekly** (resets each week) and **monthly** (resets each month).
- Top 3 only, deterministic tie-break, built from real persisted trips.
- If fewer than 3 are eligible, only real ranks are shown — never fabricated 2nd/3rd places.

## Integrity rules
- Money math is integer and deterministic (unit-tested).
- Server-authoritative: distribution, closure and leaderboards are computed/authorised by the backend (Cloud Functions), not trusted from the client.
- Idempotency keys protect closure and money writes from retry duplication.
- Audit entries record every money-related server operation.

## What is never done
- No payment disbursement, no "paid" ledger, no bank/wallet integration.
- No fabricated money figures anywhere.
