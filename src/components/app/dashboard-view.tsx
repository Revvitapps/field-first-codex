"use client";

import { Activity, CloudOff, History, ShieldAlert } from "lucide-react";
import { useDemoStore } from "@/store/demo-store";
import { filterNotificationsForPersona } from "@/lib/selectors";

export function DashboardView() {
  const projects = useDemoStore((state) => state.projects);
  const dailyLogs = useDemoStore((state) => state.dailyLogs);
  const notifications = useDemoStore((state) => state.notifications);
  const auditTrail = useDemoStore((state) => state.auditTrail);
  const offlineMode = useDemoStore((state) => state.offlineMode);
  const toggleOfflineMode = useDemoStore((state) => state.toggleOfflineMode);

  const unacknowledged = notifications.filter((note) => note.ackRequired && note.status === "pending").length;
  const overdueEscalations = notifications.filter((note) => note.status === "escalated").length;
  const superintendentItems = filterNotificationsForPersona(notifications, "Superintendent").length;
  const compliancePercent = Math.round((dailyLogs.filter((log) => log.workPerformed.length > 0).length / dailyLogs.length) * 100);

  return (
    <div className="page-shell pb-28">
      <section className="space-y-4">
        <div className="field-card rounded-[32px] p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-kicker text-xs text-[var(--teal-400)]">Office dashboard</p>
              <h1 className="mt-3 text-3xl font-semibold">Health, compliance, and recent action</h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--sand-200)]">
                Project health rolls up schedule risk, unacknowledged safety items, daily-log compliance, and audit activity. Offline mode is also simulated here.
              </p>
            </div>
            <button
              type="button"
              onClick={toggleOfflineMode}
              className={`rounded-2xl px-4 py-3 text-sm font-semibold ${offlineMode ? "bg-[var(--red-500)] text-white" : "bg-[var(--teal-500)] text-[var(--ink-950)]"}`}
            >
              <span className="inline-flex items-center gap-2">
                <CloudOff className="h-4 w-4" />
                {offlineMode ? "Go online" : "Go offline"}
              </span>
            </button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <div className="field-card rounded-[24px] p-4">
            <div className="text-kicker text-[11px] text-[var(--sand-200)]">Project health</div>
            <div className="mt-2 text-3xl font-semibold">{projects.length}</div>
            <div className="mt-2 text-sm text-[var(--sand-200)]">Active demo projects</div>
          </div>
          <div className="field-card rounded-[24px] p-4">
            <div className="text-kicker text-[11px] text-[var(--sand-200)]">Unacknowledged</div>
            <div className="mt-2 text-3xl font-semibold">{unacknowledged}</div>
            <div className="mt-2 text-sm text-[var(--sand-200)]">Safety items awaiting action</div>
          </div>
          <div className="field-card rounded-[24px] p-4">
            <div className="text-kicker text-[11px] text-[var(--sand-200)]">Escalations</div>
            <div className="mt-2 text-3xl font-semibold">{overdueEscalations}</div>
            <div className="mt-2 text-sm text-[var(--sand-200)]">Visible overdue chains</div>
          </div>
          <div className="field-card rounded-[24px] p-4">
            <div className="text-kicker text-[11px] text-[var(--sand-200)]">Log compliance</div>
            <div className="mt-2 text-3xl font-semibold">{compliancePercent}%</div>
            <div className="mt-2 text-sm text-[var(--sand-200)]">Logs with work performed entered</div>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
          <div className="field-card rounded-[28px] p-5">
            <div className="mb-4 flex items-center gap-2">
              <Activity className="h-5 w-5 text-[var(--teal-400)]" />
              <h2 className="text-lg font-semibold">Project health cards</h2>
            </div>
            <div className="space-y-3">
              {projects.map((project) => (
                <div key={project.id} className="rounded-2xl border border-white/8 bg-white/3 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-semibold">{project.name}</div>
                    <span className="rounded-full bg-white/6 px-2 py-1 text-xs">{project.percentComplete}%</span>
                  </div>
                  <div className="mt-2 text-sm text-[var(--sand-200)]">{project.phase}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="field-card rounded-[28px] p-5">
              <div className="mb-4 flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-[var(--amber-400)]" />
                <h2 className="text-lg font-semibold">Superintendent load</h2>
              </div>
              <div className="text-3xl font-semibold">{superintendentItems}</div>
              <p className="mt-2 text-sm text-[var(--sand-200)]">Current routed notifications addressed to the superintendent persona.</p>
            </div>

            <div className="field-card rounded-[28px] p-5">
              <div className="mb-4 flex items-center gap-2">
                <History className="h-5 w-5 text-[var(--teal-400)]" />
                <h2 className="text-lg font-semibold">Recent audit activity</h2>
              </div>
              <div className="space-y-3">
                {auditTrail.slice(0, 5).map((entry) => (
                  <div key={entry.id} className="rounded-2xl border border-white/8 bg-white/3 p-4">
                    <div className="font-semibold">{entry.action}</div>
                    <div className="mt-2 text-sm text-[var(--sand-200)]">{entry.why}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
