Yes. I did another fresh gap audit from the ground up, rather than assuming the previous PRD was complete.

There are still several things I would fix before handing this to an AI coding agent. Most are not missing "nice-to-have" screens—they are edge cases that can cause wrong money, wrong trip numbers, wrong attendance, or irreversible data loss.

Final audit result

Previous specification: ~90–95% complete
After the additions below: suitable to freeze as a v1.0 implementation specification.

I found 18 remaining areas worth locking down.


---

1. 🚨 Biggest remaining issue: Half-share calculation

The current wording:

> Half-share = 0.5 participation



can cause an AI agent to interpret it incorrectly.

Your real rule is:

> Half-share is an exceptional human decision, and the other half/remaining amount is decided by the other labourers.



Therefore, do not make half-share part of the normal automatic mathematical participant formula.

Better model

Every person on a trip has:

FULL

HALF


But the calculation engine should produce a proposed entitlement, followed by an explicit adjustment.

Example:

Trip = ₹200

Normal share = ₹50

Person A = HALF

A gets:

₹25

Remaining/discrepancy:

₹25

Then the user/group explicitly decides where that ₹25 goes.

Possible:

Labour B +₹25

Labour C +₹25

split B/C

leave as remaining money


Critical rule

The app must never decide this automatically.


---

2. 🚨 Half-share needs an explicit UI

Add:

Half-Share / Adjustment Screen

When selecting half-share:

> ⚠️ Exceptional share



Show:

Normal share: ₹50
Half share: ₹25
Amount requiring decision: ₹25

Then:

Distribution

Keep as remaining

Give to selected participant(s)

Custom distribution


Every rupee must reconcile.


---

3. 🚨 Custom adjustment must reconcile

Suppose:

₹200 trip

A = ₹25
B = ₹58
C = ₹58
D = ₹59

Total:

₹200

Perfect.

But if user enters:

A ₹25
B ₹60
C ₹60
D ₹60

Total:

₹205

Block save.

Error:

> "Adjustment exceeds the available trip amount by ₹5."



Likewise if total is ₹190:

> "₹10 remains undistributed."



The user can either intentionally leave ₹10 as Remaining Money or distribute it.


---

4. 🚨 Separate "Remaining" from "Adjustment"

These should not be mixed.

Remaining Money

Money that has not been distributed.

Adjustment

An explicit decision to redistribute/change an amount.

Example:

Trip:

₹200

Normal calculation:

₹198 distributed
₹2 remaining

Then user gives ₹2 to A:

Final:

₹200 distributed
₹0 remaining

The system should preserve both:

Original calculation

and

Final adjustment.


---

5. Calculation vs Day Closure needs separation

This is important.

You said:

> Automatically calculate everything around 7–8 PM or customized time or Calculate button.



That should not automatically mean "close the day."

These are different:

Calculate

Recalculate current records.

Close

Lock the work date.

Recommended:

Automatic calculation = YES

Automatic irreversible closure = NO

The user should explicitly close the day unless you later decide otherwise.

This is safer.


---

6. Add "Calculation Status"

Every day should have:

Not calculated

Calculated

Changes pending

Ready to close

Closed

Reopened


Example:

You closed at 8 PM.

Then someone adds/corrects a trip.

Status becomes:

> Changes Pending



The app must not pretend the old calculation is still final.


---

7. Add "Last calculated" and "Last changed"

Daily screen should show:

> Last calculated: 7:42 PM



> Last data change: 8:13 PM



If:

Last data change > Last calculation

show:

🟠 Calculation needs refresh

This is an excellent integrity feature.


---

8. Trip numbering after voiding needs an explicit rule

This wasn't sufficiently locked.

Example:

Trip 1
Trip 2
Trip 3
Trip 4

Then Trip 3 is voided.

Should the next trip be:

Trip 5

not Trip 3.

Recommended rule

Trip numbers are historical identifiers.

Never reuse a trip number.

So:

1
2
3 VOIDED
4
5

This prevents audit confusion.


---

9. Trip numbering after deleting a draft

A draft should not consume a trip number.

Only when the transaction successfully creates an ACTIVE trip should the number become official.

If save fails:

No trip number consumed.

This prevents artificial gaps caused by failed saves.


---

10. Date correction needs a rule

Suppose Trip 15 was accidentally entered for:

9 September

but should have been:

8 September.

Moving a trip between dates can create numbering problems.

Recommended:

Don't directly mutate the official trip number.

Instead:

1. Validate target date.


2. Reassign/recreate sequence safely.


3. Preserve original trip identity.


4. Record audit.


5. Recalculate both dates.



The UI should make this a controlled historical correction.


---

11. Add "Historical Correction Mode"

Normal editing should be easy.

Historical correction should be clearly marked:

> Historical correction



because it can change:

previous day totals

person earnings

leaderboard

attendance

remaining money


After correction:

> Recalculate affected dates.




---

12. Attendance needs one more rule

We established:

Present

Absent

Unmarked


But we should distinguish:

Working

Person participated in ≥1 trip.

Present, no loading

Person was present but participated in 0 trips.

Absent

Explicitly absent.

Unmarked

No attendance decision recorded.

This is excellent because:

No trip ≠ absent.


---

13. Working-day definition needs locking

For the labourer profile:

Working day

A date where the person participated in at least one valid trip.

This should be calculated automatically.

Present day

Explicit attendance = Present.

These are different statistics.

Example:

A:

Present = 25 days

Working = 20 days

Absent = 3 days

Unmarked = 2 days

Perfectly valid.


---

14. What happens if someone participates but attendance says "Absent"?

This should be a hard consistency conflict.

Don't automatically change attendance.

Show:

> Labour A is marked absent but participated in Trip #14.



Actions:

Review trip

Change attendance to Present

Remove person from trip

Cancel


No silent correction.


---

15. What happens if attendance says Present but no trips?

That's valid.

Show:

> Present — No loading trips



This should not generate money.


---

16. Leaderboard needs a precise half-share rule

I recommend:

Leaderboard participation

Any valid participation counts as 1 trip, regardless of Full/Half.

Why?

Because leaderboard represents:

> Number of trips the person participated in.



Money represents:

> Their calculated share.



These should not be mixed.

So:

A full share → +1 trip
A half share → +1 trip

This keeps the leaderboard easy to understand.


---

17. Leaderboard must exclude corrections/voids

Ranking should update automatically when:

trip created

trip edited

trip voided

trip restored/reopened

participant changed


No stale leaderboard cache.


---

18. Add "Leaderboard Period Details"

At the top:

Weekly

Mon 7 Sep – Sun 13 Sep

Monthly

1 Sep – 30 Sep

This removes ambiguity.


---

19. ⚠️ Weekly "reset" must not delete history

You said:

> Every week reset.



Correct implementation:

Leaderboard window changes.

Not:

> Delete previous week's data.



Previous week remains available in reports/history.


---

20. Monthly top 3

Lock:

If:

5 qualifying labourers:

show 3.

If:

2:

show 2.

If:

1:

show 1.

If:

0:

show empty state.

Never fabricate ranks.


---

21. Add "Period Comparison"

Analysis could include:

This week vs previous week

Trips

Money

Working days


This month vs previous month

Trips

Money

Tractor activity


This isn't essential to core accounting, but it is a useful premium analysis feature.


---

22. Add "Trip Distribution Summary"

For a date:

> 12 trips



Participant-count distribution:

1-person trips: 1

2-person trips: 0

3-person trips: 3

4-person trips: 6

5-person trips: 2


This helps identify unusual trips and makes auditing easier.


---

23. Add "Exception Center"

This would be extremely useful.

Data Issues

Show only records needing attention:

Attendance conflict

Uncalculated changes

Remaining money

Historical correction pending

Invalid/incomplete draft

Backup overdue

Database integrity issue

Duplicate-like trip detected


This gives the owner one place to resolve problems.


---

24. Remaining money should NOT automatically be treated as an error

Example:

3 participants:

₹66 × 3 = ₹198

₹2 remaining.

That is normal, not an error.

UI:

🟡 Remaining ₹2

not:

🔴 Error.

Only inconsistent/unexplained amounts should be errors.


---

25. Add "Reason for Remaining"

For normal rounding:

> Rounding remainder



For half-share:

> Half-share adjustment



For manual:

> Manual undistributed amount



This makes reports understandable.


---

26. Add "Calculation Explanation"

Every trip should have a human-readable explanation.

Example:

> Trip #27
Rate ₹200
3 full participants
₹200 ÷ 3 = ₹66 settled per person
₹198 distributed
₹2 remaining due to whole-rupee settlement.



This is excellent for trust and dispute resolution.


---

27. Add "Audit Before Share"

If someone shares a report, the report should be generated from the current calculated database state.

Never share an outdated cached summary.

Before sharing:

> Calculating latest data…



Then generate.


---

28. Add "Report Snapshot"

When exporting:

Store:

generated time

period

database calculation state


This helps explain what was shared if data changes later.


---

29. Backup needs encryption consideration

Because backups may contain:

names

work history

money

attendance


A production backup should ideally be protected.

Recommended:

Encrypted backup

Password/passphrase supplied by user.

Use modern Android cryptography primitives.

Do not invent your own encryption algorithm.


---

30. Backup password recovery

This needs an honest rule.

If the user forgets an encrypted backup password:

There should be no fake recovery mechanism.

The app should clearly state:

> "This password cannot be recovered by SAND WORKS."



Otherwise security becomes fake.


---

31. Add "Backup Verification"

Creating a backup isn't enough.

After creation:

1. Validate generated file.


2. Verify required records exist.


3. Confirm readable integrity.


4. Report success.



Example:

> Backup verified ✓




---

32. Add "Restore Dry Run"

Before restore:

Validate without changing the database.

Show:

> Backup valid ✓



Then preview:

Trips: 1,284
People: 8
Tractors: 3
Attendance: 421

Then user confirms.


---

33. Add "Pre-Restore Backup"

Before replacing current data:

Offer:

> Create safety backup



This is one of the best protections against accidental data loss.


---

34. Restore should not silently merge people

Example current:

Labour A

Backup:

Labour A

But different internal IDs.

Do not automatically assume they're the same person.

For v1:

Recommended

Full restore replaces local database after safety backup.

Don't implement complicated merge unless genuinely needed.


---

35. Add "Export Everything"

Separate from backup.

Export

Human-readable reports.

Backup

Machine-restorable complete application data.

These must not be treated as the same thing.


---

36. Add "Database Backup vs Report Export" explanation

Settings:

> Backup: restores SAND WORKS data.



> Export: creates reports for viewing/sharing.



Very important.


---

37. Add "Safe App Reset" architecture

If eventually required:

Clear drafts only

Safe.

Reset settings

Doesn't touch trips.

Restore backup

Controlled.

Delete all data

Dangerous and strongly protected.

No accidental one-tap reset.


---

38. App Lock needs emergency considerations

If app lock is enabled:

biometric

PIN


The app should not expose financial information in notifications.

Lock screen should not show:

> "₹4,850 earned today."



Instead:

> "SAND WORKS notification"



or generic notification content depending on settings.


---

39. Add privacy controls

Settings:

Notification privacy

Show details

Hide details


App preview privacy

If Android supports relevant controls, avoid exposing sensitive screens unnecessarily.


---

40. Add "Unsaved Form Recovery"

Important for a 33-trip day.

If the user spends time selecting 6 participants and accidentally leaves:

The app can preserve the draft.

On return:

> Resume Trip Entry?



But draft must remain:

NOT a real trip

until confirmed.


---

41. Add "Discard Drafts"

Settings / Add Trip:

> Drafts



User can inspect and discard incomplete trip drafts.

No automatic conversion.


---

42. Add "Trip Entry Shortcut"

For high-volume operation:

After saving Trip #12:

Show:

Next Trip

Tap:

+ Add Trip

The form opens immediately.

This is better than returning all the way to Home.


---

43. Add "Save & Next Trip"

This should be a major workflow action.

Buttons:

Save Trip

Save & Add Next Trip

The latter:

1. Saves current trip.


2. Calculates it.


3. Automatically increments trip number.


4. Opens new Add Trip.


5. Does NOT carry participants automatically.



This is perfect for continuous loading.


---

44. Add "Recently Used" suggestions

Safe:

> Recently used tractors



> Recently used participants



But:

Never automatically select participants based on history.


---

45. Add "Quick participant selection"

For 33 trips:

Use compact chips/avatars:

A B C D D1 D2 D3

Tap to select/deselect.

This reduces entry time dramatically.


---

46. Add participant count indicator

At all times:

> 4 participants



Then:

> ₹50 each



This should remain visible while editing.


---

47. Add trip rate visibility

Never hide the rate.

Trip screen:

> Rate used: ₹200



Even if current rate later becomes ₹250.


---

48. Add "Rate locked" indicator

Historical trip:

> 🔒 Rate ₹200 — locked to this trip



This communicates why changing Settings doesn't modify old trips.


---

49. Add "Historical record" indicator

Old trip:

> Historical



Voided:

> VOIDED



Edited:

> Edited



Adjusted:

> Adjusted



This makes audit status visible.


---

50. Add global "data freshness"

Dashboard:

> Calculated 2 minutes ago



or:

> Changes pending calculation



Very useful.


---

51. Add "No work today" UX

Home should distinguish:

No work recorded

from

₹0 earnings

Those are not necessarily the same.

No trip:

> No work recorded today.



Not:

> ₹0 earned



because that could imply work occurred but generated zero.


---

52. Add "Future date protection"

By default:

Do not allow future trips.

If you later need scheduling, that's a different feature.

Historical dates can be corrected through controlled workflows.


---

53. Add "Date lock"

Once a day is closed:

historical modification requires:

Reopen Day

This prevents accidental changes.


---

54. Add "Affected totals" confirmation

If changing Trip #4:

Show:

> This change will affect:

Today's total
Labour A
Labour B
Driver 2
Weekly leaderboard



Then:

Confirm change

This is excellent UX for financial records.


---

55. Add "Void impact preview"

Before voiding:

> Remove Trip #17 from active calculations?



Show:

Gross:

₹200 decrease

Labour A:

−₹50

Labour B:

−₹50

etc.

This is much safer than a generic:

> Are you sure?




---

56. Add "Edit impact preview"

Same concept.

If participant A is removed:

Show:

> Labour A: −₹50



> Labour B: +₹16



etc., according to the resulting calculation.

The user can see consequences before saving.


---

57. Add "Undo" for ordinary actions

After:

marking attendance

saving trip

editing


show a short:

Undo

where technically safe.

For financial changes, Undo should actually create/reverse a controlled transaction rather than destroying audit history.


---

58. Don't overuse Undo for destructive operations

For:

void

restore

delete/reset


use explicit confirmation instead.


---

59. Add "System clock warning"

If Android time/date appears wrong, show a non-blocking warning.

But don't automatically modify data.


---

60. Add "Locale-safe currency formatting"

Internally:

integer paise.

Display:

₹2,400

not:

2400.0

and not:

2,400.00 if whole-rupee settlement is the chosen UI convention.

For rates where paise are eventually needed, formatting can still support decimals.


---

61. Important architecture correction: don't add libraries unnecessarily

Your master list mentions:

Retrofit

Moshi

OkHttp

Coil


These aren't all required.

For this application:

Definitely justified

Kotlin

Compose

Material 3

Room

DataStore

Hilt

Coroutines

Navigation Compose

WorkManager

AndroidX Security / Keystore APIs where required

JUnit

Compose testing


Conditional

Coil — only if user/profile images are actually supported.

Retrofit/Moshi/OkHttp — not required for v1, because there is no API/backend.


An AI agent should not add unnecessary networking dependencies.


---

62. No API should mean no fake API layer

Do not create:

FakeApiService
MockServer
DummyRepository
FakeNetworkRepository

just to satisfy an architecture diagram.

The real source is:

Room + DataStore.


---

63. Add dependency/license audit

Before release:

dependency versions checked

known vulnerabilities checked

licenses reviewed

unused dependencies removed



---

64. Add Android compatibility testing

Minimum SDK 24 means test across representative versions.

At minimum:

Android 7/8-era compatibility where practical

Android 12+

Android 13+

Android 14+

Android 15+

Android 16 / API 36 target environment


Test especially:

notifications

storage

biometric

file picker

WorkManager

edge-to-edge

back navigation.



---

65. Add edge-to-edge UI audit

Modern Android versions require careful edge-to-edge handling.

Verify:

status bar

navigation bar

bottom navigation

FAB

dialogs

keyboard

safe insets


No content hidden behind system bars.


---

66. Add keyboard/input audit

For names/settings:

IME action

keyboard dismissal

numeric keypad for money

validation without keyboard obstruction



---

67. Add rotation/process-death tests

Especially:

Add Trip

because losing 20 participant selections would be frustrating.

State should survive appropriate lifecycle events.


---

68. Add database corruption strategy

If Room cannot open the database:

Do NOT automatically delete it.

Instead:

1. Preserve database.


2. Show recovery screen.


3. Recommend backup/recovery.


4. Attempt safe recovery only where justified.


5. Never silently destroy the user's history.




---

69. Add "Recovery Mode"

New screen:

Data Recovery

Options:

Retry

Restore backup

Export diagnostic information

Contact/help instructions


Do not offer:

> Reset database



as the first solution.


---

70. Add release database migration tests

Every future schema version must have automated:

old database → new database

tests.

No destructive migration in production.


---

71. Add screenshot/UI regression testing

Important screens:

Home

Add Trip

Calculation

Person Details

Reports

Leaderboard

Settings

Dark theme

Light theme


Check against accidental UI regressions.


---

72. Add accessibility automated tests

At least:

semantics

content descriptions

touch target checks

contrast where tooling supports it

TalkBack manual test



---

73. Add "real-data-only" release gate

Before release:

Search source and resources for:

dummy names

sample trips

fake money

mock values

placeholder images

TODO

FIXME where it represents incomplete implementation

fake API responses


No production fake data.

Tests may contain synthetic test data, obviously. That distinction should be explicitly allowed.


---

74. Add "test data isolation"

Automated tests may use:

> Labour A
Tractor 1
₹200



but those values must never appear in the user's production database after installation.


---

75. Add first-launch database verification

First launch:

schema valid

settings initialized

no sample records

no trips

no fake people

no fake tractors


The user starts with an empty real database.


---

76. Add first-trip tutorial

Optional lightweight explanation:

> Every trip is independent. Select only the people who actually loaded this trip.



This reinforces your most important rule.

It should be dismissible.


---

77. Add "Calculation Rules" accessible from Add Trip

A small:

ⓘ How calculation works

button.

User can quickly verify:

> ₹200 / actual participants.



This reduces disputes.


---

78. Add "Trip Notes"

Optional trip-level note:

unusual loading situation

correction explanation

other relevant operational note


Not required.

Do not force notes on every trip.


---

79. Add "Attendance Notes"

Optional:

> Reason / note



For absence or special attendance circumstances.


---

80. Add "Person Notes"

Optional profile notes.

Avoid unnecessary sensitive personal information.


---

81. Add "Archive" carefully

I would actually not include archive in v1 unless you genuinely need it.

You already have:

Active

Inactive

Voided


Adding Archive could create unnecessary complexity.


---

82. Add "Bulk operations" carefully

Useful for:

attendance marking

export

filtering


But avoid bulk financial editing in v1.

Bulk financial modification increases risk.


---

83. Add "Confirmation summary before daily close"

Before closing:

9 September 2026

Trips       33
Gross       ₹6,600
Distributed ₹6,578
Remaining   ₹22

People      7
Tractors    3

Calculation ✓
Reconciliation ✓

Then:

Close Day


---

84. Add closed-day visual distinction

Closed screen should feel visibly different:

🔒 Day Closed

No ambiguity.


---

85. Reopen should explain consequences

> Reopening this date allows historical records to change and may affect totals, leaderboards and reports.



Buttons:

Reopen

Cancel


---

86. Add "affected-date recalculation"

If a historical trip changes:

Only affected dates/periods need recalculation.

For example:

Trip moved:

9 Sep → 8 Sep

Recalculate:

8 Sep

9 Sep

affected week

affected month

affected person totals

affected leaderboard


Don't recalculate the entire lifetime database unnecessarily.


---

87. Add deterministic aggregation

Person totals should be generated from source trip records.

Never maintain dozens of independent manually updated counters without a reliable source.


---

88. Add consistency invariants to production debug/data-health

For every ACTIVE trip:

participants ≥ 1

rate > 0

distributed ≥ 0

remaining ≥ 0

distributed + remaining = rate

For every person:

total money = sum of trip-level final shares + adjustments

For every day:

gross = sum of active trip rates

These should be automated checks.


---

89. Add "database invariant failure = red alert"

If:

> Daily gross ≠ distributed + remaining



show:

🔴 Data integrity issue

Never display:

> ₹6,600



as if everything is fine.


---

90. Add no-network release test

Put phone into:

Airplane Mode

Then:

Add person

Add tractor

Add trip

Calculate

View reports

Attendance

Leaderboard

Backup

Export


All core operations must work.


---

91. One important business clarification still remains

There is one genuinely unresolved business rule I would not invent:

Half-share distribution

You said:

> "other half go it's decided others labours."



That means the people decide manually.

Good.

But the app needs a precise mechanism.

My recommended v1 behaviour:

Option A

Half-share person receives half of their normal calculated share.

The remainder is shown.

Then the user can:

Leave as Remaining

or

Explicitly distribute the remainder among selected participants.

This is safest.


---

92. Another business rule I'd lock

Rounding

You said:

> 66



Therefore:

Always floor to whole rupees.

No automatic rounding up.

Examples:

₹200 / 3 = ₹66
₹200 / 6 = ₹33
₹200 / 7 = ₹28

Remaining stays visible.


---

93. One thing I would REMOVE from the earlier PRD

The earlier specification suggested:

> "Roles: Owner/Manager, Operator, Viewer, Labourer"



For a private, no-backend, single-device application, this can become unnecessary complexity.

Better v1

App Owner / Authorized Device User

with optional:

App Lock

If you don't have multiple authenticated accounts on the same device, don't pretend you have enterprise RBAC.


---

94. One thing I would NOT add

Do not add:

cloud sync

login system

server

Firebase database

online payroll

UPI

payment gateway

GPS tracking

live tractor tracking

unnecessary camera/location permissions

social features


They don't solve your core problem.


---

95. FINAL SCREEN AUDIT

After this second audit, I recommend these core screens:

Startup

1. Splash


2. First-time Setup


3. App Lock



Operations

4. Home


5. Work Day Details


6. Add Trip


7. Edit Trip


8. Trip Details


9. Trip History


10. Trip Calculation


11. Daily Calculation


12. Daily Reconciliation


13. Day Closure


14. Reopen Day


15. Exception Center



People

16. People


17. Labourer Details


18. Labourer Earnings Ledger


19. Add/Edit Labourer


20. Driver Details


21. Driver Earnings Ledger


22. Add/Edit Driver



Attendance

23. Attendance


24. Attendance Date Details



Tractors

25. Tractor List


26. Tractor Details


27. Add/Edit Tractor



Analytics

28. Reports


29. Analysis


30. Weekly Leaderboard


31. Monthly Leaderboard


32. Ranking Details


33. Participation Matrix


34. Trip Distribution Analysis



Data

35. Export


36. Export Preview


37. Export History


38. Backup


39. Backup Verification


40. Restore Preview


41. Data Health


42. Recovery Mode


43. Audit History



Settings

44. Settings


45. Calculation Settings


46. Rate History


47. Notification Settings


48. Security


49. Data & Storage



Help

50. Calculation Rules


51. Help / FAQ


52. About



That's a complete v1 navigation model without stuffing every feature into the bottom bar.


---

96. FINAL BOTTOM NAVIGATION

I would lock this:

Position	Destination

1	Home
2	Trips
3	People
4	Reports
5	More


And:

☰ More

contains:

Attendance

Leaderboard

Tractors

Daily Calculation

Exception Center

Backup

Export

Audit

Settings

Help

About



---

97. FINAL CORE DATA FLOW

This is now the architecture I would hand to the coding agent:

REAL-WORLD EVENT
      ↓
TRIP
      ↓
TRACTOR
      ↓
ACTUAL PARTICIPANTS
      ↓
FULL / HALF
      ↓
CALCULATION ENGINE
      ↓
INDIVIDUAL SHARES
      ↓
EXPLICIT ADJUSTMENTS
      ↓
REMAINING MONEY
      ↓
TRIP LEDGER
      ↓
DAILY AGGREGATION
      ↓
PERSON LEDGER
      ↓
ATTENDANCE
      ↓
WEEKLY / MONTHLY ANALYTICS
      ↓
REPORTS / EXPORT / WHATSAPP


---

98. FINAL "NOTHING IS PERMANENT" RULE

This deserves to be a formal product principle:

> No operational relationship is assumed to be permanent except historical facts already recorded.



Therefore:

Labourer ↔ Tractor: not permanent
Driver ↔ Loading participation: not permanent
Tractor sequence: not permanent
Participant count: not permanent
Participant combination: not permanent
Morning/evening: not a separate workday
Rate: configurable for future work, historically locked per trip
Attendance: independent of trip participation
Leaderboard: dynamically calculated from valid records

This is the heart of the application.


---

99. FINAL FINANCIAL MODEL

For every trip:

Base

Trip Rate = ₹200

Actual participation

Determine the people who physically loaded.

Settlement

Calculate each person's applicable share.

Rounding

Whole rupee, floor.

Remaining

Anything not distributed remains explicitly recorded.

Adjustment

Only through an explicit user decision.

Final

Trip Rate
=
Final Distributed Money
+
Remaining Money

Then:

Daily Gross
=
Sum of ACTIVE Trip Rates

And:

Person Total
=
Sum of that person's Trip-Level Final Shares
+
Explicit Adjustments


---

100. FINAL ACCEPTANCE TEST — THE MOST IMPORTANT ONE

The coding agent must create a test scenario with at least 33 real-world-style trips where:

Tractor order is random.

Tractor 1, 2 and 3 all participate.

Labourers change every trip.

Labourers skip trips.

Drivers sometimes load their own tractor.

Drivers sometimes help another tractor.

Drivers sometimes don't load.

Participant count changes.

Some trips have 1 participant.

Some have 2.

Some have 3.

Some have 4.

Some have 5+.

No half-shares in the primary test.

Some trips create ₹2/₹4/etc. rounding remainder.

Morning and evening are on the same date.

Trip numbering continues.

One trip is voided.

One historical trip is edited.

Daily calculation is run repeatedly.

Day is closed.

Day is reopened.

Calculation is run again.

Final totals are compared.


The system must prove:

> Repeated calculation does not create extra money.



> Voiding does not delete history.



> Editing correctly changes affected totals.



> Reopening does not duplicate accrual.



> Trip numbers are never reused.



> Remaining money is never hidden.



> Person totals reconcile to trip-level records.



> Gross money reconciles with distributed + remaining.




---

FINAL VERDICT

After this second audit, I would freeze the business model rather than continuously adding features.

The remaining decisions that genuinely need a human business choice are only these:

A. Half-share remainder

Recommended:

half-share is calculated, remainder is explicitly shown, and the user chooses whether to leave it or redistribute it.

B. Automatic 7–8 PM processing

Recommended:

automatic calculation/checking, but NOT automatic irreversible day closure.

C. Weekly definition

Recommended:

Monday → Sunday.

D. Monthly definition

Recommended:

calendar month, while custom reports can provide rolling 30-day periods.

E. Half-share leaderboard

Recommended:

half-share participation still counts as 1 qualifying trip.

Everything else can now be deterministically specified without guessing.

And one important correction to the earlier approach: do not try to make the application "smart" by predicting who will participate based on previous trips. For your operation, unpredictability is a fundamental characteristic. The application should optimize fast explicit recording, not automatic assumptions.

That is what will make SAND WORKS reliable rather than merely attractive.
