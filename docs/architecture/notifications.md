# Notifications & Emergency Warning — SAND WORKS

Status: **SPECIFIED.** FCM-based, online. Backend-authoritative. Honest about Android limits.

## 1. Types
| Type | Purpose | Recipient |
|---|---|---|
| A | **Daily accrued-money summary** (wording: accrued, never "payment") | each eligible user |
| B | Operational/emergency warning (owner) | chosen recipients |
| C | Approval outcome | applicant |
| D | Trip assignment | driver/labourer |
| E | Temporary-assignment expiry | assignee |
| F | Operational/system-account | relevant user |

## 2. Normal notifications
Approve account/access-change/trip/daily-accrual-summary/operational/system events → targeted per user, sent by backend. No private-financial cross-broadcast (never include another user's money).

## 3. Owner-only broadcast & Emergency Warning
- Only OWNER can send broadcast messages/warnings.
- Emergency Warning flow: **warning button → confirmation step → optional message → recipient scope → delivery state → retry → duplicate prevention → history → audit → cancellation where possible.**

## 4. Urgent behaviour — strongest Android-compliant (honest)
Use a **high-importance notification channel**, with:
- **vibration** (when device permits)
- **notification sound / alert sound** (when device/OS permits)
- **heads-up notification** (where the OS allows)
- **full-screen intent only where legally/platform appropriate** (restricted).
Accurately distinguish: vibration · notification sound · heads-up · high-importance channel · full-screen intent · device volume · Silent mode · Do Not Disturb · Android permission/policy restrictions.

**The app never claims it can force a phone to play at full volume while Silent/DND, bypass Do Not Disturb, or override the user's sound settings.** Document the cases where Android prevents the app from overriding system policy; the app provides the strongest compliant behaviour and tells the user to enable the channel/permissions for best effect.

## 5. Read state, retention, channel model
- Notification centre with read/unread; badge. Deep link → re-validate then route.
- Channels: Earnings/Summary, Alerts/Warnings, System/Account, Operational.
- Retention per org prefs (history).

## 6. Permission handling
- POST_NOTIFICATIONS requested with rationale + in-app settings; no over-broad upfront demand. If denied, features degrade honestly (user may enable later).

## 7. Plan dependency
Real FCM push requires Firebase project + FCM creds (owner-provisioned). Not fabricated; document fallback if absent (in-app notification centre still works; real push pending).
