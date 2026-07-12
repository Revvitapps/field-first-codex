"use client";

import { useDemoStore } from "@/store/demo-store";

const personas = ["Foreman", "Superintendent", "Homeowner", "Office / PM"] as const;

export function PersonaSwitch() {
  const currentPersona = useDemoStore((state) => state.currentPersona);
  const setPersona = useDemoStore((state) => state.setPersona);

  return (
    <label className="field-card flex items-center gap-3 rounded-full px-3 py-2 text-sm text-[var(--sand-100)]">
      <span className="text-kicker text-[10px] text-[var(--sand-200)]">Persona</span>
      <select
        className="bg-transparent pr-2 text-sm text-[var(--sand-50)] outline-none"
        value={currentPersona}
        onChange={(event) => setPersona(event.target.value as (typeof personas)[number])}
      >
        {personas.map((persona) => (
          <option key={persona} value={persona} className="bg-[var(--ink-900)]">
            {persona}
          </option>
        ))}
      </select>
    </label>
  );
}
