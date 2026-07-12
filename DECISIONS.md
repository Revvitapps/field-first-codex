# Decisions

## Phase 0

- Chose a hand-rolled service worker and manifest instead of `next-pwa` to keep the installable shell zero-config and predictable on Next.js 16.
- Kept the root workspace folder name unchanged and scaffolded in a temporary lowercase folder because `create-next-app` rejects package names derived from mixed-case folders with spaces.
