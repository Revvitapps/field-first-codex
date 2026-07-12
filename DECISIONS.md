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
