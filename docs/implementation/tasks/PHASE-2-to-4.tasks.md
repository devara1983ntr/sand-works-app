# Phases 2–4 — Task Contracts

## Phase 2 — Design system & assets
P2T1 Apply locked brand (master → launcher; no redraw/SVG). Obj: correct launcher/app icon from masters. Accept: icon shows; no placeholder. Evidence: screenshot/asset check.
P2T2 Theme tokens light+dark per DESIGN-SYSTEM. Accept: contrast AA; both themes.
P2T3 Component library. Accept: components used, no inert controls.
P2T4 Responsive + accessibility baseline (semantics, touch ≥48dp, reduced motion).

## Phase 3 — Authentication
P3T1 Firebase Auth integration behind repository (emulator/local). Obj: email/password auth. Accept: sign-in/up/out works on emulator; never fake auth. Security: real Firebase creds in Phase 26/deploy only.
P3T2 Session management (persist, expiry, sign-out). Accept: session states truthful.
P3T3 Auth screens + validation + states (Welcome/SignIn/SignUp/Forgot/Reset). Accept: SCREEN-STATE + a11y; tests.
P3T4 Role-aware routing + deep-link re-validation foundation. Accept: routes by role from session.
Blockers (production): Firebase project + App Check.

## Phase 4 — User / role / approval
P4T1 User model + pending/active/status. Accept: states model.
P4T2 Registration (D/L)→pending; owner provisioning path (Ramesh Sahu OWNER; no create-owner UI). Security: role = request only.
P4T3 Approvals UI + Approve/Reject backend op (CF). Owner-only. Accept: approved user gains access; audit.
P4T4 Disable/suspend/reactivate + account-status screens. Accept: no access when disabled; honest.
Security: no ADMIN role; Mansingh Rana = DRIVER. Enforced by backend not UI.
