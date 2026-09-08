# ACCESSIBILITY — SAND WORKS

Status: **SPECIFIED.**

## Requirements
- **Screen reader labels:** all screens, controls, list items, icons have contentDescriptions/semantics.
- **Semantic hierarchy:** headings/roles announced in order.
- **Touch targets:** ≥48dp (with 8dp spacing).
- **Contrast:** AA minimum text; non-text contrast; both themes.
- **Text scaling:** layouts support large font scale without truncation/overlap.
- **Keyboard navigation:** logical tab/focus order where applicable; IME actions.
- **Content descriptions / focus order:** correct; focus visible.
- **Error announcements:** errors announced to screen readers (live region).
- **Dynamic font sizes:** supported.
- **Reduced motion:** honour system reduce-motion (limit animation).
- **Haptics alternatives:** not the only feedback; visual/verbal alternatives.
- **Colour-independent status:** working/absent, success/error, leaderboard ranks also conveyed by icon/text, not colour only.

## Acceptance
Automated (Compose semantics/contrast) + manual TalkBack pass across all screens; empty/error/offline states readable. Screen reader can complete core flows (sign-in, view accrual, add trip for driver/owner).
