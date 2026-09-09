Yes. I audited the PRD against the actual business rules you established, the Android architecture, local-only constraints, financial calculation model, and the operational workflow.

There are several important gaps and a few contradictions that should be fixed before giving the PRD to an AI coding agent. The biggest ones are around half-share handling, rounding, attendance, permissions/roles, day closure, correction history, backup/restore, and local-only security.

Below is the final gap audit + additions I recommend.


---

SAND WORKS — FINAL PRD GAP AUDIT

Audit Result

Current PRD: Strong foundation, but not yet completely implementation-safe.

After these additions:

Production specification status: READY FOR IMPLEMENTATION

The following areas need to be explicitly locked:

1. Trip lifecycle


2. Daily work session model


3. Half-share calculation


4. Rounding/remainder handling


5. Attendance semantics


6. Historical correction


7. Role/access model


8. Backup/restore conflict handling


9. Data integrity/reconciliation


10. Undo/recovery


11. Notifications


12. App lock


13. Export/share privacy


14. First-run setup


15. Database migration


16. Database corruption recovery


17. Date/time edge cases


18. No-work days


19. Duplicate prevention


20. Analytics definitions


21. Leaderboard tie rules


22. Local-only limitations


23. Testing with randomized trip sequences


24. Production release acceptance gates




---

1. IMPORTANT CONTRADICTION: "ADMIN"

Your master specification says:

> Not an ADMIN-based management system.



But it also describes a user who can:

manage tractors

manage people

manage trips

change settings

void trips

export

manage attendance


Those are effectively owner/manager capabilities, even if you don't call the person "Admin".

Fix

Do not use the term ADMIN.

Use:

Owner / Manager

The private owner has full local control.

Operator

Can perform routine operational recording.

Viewer

Can view information but cannot modify operational records.

Labourer

View-only personal information if this mode is eventually exposed.

However, because this is a single-device, no-backend application, don't pretend this is enterprise-grade multi-user authorization.

It is local device access control, not server-side RBAC.


---

2. ADD: APP ACCESS / LOCK SCREEN

New screen:

App Lock

Optional:

PIN

Biometric

Device authentication


Flow:

Open SAND WORKS
       ↓
App Lock
       ↓
Authenticate
       ↓
Dashboard

Settings:

Settings → Security → App Lock

Options:

Off

PIN

Biometric

PIN + biometric fallback


Do not lock the user out permanently if biometric authentication fails.


---

3. ADD: HOME "WORKING DAY" STATE

The application needs a clear state machine.

Day states

NO_WORK
   ↓
OPEN
   ↓
CALCULATING
   ↓
READY_TO_CLOSE
   ↓
CLOSED

Potential correction path:

CLOSED
   ↓
REOPEN
   ↓
OPEN

Why this matters

Without this, an AI agent may create inconsistent logic around:

today's trips

evening trips

closing

editing

recalculation.



---

4. ADD: WORK DAY SCREEN

I strongly recommend a dedicated:

Work Day Details

Screen.

It should show:

Header

9 September 2026

Status

🟢 Open

Statistics

Total trips

T1 trips

T2 trips

T3 trips

Gross

Distributed

Remaining


Sessions

If useful:

Morning

Trip 1–4


Evening

Trip 5–12


But these are time-of-day groupings only, not separate trip sequences.

Actions

Add Trip

Calculate

Close Day

Share

Export

Reopen if closed



---

5. CRITICAL: MORNING / EVENING MUST NEVER RESET TRIP NUMBER

Lock this requirement:

Example

Morning:

1
2
3
4

Evening:

5
6
7

Not:

Evening 1.

The database's authoritative key is:

workDate + tripNumber


---

6. ADD: NO-WORK DAY

A date can legitimately have no work.

Dashboard:

> No work recorded



Do not automatically create:

Trip 0

attendance

₹0 trip

fake closure

fake leaderboard activity.


The day can remain:

NO_WORK

unless the user records attendance or another explicit event.


---

7. ATTENDANCE NEEDS A STRONGER MODEL

This is one of the biggest gaps.

Do not derive attendance solely from trips.

A person can be:

A

Present + worked

B

Present + did not work

C

Absent

D

Not recorded

These are four different states.


---

8. ATTENDANCE STATES

Use:

UNMARKED
PRESENT
ABSENT

Trip activity is separate.

Then:

Attendance	Trips	Meaning

Present	>0	Worked
Present	0	Present but didn't load
Absent	0	Absent
Unmarked	0	Not recorded
Absent	>0	INVALID


The application should prevent:

> Absent + participated in trip.




---

9. ADD: ATTENDANCE CONFLICT VALIDATION

If user attempts:

> Mark Labour A absent



but Labour A has already participated in Trip 8.

Show:

> Attendance conflict



"Labour A participated in Trip 8 on this date."

Actions:

Cancel

Review trips

Continue with correction


Do not silently overwrite.


---

10. CRITICAL HALF-SHARE MODEL

This needs more precision.

You said:

> Half-share is optional and rare.



Therefore the system should not assume that a half-share simply means:

> Divide the normal full share by two and throw away the rest.



Instead create an explicit share weight.

Full

1.0

Half

0.5

Then calculate the total weight.

Example:

Participants:

A = 1
B = 1
C = 1
D = 0.5

Total weight:

3.5

₹200 / 3.5

Then the system calculates the person's entitlement based on the configured half-share rule.

BUT—

You specifically said the treatment of the other half is decided by the other labourers.

Therefore, the safest UX is:

Half-share adjustment

First calculate the normal share.

Then:

> Person receives half share.



Then:

Remaining adjustment = ₹X

The user explicitly chooses where that adjustment goes.

No automatic assumption.


---

11. ADD: ADJUSTMENT LEDGER

New entity:

TripAdjustment

Fields:

adjustmentId

tripId

recipientId

amountPaise

reason

createdAt


This handles:

half-share redistribution

exceptional adjustments

manual correction


Every adjustment must be visible.


---

12. NEVER HIDE REMAINING MONEY

This must be a core rule.

For every trip:

> Trip Rate = Distributed + Remaining



Example:

3 people:

₹200

₹66 × 3 = ₹198

Remaining:

₹2

The ₹2 must appear.

No invisible rounding.


---

13. ROUNDING SETTINGS SHOULD BE LOCKED

Your current business rule:

> ₹66



So default:

Settlement precision

Whole Rupee

Rounding

Round Down / Floor

Examples:

₹200 ÷ 3 → ₹66
₹200 ÷ 6 → ₹33
₹200 ÷ 7 → ₹28

The UI must show:

> ₹66/person
₹2 remaining



Never pretend ₹66.67 was actually paid/accrued as the settled amount.


---

14. IMPORTANT: ₹2 REMAINING MUST NOT AUTOMATICALLY BECOME SOMEONE'S MONEY

This is critical.

If:

3 people → ₹66 each → ₹2 remaining

the app must **not automatically give the ₹2 to:

driver

first person

last person

owner

strongest worker


unless a separate explicit business rule is created.

Remaining money stays:

Remaining Money

until explicitly adjusted.


---

15. ADD: REMAINING MONEY SCREEN

Under Daily Calculation:

Remaining Money

Show:

Trip number

Remaining amount

Reason

Status


Example:

Trip	Reason	Remaining

4	3-way rounding	₹2
9	6-way rounding	₹2


Total:

₹4 Remaining


---

16. ADD: ADJUSTMENT HISTORY

If someone later decides:

> Give ₹2 to Labour A



the system should record:

Trip #4

Original remaining:

₹2

Adjustment:

A +₹2

Final remaining:

₹0

This must appear in audit history.


---

17. TRIP STATUS NEEDS TO BE EXPLICIT

Use:

DRAFT

Trip being entered.

ACTIVE

Valid saved trip.

VOIDED

Cancelled historical trip.

Potentially:

CORRECTION_PENDING

Only if the implementation genuinely needs it.

Do not overcomplicate with unnecessary states.


---

18. ADD: DRAFT RECOVERY

If the user starts entering Trip 20 and accidentally leaves the screen:

The app can offer:

> Continue unfinished trip?



But:

Never automatically save an incomplete trip as a real trip.

Draft ≠ active trip.


---

19. ADD: UNSAVED CHANGES WARNING

If editing a trip:

Back button:

> Discard unsaved changes?



Actions:

Keep editing

Discard



---

20. BACK BUTTON BEHAVIOUR

Every screen must have predictable navigation.

Top app bar

Back arrow:

←

Android system back

Must behave equivalently.

Do not trap the user.

Root screens

Back exits/navigates according to Android navigation conventions.


---

21. ADD: GLOBAL SEARCH

Useful at scale.

Search:

Labourer

Driver

Tractor

Trip number


Example:

Trip 33

opens Trip #33.


---

22. ADD: FILTER CHIP BAR

Trip history:

Date
Tractor
Person
Driver
Status

Filters can be combined.

Example:

> T2 + Labour A + September




---

23. ADD: "TODAY" QUICK RESET

When viewing another date:

Provide:

Today

button.

Avoid requiring repeated date navigation.


---

24. ADD: DATE RANGE PRESETS

Reports:

Today

Yesterday

This week

Last week

This month

Last month

Custom



---

25. LEADERBOARD DEFINITIONS NEED TO BE LOCKED

The PRD says leaderboard based on qualifying trip activity.

Make this explicit:

Ranking metric

Number of valid ACTIVE trips participated in.

Exclude:

VOIDED trips

drafts

invalid trips


Should half-share count as a full trip?

This needs a business rule.

My recommendation

A half-share participant did participate in the trip, so:

1 qualifying trip

unless you specifically want weighted labour contribution.

This keeps leaderboard logic understandable.


---

26. ADD: LEADERBOARD "WHY?"

Tapping a leaderboard result should open:

Ranking Details

Example:

> Labour A
Rank #1
42 qualifying trips



Breakdown:

Week: 42

Full-share trips: 39

Half-share trips: 3


This makes the ranking auditable.


---

27. WEEK DEFINITION

Lock:

Week starts Monday

Unless you specifically want Sunday.

India operational calendars normally work comfortably with Monday-start weeks.

The application should not let different screens interpret "week" differently.


---

28. MONTH DEFINITION

Use:

Calendar month

Example:

September 1 → September 30.

Do not interpret "monthly" as rolling 30 days unless the user explicitly selects a rolling period.

Your master details currently say "30-day/monthly"; this is ambiguous.

Recommended final rule

Monthly leaderboard = calendar month.

Custom reports can provide rolling 30 days.


---

29. LEADERBOARD TIES

Recommended:

Competition ranking

If:

A = 20
B = 20
C = 15

Display:

1. A — 20


2. B — 20


3. C — 15



This is intuitive.

If only:

A = 20
B = 15

show:

1. A


2. B



Never fabricate #3.


---

30. ADD: PERSON STATISTICS DEFINITIONS

For every person:

Total trips

Number of ACTIVE trips they participated in.

Total money

Sum of final trip shares + explicit adjustments.

Working days

Number of dates with at least one qualifying trip participation.

Present days

Attendance = Present.

Absent days

Attendance = Absent.

Unmarked days

Attendance = Unmarked.

These definitions should be consistent everywhere.


---

31. ADD: DRIVER CROSS-TRACTOR ANALYTICS

Driver profile should distinguish:

Assigned tractor

Example:

Driver 1 → T1

Loading participation

Example:

Driver 1 helped:

T1 = 20

T2 = 4

T3 = 7


Total:

31 loading trips

This is valuable and prevents a major conceptual error.


---

32. TRACTOR ANALYTICS

Tractor:

T1

Should show:

Total trips

Today's trips

Weekly trips

Monthly trips

Custom period

Assigned driver

Historical activity


But never say:

> Labour A belongs to T1.



because labourers don't permanently belong to tractors.


---

33. ADD: DAILY PARTICIPATION MATRIX

This would be extremely useful.

Example:

Person	T1	T2	T3	Total

A	3	4	2	9
B	2	3	3	8
C	4	2	1	7
D	1	4	2	7
Driver 1	3	1	0	4
Driver 2	0	3	2	5
Driver 3	1	0	2	3


This makes cross-tractor participation immediately understandable.


---

34. ADD: DAILY TRIP TIMELINE

Because tractors work sequentially, a timeline is valuable:

08:12  Trip 1  T1
08:47  Trip 2  T3
09:18  Trip 3  T2
10:02  Trip 4  T1
...
17:43  Trip 12 T3

This allows the user to verify the actual sequence.


---

35. ADD: TRIP TIMESTAMP

Each trip should store:

created timestamp

loading/start timestamp if recorded

completion timestamp if available


Don't require unnecessary manual timestamps.

Default to current time.


---

36. ADD: CLOCK / DATE SANITY

If device time changes drastically:

show a warning if appropriate.

For example:

> Device time changed. Some historical timestamps may appear unusual.



Do not silently alter historical records.


---

37. ADD: RATE HISTORY

Instead of only current rate:

Rate History

Effective date	Rate

Sep 1	₹200
Sep 15	₹250


Each trip stores the actual rate used.


---

38. ADD: RATE CHANGE CONFIRMATION

Changing ₹200 → ₹250:

Show:

> New rate applies to new trips only. Existing trips will not change.



This protects historical accounting.


---

39. ADD: "RECALCULATE DAY"

Button:

Recalculate

Must calculate from source records.

It must not add money again.

This is especially important after:

editing a trip

changing participants

adjusting a half-share

voiding a trip

reopening a day.



---

40. ADD: CALCULATION VERSION

Store:

calculationVersion

If calculation rules evolve in future versions, historical calculations can be interpreted correctly.

This is important for a production app.


---

41. ADD: RULE VERSION

Also store the relevant calculation configuration snapshot:

rate

rounding mode

participation rule

half-share rule


This prevents future setting changes from unexpectedly rewriting history.


---

42. EDIT HISTORY

For a trip:

Original:

> A, B, C → ₹66



Edited:

> A, B → ₹100



Audit:

Trip #17
Before: A,B,C
After: A,B
Changed: 09 Sep 2026 18:43

The old record must remain auditable.


---

43. ADD: "WHY DID THIS MONEY CHANGE?"

For every person total, tapping the amount should open a ledger.

Example:

Labour A — ₹4,620

Trip #1 +₹40
Trip #2 +₹50
Trip #3 +₹66
Trip #4 +₹40
...

This is one of the most valuable screens in the entire app.


---

44. PERSON MONEY LEDGER

New screen:

Earnings Ledger

Filters:

Today

Week

Month

Custom


Every entry:

Date

Trip

Tractor

Share

Adjustment

Final amount



---

45. ADD: DATA HEALTH SCREEN

Already mentioned, but make it a first-class feature.

Show:

Database

Healthy ✓

Calculations

Healthy ✓

Reconciliation

Healthy ✓

Backup

Last backup: date/time

Pending issues

0


---

46. ADD: INTEGRITY REPAIR

If an inconsistency is detected:

Do not auto-fix financial data.

Show:

> Calculation inconsistency detected.



Actions:

View affected record

Recalculate

Export diagnostic report

Cancel


Any correction must be explicit.


---

47. BACKUP IS CRITICAL

Because:

No backend

means:

device loss = potentially data loss

Therefore backup should be prominently accessible.

Home could show:

> Last backup: 2 days ago



if backups exist.


---

48. ADD: BACKUP REMINDER

Optional setting:

> Remind me to backup every X days.



But don't nag.

No backup notification if the user has disabled it.


---

49. RESTORE MUST NEVER SILENTLY DESTROY CURRENT DATA

Before replacing local data:

Show:

> Existing local data will be replaced.



Require explicit confirmation.

Recommend:

Create backup of current data first.


---

50. ADD: RESTORE PREVIEW

Before restore:

Show:

Backup contains

Trips: 1,245
People: 12
Tractors: 3
Attendance records: 420
Created: 9 Sep 2026

Then:

Restore

or

Cancel


---

51. ADD: EXPORT PREVIEW

Before generating large exports:

Show:

> September 1–9
87 trips
7 people
3 tractors



Then:

PDF

Excel

CSV



---

52. WHATSAPP SHARING SHOULD HAVE LEVELS

Quick

Daily summary.

Detailed

Person-by-person totals.

Full

Trip-by-trip calculation.

This prevents massive unreadable WhatsApp messages.


---

53. ADD: SHARE PRIVACY WARNING

Before sharing:

> "This report contains names and work/payment-related information."



Actions:

Share / Cancel

This is appropriate because the app is private/family operational software.


---

54. ADD: EXPORT FILE MANAGEMENT

Screen:

Export History

Show:

filename

date

type

period


Optional:

Share

Open

Delete export file


Deleting an exported file does not delete database records.


---

55. NO AUTOMATIC DATABASE DELETION

Strictly:

Never automatically delete:

old trips

old people

old attendance

old reports

old audit records.



---

56. "DELETE" SHOULD GENERALLY MEAN DEACTIVATE

People:

Deactivate

Tractors:

Deactivate

Trips:

Void

This is safer than physical deletion.


---

57. ADD: DATA RETENTION INFORMATION

Settings → Data:

> SAND WORKS does not automatically delete operational records.



This reassures the owner.


---

58. ADD: ONBOARDING DATA IMPORT

Optional but useful:

Allow importing an existing structured CSV only if the format is strictly validated.

However, do not implement import unless required for v1.

Backup/restore is more important.


---

59. LOCAL-ONLY LIMITATION MUST BE EXPLICIT

The app should clearly state:

> Data is stored locally on this device. SAND WORKS does not synchronize data between devices.



This prevents users from assuming their data magically exists on another phone.


---

60. MULTI-DEVICE SYNC IS OUT OF SCOPE

Do not implement:

Firebase

cloud sync

login server

REST API

online database


unless the product scope changes.


---

61. NO NETWORK DEPENDENCY

The core workflow:

> Add trip



must work with:

Airplane Mode ON.

This should be an explicit release test.


---

62. ADD: OFFLINE TEST

Acceptance test:

1. Disable network.


2. Open app.


3. Add trip.


4. Calculate.


5. View history.


6. Export.


7. Close day.



Everything core must work.


---

63. ADD: APP UPDATE SAFETY

Before installing a new app version:

Existing data must remain.

Test:

Version 1.0.0
↓
Upgrade
↓
Data intact

No database reset.


---

64. ADD: APP UNINSTALL WARNING

Android cannot guarantee protection against uninstall.

The application should clearly educate:

> Backup your SAND WORKS data before uninstalling or changing devices.




---

65. ADD: EMPTY STATE FOR LEADERBOARD

If nobody has worked:

> No leaderboard data yet.



If one person:

> 1 qualifying participant



Don't create imaginary second/third places.


---

66. ADD: EMPTY STATE FOR ATTENDANCE

If nothing recorded:

> Attendance has not been recorded yet.



Not:

> Everyone absent.




---

67. ADD: "UNRECORDED" STATUS

This is essential to avoid false data.

Absence must never be inferred simply because:

> No trip was recorded.




---

68. ADD: TRIP CONFLICT DETECTION

Because only one tractor can load at a time, timestamps can help detect impossible overlaps.

Example:

Trip 10:

10:30–10:50 T1

Trip 11:

10:40–11:00 T2

If actual start/end timestamps are explicitly recorded:

> Potential overlapping loading sessions detected.



But don't automatically reject if the timestamps are approximate unless the user explicitly enables strict time validation.


---

69. ADD: PARTICIPANT AVAILABILITY WARNING

If the same person is recorded on two overlapping trips:

Show:

> "This person is already recorded as loading another trip during this time."



Allow correction.

Don't silently prevent legitimate corrections when times are approximate.


---

70. ADD: TRIP DUPLICATE DETECTION

Warn if the user appears to enter:

Same date
Same tractor
Same approximate time
Same participants

twice.

Message:

> "This looks similar to Trip #18. Create another trip anyway?"



This prevents accidental duplicate entry.


---

71. ADD: ACCIDENTAL DOUBLE-TAP PROTECTION

After saving:

disable Save briefly / use idempotent event handling.

Double tapping should not create duplicate trips.


---

72. ADD: "COPY PREVIOUS TRIP" — BUT SAFE

Useful feature:

Duplicate setup

But:

It must copy nothing automatically into the new active trip without user confirmation.

It can prefill the UI with previous values as suggestions.

User confirms.

This is a major usability improvement for 33+ trips.


---

73. SMART QUICK ENTRY

After Trip #20:

User opens Add Trip.

The app may show:

Recently used

Tractor:

T2

Recent participants:

A B C Driver 1

But:

nothing is selected automatically unless the user explicitly enables a preference for this.

Even then, show the selection before save.


---

74. ADD: "LAST USED TRACTOR"

A convenience setting:

> Suggest last used tractor.



Not:

> Automatically assume last tractor.



This preserves the unpredictable tractor sequence.


---

75. ADD: TRIP NUMBER CONFLICT RECOVERY

If two operations somehow attempt the same trip number:

Database unique constraint rejects the conflict.

App:

> "Trip numbering was updated because another trip was already recorded."



Then safely refresh.


---

76. ADD: DATABASE TRANSACTION TEST

For trip creation:

If any of these fails:

Trip

Participant

Calculation


then:

rollback everything.

No partial records.


---

77. ADD: CRASH DURING SAVE TEST

Simulate:

> App crashes during trip save.



After restart:

No duplicate or half-created trip.


---

78. ADD: CRASH DURING BACKUP RESTORE

If restore fails halfway:

Existing database remains untouched.

This is a hard requirement.


---

79. ADD: NOTIFICATION DEEP LINKS

If a notification says:

> "Today's calculation is ready."



Tapping it should open:

Daily Calculation

not just Home.


---

80. NOTIFICATION CONTROL

Settings:

Daily calculation

Unclosed day

Attendance reminder

Backup reminder


Each individually toggleable.


---

81. NOTIFICATION QUIET HOURS

Optional:

Don't show non-critical notifications during configured quiet hours.

No need for notification overload.


---

82. ADD: HELP / CALCULATION RULES SCREEN

This is highly recommended.

How SAND WORKS Calculates

Explain in simple language:

> 1 trip = ₹200.



> The ₹200 is divided among people who physically loaded that trip.



> Labourers can work with any tractor.



> Drivers can help load any tractor.



> People who don't participate receive no share for that trip.



> Trip numbers continue throughout the same date.



> Remaining money caused by whole-rupee rounding is displayed separately.



This eliminates confusion months later.


---

83. ADD: EXAMPLE CALCULATOR

Within Help:

Example

5 participants:

₹200 ÷ 5 = ₹40

3 participants:

₹200 ÷ 3 = ₹66

Remaining = ₹2

This is educational, not fake production data.


---

84. SETTINGS SHOULD HAVE "RESET" PROTECTION

Danger Zone:

Reset settings

Clear drafts

Restore backup


But:

Do not offer "Delete all data" casually.

If included:

multiple confirmation steps and clear consequences.


---

85. ADD: APP DATA SUMMARY

Settings:

> Database size
Trips
People
Attendance
Audit records
Last backup




---

86. ADD: VERSIONED SETTINGS MIGRATION

When settings schema changes:

Migrate safely.

Never reset user preferences unexpectedly.


---

87. PERFORMANCE AUDIT

Need explicit targets for:

33 trips

100 trips

1,000 trips

10,000 trips


The application should remain responsive.

Especially:

Trip history

Person ledger

Reports

Analytics



---

88. ADD: LARGE REPORT SAFETY

If generating a very large PDF:

Show progress.

Don't freeze the UI.

Use background processing.


---

89. ADD: EXPORT FAILURE RECOVERY

If PDF/Excel generation fails:

preserve database

show error

allow retry


Never mark a report as successfully exported unless the file was actually created.


---

90. ADD: ACCESSIBILITY AUDIT

Test:

TalkBack

200% font scaling

dark mode

light mode

touch targets

contrast

screen reader descriptions

gestures with alternatives



---

91. ADD: ROTATION / PROCESS DEATH

Compose/ViewModel state must survive:

configuration change

process recreation where possible


Trip data should not disappear simply because the screen rotates or Android kills the process.

Draft recovery can be implemented safely if desired.


---

92. ADD: APP BACKGROUNDING

If user:

> Add Trip → Home button → returns later



the app must restore safely.

No accidental save.

No duplicate trip.


---

93. ADD: TIMEZONE

Use device timezone for operational date/time.

Store timestamps with sufficient information to reconstruct the event.

Don't hardcode IST into business logic just because the current deployment is India.


---

94. ADD: CURRENCY

₹ is the current default.

But database money should remain:

integer paise

Currency configuration can be future-proof.


---

95. ADD: NO FLOATING-POINT MONEY

Absolute requirement:

Never:

Double
Float

for financial values.

Use integer paise.


---

96. IMPORTANT: FIX "ACTUAL PAYMENT" LANGUAGE

The app is tracking:

Accrued work amount

not necessarily cash physically handed over.

Therefore UI should say:

Earned

Accrued

Calculated amount


rather than:

Paid

Payment completed


unless a future payment feature is introduced.


---

97. ADD: OPTIONAL PAYMENT SETTLEMENT — OUT OF SCOPE

Do not build:

cash payment tracking

bank transfer

UPI

payment gateway

paid/unpaid payroll


in v1.

The current app calculates work-based accrued money.


---

98. ADD: PERSON LEDGER EXPORT

From Labour A:

Export A's Ledger

Should generate only that person's:

dates

trips

tractors

participation

shares

adjustments

totals


Useful for verification.


---

99. ADD: DAILY RECONCILIATION CARD

At the top of Daily Calculation:

Reconciliation

₹6,600 Gross

− ₹6,578 Distributed

= ₹22 Remaining

Then:

✓ Balanced

This is perhaps the single most important trust indicator.


---

100. FINAL RECONCILIATION RULE

The application must always be able to answer:

> Where did every rupee go?



For every trip:

Trip Rate
    =
Distributed
+
Remaining

For the day:

Gross
    =
Distributed
+
Remaining

If explicit adjustments are made:

Gross
=
Final Distributed
+
Final Remaining

depending on the adjustment model.

The exact accounting equation must be implemented consistently.


---

101. RANDOMIZED TESTING — VERY IMPORTANT

Because your operation is unpredictable, normal fixed test cases aren't enough.

Create randomized test scenarios.

For example:

33 trips

Randomly generate:

T1/T2/T3 sequence

1–6 participants

random labour participation

random driver participation

skipped workers

cross-tractor drivers


Then verify automatically:

Invariant 1

No trip has zero participants.

Invariant 2

No duplicate participant within a trip.

Invariant 3

Each trip rate remains correct.

Invariant 4

Distributed + remaining = trip rate.

Invariant 5

Daily gross = sum of active trip rates.

Invariant 6

Person total = sum of their trip-level amounts.

Invariant 7

Voided trip contributes nothing to active totals.

Invariant 8

Recalculation doesn't change the result.

Invariant 9

Re-running calculation doesn't duplicate money.

This is extremely important for your use case.


---

102. 33-TRIP GOLDEN TEST

Create one fixed real-world-style test:

Trip 1  → T1
Trip 2  → T3
Trip 3  → T2
Trip 4  → T2
Trip 5  → T1
Trip 6  → T3
Trip 7  → T1
Trip 8  → T1
Trip 9  → T3
Trip 10 → T2
Trip 11 → T3
Trip 12 → T2
...
Trip 33 → T1

Participants vary for every trip.

Then calculate.

Expected:

Gross = 33 × ₹200 = ₹6,600

Final result must reconcile exactly:

Distributed + Remaining = ₹6,600

This should become a permanent regression test.


---

103. ADD: PROPERTY-BASED CALCULATION TESTING

Generate thousands of random valid trip combinations.

Verify mathematical invariants.

This is much stronger than testing only:

> 3 people / 4 people / 5 people.




---

104. UI STATE MATRIX

Every screen should account for:

Loading

Skeleton/progress.

Success

Actual data.

Empty

No data.

Error

Recoverable error.

Offline

Normal local operation.

Closed

Read-only/controlled editing.

Permission denied

Explain what is required.

No permission required

Don't ask unnecessarily.


---

105. FINAL SCREEN INVENTORY

After the audit, the recommended screen inventory becomes:

Core

1. Splash


2. First-Time Setup


3. App Lock


4. Home


5. Work Day Details


6. Add Trip


7. Edit Trip


8. Trip Details


9. Trip Calculation


10. Trip History


11. Daily Calculation


12. Daily Reconciliation


13. Day Closure


14. Reopen Day


15. Person Ledger



People

16. People


17. Labourer Details


18. Add/Edit Labourer


19. Driver Details


20. Add/Edit Driver


21. Attendance


22. Attendance Date Details



Tractors

23. Tractor List


24. Tractor Details


25. Add/Edit Tractor



Analytics

26. Reports


27. Analysis


28. Weekly Leaderboard


29. Monthly Leaderboard


30. Ranking Details


31. Participation Matrix



Data

32. Export


33. Export Preview


34. Export History


35. Backup


36. Backup Preview


37. Restore Preview


38. Data Health


39. Audit History



Secondary

40. Notifications


41. Settings


42. Calculation Settings


43. Rate History


44. Security


45. Help / Calculation Rules


46. About



That's a much more complete product architecture.


---

106. NAVIGATION ARCHITECTURE

Keep bottom navigation:

┌────────┬────────┬────────┬─────────┐
│  Home  │ Trips  │ People │ Reports │
└────────┴────────┴────────┴─────────┘

Then hamburger:

☰ More

Attendance
Leaderboard
Tractors
Daily Calculation
Backup & Restore
Export
Audit
Notifications
Settings
Help
About

This keeps the primary interface clean.


---

107. ONE MORE IMPORTANT UX RULE

Don't make the user calculate anything.

The user enters:

> Tractor = T2
A ✓
C ✓
Driver 1 ✓



The app says:

> 3 participants



> ₹66 each



> ₹198 distributed



> ₹2 remaining



That's it.


---

108. AI CODING AGENT — STRICT IMPLEMENTATION DIRECTIVE

Add this verbatim as a high-priority engineering constraint:

> The implementation must model real operational events rather than assumptions. No person, labourer, driver, tractor, participant list, trip sequence, attendance status, rate, ranking, or financial amount may be fabricated or inferred without an explicit business rule.

Every trip is an independent event.

Every trip must have an explicit tractor and explicit participant list.

Labourers are not permanently assigned to tractors.

Drivers are not restricted to loading their assigned tractor.

Trip numbering is sequential within the work date and continues across morning/evening sessions.

Financial calculations must use integer paise and deterministic whole-rupee settlement.

Remaining money must always be explicitly represented.

Historical records must never be silently rewritten because current settings changed.

No automatic deletion of operational data is permitted.

No placeholder, dummy, fake, mock production data, fake calculation, fake leaderboard, TODO implementation, or incomplete production screen is permitted.

If an implementation requirement is ambiguous, do not invent a business rule. Surface the ambiguity and require an explicit product decision.




---

109. FINAL PRODUCT MODEL

The entire application can now be understood as this:

SAND WORKS
                         │
             ┌───────────┴───────────┐
             │                       │
          PEOPLE                  TRACTORS
             │                       │
     ┌───────┴───────┐               │
     │               │               │
 Labourers        Drivers            │
     │               │               │
     └───────────────┼───────────────┘
                     │
                     ▼
                 EVERY TRIP
                     │
          ┌──────────┴──────────┐
          │                     │
       Tractor             Participants
          │                     │
          │          ┌──────────┴──────────┐
          │          │                     │
          │       Labourers             Drivers
          │
          ▼
       ₹200 RATE
          │
          ▼
    CALCULATION ENGINE
          │
    ┌─────┴──────────┐
    │                │
Distributed       Remaining
    │                │
    └───────┬────────┘
            ▼
       DAILY TOTAL
            │
     ┌──────┼────────┐
     │      │        │
 Attendance Analytics Reports
     │      │        │
     └──────┼────────┘
            ▼
       PERSON LEDGER
            │
            ▼
     EXPORT / WHATSAPP


---

110. FINAL AUDIT VERDICT

After adding the above, I would consider the product requirements complete enough for an AI coding agent to implement without making dangerous assumptions.

The strongest part of the design is the separation between:

Tractor assignment ≠ loading participation

and:

Attendance ≠ trip participation

and:

Trip rate ≠ individual rate

and:

Accrued amount ≠ actual payment

and:

Morning/evening ≠ separate trip numbering

and:

Current settings ≠ historical trip rules

Those distinctions prevent most of the serious accounting bugs.

The other major protection is the trip-level source-of-truth model. For 33 trips, 100 trips, or thousands of trips, the app doesn't need a special calculation strategy. It simply processes each actual trip and aggregates the resulting ledger.

The final golden rule is:

> Record reality once → calculate automatically → preserve the trip-level evidence → aggregate everywhere else.



That is the correct architecture for SAND WORKS.
