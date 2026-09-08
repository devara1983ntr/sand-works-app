# OWNER Screens

The owner is the single operator. Only the owner sees organisation-wide data, configuration, approvals, reports and the audit trail.

## SC-OWN-DASH — Owner dashboard (operational overview)
- **Shows:** today's trips count; today's work; money accrual summary; active drivers & labourers; recent activity; pending approvals; recent alerts.
- **Actions:** quick links (add tractor, review pending approvals, view today's trips). Navigate to any section.
- **States:** loading / empty (no data yet — honest zero) / error / offline (network unavailable: retry) / forbidden (only if an account lost role mid-session).
- **Data security:** organisation-scoped reads only.

## SC-OWN-APPROVALS — Approve / reject pending registrations
- **Shows:** pending driver & labourer signups with the details they provided.
- **Actions:** Approve / Reject each. Optional note.
- **Why:** approval-before-access (SWF-02). Rejection shows the applicant an honest state.
- **Security:** owner-only; approval recorded to audit; approval is backend-authoritative and cannot be forged by the applicant.

## SC-OWN-USERS — Manage drivers & labourers
- **Shows:** list of driver and labourer accounts/records with status (active, pending, disabled, suspended) and approval state.
- **Actions:** view a person's record; disable/suspend; edit contact details; correct status with a reason.
- **Security:** owner-only; changes audited; a person cannot edit their own status/role.

## SC-OWN-TRACTORS — Tractor registry
- **Shows:** registered tractors.
- **Actions:** Add tractor (e.g. Sonalika, John Deere); edit; soft-delete (never hard-destroys history). A deactivated tractor is not offered on new trips but old trips keep their tractor reference.
- **Rule:** tractors are owner-managed records — **not** hardcoded logic. Initial seed records: Sonalika, John Deere.
- **Security:** owner writes; everyone can read active tractors they may use on a trip.

## SC-OWN-LABOUR — Labourer registry & attendance
- **Shows:** labourer records and their working/absent days per date.
- **Actions:** register/edit labourer; mark a day working or absent; **correct** an attendance record with a required reason.
- **Rule:** corrections are owner+reason+audit; never a silent overwrite.
- **States:** loading / empty / error / submitting (correction) / conflict (if the record changed concurrently — show the user, don't silently overwrite).

## SC-OWN-RATES — Rates & money-rule settings
- **Shows:** current per-trip rate (default ₹200) and the distribution rule.
- **Actions:** change the rate; choose the distribution rule (equal split default; driver+labour share; custom %; fixed allocation). Show a preview of how money would split for a sample trip.
- **Rule:** the rate is snapshotted per trip at record time and is immutable for that trip after record. Changing the rate now does **not** rewrite historical trips.
- **Security:** owner-only; audited.

## SC-OWN-SETTINGS — General settings
- **Shows/actions:** daily summary time (default 19:30, configurable within the allowed window); notification preferences; owner profile; organisation profile (name, brand).
- **Security:** owner write; audited.

## SC-OWN-REPORTS — Reports & export
- **Shows:** report builder over a date range.
- **Actions:** choose breakdown (overall and/or per tractor, per driver, per labourer, per date); choose format PDF or CSV; export.
- **Content:** money totals, trip/work counts, working & absent days. Owner-only.
- **States:** loading / empty / error / generating / success-with-download. Never shows fabricated totals.
- **Security:** owner-only export; backend/export path enforces owner scope.

## SC-OWN-AUDIT — Audit viewer (read-only)
- **Shows:** the server-authoritative audit log (who did what, when, before/after where applicable) with filters.
- **Actions:** filter, view. **Read-only.**
- **Security:** owner-only read; the client cannot write audit entries.

## SC-OWN-ALERT — Send operational alert
- **Shows:** an alert composer (optional message; recipients — drivers/labourers/approved users).
- **Actions:** send a high-priority operational warning; recipients receive a prominent alert with acknowledgement.
- **Security:** owner-only; acknowledgement recorded; alert clearly shows sender/time/recipients. Honest platform limits: never claims to override silent/DND; uses a prominent in-app alert rather than unsafe volume tricks.
