# Product Overview — SAND WORKS

## One-line
SAND WORKS is an **online-first** mobile tool that lets an owner operate tractors with drivers and daily labourers, record trips, and transparently show each person what they have accrued.

## The problem it solves
A small farm/operation hires one or more drivers and daily labourers. Every day several tractor trips happen. Two things are hard to keep honest and transparent by hand:
1. **Who worked, on which trips, with which tractor**, and how many trips/days each person accumulated.
2. **What each person has accrued** in money terms, given a per-trip rate and a distribution rule among the driver and the labourers present on that trip.

SAND WORKS removes the guesswork and the arguments: the data lives in one shared online source of truth, and each person only ever sees their own figures.

## Guiding principles (this product)
- **Online-first.** The authoritative data lives in a backend (Firebase). Devices read and write against the live backend; there is no local-primary/offline-primary data model. (Resilience against transient network issues is handled by normal loading/error/retry UI, not by an offline-first architecture.)
- **One organisation, one owner.** It is a private family/operator tool, not a multi-tenant SaaS and not a public marketplace.
- **Honest money.** The app tracks **accrued totals only** — never "payment completed". Wording, leaderboards and reports all reflect accrual, never disbursement.
- **Role-scoped.** A driver or labourer sees only their own operational information. Only the owner sees the full organisation.
- **No fabrication.** No fake data, fake success, or made-up backend behaviour anywhere.

## Not in scope (explicit)
- No public/Play-store consumer release.
- No multi-owner or admin/delegated role.
- No disbursement/ledger/payment engine.
- No offline-first local database as the source of truth.
- No migration of data from any legacy application.

## Key concepts
| Concept | Meaning |
|---|---|
| **Organisation** | One operation (owner-led). All data is scoped to it. |
| **Tractor** | A machine registered by the owner (initial examples Sonalika, John Deere). |
| **Trip** | A single working run on a date with a tractor, a driver, participating labourers, and a recorded rate/total. |
| **Driver** | Operates a trip; may add/edit trips within their scope. |
| **Labourer** | Daily worker attached to trips; operationally read-only. |
| **Accrual** | Money a person has earned per the distribution rule over a period — the only money figure the app shows. |

## Online-first architecture in plain terms
- A person signs in with an account. New driver/labourer accounts need **owner approval** before privileged access.
- Reads and writes go to the live backend, protected by per-role security rules.
- The daily closure, trip numbering, money distribution and leaderboards are computed/authorised **by the backend**, never trusted from the client.
- See `docs/architecture/architecture.md` for the full model.
