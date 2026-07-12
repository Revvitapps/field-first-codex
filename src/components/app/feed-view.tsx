"use client";

import { ArrowRight, FileText, ShieldAlert, Sparkles } from "lucide-react";
import { useDemoStore } from "@/store/demo-store";
import { canSeeVisibilityLevel, filterNotificationsForPersona, filterProjectsForPersona, formatDate } from "@/lib/selectors";
import { SyncStateBadge } from "@/components/app/sync-state-badge";

const severityTone: Record<string, string> = {
  FYI: "bg-white/6 text-[var(--sand-100)]",
  "Action required": "bg-[rgba(239,187,87,0.18)] text-[var(--amber-400)]",
  "Approval required": "bg-[rgba(61,212,193,0.18)] text-[var(--teal-400)]",
  "Blocking issue": "bg-[rgba(221,93,79,0.16)] text-[#ff9d90]",
  "Safety critical": "bg-[rgba(221,93,79,0.24)] text-[#ffb1a7]",
};

export function FeedView() {
  const persona = useDemoStore((state) => state.currentPersona);
  const projects = useDemoStore((state) => state.projects);
  const notifications = useDemoStore((state) => state.notifications);
  const captureEvents = useDemoStore((state) => state.captureEvents);
  const tasks = useDemoStore((state) => state.tasks);
  const auditTrail = useDemoStore((state) => state.auditTrail);

  const visibleProjects = filterProjectsForPersona(projects, persona);
  const visibleNotifications = filterNotificationsForPersona(notifications, persona);
  const visibleCaptures = captureEvents.filter((event) => canSeeVisibilityLevel(persona, event.visibilityLevel));
  const focusTasks = tasks.filter((task) => visibleProjects.some((project) => project.id === task.projectId)).slice(0, 3);

  return (
    <section className="space-y-4">
      <div className="field-card rounded-[28px] p-5">
        <p className="text-kicker text-xs text-[var(--teal-400)]">Live feed</p>
        <div className="mt-3 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold">{persona} command surface</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--sand-200)]">
              Persona filtering changes the stream, recipients, and visibility without changing the underlying job record.
            </p>
          </div>
          <Sparkles className="mt-1 h-6 w-6 text-[var(--teal-400)]" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {visibleProjects.map((project) => (
          <article key={project.id} className="field-card rounded-[24px] p-4">
            <div className="text-kicker text-[11px] text-[var(--sand-200)]">{project.phase}</div>
            <h3 className="mt-2 text-lg font-semibold">{project.name}</h3>
            <p className="mt-1 text-sm text-[var(--sand-200)]">{project.address}</p>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/8">
              <div className="h-full rounded-full bg-[var(--teal-500)]" style={{ width: `${project.percentComplete}%` }} />
            </div>
            <div className="mt-2 text-sm text-[var(--sand-200)]">{project.percentComplete}% complete</div>
          </article>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-[1.3fr_0.9fr]">
        <div className="field-card rounded-[28px] p-5">
          <div className="mb-4 flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-[var(--amber-400)]" />
            <h3 className="text-lg font-semibold">Visible notifications</h3>
          </div>
          <div className="space-y-3">
            {visibleNotifications.map((notification) => (
              <div key={notification.id} className="rounded-2xl border border-white/8 bg-black/10 p-4">
                <div className="flex items-center justify-between gap-3">
                  <strong>{notification.title}</strong>
                  <span className={`rounded-full px-2 py-1 text-xs ${severityTone[notification.severity] ?? severityTone.FYI}`}>
                    {notification.severity}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-[var(--sand-200)]">{notification.body}</p>
                <div className="mt-3 text-xs text-[var(--sand-200)]">
                  {formatDate(notification.createdAt)} • {notification.routeReason}
                </div>
              </div>
            ))}
            {visibleNotifications.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/12 p-4 text-sm text-[var(--sand-200)]">
                No alerts are routed to the current persona.
              </div>
            ) : null}
          </div>
        </div>

        <div className="space-y-4">
          <div className="field-card rounded-[28px] p-5">
            <div className="mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-[var(--teal-400)]" />
              <h3 className="text-lg font-semibold">Recent capture context</h3>
            </div>
            <div className="space-y-3">
              {visibleCaptures.slice(0, 3).map((capture) => (
                <div key={capture.id} className="rounded-2xl border border-white/8 bg-white/3 p-4">
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="font-semibold capitalize">{capture.classification}</span>
                    <SyncStateBadge state={capture.syncState} />
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[var(--sand-200)]">{capture.summary}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="field-card rounded-[28px] p-5">
            <div className="mb-4 flex items-center gap-2">
              <ArrowRight className="h-5 w-5 text-[var(--teal-400)]" />
              <h3 className="text-lg font-semibold">Open work</h3>
            </div>
            <div className="space-y-3">
              {focusTasks.map((task) => (
                <div key={task.id} className="rounded-2xl border border-white/8 bg-white/3 p-4">
                  <div className="text-sm font-semibold">{task.title}</div>
                  <div className="mt-1 text-sm text-[var(--sand-200)]">
                    {task.assignedTo} • due {formatDate(task.dueDate)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="field-card rounded-[28px] p-5">
            <div className="mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-[var(--amber-400)]" />
              <h3 className="text-lg font-semibold">Audit trail</h3>
            </div>
            <div className="space-y-3">
              {auditTrail.slice(0, 4).map((entry) => (
                <div key={entry.id} className="rounded-2xl border border-white/8 bg-white/3 p-4">
                  <div className="text-sm font-semibold">{entry.action}</div>
                  <div className="mt-1 text-xs text-[var(--sand-200)]">
                    {entry.actor} • {entry.controlLevel}
                  </div>
                  <p className="mt-2 text-sm text-[var(--sand-200)]">{entry.why}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
