"use client";

import { CheckCircle2, ClipboardList, Link2, TimerReset } from "lucide-react";
import { useDemoStore } from "@/store/demo-store";
import { filterProjectsForPersona, formatDate } from "@/lib/selectors";

const assigneeOptions = ["Foreman", "Superintendent", "Office / PM", "Architect / Engineer"] as const;

export function TasksScheduleView() {
  const persona = useDemoStore((state) => state.currentPersona);
  const projects = useDemoStore((state) => state.projects);
  const tasks = useDemoStore((state) => state.tasks);
  const scheduleRiskAlert = useDemoStore((state) => state.scheduleRiskAlert);
  const reassignTask = useDemoStore((state) => state.reassignTask);
  const attachTaskEvidence = useDemoStore((state) => state.attachTaskEvidence);
  const completeTask = useDemoStore((state) => state.completeTask);
  const reportSchedule80Complete = useDemoStore((state) => state.reportSchedule80Complete);

  const visibleProjects = filterProjectsForPersona(projects, persona);
  const visibleTasks = tasks.filter((task) => visibleProjects.some((project) => project.id === task.projectId));
  const birchLane = projects.find((project) => project.id === "birch-lane");

  return (
    <div className="page-shell pb-28">
      <section className="space-y-4">
        <div className="field-card rounded-[28px] p-5">
          <p className="text-kicker text-xs text-[var(--amber-400)]">Tasks and schedule</p>
          <h1 className="mt-3 text-3xl font-semibold">Evidence-gated work and constraint-aware sequencing</h1>
          <p className="mt-2 text-sm leading-6 text-[var(--sand-200)]">
            Tasks can be reassigned and blocked on required photo evidence. The Birch Lane schedule includes the drywall → inspection → electrical trim dependency demo.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="field-card rounded-[28px] p-5">
            <div className="mb-4 flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-[var(--teal-400)]" />
              <h2 className="text-lg font-semibold">Tasks and punch items</h2>
            </div>
            <div className="space-y-3">
              {visibleTasks.map((task) => (
                <article key={task.id} className="rounded-2xl border border-white/8 bg-white/3 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="font-semibold">{task.title}</div>
                      <div className="mt-1 text-sm text-[var(--sand-200)]">
                        {task.type} • due {formatDate(task.dueDate)}
                      </div>
                    </div>
                    <span className="rounded-full bg-white/6 px-2 py-1 text-xs">{task.status}</span>
                  </div>
                  <p className="mt-3 text-sm text-[var(--sand-200)]">{task.summary}</p>
                  <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto_auto]">
                    <select
                      value={task.assignedTo}
                      onChange={(event) => reassignTask(task.id, event.target.value as (typeof assigneeOptions)[number])}
                      className="rounded-xl border border-white/10 bg-black/10 px-3 py-2 text-sm outline-none"
                    >
                      {assigneeOptions.map((option) => (
                        <option key={option} value={option} className="bg-[var(--ink-900)]">
                          {option}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => attachTaskEvidence(task.id, "photo-hazard-2")}
                      className="rounded-xl border border-white/10 px-3 py-2 text-sm"
                    >
                      Attach evidence
                    </button>
                    <button
                      type="button"
                      onClick={() => completeTask(task.id)}
                      className="rounded-xl bg-[var(--teal-500)] px-3 py-2 text-sm font-semibold text-[var(--ink-950)]"
                    >
                      Complete
                    </button>
                  </div>
                  {task.evidenceRequired ? (
                    <div className="mt-3 text-xs text-[var(--sand-200)]">
                      Evidence required. {task.evidencePhotoIds.length} photo(s) attached.
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="field-card rounded-[28px] p-5">
              <div className="mb-4 flex items-center gap-2">
                <Link2 className="h-5 w-5 text-[var(--amber-400)]" />
                <h2 className="text-lg font-semibold">Birch Lane activity chain</h2>
              </div>
              <div className="space-y-3">
                {birchLane?.activities.map((activity) => (
                  <div key={activity.id} className="rounded-2xl border border-white/8 bg-white/3 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="font-semibold">{activity.label}</div>
                      <span className="rounded-full bg-white/6 px-2 py-1 text-xs">{activity.percentComplete}%</span>
                    </div>
                    <div className="mt-2 text-sm text-[var(--sand-200)]">
                      {activity.start} → {activity.end}
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs">
                      {activity.dependencyIds.length ? activity.dependencyIds.map((dependency) => (
                        <span key={dependency} className="rounded-full bg-black/10 px-2 py-1">
                          Depends on {dependency.replace("bl-activity-", "#")}
                        </span>
                      )) : <span className="rounded-full bg-black/10 px-2 py-1">No dependencies</span>}
                    </div>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => reportSchedule80Complete("birch-lane")}
                className="mt-4 touch-target w-full rounded-2xl bg-[var(--amber-400)] px-4 py-3 text-sm font-semibold text-[var(--ink-950)]"
              >
                Report 80% complete
              </button>
            </div>

            {scheduleRiskAlert ? (
              <div className="field-card rounded-[28px] p-5">
                <div className="mb-4 flex items-center gap-2">
                  <TimerReset className="h-5 w-5 text-[var(--red-500)]" />
                  <h3 className="text-lg font-semibold">{scheduleRiskAlert.title}</h3>
                </div>
                <p className="text-sm leading-6 text-[var(--sand-200)]">{scheduleRiskAlert.summary}</p>
                <div className="mt-4 space-y-2 text-sm text-[var(--sand-100)]">
                  {scheduleRiskAlert.chain.map((step) => (
                    <div key={step} className="rounded-xl border border-white/8 bg-white/3 px-3 py-2">
                      {step}
                    </div>
                  ))}
                </div>
                <div className="mt-4 space-y-2">
                  {scheduleRiskAlert.proposedDates.map((date) => (
                    <div key={date} className="rounded-xl border border-white/8 bg-black/10 px-3 py-2 text-sm">
                      Proposed inspection slot: {date}
                    </div>
                  ))}
                </div>
                <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-[rgba(61,212,193,0.18)] px-3 py-2 text-sm text-[var(--teal-400)]">
                  <CheckCircle2 className="h-4 w-4" />
                  Superintendent-only notification sent
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}
