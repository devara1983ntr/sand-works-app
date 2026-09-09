# Phases 2–4 — Task Contracts

Status: **IMPLEMENTED & VERIFIED.** All tasks P2T1 through P4T4 are DONE.

## Phase 2 — Design system & assets
P2T1 [DONE] Apply locked brand (master → launcher). Implemented in `res/mipmap-*` and AndroidManifest.
P2T2 [DONE] Theme tokens light+dark per DESIGN-SYSTEM. Implemented in `ui/theme/Color.kt`, `Theme.kt`.
P2T3 [DONE] Component library. Implemented in `ui/components/CommonComponents.kt`.
P2T4 [DONE] Responsive + accessibility baseline (semantics, touch ≥48dp). Implemented in components.

## Phase 3 — Authentication
P3T1 [DONE] Firebase Auth integration behind repository. Implemented in `SandWorksRepository.kt`.
P3T2 [DONE] Session management (persist, expiry, sign-out). Implemented in `SandWorksRepository.kt:checkCurrentAuth()`.
P3T3 [DONE] Auth screens + validation + states (Welcome/SignIn/SignUp/Forgot/Reset). Implemented in `AuthScreens.kt`.
P3T4 [DONE] Role-aware routing + deep-link re-validation foundation. Implemented in `MainActivity.kt`.

## Phase 4 — User / role / approval
P4T1 [DONE] User model + pending/active/status. Implemented in `model/Models.kt:User, UserStatus`.
P4T2 [DONE] Registration (D/L)→pending; owner provisioning path (Ramesh Sahu OWNER). Implemented in `AuthScreens.kt`.
P4T3 [DONE] Approvals UI + Approve/Reject backend op (CF). Implemented in `OwnerScreens.kt:OwnerPeopleScreen`.
P4T4 [DONE] Disable/suspend/reactivate + account-status screens. Implemented in `AuthScreens.kt`, `OwnerScreens.kt`.
Security: no ADMIN role; Mansingh Rana = DRIVER. Enforced by backend and `firestore.rules`.
