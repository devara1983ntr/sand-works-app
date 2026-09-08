# BUILD-BASELINE — Confirmed Implementation Facts — SAND WORKS

Status: **LOCKED / APPROVED by owner (2026-09-08).** This is the authoritative, non-negotiable build baseline. A coding agent must implement **exactly** this; it must not silently substitute preferences.

## 1. Application identity
| Field | Confirmed value |
|---|---|
| Application / Package ID | `com.roshan.sandworks` |
| App name | SAND WORKS |
| Owner | Ramesh Sahu |
| Primary driver | Mansingh Rana |
| Roles | OWNER, DRIVER, LABOURER |
| Admin role | **None** (never create one) |
| Platform | Native Android |
| Language | Kotlin |
| UI | Jetpack Compose |
| UI library | Material 3 |
| Source of truth | Online-first / backend authoritative |
| Offline-first architecture | **No** |
| Legacy migration | **None** |

## 2. Tech stack (locked — do not introduce alternatives)
| Concern | Confirmed |
|---|---|
| Architecture | Clean Architecture + UDF/MVI |
| State | ViewModel + StateFlow/Flow |
| DI | Hilt |
| Navigation | Navigation Compose |
| Async | Kotlin Coroutines |
| Local persistence | Room only where justified; DataStore for preferences/session-level local state |
| Images | Coil |
| Background work | WorkManager |
| Backend | Firebase |
| Database | Cloud Firestore |
| Authentication | Firebase Authentication |
| Push notifications | Firebase Cloud Messaging |
| App protection | Firebase App Check where applicable |
| Crash monitoring | Firebase Crashlytics |
| Analytics | Firebase Analytics only where justified |
| Server logic | Cloud Functions where required |
| File storage | Firebase Storage **if** the selected Firebase plan supports it |

> **Instruction:** The intended UI stack is **Kotlin → Jetpack Compose → Material 3 → Material Symbols → Roboto → SAND WORKS design tokens/components**. Hilt, Navigation Compose, Coroutines, Coil, Room, DataStore and WorkManager are **supporting libraries, not competing UI frameworks**. Do **not** introduce another UI framework or design system. Do not invent a different package ID, another branding system, another logo, an SVG replacement of the approved PNG, non-Roboto typography, another database, an ADMIN role, fake/mock production data, or undocumented screens/business rules.

## 3. Design system (locked)
| Field | Confirmed value |
|---|---|
| Design style | Premium industrial operations UI |
| Theme | Dark-first + Light theme |
| Design system | Material 3 + locked SAND WORKS tokens |
| Primary brand | Orange `#F97316` |
| Secondary brand | Sand Gold `#F5B942` |
| Dark foundation | Deep Charcoal `#0B0D0F`, Graphite `#15191D`, Slate `#20262B` |
| Light foundation | `#F6F7F8`, White `#FFFFFF` |
| Typography | Roboto |
| Icons | Material Symbols |
| Logo source | Approved PNG asset; do not recreate as SVG |
| Corner radius | Generally 12–16dp |
| Animation | Restrained, purposeful |
| Large screens | Adaptive layouts |
| Bottom navigation | Maximum 4–5 destinations where applicable |
| Navigation | Role-aware + deterministic back + drawer where specified |
| Gestures | Only documented/useful gestures; never hidden functionality |

## 4. Domain / money rules (locked)
| Field | Confirmed value |
|---|---|
| Money representation | Integer paise internally |
| Default trip rate | ₹200 |
| Money meaning | **Accrued earnings, not payment/disbursement** |
| Trip rate | Snapshot / immutable per trip |
| Initial tractors | Sonalika, John Deere |

Refer to `docs/spec/money-engine.md`, `docs/spec/roles-access.md`, `docs/spec/temporary-access.md`, `docs/spec/leaderboards.md`, `docs/architecture/DATABASE.md`, `docs/architecture/API.md`, `docs/architecture/SECURITY.md`.

## 5. Repository & control plane
| Field | Confirmed value |
|---|---|
| Repository | `devara1983ntr/sand-works-app` (public) |
| Implementation control plane | `docs/implementation/` — 26 phases / 68 tasks |
| Documentation authority | `AGENT.md`, `PRD.md`, `PRD2.md`, `docs/DOCUMENTATION-INDEX.md` and the referenced specification/architecture/design/quality documents |

## 6. Environment-only dependencies (the ONLY legitimate reasons to stop/block)
Genuine external prerequisites only — never faked, never bypassed:
- Real Firebase project configuration (`google-services.json` is provided at repo root; the build must consume/place it as `app/google-services.json`).
- FCM credentials.
- Firebase plan-dependent services (Cloud Functions, Storage, scheduled closure) — require Blaze decision.
- Dedicated release signing keystore.

If a task depends on an unresolved environment input, mark it BLOCKED in the control plane and report the smallest needed input (AGENT.md §9). Do not fabricate a substitute.
