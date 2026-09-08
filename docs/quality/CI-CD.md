# CI / CD — SAND WORKS

Status: **SPECIFIED.** Continuous integration; **no automatic Google Play publishing**. Private APK distribution.

## Pipeline stages
1. **Checkout** (pin commit).
2. **Dependency resolution** (cached Gradle).
3. **Formatting/static checks** (ktlint/spotless).
4. **Lint** (Android lint; no errors).
5. **Compilation** (`assembleDebug`/`compileDebugKotlin`).
6. **Unit tests** (JVM + Robolectric).
7. **Firebase emulator tests** (Security Rules + Cloud Functions) where secrets-free (uses emulator; no production project).
8. **UI tests** where feasible (Gradle managed devices / connectedAndroidTest on hosted runner, if available).
9. **Security scanning** (SAST).
10. **Secret scanning** (gitleaks/detect-secrets) — fail on any token/key.
11. **Dependency scanning** (OWASP/OSV) — fail on critical/high.
12. **Artifact generation** — build release APK unsigned (or signed in secure step).
13. **Versioning** — derived from git/tag; versionCode monotonic.
14. **Release validation** — tests green + manual checklist.
15. **Signing** — only in protected release job via CI secrets; never in logs.
16. **Artifact integrity** — checksum + signature verify.
17. **Release notes** — generated/manual; attached.
18. **Distribution** — private APK output (no Play).

## Guardrails
- No secrets in pipeline logs; env/CI secrets only.
- Never disable tests to go green.
- Placeholder scan (TODO/FIXME/TBD/XXX) fails the production branch job.
- Release signing uses dedicated SAND WORKS keystore from secrets; not committed.

## Current state
Pipelines are **SPECIFIED**; actual CI runner/config is EXISTING only when committed and run. This repo is documentation; no CI is running here.
