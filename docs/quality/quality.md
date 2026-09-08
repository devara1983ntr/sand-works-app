# Quality, Testing & Release — SAND WORKS

## Quality bar
Industry-level: production-ready, fast, reliable, accessible, secure. **No placeholder/fake data, fake success, fake money, fake leaderboard, fake notifications, fake loading, or inert/dead controls.** Every visible control works; every role is tested; every backend rule is tested.

## What is tested
- **Unit:** money-engine math (integer paise, distribution rules, remainder policy, snapshots), domain rules, time/day boundaries.
- **Repository/data:** mapping, scoping.
- **UI per screen & per state:** loading / empty / error / offline / submitting / conflict / forbidden / session-expired — each truthful. Interaction tests confirm real behaviour (no dead buttons).
- **Backend:** Cloud Functions emulator tests for approval, numbering, distribution, closure idempotency, leaderboards, alert/notifications, export, expiry, audit.
- **Security/attack suite:** the attack posture in `docs/security/security.md` (role escalation, cross-org, forge, disabled/expired, deep-link authz, storage, idempotency/retry).
- **Concurrency/offline UX:** revision conflicts resolved with user choice, never silent overwrite; flaky-network behaviour is honest (loading/error/retry).
- **Accessibility & responsive:** contrast, 48dp touch targets, TalkBack semantics, reduced motion, no colour-only signalling, responsive across phone sizes, text-scale.

## Accessibility
Material 3 with accessible tokens; every screen has semantic labels; no essential control relies on colour alone.

## Release & delivery
- **Not** a public store consumer release — a private production APK for the organisation.
- Requires a real, owner-provisioned Firebase project and a dedicated release signing identity.
- Firebase services required for full go-live: Auth, Firestore, Cloud Functions, Cloud Messaging, App Check (and Cloud Storage where enabled). These are provisioned by the owner/environment — this documentation never fakes their presence.
- Release checklist gates: build + sign + install on real devices; security retest on the release candidate; accessibility pass; money-idempotency verification; audit integrity check.

## Honesty about dependencies
This repository is a **specification**. Building and running the app requires real environment inputs (Firebase project, signing). Where an input is absent it is treated as a genuine dependency, never as an invented/assumed capability.
