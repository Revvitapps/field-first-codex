# Decisions

## Phase 0

- Chose a hand-rolled service worker and manifest instead of `next-pwa` to keep the installable shell zero-config and predictable on Next.js 16.
- Kept the root workspace folder name unchanged and scaffolded in a temporary lowercase folder because `create-next-app` rejects package names derived from mixed-case folders with spaces.

## Phase 1

- Added `personaAccess` on projects and visibility-level filtering helpers so the persona switch has deterministic, demo-friendly behavior without inventing a backend permissions model.
- Seeded the full domain objects early, including future-phase entities like RFIs, rules, audit entries, and message threads, to avoid schema churn across later phases.

## Phase 2

- Represented the hero capture flow as a local client-side state machine so the full interaction works offline and remains easy to extend in later phases.
- Used bundled SVG demo sets for deterministic repeatability and allowed generic file uploads as a looser fallback for ad hoc clicking.

## Phase 3

- Implemented escalation with a client-side watcher over live notifications instead of embedding timers in store state, which keeps persistence simple while still demonstrating the full 30-second chain.
- Scoped auto-escalation to newly generated `live-note-*` safety notifications so the seeded historical data remains illustrative rather than firing immediately on page load.

## Phase 4

- Added the voice-to-log demo as a deterministic store mutation rather than freeform speech parsing so the labor extraction, RFI suggestion, and notification outcomes stay consistent during every walkthrough.

## Phase 5

- Kept the schedule-risk demo scoped to Birch Lane’s known drywall chain so the “Report 80% complete” action can reliably demonstrate dependency-aware replanning without building a full scheduling engine.

## Phase 6

- Used the Harbor View homeowner as the fixed portal persona so the magic-link simulation, curated feed, and approval card all stay consistent regardless of the internal persona currently selected elsewhere in the app.

## Phase 7

- Made offline sync a lightweight queue simulation over capture `syncState` values instead of building a separate job model, which is enough to demonstrate honest state labels and re-sync behavior after reconnect.
