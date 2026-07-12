"use client";

import { BellRing } from "lucide-react";
import { filterNotificationsForPersona, formatDate } from "@/lib/selectors";
import { useDemoStore } from "@/store/demo-store";

export function InboxView() {
  const persona = useDemoStore((state) => state.currentPersona);
  const notifications = useDemoStore((state) => state.notifications);
  const items = filterNotificationsForPersona(notifications, persona);

  return (
    <section className="space-y-4">
      <div className="field-card rounded-[28px] p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-kicker text-xs text-[var(--red-500)]">Inbox</p>
            <h2 className="mt-3 text-2xl font-semibold">Persona-aware routing</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--sand-200)]">
              Recipient policies, severity, and visibility levels determine what lands here.
            </p>
          </div>
          <BellRing className="h-6 w-6 text-[var(--red-500)]" />
        </div>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <article key={item.id} className="field-card rounded-[24px] p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="text-lg font-semibold">{item.title}</div>
              <span className="rounded-full bg-white/6 px-2 py-1 text-xs">{item.status}</span>
            </div>
            <p className="mt-2 text-sm leading-6 text-[var(--sand-200)]">{item.body}</p>
            <div className="mt-3 text-xs text-[var(--sand-200)]">
              {formatDate(item.createdAt)} • {item.routeReason}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
