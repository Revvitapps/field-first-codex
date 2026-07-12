"use client";

import { ShieldCheck } from "lucide-react";
import { useDemoStore } from "@/store/demo-store";

const controlLevels = [
  "automatic",
  "automatic with undo",
  "recommendation requiring approval",
  "mandatory human approval",
  "prohibited from automation",
] as const;

export function RulesView() {
  const rules = useDemoStore((state) => state.rules);
  const updateRule = useDemoStore((state) => state.updateRule);

  return (
    <div className="page-shell pb-28">
      <section className="space-y-4">
        <div className="field-card rounded-[32px] p-6">
          <p className="text-kicker text-xs text-[var(--teal-400)]">Rule builder</p>
          <h1 className="mt-3 text-3xl font-semibold">Protocol-based automation controls</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--sand-200)]">
            Toggle rules and adjust control levels. The next capture run uses these settings immediately, including disabled routes that block automation altogether.
          </p>
        </div>

        <div className="space-y-4">
          {rules.map((rule) => (
            <div key={rule.id} className="field-card rounded-[28px] p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-kicker text-[11px] text-[var(--sand-200)]">{rule.trigger}</div>
                  <h2 className="mt-2 text-xl font-semibold">{rule.name}</h2>
                  <p className="mt-2 text-sm leading-6 text-[var(--sand-200)]">{rule.summary}</p>
                </div>
                <ShieldCheck className="h-6 w-6 text-[var(--teal-400)]" />
              </div>

              <div className="mt-5 grid gap-4 lg:grid-cols-[auto_1fr]">
                <label className="inline-flex items-center gap-3 text-sm">
                  <input
                    type="checkbox"
                    checked={rule.enabled}
                    onChange={(event) => updateRule(rule.id, { enabled: event.target.checked })}
                    className="h-4 w-4"
                  />
                  Enabled
                </label>
                <select
                  value={rule.controlLevel}
                  onChange={(event) => updateRule(rule.id, { controlLevel: event.target.value as (typeof controlLevels)[number] })}
                  className="rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-sm outline-none"
                >
                  {controlLevels.map((level) => (
                    <option key={level} value={level} className="bg-[var(--ink-900)]">
                      {level}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-5 rounded-2xl border border-white/8 bg-white/3 p-4">
                <div className="font-semibold">Plain-English rendering</div>
                <div className="mt-3 text-sm text-[var(--sand-200)]">
                  When <strong>{rule.trigger.replace("When ", "").toLowerCase()}</strong>, and{" "}
                  {rule.conditions.join(" + ").toLowerCase()}, then {rule.actions.map((action) => action.description).join(" • ")}.
                </div>
                <div className="mt-3 text-xs text-[var(--sand-200)]">
                  Full clause editing is visually stubbed for the demo. Toggle and control-level changes are live.
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
