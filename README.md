# FieldFirst

FieldFirst is a clickable, demo-ready prototype of a field-first construction operating system built as a Next.js PWA. It is intentionally local-first and fully mocked: no API keys, no paid services, and no backend dependency beyond `npm install && npm run dev`.

## What this demonstrates

- A system of action instead of a system of record.
- Five-photo capture with mock GPS recognition, deterministic classification, context questions, and action-plan preview.
- Rule-based routing with explicit control levels, inbox delivery, escalation timers, and audit trail.
- Voice-to-daily-log parsing with labor extraction, design-conflict trace, and RFI suggestion.
- Evidence-gated tasks, constraint-aware schedule risk, curated homeowner portal, offline queue simulation, and dashboard visibility.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Three-minute demo script

1. Open `/capture`.
2. Choose `Birch Lane safety issue`.
3. Confirm GPS, wait for classification, accept the context defaults, and confirm execution.
4. Open `/inbox` as `Superintendent` and show the live safety alert. Leave it untouched for 30 seconds, then switch to `Office / PM` and show the escalation.
5. Open `/daily-logs` and click `Run voice demo`. Show the transcript, labor extraction, decision trace, and RFI recommendation.
6. Open `/portal`, click the magic link, show the homeowner-safe plumbing reschedule note, then approve the change-order card.
7. Open `/rules`, disable `Safety escalation`, return to `/capture`, rerun the same safety set, and show that the action preview and resulting automation behavior change.
8. Open `/dashboard` and toggle offline mode. Run another capture while offline, then go back online and watch the sync state recover.

## What is mocked

- GPS recognition → production counterpart: geofencing / device-location service.
- Classification and decision trace → production counterpart: vision model plus orchestration layer.
- Voice transcript → production counterpart: speech-to-text API.
- Notifications and escalation delivery → production counterpart: email, SMS, push, and workflow queue.
- Persistence → production counterpart: Postgres or similar system of record.
- Offline sync → production counterpart: upload queue with conflict handling and server verification.

## Core routes

- `/feed`: persona-aware field activity stream and audit summary.
- `/capture`: five-photo hero workflow.
- `/projects`: seeded project model, contacts, and milestones.
- `/inbox`: recipient-matrix routing and acknowledgements.
- `/daily-logs`: daily logs plus voice-to-log.
- `/tasks`: punch lists and schedule-risk demo.
- `/portal`: homeowner experience with controlled transparency.
- `/rules`: rule builder and control-level toggles.
- `/dashboard`: office health, compliance, offline toggle, and audit activity.
- `/why`: pitch story and market framing.

## Verification standard

- `npm run lint` passes.
- `npm run build` succeeds.
- All AI, GPS, OCR, weather, and notifications are mocked locally.
