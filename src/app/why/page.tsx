export default function WhyPage() {
  return (
    <div className="page-shell pb-28">
      <section className="space-y-4">
        <div className="field-card rounded-[32px] p-6">
          <p className="text-kicker text-xs text-[var(--teal-400)]">Pitch</p>
          <h1 className="mt-3 text-3xl font-semibold">System of action beats system of record</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--sand-200)]">
            Procore and Buildertrend are strong systems of record, but their core pattern is still project → tool → entry → save → follow-up. FieldFirst flips the loop: capture once at the jobsite, then classify, route, notify, escalate, and audit with humans stepping in only where risk requires it.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
          <div className="field-card rounded-[28px] p-5">
            <h2 className="text-xl font-semibold">What incumbents do well</h2>
            <div className="mt-4 space-y-3 text-sm leading-6 text-[var(--sand-200)]">
              <p>Procore dominates enterprise and commercial GC workflows with deep multi-party financials.</p>
              <p>Buildertrend is tuned for residential builders and remodelers with CRM, selections, homeowner portal, warranty workflows, and unified cost-code flows into accounting.</p>
              <p>Both now ship AI. Procore Assist, Procore AI (Helix), Agent Builder, and Buildertrend AI Client Updates prove that “we have AI” is not a moat by itself.</p>
            </div>
          </div>

          <div className="field-card rounded-[28px] p-5">
            <h2 className="text-xl font-semibold">Why capture-first still wins</h2>
            <div className="mt-4 space-y-3 text-sm leading-6 text-[var(--sand-200)]">
              <p>The moat is recognizing the jobsite, understanding the documentation, and driving protocol-based action from field capture before context is lost.</p>
              <p>This prototype dramatizes known pain points: photo sync failures, weak offline behavior, mobile apps that feel secondary to desktop, hard-to-follow financial workflows, and notification overload.</p>
              <p>FieldFirst makes every automated move explicit with control levels, audit entries, and role-based communication policy instead of pretending automation should act invisibly.</p>
            </div>
          </div>
        </div>

        <div className="field-card rounded-[28px] p-5">
          <h2 className="text-xl font-semibold">Three-minute demo story</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-4">
            <div className="rounded-2xl border border-white/8 bg-white/3 p-4">
              <div className="font-semibold">1. Capture</div>
              <div className="mt-2 text-sm text-[var(--sand-200)]">Run the safety demo set and show GPS recognition plus deterministic classification.</div>
            </div>
            <div className="rounded-2xl border border-white/8 bg-white/3 p-4">
              <div className="font-semibold">2. Escalate</div>
              <div className="mt-2 text-sm text-[var(--sand-200)]">Confirm the action plan, leave the alert unacknowledged, and let the 30-second escalation fire.</div>
            </div>
            <div className="rounded-2xl border border-white/8 bg-white/3 p-4">
              <div className="font-semibold">3. Explain</div>
              <div className="mt-2 text-sm text-[var(--sand-200)]">Show voice-to-log, the decision trace, and the RFI suggestion in daily logs.</div>
            </div>
            <div className="rounded-2xl border border-white/8 bg-white/3 p-4">
              <div className="font-semibold">4. Build trust</div>
              <div className="mt-2 text-sm text-[var(--sand-200)]">Switch to the homeowner portal and the rule builder to show controlled transparency and human control.</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
