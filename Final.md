SAND WORKS — FINAL MASTER PRD

Production-Ready Android Product & Engineering Specification

Trip Management • Labour/Driver Participation • Automatic Accrual Calculation • Attendance • Analytics • Reports • Backup • WhatsApp Sharing

Status: FINAL / IMPLEMENTATION-READY

This specification supersedes the previous drafts. The rules below are the authoritative product requirements for the SAND WORKS v1.0 implementation.


---

1. PRODUCT IDENTITY

Item	Final Specification

App name	SAND WORKS
Application ID	com.roshan.sandworks
Namespace	com.roshan.sandworks
Platform	Android
Application type	Private personal/family operational application
Owner	Ramesh Sahu
Version	1.0.0
Version code	1
Min SDK	24
Target SDK	36
Compile SDK	36
Language	Kotlin
UI	Jetpack Compose
Design	Material 3
Architecture	Clean Architecture + MVVM + UDF
Persistence	Room
Preferences	DataStore
DI	Hilt
Async	Kotlin Coroutines / Flow
Background	WorkManager where appropriate
Backend	None
Runtime API	None required
Default trip rate	₹200
Money storage	Long integer paise



---

2. BRAND

The supplied approved PNG logo/icon is the single source of truth.

Must

Use the supplied PNG directly.

Use the appropriate square/horizontal asset according to context.

Preserve the approved appearance.


Must not

Recreate the logo.

Trace it.

Convert it into a replacement SVG.

Generate an AI replacement.

Substitute another logo.

Modify it unnecessarily.



---

3. LOCKED COLOUR SYSTEM

Brand

Orange — #F97316

Deep Orange — #EA580C

Sand Gold — #F5B942

Deep Charcoal — #0B0D0F

Graphite — #15191D

Slate — #20262B

Steel — #66717A

Off White — #F5F7F8

Muted — #A7B0B7


Light theme

Background — #F6F7F8

Surface — #FFFFFF

Text — #111518

Secondary — #5F686E

Border — #DCE1E4


These are locked.

Do not introduce arbitrary substitute oranges/yellows or replacement brand colours.

Semantic success/warning/error/information colours may exist where required for usability.


---

4. TYPOGRAPHY

Roboto

Material 3 typography system.

Priorities:

1. Readability


2. Clear hierarchy


3. Large monetary figures


4. Strong trip numbers


5. Easy scanning during physical work



No decorative fonts.


---

5. THE FUNDAMENTAL BUSINESS PRINCIPLE

> Nothing is permanently assigned during loading operations.



The system must never assume:

Labourer → tractor

Driver → loading participation

Labourer → fixed team

Tractor → fixed sequence

Fixed number of workers

Fixed participant combination

Everyone present → working

Previous participants → current participants


Only actual recorded events are authoritative.


---

6. TRIP MONEY RULE

One loaded trip = ₹200

This is the total amount for the trip.

It is not ₹200 per person.

For every trip:

> ₹200 is divided according to the actual people who physically loaded that trip.




---

7. PARTICIPATION RULE

A person receives a share only when explicitly recorded as physically participating in that trip.

Participants can be:

Labourers

Drivers

Labourers + drivers


There is no permanent team.


---

8. TRACTOR RULE

There are currently 3 tractors.

Example:

Tractor 1

Tractor 2

Tractor 3


They may be:

Sonalika

John Deere

5045

5050

etc.


Brand/model/power does not affect labour calculation.

Additional tractors must be supported.


---

9. TRACTOR SEQUENCE

Tractors load one at a time.

The order is unpredictable.

Valid:

> T1 → T2 → T3 → T1 → T2 → T3



Also:

> T1 → T3 → T2 → T1 → T1 → T3



Also any other valid sequence.

The application must record the actual tractor for every trip.

Never automatically assume the next tractor.


---

10. DRIVER RULE

A driver has an assigned tractor.

But:

> A driver can physically help load another tractor.



Example:

T1 is loading.

Participants:

Labour A

Labour B

Driver 1

Driver 2


4 participants.

₹200 ÷ 4 = ₹50 each.

Driver 2 receives ₹50 despite being assigned to T2.

Therefore:

Assigned tractor

and

Actual loading participation

must be stored separately.


---

11. LABOURER MOVEMENT

Labourers can work with any tractor.

Example:

Trip 1 → T1 → A/B/C
Trip 2 → T3 → A/D
Trip 3 → T2 → B/C/D
Trip 4 → T1 → C

This is completely valid.


---

12. PARTICIPANT COUNT

Participant count can change every trip.

Examples:

1 person

₹200 ÷ 1 = ₹200

2 people

₹200 ÷ 2 = ₹100

3 people

₹200 ÷ 3 → ₹66 each

Remaining = ₹2

4 people

₹200 ÷ 4 = ₹50

5 people

₹200 ÷ 5 = ₹40

6 people

₹200 ÷ 6 → ₹33 each

Remaining = ₹2


---

13. ROUNDING RULE

The agreed settlement rule is:

> Whole rupee, round down/floor.



Therefore:

₹200 ÷ 3 = ₹66

not ₹66.67.

The difference becomes:

Remaining Money


---

14. REMAINING MONEY

Remaining money must always be visible.

For every trip:

> Trip Rate = Distributed Money + Remaining Money



Example:

₹200

3 participants

₹66 × 3 = ₹198

Remaining = ₹2

The ₹2 must not disappear.


---

15. REMAINING MONEY IS NOT AUTOMATICALLY DISTRIBUTED

The system must never automatically give remaining money to:

Driver

First labourer

Last labourer

Owner

Highest-ranked person


It remains:

Remaining Money

unless explicitly adjusted.


---

16. HALF-SHARE

Half-share is:

optional

rare

manually selected

decided by the participating labour group


It must never be inferred.

A person can be:

FULL

or

HALF

The system calculates the half-share and then explicitly handles the resulting remainder/adjustment.


---

17. HALF-SHARE ADJUSTMENT

Example:

Normal entitlement:

₹50

Half-share:

₹25

The remaining ₹25 must be explicitly handled.

Options:

Keep as Remaining Money

Give to one participant

Split among selected participants

Custom explicit distribution


The app must not decide automatically.


---

18. ADJUSTMENT VALIDATION

If the trip contains ₹200:

Final participant amounts + remaining must equal ₹200.

If the user tries to distribute ₹205:

BLOCK

> Adjustment exceeds available trip amount by ₹5.



If ₹190 is distributed:

> ₹10 remains undistributed.



The user may intentionally leave the ₹10 as Remaining Money.


---

19. FINANCIAL STORAGE

Never use:

Float

Double


for financial values.

Use:

> Long integer paise



₹200 = 20,000 paise.

All calculations must be deterministic.


---

20. ACCRUED MONEY, NOT PAYMENT

The application records:

Work amount

Accrued amount

Calculated amount


It does not represent:

Bank payment

UPI

Payroll payment

Payment gateway

Actual cash settlement


Do not use "Paid" unless a future payment feature is explicitly added.


---

21. TRIP NUMBERING

Trip numbers are:

> Sequential within a work date.



Example:

Morning:

1
2
3
4

Evening:

5
6
7

The evening does not restart at 1.


---

22. NO MORNING WORK

If there is no morning work:

Evening begins:

Trip 1

Then:

2, 3, 4...


---

23. VOIDED TRIPS

Trip numbers are never reused.

Example:

1
2
3 — VOIDED
4
5

Trip 3 remains historically visible as:

VOIDED

The next trip remains Trip 6.


---

24. DRAFT TRIPS

A draft does not consume an official trip number.

Only successful creation of an ACTIVE trip commits the official number.

Failed saves must not create financial records.


---

25. TRIP LIFECYCLE

DRAFT
  ↓
VALIDATING
  ↓
ACTIVE
  ↓
CALCULATED
  ↓
CLOSED DAY

Exception paths:

ACTIVE → EDITED
ACTIVE → VOIDED
CLOSED → REOPENED → ACTIVE

No unnecessary states should be invented.


---

26. DAILY WORK STATE

NO_WORK
   ↓
OPEN
   ↓
CALCULATED
   ↓
READY_TO_CLOSE
   ↓
CLOSED

Correction:

CLOSED
   ↓
REOPEN
   ↓
OPEN


---

27. CALCULATION ≠ CLOSURE

This is locked.

Automatic calculation

Allowed.

Automatic irreversible closure

Not allowed by default.

The user explicitly closes the day.


---

28. AUTOMATIC CALCULATION

Calculation can occur:

After trip save

Dashboard opening

App resume

Calculate button

Scheduled WorkManager execution

Date transition

After relevant edits

Before export/share


Calculation must be idempotent.

Running it 1 or 100 times produces the same result.


---

29. 7–8 PM REQUIREMENT

Default configured calculation time:

7–8 PM operational window

The user can customize it.

Android background execution is not guaranteed at an exact minute, therefore the app must not falsely claim exact execution.

WorkManager provides best-effort scheduled processing.

Also calculate on:

app open

resume

explicit Calculate

trip changes



---

30. CALCULATION STATUS

Every work date should expose:

Not calculated

Calculated

Changes pending

Ready to close

Closed

Reopened


Show:

Last calculated

and:

Last changed

If the data changed after calculation:

> Calculation needs refresh




---

31. DAILY CLOSURE

Before closing:

> 33 Trips
Gross ₹6,600
Distributed ₹6,578
Remaining ₹22



Then:

Close Day

Closed days become protected against accidental modification.


---

32. REOPEN

Reopening requires confirmation.

Show consequences:

> Reopening may change person totals, reports, leaderboards and historical calculations.



Record an audit event.


---

33. HISTORICAL CORRECTION

Changing an old trip must be treated as a historical correction.

If a trip moves from:

9 Sep → 8 Sep

recalculate:

8 Sep

9 Sep

affected week

affected month

affected people

affected leaderboard


Preserve audit history.


---

34. RATE HISTORY

Default:

₹200

If changed to:

₹250

new trips use ₹250.

Old trips remain ₹200.

Every trip stores its rate snapshot.

Settings changes never silently rewrite historical trips.


---

35. ATTENDANCE

Attendance is independent from trip participation.

States:

Unmarked

Present

Absent


Derived operational state:

Working

Present, no loading

Absent

Unrecorded



---

36. ATTENDANCE EXAMPLES

Present + 5 trips

Working.

Present + 0 trips

Present, no loading.

Absent + 0 trips

Absent.

Unmarked + 0 trips

Unrecorded.

Absent + 1 trip

Conflict.

The app must not silently fix it.


---

37. WORKING DAY

A person's working day means:

> They participated in at least one valid ACTIVE trip on that date.



It is not based solely on attendance.


---

38. ATTENDANCE CONFLICT

If Labour A is marked absent but appears on Trip 14:

Show:

> Labour A is marked absent but participated in Trip 14.



Actions:

Review trip

Change attendance

Remove person from trip

Cancel



---

39. LEADERBOARD

Weekly

Monday → Sunday.

Ranking metric:

> Number of valid ACTIVE trips participated in.



Half-share still counts as:

1 qualifying trip

Void/draft trips do not count.


---

40. MONTHLY LEADERBOARD

Calendar month.

Example:

September 1 → September 30.

Top:

3 only

If only two qualify:

show two.

If one qualifies:

show one.

Never fabricate third place.

Previous months remain historically available.


---

41. LEADERBOARD TIES

Use deterministic competition ranking.

Example:

A = 40
B = 40
C = 35

Display:

1st — A
1st — B
3rd — C

No arbitrary rank changes.


---

42. PERSON TOTALS

For every person:

Total trips

Count of valid trips participated in.

Total money

Sum of trip-level final shares + explicit adjustments.

Working days

Dates with ≥1 valid trip participation.

Present days

Attendance = Present.

Absent days

Attendance = Absent.

Unmarked days

Attendance = Unmarked.

These definitions must be identical everywhere.


---

43. PERSON EARNINGS LEDGER

Example:

Labour A — ₹4,620

Trip 1 → +₹40
Trip 2 → +₹50
Trip 3 → +₹66
Trip 4 → +₹40
...

Every amount must be traceable back to a trip.


---

44. "WHY THIS AMOUNT?" FEATURE

Tapping a person's total opens the detailed ledger.

This is a critical trust feature.


---

45. DAILY PARTICIPATION MATRIX

Example:

Person	T1	T2	T3	Total

A	3	4	2	9
B	2	3	3	8
C	4	2	1	7
D	1	4	2	7


Drivers also appear.

This shows cross-tractor activity without implying permanent assignment.


---

46. DRIVER ANALYTICS

Driver profile must distinguish:

Assigned tractor

Driver 1 → T1

Actual loading participation

Driver 1:

T1 → 20 trips
T2 → 4 trips
T3 → 7 trips

Total → 31 loading trips

This is essential.


---

47. TRACTOR ANALYTICS

For every tractor:

Today

Week

Month

Custom period

Total trips

Assigned driver

History


Do not assign labourers permanently to tractors.


---

48. TRIP DISTRIBUTION ANALYSIS

Example:

33 trips:

1-person trips: 2

2-person trips: 4

3-person trips: 8

4-person trips: 15

5-person trips: 4


This is useful for operational auditing.


---

49. EXCEPTION CENTER

Dedicated screen:

Exceptions

Calculation pending

Attendance conflict

Remaining money

Historical correction

Duplicate-like trip

Backup overdue

Database integrity issue

Incomplete draft


The user can resolve issues from one place.


---

50. COMPLETE SCREEN INVENTORY

Startup

1. Splash


2. First-Time Setup


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


16. Earnings Ledger



People

17. People


18. Labourer Details


19. Add/Edit Labourer


20. Driver Details


21. Add/Edit Driver


22. Driver Earnings Ledger



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




---

51. BOTTOM NAVIGATION

Exactly five primary destinations:

Home | Trips | People | Reports | More

Do not put every feature in bottom navigation.


---

52. HAMBURGER MENU

More:

Attendance

Leaderboard

Tractors

Daily Calculation

Exception Center

Backup

Export

Audit

Notifications

Settings

Help

About



---

53. HOME

The home screen is the operational command centre.

Header

Logo/branding

Current date

Current time

Morning/Evening indicator

Hamburger


Today's card

Trips

Gross

Distributed

Remaining

Calculation status


Quick actions

Add Trip

Attendance

Calculate

Today's Report

Share


Tractor summary

T1 trips

T2 trips

T3 trips


Recent trips

Latest records.


---

54. ADD TRIP — PRIMARY WORKFLOW

1. Automatically detect date/time.


2. Determine current trip number.


3. Select tractor.


4. Select actual participants.


5. Select Full/Half where necessary.


6. Display live calculation.


7. Validate.


8. Confirm.


9. Save atomically.


10. Update totals.


11. Offer Save & Add Next Trip.




---

55. NO AUTOMATIC PARTICIPANT CARRY-FORWARD

The previous trip's participants may appear as:

Recently used

but must not automatically become selected.

Suggested ≠ selected.

This prevents incorrect earnings.


---

56. SAVE & ADD NEXT TRIP

Ideal for continuous loading.

After saving Trip 12:

> Trip 12 saved ✓



Button:

Save & Add Next Trip

Next screen opens with:

Trip 13

Participants are not automatically carried forward.


---

57. TRIP CALCULATION PREVIEW

Before save:

> Trip #18
Tractor T2
Rate ₹200



Participants:

A
B
Driver 1
Driver 3

Count:

4

Share:

₹50/person

Distributed:

₹200

Remaining:

₹0


---

58. TRIP DETAILS

Show:

Trip number

Date

Time

Tractor

Assigned driver

Actual participants

Full/Half

Rate

Individual shares

Distributed

Remaining

Adjustments

Status

Audit


Actions:

Edit

Void

Share

Recalculate



---

59. VOID IMPACT PREVIEW

Before voiding:

Show affected amounts.

Example:

> Trip #17 will be removed from active calculations.



Show:

Daily gross impact

Person amount changes

Leaderboard impact


Then confirm.


---

60. EDIT IMPACT PREVIEW

Before changing participants:

Show:

> This change affects today's totals and the following people.



Then calculate the resulting values before saving.


---

61. SEARCH

Search:

Person

Driver

Labourer

Tractor

Trip number



---

62. FILTERS

Trips:

Date

Tractor

Person

Driver

Status


Reports:

Today

Yesterday

This week

Last week

This month

Last month

Custom



---

63. DATE NAVIGATION

Daily screens support:

previous day

next day

Today shortcut

Material 3 date picker



---

64. NO-WORK DAY

If there are no trips:

> No work recorded today



Do not fabricate:

Trip 0

₹0 trip

attendance

workers

leaderboard activity.


No work ≠ zero-value work.


---

65. ANALYSIS

Show only real data.

Metrics:

Trips/day

Trips/tractor

Person participation

Driver participation

Money/day

Remaining/day

Working days

Absence days

Top labourers

Tractor activity

Average participants/trip


No fake chart values.


---

66. REPORTS

Daily

Trips

Tractor totals

Person totals

Gross

Distributed

Remaining


Weekly

Trips

Labour totals

Driver totals

Attendance

Leaderboard


Monthly

All major statistics.


Custom

Any date range.


---

67. EXPORT

Support:

CSV

XLSX

PDF

Shareable text


Do not confuse:

Export = human-readable report

with:

Backup = restorable application data


---

68. WHATSAPP

Use Android's standard system share mechanism.

No WhatsApp API required.

Quick Share

Today's summary.

Detailed Share

Person totals.

Full Share

Trip-by-trip calculation.

All generated exclusively from real local records.


---

69. SHARE PRIVACY

Before sharing:

> This report contains work and money-related information.



Actions:

Share / Cancel


---

70. BACKUP

Because there is no backend, backup is a first-class feature.

Backup includes:

People

Tractors

Trips

Participants

Calculations

Adjustments

Attendance

Settings

Audit history



---

71. BACKUP VS EXPORT

Backup

Machine-restorable.

Export

Human-readable.

They must use separate workflows and file formats.


---

72. RESTORE

Workflow:

Select backup
↓
Validate
↓
Preview
↓
Create safety backup
↓
Confirm
↓
Transactional restore
↓
Verify

Never silently overwrite current data.


---

73. BACKUP ENCRYPTION

Recommended:

Encrypted backup

using established Android cryptography APIs.

Never invent cryptography.

If encrypted backup password is forgotten:

> It cannot be magically recovered.



No fake recovery mechanism.


---

74. DATABASE RECOVERY

If Room cannot open:

Never delete the database automatically.

Show:

Data Recovery

Retry

Restore backup

Export diagnostics

Help



---

75. DATABASE SCHEMA

Core entities:

Person

personId

name

type

active

createdAt

updatedAt


LabourerProfile

labourerId

personId

notes


DriverProfile

driverId

personId

assignedTractorId


Tractor

tractorId

name

brand

model

specification

registrationIdentifier

active


Trip

tripId

workDate

tripNumber

timestamp

tractorId

ratePaise

status

createdAt

updatedAt


TripParticipant

tripParticipantId

tripId

personId

participationType

calculatedSharePaise

adjustmentPaise

finalSharePaise


TripCalculation

calculationId

tripId

ratePaise

participantCount

distributedPaise

remainingPaise

calculationVersion

calculatedAt


TripAdjustment

adjustmentId

tripId

recipientId

amountPaise

reason

createdAt


Attendance

attendanceId

personId

workDate

status

reason

notes


DailyClosure

closureId

workDate

grossPaise

distributedPaise

remainingPaise

status

calculatedAt

closedAt

reopenedAt


AuditEvent

auditId

timestamp

eventType

entityType

entityId

description

old/new references



---

76. DATABASE CONSTRAINTS

Important unique constraints:

workDate + tripNumber

personId + workDate for attendance.

No duplicate participant within one trip.


---

77. DATABASE TRANSACTION

Creating a trip must atomically perform:

1. Validate


2. Generate number


3. Store trip


4. Store participants


5. Calculate


6. Store calculation


7. Store adjustments if any


8. Commit



Failure anywhere:

rollback everything.


---

78. IDEMPOTENCY

Repeated:

calculation

dashboard refresh

app restart

scheduled calculation


must never duplicate money.


---

79. SOURCE-OF-TRUTH PRINCIPLE

The source of truth is:

Trip

Participant

Rate snapshot

Attendance

Explicit adjustment


Person totals are derived.

Never store a person's total as the only source.


---

80. DATA INTEGRITY RULES

For every ACTIVE trip:

≥1 participant

valid tractor

valid rate

distributed ≥0

remaining ≥0

distributed + remaining = rate


For every day:

> Gross = Distributed + Remaining



For every person:

> Total = sum of trip-level final shares + adjustments




---

81. DATA HEALTH

Show:

Database health

Calculation health

Reconciliation

Last backup

Record counts

Pending exceptions


If everything is valid:

All local data checks passed ✓


---

82. NO SILENT CORRECTIONS

If a discrepancy appears:

Never silently modify money.

Instead:

preserve source data

show discrepancy

offer controlled recalculation

record audit



---

83. AUDIT TRAIL

Record:

Trip creation

Trip edit

Trip void

Day close

Day reopen

Rate changes

Attendance changes

Person changes

Tractor changes

Adjustments

Backup

Restore


Audit records are read-only.


---

84. DATA RETENTION

Absolutely no automatic deletion of:

trips

attendance

people

tractors

calculations

audit history


People/tractors become:

Inactive

Trips become:

VOIDED

rather than physically deleted.


---

85. LOCAL-ONLY

Core app must function with:

Airplane Mode ON

No network is required for:

trips

calculation

attendance

reports

leaderboard

analytics

backup

local export



---

86. NO UNNECESSARY NETWORK STACK

Do not add:

Retrofit

Moshi

OkHttp


unless a future feature actually requires networking.

Do not create fake APIs.


---

87. SECURITY

Use:

Android Keystore where appropriate

optional biometric/PIN app lock

secure preferences where needed

no secrets in source

no API keys

no signing credentials

no service-account files



---

88. APP LOCK

Optional:

PIN

Biometric

Device authentication


Notification privacy should prevent financial details from appearing on the lock screen unless explicitly enabled.


---

89. PERMISSIONS

Request only when genuinely required.

Possible:

POST_NOTIFICATIONS on Android 13+

biometric APIs

Storage Access Framework for files


Do not request:

location

contacts

microphone

camera

broad storage


without an actual feature requiring them.


---

90. NOTIFICATIONS

Optional:

Daily calculation

Unclosed day

Attendance reminder

Backup reminder


Each configurable.

Notification deep links should open the relevant screen.


---

91. TIME

Use java.time.

Device timezone determines operational date/time.

Morning/evening is a UI classification, not a separate workday.


---

92. DATE BOUNDARY

Calendar date is authoritative.

Example:

11:50 PM → Trip 20 on Sep 9.

12:10 AM → Trip 1 on Sep 10.


---

93. GESTURES

Supported where useful:

Swipe trip card

Long press trip

Pull-to-refresh

Swipe daily dates

Quick participant chips


Every gesture must have a visible/button alternative.

Minimum touch target:

48dp


---

94. UI STATES

Every major screen must support:

Loading

Skeleton/progress.

Success

Real data.

Empty

Meaningful empty state.

Error

Explanation + retry/recovery.

Closed

Read-only/protected.

Conflict

Explicit resolution.

No blank screens.


---

95. ADD TRIP EMPTY/ERROR STATES

No tractor:

> Add a tractor before recording a trip.



No participants:

> Select at least one person who physically loaded this trip.



Save failure:

> Trip was not saved. No amount was added.




---

96. ACCESSIBILITY

Required:

TalkBack

semantics

content descriptions

48dp targets

dynamic font scaling

keyboard support

accessible gesture alternatives

adequate contrast

no colour-only meaning



---

97. RESPONSIVE UI

Support:

different phone sizes

portrait

landscape where appropriate

edge-to-edge

system bars

keyboard

large text



---

98. PROCESS DEATH

Trip-entry state should survive appropriate lifecycle recreation.

A draft may be preserved.

But:

> Draft ≠ saved trip.




---

99. DUPLICATE DETECTION

Warn about suspicious duplicate entries:

Same:

date

tractor

approximate time

participants


Do not automatically reject legitimate operations.


---

100. OVERLAPPING TRIP WARNING

Because only one tractor loads at a time, if actual start/end timestamps overlap:

Show:

> Potential overlapping loading sessions detected.



But do not blindly reject approximate timestamps.


---

101. GLOBAL "EXCEPTION CENTER"

The owner can immediately see:

> 2 items need attention



Examples:

₹2 remaining on Trip #17

Attendance conflict for Labour A

Calculation pending for today's changes


This is preferable to hiding problems.


---

102. FINAL NAVIGATION

SAND WORKS
                         │
       ┌─────────────────┼─────────────────┐
       │                 │                 │
      Home              Trips             People
       │                 │                 │
       └─────────────────┼─────────────────┘
                         │
                      Reports
                         │
                        More
       ┌─────────────────┼──────────────────┐
       │                 │                  │
 Attendance         Leaderboard          Tractors
       │                 │                  │
 Calculation          Reports             Data
       │                 │                  │
 Backup               Audit             Settings


---

103. ENGINEERING STACK

Presentation

Jetpack Compose

Material 3

Navigation Compose

ViewModel

StateFlow


Domain

Use cases

Calculation engine

domain models

validation


Data

Room

DAOs

repositories

DataStore


Infrastructure

WorkManager

Android Keystore

Storage Access Framework


Testing

JUnit

Robolectric where useful

Compose UI testing

Android instrumentation

migration tests

integration tests



---

104. CLEAN ARCHITECTURE

Presentation
     ↓
Domain
     ↓
Data
     ↓
Room / DataStore

Composables must not directly access DAOs.


---

105. CALCULATION ENGINE

A dedicated deterministic domain component must calculate:

Input:

trip rate

participants

full/half status

explicit adjustments


Output:

individual shares

distributed

remaining

calculation metadata


It must be independently unit tested.


---

106. TESTING — NORMAL CASES

Test:

1 participant

2

3

4

5

6

7

8+


Test:

labour only

driver only

labour + driver

multiple drivers

cross-tractor drivers

skipped labourers



---

107. TESTING — 33 TRIPS

Mandatory scenario:

33 trips

with:

random tractor sequence

changing labourers

changing drivers

skipped participants

cross-tractor drivers

1–6 participants

morning/evening continuation

rounding remainder

one voided trip

one edited trip

repeated recalculation

close

reopen

recalculate


Expected gross:

33 × ₹200 = ₹6,600

Then:

> Distributed + Remaining = ₹6,600




---

108. RANDOMIZED TESTING

Generate thousands of valid random trip combinations.

Verify:

no duplicate participant

≥1 participant

valid tractor

valid rate

exact reconciliation

no duplicate accrual

voided trips excluded

recalculation idempotent

person totals correct


This is especially important because your real-world workflow is unpredictable.


---

109. LARGE DATA TEST

Test:

100 trips

1,000 trips

10,000 trips


The UI must remain responsive.

Use efficient:

Room queries

indexes

lazy lists

aggregate queries



---

110. CRASH TESTING

Simulate crashes during:

trip save

calculation

edit

void

backup

restore


No partial financial record may remain.


---

111. RESTORE TEST

Corrupt/incompatible backup:

> Existing database remains untouched.



Valid backup:

> Preview → confirm → restore → verify.




---

112. MIGRATION TESTING

Every schema version must migrate without loss.

Never use destructive migration in production.


---

113. SECURITY RELEASE AUDIT

Check:

no secrets

no private keys

no passwords

no API credentials

no signing files

no fake security

no sensitive logging

minimal permissions

backup security



---

114. RELEASE SIGNING

Production:

com.roshan.sandworks

Dedicated production keystore.

Never commit:

.jks

keystore password

signing secrets

keystore.properties


Use secure environment/CI secrets.

Do not reuse unrelated Flutter signing credentials.


---

115. FINAL "NO FAKE DATA" POLICY

Absolutely no:

fake labourers

fake drivers

fake tractors

fake trips

fake earnings

fake attendance

fake leaderboard

fake analytics

fake API

dummy production repository

placeholder production screen

fake calculation

TODO production implementation

// TODO for unfinished required functionality

"coming soon" for required features

lorem ipsum


Tests may contain synthetic data only inside test code.


---

116. NO HARD-CODED PRODUCTION RECORDS

The app must start with:

No fake trips.

No fake people.

No fake tractors.

The owner enters the actual data.

₹200 is a default configuration, not scattered hardcoded business logic.


---

117. FINAL UX PRINCIPLE

The user should record:

> What actually happened.



The app should do:

> All mathematics, aggregation, reconciliation and reporting.



Example:

User:

> T2
A ✓
C ✓
Driver 1 ✓



Application:

> 3 participants
₹66/person
₹198 distributed
₹2 remaining



No manual calculation required.


---

118. FINAL DAILY WORKFLOW

OPEN APP
   ↓
TODAY
   ↓
+ ADD TRIP
   ↓
SELECT ACTUAL TRACTOR
   ↓
SELECT ACTUAL PARTICIPANTS
   ↓
AUTOMATIC CALCULATION
   ↓
VALIDATION
   ↓
SAVE
   ↓
TRIP NUMBER INCREMENTS
   ↓
NEXT TRIP
   ↓
...
   ↓
EVENING CONTINUES SAME NUMBER
   ↓
CALCULATE
   ↓
RECONCILE
   ↓
CLOSE DAY
   ↓
REPORT / EXPORT / WHATSAPP


---

119. FINAL FINANCIAL MODEL

For every trip:

Rate = ₹200

Then:

Actual participants

↓

Individual shares

↓

Distributed

↓

Remaining

↓

Optional explicit adjustment

↓

Final trip ledger

Then:

Daily totals

↓

Person totals

↓

Weekly/monthly leaderboard

↓

Reports


---

120. FINAL ACCOUNTING INVARIANTS

The implementation must continuously protect these:

Trip

Trip Rate = Distributed + Remaining

Day

Daily Gross = Distributed + Remaining

Person

Person Total = Sum of Trip-Level Final Shares + Explicit Adjustments

Historical

Changing current rate must not change old trips.

Void

Voided trip contributes ₹0 to active totals but remains in history.

Recalculation

Recalculation never creates additional money.

Numbering

Trip numbers are never reused.


---

121. FINAL ACCEPTANCE GATE

SAND WORKS is not production-ready until:

[ ] Every required screen exists.

[ ] Navigation is complete.

[ ] Back navigation works.

[ ] Bottom navigation works.

[ ] Hamburger navigation works.

[ ] Trip calculation is deterministic.

[ ] ₹200 rule works.

[ ] Rounding works.

[ ] Remaining money works.

[ ] Half-share works.

[ ] Explicit adjustments reconcile.

[ ] Random tractor order works.

[ ] Cross-tractor drivers work.

[ ] Labourers can change tractor every trip.

[ ] Skipped workers work.

[ ] Attendance is independent.

[ ] Attendance conflicts are detected.

[ ] Morning/evening numbering continues.

[ ] No-work days work.

[ ] Closed dates are protected.

[ ] Reopening works.

[ ] Historical correction works.

[ ] Rate snapshots work.

[ ] Void works.

[ ] Audit works.

[ ] Person ledger works.

[ ] Weekly leaderboard works.

[ ] Monthly top 3 works.

[ ] Tie handling works.

[ ] Analytics work from real data.

[ ] Reports work.

[ ] PDF works.

[ ] XLSX works.

[ ] CSV works.

[ ] WhatsApp/system share works.

[ ] Backup works.

[ ] Backup verification works.

[ ] Restore preview works.

[ ] Restore is transactional.

[ ] Data health works.

[ ] Recovery mode works.

[ ] No automatic deletion.

[ ] No fake data.

[ ] No placeholder logic.

[ ] No unfinished required functionality.

[ ] No production TODOs.

[ ] No unnecessary API/network layer.

[ ] No secrets.

[ ] Release signing is secure.

[ ] Unit tests pass.

[ ] Integration tests pass.

[ ] Compose UI tests pass.

[ ] Migration tests pass.

[ ] Randomized calculation tests pass.

[ ] 33-trip test passes.

[ ] Large-data tests pass.

[ ] Offline tests pass.

[ ] Crash/recovery tests pass.

[ ] Accessibility audit passes.

[ ] Android compatibility audit passes.

[ ] Release build passes.

[ ] Final APK/AAB installation test passes.



---

122. FINAL NON-NEGOTIABLE AI CODING AGENT DIRECTIVE

> Implement SAND WORKS as a real production application, not a prototype or visual mockup.

Do not invent business rules.

Do not assume permanent tractor/labour/driver relationships.

Every trip is an independent operational event.

Only explicitly recorded participants receive a share.

Drivers may participate in loading any tractor.

Labourers may participate in any tractor.

The tractor sequence is unpredictable.

Trip numbering is sequential per calendar work date and continues across morning and evening.

₹200 is the total trip rate, never the individual rate.

Financial values must use integer paise.

Whole-rupee settlement uses floor/round-down.

Remaining money must always be explicitly recorded.

Half-share is exceptional and requires explicit handling.

No automatic redistribution of remaining money is permitted.

Historical rates are immutable snapshots for their trips.

Attendance and trip participation are separate concepts.

No-work must never be interpreted as absence.

Voided trips remain auditable and are excluded from active calculations.

Recalculation must be idempotent.

No automatic deletion of operational data is permitted.

All financial totals must be traceable back to individual trip records.

No fake, dummy, placeholder, mock production data, fake calculations, fake rankings, fake APIs, unfinished screens, or TODO production logic is permitted.

If a requirement is genuinely ambiguous, do not silently guess. Surface the ambiguity before implementing the affected business behaviour.

The application must be publishable only after the complete testing, security, data-integrity, migration, accessibility, performance and release gates pass.




---

FINAL STATUS

SAND WORKS v1.0 PRD: FROZEN

The core model is now sufficiently explicit for implementation:

Real trip → actual tractor → actual participants → automatic calculation → explicit remainder/adjustment → trip ledger → daily reconciliation → person ledger → attendance → leaderboard/analysis → reports/export/share.

The design deliberately avoids trying to predict your unpredictable real-world loading operation. The app records reality; the calculation engine handles everything else.
