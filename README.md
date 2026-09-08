# SAND WORKS

**SAND WORKS** — an online-first Android application for a small farming/labour operation. It is a **private, personal/family operational tool** for a single owner who runs tractors, drivers and daily labourers, records trips, and transparently shows each person what they have **accrued**.

This repository is the **single authoritative product + technical specification and implementation control plane**. It is documentation, architecture, requirements, UX, security, planning and validation only — **it contains no application source code**. An independent senior Android (Kotlin + Jetpack Compose) coding agent builds the app from this repository, task-by-task, per `docs/implementation/`.

## Status
- **Direction:** online-first. Cloud Firestore/Firebase is the authoritative backend. Not offline-first, and not derived from any prior/legacy application.
- **Scope:** private, one-owner, family/operator use. Not a public SaaS, marketplace, or social product. Not slated for Google Play unless the owner later changes that.
- **Readiness:** SPECIFIED (build-ready) — see `docs/DOCUMENTATION-INDEX.md` for the full status classification of every area.

## Identity
| Field | Value |
|---|---|
| Product | SAND WORKS |
| Package / application id | `com.roshan.sandworks` |
| Owner | **Ramesh Sahu** (single OWNER, ultimate authority) |
| Primary / authorized driver | **Mansingh Rana** (DRIVER — **not** an admin; no second administrative role) |
| Roles | OWNER · DRIVER · LABOURER (no ADMIN) |
| Architecture | Online-first; Firebase (Auth, Firestore, FCM, App Check, Crashlytics, + Storage/Cloud Functions/Analytics per plan) |
| Money model | Accrued-money tracking only (integer paise); daily **accrued-money summary** — never "payment" |

## Roles (summary)
- **OWNER (Ramesh Sahu):** complete control within the documented boundary — users/approvals, tractors, trips, rate & distribution config, accruals, daily closure, attendance, leaderboards, notifications, emergency alerts, messaging, exports, audit.
- **DRIVER (e.g. Mansingh Rana):** authorized driver operations — dashboard, tractor selection, add/edit trips, select labourers, own history/totals, share today's trips, temporary-assignment support when authorized. Never an admin.
- **LABOURER:** operationally **read-only** — own accrued money, working/absent days/dates, weekly + monthly top-3 leaderboard, profile, notifications.

## What this repository holds
| Path | Contents |
|---|---|
| `README.md` | this file |
| `AGENT.md` | strict constitution for every future AI coding agent (anti-fabrication, blocker protocol) |
| `PRD.md` / `PRD2.md` | product requirements document + execution-level product specification |
| `CHANGELOG.md` | honest documentation revision history |
| `docs/` | complete specification (see `docs/DOCUMENTATION-INDEX.md`) |
| `docs/implementation/` | small-task implementation control plane (phases, tasks, dependency graph, roadmap, traceability, status/blockers) |
| `assets/` | locked brand kit (logo + app icon masters and platform copies) |

## Read order
1. `AGENT.md` — the binding rules.
2. `docs/DOCUMENTATION-INDEX.md` — full index + status classification.
3. `PRD.md` → `PRD2.md` — what and how in detail.
4. `docs/` — screens, navigation, design system, database, API, security, money, notifications, testing, deployment.
5. `docs/implementation/` — how to build, task by task.

_No legacy/reference-application material is included. This is a fresh, self-contained specification._
