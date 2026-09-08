# Notifications & Alerts — SAND WORKS

Notifications are **online** (Firebase Cloud Messaging) and **role/user-targeted**. A notification is sent by the backend and targets a specific user; it never contains another person's private money figures.

## Notification types
| Type | Recipient | Purpose |
|---|---|---|
| A Daily earnings summary | each eligible user | accrued-totals summary for the day ("earnings added / summary" wording) |
| B Operational alert | recipients chosen by owner | owner's high-priority warning |
| C Approval outcome | applicant | account approved or rejected |
| D Trip assignment | driver/labourer | assigned to a trip/operational role |
| E Temporary-assignment expiry | assignee | temp access has ended |
| F Operational / other | relevant user | general operational notice |

## Owner alert (SC-OWN-ALERT)
- **Who sends:** owner only.
- **Recipients:** drivers/labourers/approved users.
- **Presentation:** high priority; vibration; custom alert sound; heads-up where the OS permits; a **prominent in-app alert** that requires acknowledgement/dismissal.
- **Honest platform limits:** the app never claims to override silent/DND or force volume (no unsafe volume tricks); full-screen intents are restricted; acknowledgement is recorded.
- **Shown metadata:** sender, timestamp, recipients, message.

## Deep links from notifications
Opening a notification routes to the relevant screen **after** re-validating auth + role + org + ownership + existence. If not allowed, an honest Forbidden/NotFound state is shown.

## Read state
Notifications track read state; unread is shown in the notification centre and as a badge where appropriate.

## Rules
- Sent by the backend (Cloud Functions) — the client cannot forge a notification from another user or the owner.
- Per-user targeting; **no private-financial cross-broadcast**.
- Approved copy wording is used (no fabricated strings).
- Permission asked with rationale + in-app settings; no broad upfront request beyond what is needed.
