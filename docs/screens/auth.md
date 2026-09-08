# Auth Screens — Sign In, Sign Up & Account Lifecycle

These are the first screens every person meets. They are identical in structure across roles; the role is captured at sign-up and at approval.

## SC-AUTH-WELCOME (splash/welcome)
- **Who:** everyone (not yet signed in).
- **Purpose:** show the SAND WORKS brand (logo) and route the person to sign in or sign up.
- **Actions:** "Sign in", "Create account".
- **States:** loading (checking for an existing session); if a valid session exists, route straight to that person's dashboard (role-aware), never re-show welcome.
- **Security:** nothing privileged shown; brand asset from the locked set.

## SC-AUTH-SIGNIN
- **Purpose:** authenticate an existing user.
- **Fields:** email, password.
- **Actions:** Sign in; link to "Forgot password"; link to "Create account".
- **Validation:** email well-formed; password non-empty. Errors shown in plain language.
- **States:** idle / submitting / **error** (invalid credentials) / **account-not-approved** / **account-disabled-or-suspended** (truthful message; no fake access) / network-error (with retry).
- **On success:** route by role → owner dashboard, driver dashboard, or labourer dashboard.
- **Security:** credentials sent to the backend over TLS; password never stored locally in plaintext; no client-side role assertion (role comes from the backend session).

## SC-AUTH-SIGNUP
- **Purpose:** register a **new** account. Registration asks which kind of account the person needs (owner / driver / labourer). Driver and labourer signups do **not** immediately grant access — they enter the **pending-approval** state and wait for the owner.
- **Fields:** full name, phone (optional/contact), role selection (driver/labourer; owner signup is a special provisioned case), email, password (and confirm).
- **Owner signup:** the first/owner account is provisioned by the operator (this is the one-owner rule). There is no public "create an owner account" path for arbitrary users.
- **Driver/Labourer signup:** creates a pending account and shows **SC-AUTH-PENDING**.
- **States:** idle / submitting / validation-error / **already-registered** / network-error.
- **Security:** role selection is only a **request**; the effective role/privileges are granted by the owner's approval and enforced by the backend. A user cannot grant themselves a role by choosing it.

## SC-AUTH-PENDING (approval pending)
- **Who:** a newly registered driver/labourer not yet approved.
- **Purpose:** tell the person their registration is awaiting owner approval and that they will get access once approved.
- **No operational data is shown here.** This screen is informational only.
- **Action:** sign out (to switch accounts). Optionally "resend" contact support.
- **State:** if the owner later rejects, the user sees a clear rejection state (and may correct/re-register as appropriate); if approved, they proceed to their role dashboard on next sign-in.

## SC-AUTH-FORGOT (forgot password / reset)
- **Purpose:** request a password reset.
- **Fields:** email.
- **Action:** send reset link.
- **State:** submitted confirmation shown (do not reveal whether the account exists, for privacy). Errors: network.
- **Security:** reset performed via the backend's secure reset flow; no plaintext password handling.

## SC-AUTH-SESSION-EXPIRED / SC-SESSION-BLOCKED
- **Purpose:** handle an expired, disabled, or suspended session truthfully.
- **Message:** the session ended / account is disabled or suspended; the user must sign in again or contact the owner.
- **Action:** sign in. No fabricated "still logged in" state.

## Design guardrails (all auth screens)
- Brand logo from the locked set (no regeneration).
- Material 3, accessible contrast, 48dp touch targets, TalkBack labels, no colour-only signalling.
- Loading/submitting/error states are truthful — no fake success or fake progress.
