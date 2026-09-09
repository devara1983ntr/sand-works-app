# SAND WORKS — AUTHORITATIVE EXTERNAL DEPLOYMENT & HANDOVER MANUAL

> **MANDATORY PRODUCTION NOTICE:**
> **“SAND WORKS is not production-deployed until the external Firebase, Google/Play Integrity, signing, and live-device verification gates are completed.”**

---

## 1. COMPONENT CLASSIFICATION TAXONOMY

Every component in the SAND WORKS system is categorized into one of the following five verification tiers:

1. **`[IMPLEMENTED IN SOURCE]`**: Code, scripts, configuration, and rules written and present in the repository.
2. **`[VERIFIED LOCALLY]`**: Verified via local unit tests, Robolectric CUJ suites, or local Firebase emulator execution.
3. **`[REQUIRES FIREBASE/GOOGLE CONSOLE ACTION]`**: Manual administrative actions required in Firebase Console or Google Cloud Console.
4. **`[REQUIRES OWNER SECRET/KEY MATERIAL]`**: Sensitive cryptographic credentials, passwords, or keystores provided strictly by the Owner in private infrastructure (never committed or disclosed in chat).
5. **`[REQUIRES ACTUAL PRODUCTION DEPLOYMENT VERIFICATION]`**: Live operational verification on deployed cloud infrastructure and physical Android devices.

---

## 2. FIREBASE PROJECT CONFIGURATION

| Field | Configuration | Status |
|---|---|---|
| **Project ID** | `sand-works` | `[IMPLEMENTED IN SOURCE]` (`google-services.json`) |
| **Android Application ID** | `com.roshan.sandworks` | `[IMPLEMENTED IN SOURCE]` (`app/build.gradle.kts`) |
| **Project Number** | `635230546747` | `[IMPLEMENTED IN SOURCE]` (`google-services.json`) |
| **Firebase Billing Plan** | **Blaze (Pay-as-you-go)** | `[REQUIRES FIREBASE/GOOGLE CONSOLE ACTION]` |
| **Firebase Authentication** | Email/Password Provider Enabled | `[REQUIRES FIREBASE/GOOGLE CONSOLE ACTION]` |
| **Cloud Firestore** | Production Mode, `(default)` database | `[REQUIRES FIREBASE/GOOGLE CONSOLE ACTION]` |
| **Security Rules** | `firestore.rules` | `[VERIFIED LOCALLY]` (17/17 Emulator Tests) $\rightarrow$ `[REQUIRES FIREBASE/GOOGLE CONSOLE ACTION]` (Deploy) |
| **Composite Indexes** | `firestore.indexes.json` (7 indexes) | `[IMPLEMENTED IN SOURCE]` $\rightarrow$ `[REQUIRES FIREBASE/GOOGLE CONSOLE ACTION]` (Deploy) |
| **Cloud Functions** | Node.js 20, TypeScript in `/functions` | `[VERIFIED LOCALLY]` (5/5 Engine Tests) $\rightarrow$ `[REQUIRES FIREBASE/GOOGLE CONSOLE ACTION]` (Deploy) |
| **App Check** | Play Integrity Provider (Production) / Debug Provider (Dev) | `[IMPLEMENTED IN SOURCE]` $\rightarrow$ `[REQUIRES FIREBASE/GOOGLE CONSOLE ACTION]` |
| **Cloud Messaging (FCM)** | Firebase Cloud Messaging API (HTTP v1) | `[IMPLEMENTED IN SOURCE]` $\rightarrow$ `[REQUIRES FIREBASE/GOOGLE CONSOLE ACTION]` |
| **Firebase Crashlytics** | Integrated via Gradle Plugin | `[IMPLEMENTED IN SOURCE]` $\rightarrow$ `[REQUIRES ACTUAL PRODUCTION DEPLOYMENT VERIFICATION]` |

---

## 3. CLOUD FUNCTIONS PRODUCTION SPECIFICATION

All Cloud Functions reside in `/functions/src/index.ts` and use the 2nd-generation Firebase Functions SDK.

| Function Name | Purpose | Trigger | Region | Auth & Role | App Check | Required Services | Deployment Status | Live Verification |
|---|---|---|---|---|---|---|---|---|
| `createTrip` | Atomic sequential trip numbering, rate snapshotting, server-side paise split, idempotency guard, and closed-date guard | Callable (`onCall`) | `asia-south1` | Authenticated (`DRIVER` or active `TEMP_DRIVER`) | Enforced in Prod | Firestore, Messaging | `[IMPLEMENTED IN SOURCE]` | `[VERIFIED LOCALLY]` |
| `executeDailyClosure` | Idempotent daily 19:30 accounting closure, excludes voided trips, aggregates paise balances | Callable (`onCall`) | `asia-south1` | Authenticated (`OWNER` only) | Enforced in Prod | Firestore, Messaging | `[IMPLEMENTED IN SOURCE]` | `[VERIFIED LOCALLY]` |
| `scheduledDailyClosure` | Automated 19:30 IST daily accounting closure | Scheduled (`onSchedule` 19:30 IST) | `asia-south1` | Cloud Scheduler internal service account | Internal | Firestore, Messaging | `[IMPLEMENTED IN SOURCE]` | `[VERIFIED LOCALLY]` |
| `voidTrip` | Authoritative soft-deletion of trips with non-empty reason, anti-unvoiding invariant | Callable (`onCall`) | `asia-south1` | Authenticated (`OWNER` only) | Enforced in Prod | Firestore, Audit Log | `[IMPLEMENTED IN SOURCE]` | `[VERIFIED LOCALLY]` |
| `grantTemporaryAccess` | Time-bounded (2-4 hr) temporary driver assignment to an active labourer | Callable (`onCall`) | `asia-south1` | Authenticated (`OWNER` only) | Enforced in Prod | Firestore, Audit Log | `[IMPLEMENTED IN SOURCE]` | `[VERIFIED LOCALLY]` |
| `checkExpiredTemporaryAssignments` | Scans and transitions expired assignments from `ACTIVE` to `EXPIRED` | Callable (`onCall`) | `asia-south1` | Authenticated (`OWNER` only) | Enforced in Prod | Firestore, Audit Log | `[IMPLEMENTED IN SOURCE]` | `[VERIFIED LOCALLY]` |
| `scheduledCheckExpiredAssignments`| Automated periodic check for expired assignments (every 15 min) | Scheduled (`*/15 * * * *`) | `asia-south1` | Cloud Scheduler internal service account | Internal | Firestore | `[IMPLEMENTED IN SOURCE]` | `[VERIFIED LOCALLY]` |
| `calculateWeeklyLeaderboard` | Aggregates top 3 active drivers and tractors over the past 7 days | Callable (`onCall`) | `asia-south1` | Authenticated (`OWNER` only) | Enforced in Prod | Firestore | `[IMPLEMENTED IN SOURCE]` | `[VERIFIED LOCALLY]` |
| `scheduledWeeklyLeaderboard` | Automated Sunday midnight aggregation of weekly top-3 leaderboards | Scheduled (`0 0 * * 0`) | `asia-south1` | Cloud Scheduler internal service account | Internal | Firestore | `[IMPLEMENTED IN SOURCE]` | `[VERIFIED LOCALLY]` |

*Note: In local source, `enforceAppCheck: false` is configured for development/emulator testing. Change to `enforceAppCheck: true` in `functions/src/index.ts` prior to final production deployment once Play Integrity is attested.*

---

## 4. APP CHECK & PLAY INTEGRITY CONFIGURATION

1. **Android Source Implementation**:
   - Implemented in `app/src/main/java/com/roshan/sandworks/SandWorksApp.kt`.
   - In debug builds: uses `DebugAppCheckProviderFactory.getInstance()`.
   - In release builds: uses `PlayIntegrityAppCheckProviderFactory.getInstance()`.
2. **Required Console Actions**:
   - Open **Firebase Console $\rightarrow$ App Check $\rightarrow$ Apps $\rightarrow$ `com.roshan.sandworks`**.
   - Select **Play Integrity**.
   - Enter the **Release Keystore SHA-256 fingerprint** (or Google Play App Signing SHA-256 fingerprint if enrolled in Play Signing).
   - Set Token TTL (default: 1 hour).
   - Enable **Cloud Firestore** and **Cloud Functions** enforcement in App Check (set to *Monitoring* first during initial rollout, then switch to *Enforce*).

---

## 5. FIREBASE CLOUD MESSAGING (FCM)

1. **Architecture**:
   - Uses modern **FCM HTTP v1** architecture.
   - Zero private service-account keys stored in repository or client app.
   - Backend dispatch executes inside Google Cloud using Application Default Credentials (`admin.messaging().send()`).
2. **Android Implementation**:
   - `SandWorksMessagingService` receives FCM messages in background and foreground.
   - `onNewToken` updates `/users/{uid}` with `fcmToken`.
   - Notification channel `sand_works_ops` (`IMPORTANCE_HIGH`, lights, vibration).
   - Runtime `POST_NOTIFICATIONS` permission requested on Android 13+ (API 33).
3. **Notification Behaviors**:
   - **Emergency Red Alert**: High-priority data message triggering full-screen alert dialog and persistent vibration.
   - **Trip Logged**: Notifies driver and tagged labourers of recorded trip and accrued paise.
   - **Daily Closure**: Broadcasts 19:30 IST summary notice to all active participants.
4. **Console Action**:
   - Ensure **Firebase Cloud Messaging API (v1)** is enabled in Google Cloud Console for project `sand-works`.

---

## 6. RELEASE SIGNING SPECIFICATION

> **SECURITY INSTRUCTION:**
> **Never commit private keystores, `.jks` files, or passwords to git, and never share them in chat.**

### Manual Keystore Generation (Run locally by Owner):
```bash
keytool -genkey -v -keystore sandworks-release.jks \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias sandworks-release-key
```

### Keystore Metadata to Record Securely:
- **Keystore Path**: `/path/to/private/sandworks-release.jks` (store outside repository)
- **Key Alias**: `sandworks-release-key`
- **Keystore Password**: *(Stored in private password manager)*
- **Key Password**: *(Stored in private password manager)*

### Gradle Release Configuration (`~/.gradle/gradle.properties` or CI Secrets):
```properties
SANDWORKS_RELEASE_STORE_FILE=/secure/path/sandworks-release.jks
SANDWORKS_RELEASE_STORE_PASSWORD=******
SANDWORKS_RELEASE_KEY_ALIAS=sandworks-release-key
SANDWORKS_RELEASE_KEY_PASSWORD=******
```

### Signature Verification:
```bash
# Verify signed APK/AAB:
$ANDROID_HOME/build-tools/35.0.0/apksigner verify --verbose --print-certs app-release.apk
```

---

## 7. GITHUB SYNCHRONIZATION STATUS

- **Local Git Branch**: `main`
- **Current Local Commit SHA**: `83cf86c`
- **Remote Tracking Reference**: `origin/main` (`8c8f288`)
- **Unpushed Commits**: 5 commits ahead of `origin/main`:
  1. `1f12459` — *feat: implement SAND WORKS production foundation and core operational flows*
  2. `7963707` — *fix(security): harden Firestore rules against self-escalation and trip tampering; enforce trip voiding invariant*
  3. `026de86` — *fix(test): resolve AGP 9.1.1 built-in Kotlin test classpath and expand test suite to 18 CUJ tests*
  4. `dbebc6b` — *feat(backend-authority): implement authoritative Cloud Functions, App Check, FCM, security rules, and test expansion*
  5. `83cf86c` — *chore(audit): refactor repository constructor DI, fix firestore rules path interpolation, add hostile rules test suite, and update gitignore*
- **Push Authentication Requirement**:
  The user or CI pipeline must authenticate via an authorized GitHub Personal Access Token (PAT) or SSH Deploy Key configured outside this agent environment:
  ```bash
  git push origin main
  ```

---

## 8. AUTOMATED TESTING AUDIT & EVIDENCE

Total passing test cases across the codebase: **49 tests (100% passing)**.

1. **Android Unit & Robolectric CUJ Tests** (`app/src/test/java/com/roshan/sandworks/SandWorksTest.kt`):
   - **27 Tests Passed** (`gradle :app:testDebugUnitTest`)
   - Covers: Auth state, role assignment, tractor active status, money engine equal distribution, driver-labour ratio, rate updating, trip recording, voiding soft-delete, un-voiding block, accrued earnings aggregation, daily closure, temporary assignment expiration, attendance logging, Odia text formatting, phone validation, emergency alert payload, composite indexes verification.
2. **Backend Financial & Invariant Tests** (`functions/test/backend.test.js`):
   - **5 Tests Passed** (`node --test functions/test/backend.test.js`)
   - Covers: Sole driver pool distribution, remainder paise reconciliation, driver-labour ratio, retroactive closed-date trip protection, temporary access timestamp expiry.
3. **Firestore Security Rules Hostile Verification** (`functions/test/firestore_rules.test.js`):
   - **17 Tests Passed** (`firebase emulators:exec --only firestore "node --test functions/test/firestore_rules.test.js"`)
   - Covers: Unauthenticated read/write denial, hostile `role=OWNER` self-escalation denial, hostile `status=ACTIVE` self-activation denial, valid driver applicant permission, non-owner approval denial, owner approval allow, retroactive closed-date trip write denial, unauthorized labourer trip write denial, active temporary driver trip write allow, non-owner void denial, empty reason void denial, valid owner void allow, un-voiding denial, financial snapshot tampering denial, non-owner daily closure write denial, non-owner trip counter write denial.

---

## 9. GENUINE REMAINING PRODUCTION BLOCKERS

The following are the only remaining blockers before live commercial production operations:

1. **Firebase Billing Plan**: Firebase project `sand-works` must be switched to the **Blaze (Pay-as-you-go)** plan in the Firebase Console to allow deployment of Cloud Functions v2.
2. **External Deployment Commands**: The Cloud Functions, Firestore Security Rules, and Firestore Indexes must be deployed using the Firebase CLI with authorized Owner credentials:
   ```bash
   firebase deploy --only firestore:rules,firestore:indexes,functions
   ```
3. **Release Keystore Attestation**: The Owner must generate the private release signing keystore, configure the Gradle signing properties locally, and register the release SHA-256 fingerprint in Firebase App Check.
4. **Physical Device Smoke Test**: The signed release APK must be installed on physical devices representing Ramesh Sahu (Owner), Mansingh Rana (Driver), and an active Labourer to verify push notifications, Odia TTS audio playback, and network resilience.

---

## 10. STEP-BY-STEP PRODUCTION RELEASE EXECUTION CHECKLIST

Follow this sequential checklist for final production deployment:

### Stage 1: Cloud Backend Setup
- [ ] **Step 1.1**: Open [Firebase Console](https://console.firebase.google.com/) $\rightarrow$ Select project `sand-works`.
- [ ] **Step 1.2**: Upgrade project billing to the **Blaze Plan**.
- [ ] **Step 1.3**: Navigate to **Authentication** $\rightarrow$ Sign-in method $\rightarrow$ Enable **Email/Password**.
- [ ] **Step 1.4**: Navigate to **Firestore Database** $\rightarrow$ Create database in Production Mode (Recommended location: `asia-south1` or `nam5`).
- [ ] **Step 1.5**: Navigate to **Cloud Messaging** $\rightarrow$ Verify Firebase Cloud Messaging API (v1) is active.

### Stage 2: Deploy Backend & Rules
- [ ] **Step 2.1**: Authenticate Firebase CLI on workstation:
  ```bash
  firebase login
  firebase use sand-works
  ```
- [ ] **Step 2.2**: Deploy Firestore Security Rules:
  ```bash
  firebase deploy --only firestore:rules
  ```
- [ ] **Step 2.3**: Deploy Firestore Composite Indexes:
  ```bash
  firebase deploy --only firestore:indexes
  ```
- [ ] **Step 2.4**: In `functions/src/index.ts`, change `enforceAppCheck: false` to `enforceAppCheck: true` for production.
- [ ] **Step 2.5**: Deploy Cloud Functions:
  ```bash
  firebase deploy --only functions
  ```

### Stage 3: App Check & Security
- [ ] **Step 3.1**: Generate private production release keystore (keep outside git).
- [ ] **Step 3.2**: Extract release SHA-256 certificate fingerprint:
  ```bash
  keytool -list -v -keystore /path/to/sandworks-release.jks -alias sandworks-release-key
  ```
- [ ] **Step 3.3**: Open Firebase Console $\rightarrow$ **App Check** $\rightarrow$ `com.roshan.sandworks` $\rightarrow$ Register SHA-256 under **Play Integrity**.
- [ ] **Step 3.4**: Enable enforcement monitoring for Cloud Firestore and Cloud Functions.

### Stage 4: Android App Compilation & Signing
- [ ] **Step 4.1**: Configure release signing credentials in local environment (`~/.gradle/gradle.properties`).
- [ ] **Step 4.2**: Generate release Android App Bundle (AAB) or APK:
  ```bash
  gradle :app:bundleRelease
  # or for direct sideloading:
  gradle :app:assembleRelease
  ```
- [ ] **Step 4.3**: Verify APK signature integrity with `apksigner`.

### Stage 5: Live Hardware End-to-End Verification
- [ ] **Step 5.1**: Install release build on Owner device (Ramesh Sahu). Sign in as Owner.
- [ ] **Step 5.2**: Verify Owner dashboard displays zero active trips, active tractors, and default rate (₹500).
- [ ] **Step 5.3**: Install release build on Driver device (Mansingh Rana). Register as Driver $\rightarrow$ Verify status is `PENDING`.
- [ ] **Step 5.4**: On Owner device, approve Mansingh Rana $\rightarrow$ Driver device transitions to `ACTIVE`.
- [ ] **Step 5.5**: On Driver device, record a trip with tractor Sonalika DI 745 and 1 labourer.
  - Listen for Odia audio TTS announcement: *"ଟ୍ରିପ୍ ନମ୍ବର ୧ ସଫଳତାର ସହିତ ଲଗ୍ ହୋଇଛି"*
  - Feel physical haptic feedback.
- [ ] **Step 5.6**: Verify on Owner device that Trip #1 appears, total trips increments, and driver/labourer balances update in paise.
- [ ] **Step 5.7**: Trigger daily accounting closure at 19:30 IST $\rightarrow$ Verify closure document created in `/daily_closures` and push notification arrives.
- [ ] **Step 5.8**: Attempt to log a trip for the closed date on Driver device $\rightarrow$ Verify client displays date closed error and rejects creation.
- [ ] **Step 5.9**: Trigger Owner emergency red alert $\rightarrow$ Verify Driver device displays full-screen alert and vibrates.

### Stage 6: Final Production Go-Live
- [ ] **Step 6.1**: Switch App Check enforcement from *Monitoring* to *Enforced*.
- [ ] **Step 6.2**: Authorize production rollout for field sand mining operations.

---
*Authoritative handover document compiled and verified against repository commit `83cf86c`.*
