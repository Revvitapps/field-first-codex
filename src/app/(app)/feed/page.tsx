export default function FeedPage() {
  return (
    <section className="space-y-4">
      <div className="field-card rounded-[28px] p-5">
        <p className="text-kicker text-xs text-[var(--teal-400)]">Live feed</p>
        <h2 className="mt-3 text-2xl font-semibold">Field activity stream</h2>
        <p className="mt-2 text-sm leading-6 text-[var(--sand-200)]">
          This route becomes the triage surface for captures, escalations, daily logs, and project health.
        </p>
      </div>
    </section>
  );
}
