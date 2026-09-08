# AGENT.md — SAND WORKS AI Coding-Agent Constitution

This file is the **binding constitution** for every future AI coding agent (or human contributor) working on SAND WORKS. It is deliberately strict. If you are an AI agent, treat every "must" below as mandatory. When anything is genuinely not implementable, **STOP at that boundary and report the exact blocker** — do not improvise.

## 1. Authority
Follow the authoritative documentation. Where documents conflict, the resolution order is:
1. `AGENT.md` (this file)
2. `README.md`
3. `PRD.md` and `PRD2.md`
4. `docs/DOCUMENTATION-INDEX.md` (index/status)
5. The specific `docs/` specification documents
6. `docs/implementation/` task contracts
Nothing else is authoritative. Older or undocumented material is never a source of truth.

## 2. Never fabricate (absolute prohibitions)
Never use or introduce:
- mock/dummy/fake data, fabricated backend or API responses
- placeholder production logic, UI, logos, icons, or images
- fake loading completion, fake success messages, fake progress
- hard-coded fake users, money, trips, roles, or accruals
- fake Firebase configuration, fake credentials, fake notification delivery
- fake authentication or fake authorization
- fake payment/accrual results
- a fake implementation solely to make a build pass

Never leave in production code or documentation:
- `TODO`, `FIXME`, `TBD`, `XXX`, `HACK`, "implement later"
- incomplete production branches, commented-out unfinished code
- empty production functions
- fake repository or network implementations

## 3. Business rules are fixed
Never invent, silently change, or reinterpret SAND WORKS business rules. Key invariants you must always honour:
- Exactly one OWNER (Ramesh Sahu). **No ADMIN role. Mansingh Rana is a DRIVER — never create a second administrator.**
- Money is **accrued-money** in **integer paise**; never floating point for authoritative money.
- Money messaging is a **daily accrued-money summary** — never label as "payment"/"paid".
- Rate default ₹200 with **immutable per-trip rate snapshot**; changing the rate never rewrites history.
- Default distribution: equal split among eligible driver + participating labourers present; config only as documented.
- Backend is authoritative for money, trip numbering, permissions, closure, leaderboards, expiry.
- Labourers are operationally read-only.
- New driver/labourer accounts get **no privileged access until owner approval**, enforced by backend, never a fake local approval.
- Online-first architecture. Do not turn it into an offline-primary system; network failures use graceful UX, never fake success.

## 4. Security & integrity
- Never bypass security, weaken validation, or rely on UI hiding as a security control.
- Never suppress errors merely to make a screen look functional.
- Never disable tests to make CI green.
- Do not bypass or mock Firestore Security Rules, App Check, or Cloud Functions authorization.
- Deep links and cross-role access must be re-validated server-side.
- No cross-user private financial disclosure (no broadcasting one user's money to others).

## 5. Secrets & signing
- Never commit secrets, signing keys/keystores, or Firebase private credentials.
- Never put tokens in source code, markdown, `.env`, config, docs, or commit messages.
- Never use production credentials in tests.
- Use secure environment/CI secret injection only.
- Debug builds use standard debug signing; the private release uses a **dedicated new SAND WORKS keystore**, never a legacy key.

## 6. Verification before claiming completion
- Never claim completion without verification.
- Always inspect the existing implementation/documentation before modifying it.
- Maintain traceability between requirement → feature → screen → workflow → data → backend → security → test → implementation task → acceptance criteria.
- Update documentation whenever intended behaviour changes.

## 7. Assets & branding
- Use the approved PNG assets only. Do not regenerate, redraw, or create a replacement SAND WORKS logo.
- Do not create an SVG version of the approved logo unless explicitly requested.
- Masters are 1536×1536 (see `docs/brandreport/assets.md`). Do not choose canonical masters by guesswork.

## 8. Status honesty
Use the classification vocabulary exactly:
- **EXISTING** — actually present/implemented.
- **SPECIFIED** — required and fully documented, not yet implemented.
- **MISSING** — required but not yet specified enough.
- **BLOCKED** — cannot proceed until an external dependency/decision exists.
- **PROPOSED** — a marked recommendation not yet approved.

Never present PROPOSED as approved, SPECIFIED as IMPLEMENTED, a mock as production, or a planned backend operation as deployed.

## 9. Blocker protocol
If a task needs information or infrastructure that is genuinely absent (e.g. Firebase project, paid plan decision, signing key, an owner decision), **do not fabricate a substitute**. Mark the task BLOCKED in `docs/implementation/`, record it in the blocker register, and report the exact smallest input needed.
