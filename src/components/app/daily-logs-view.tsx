"use client";

import { useState } from "react";
import { Mic, NotebookPen, ScanText } from "lucide-react";
import { useDemoStore } from "@/store/demo-store";
import { filterProjectsForPersona, formatDate } from "@/lib/selectors";

export function DailyLogsView() {
  const persona = useDemoStore((state) => state.currentPersona);
  const projects = useDemoStore((state) => state.projects);
  const dailyLogs = useDemoStore((state) => state.dailyLogs);
  const rfiDrafts = useDemoStore((state) => state.rfiDrafts);
  const notifications = useDemoStore((state) => state.notifications);
  const voiceDecisionTrace = useDemoStore((state) => state.voiceDecisionTrace);
  const lastVoiceTranscript = useDemoStore((state) => state.lastVoiceTranscript);
  const runVoiceLogDemo = useDemoStore((state) => state.runVoiceLogDemo);

  const visibleProjects = filterProjectsForPersona(projects, persona);
  const visibleLogs = dailyLogs.filter((log) => visibleProjects.some((project) => project.id === log.projectId));
  const [selectedLogId, setSelectedLogId] = useState<string>(visibleLogs[0]?.id ?? "");

  const selectedLog = visibleLogs.find((log) => log.id === selectedLogId) ?? visibleLogs[0];
  const selectedProject = visibleProjects.find((project) => project.id === selectedLog?.projectId);

  return (
    <div className="page-shell pb-28">
      <section className="space-y-4">
        <div className="field-card rounded-[28px] p-5">
          <p className="text-kicker text-xs text-[var(--teal-400)]">Daily logs</p>
          <div className="mt-3 flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold">Field record and voice-to-log</h1>
              <p className="mt-2 text-sm leading-6 text-[var(--sand-200)]">
                Captures auto-attach into today’s log, and the voice demo parses labor, conflict context, and an RFI recommendation.
              </p>
            </div>
            <button
              type="button"
              onClick={runVoiceLogDemo}
              className="touch-target rounded-2xl bg-[var(--teal-500)] px-4 py-3 text-sm font-semibold text-[var(--ink-950)]"
            >
              <span className="inline-flex items-center gap-2">
                <Mic className="h-4 w-4" />
                Run voice demo
              </span>
            </button>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="space-y-3">
            {visibleLogs.map((log) => {
              const project = projects.find((entry) => entry.id === log.projectId);
              const active = log.id === selectedLog?.id;
              return (
                <button
                  key={log.id}
                  type="button"
                  onClick={() => setSelectedLogId(log.id)}
                  className={`field-card block w-full rounded-[24px] p-4 text-left transition ${
                    active ? "border-[var(--teal-400)]" : "hover:border-white/20"
                  }`}
                >
                  <div className="text-kicker text-[11px] text-[var(--sand-200)]">{project?.name}</div>
                  <div className="mt-2 text-lg font-semibold">{formatDate(log.date)}</div>
                  <div className="mt-1 text-sm text-[var(--sand-200)]">{log.weather}</div>
                </button>
              );
            })}
          </div>

          {selectedLog ? (
            <div className="space-y-4">
              <div className="field-card rounded-[28px] p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-kicker text-xs text-[var(--sand-200)]">{selectedProject?.name}</p>
                    <h2 className="mt-2 text-2xl font-semibold">{formatDate(selectedLog.date)} daily log</h2>
                  </div>
                  <NotebookPen className="h-6 w-6 text-[var(--teal-400)]" />
                </div>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-white/8 bg-white/3 p-4">
                    <div className="font-semibold">Workforce</div>
                    <div className="mt-3 space-y-2 text-sm text-[var(--sand-200)]">
                      {selectedLog.workforce.map((entry) => (
                        <div key={entry.role}>
                          {entry.role}: {entry.count} people / {entry.hours} h
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-white/8 bg-white/3 p-4">
                    <div className="font-semibold">Work performed</div>
                    <div className="mt-3 space-y-2 text-sm text-[var(--sand-200)]">
                      {selectedLog.workPerformed.map((item) => (
                        <div key={item}>{item}</div>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-white/8 bg-white/3 p-4">
                    <div className="font-semibold">Delays</div>
                    <div className="mt-3 space-y-2 text-sm text-[var(--sand-200)]">
                      {selectedLog.delays.length ? selectedLog.delays.map((item) => <div key={item}>{item}</div>) : <div>No delays recorded.</div>}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-white/8 bg-white/3 p-4">
                    <div className="font-semibold">Visitors</div>
                    <div className="mt-3 space-y-2 text-sm text-[var(--sand-200)]">
                      {selectedLog.visitors.length ? selectedLog.visitors.map((item) => <div key={item}>{item}</div>) : <div>No visitors recorded.</div>}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="field-card rounded-[28px] p-5">
                  <div className="mb-4 flex items-center gap-2">
                    <ScanText className="h-5 w-5 text-[var(--teal-400)]" />
                    <h3 className="text-lg font-semibold">Decision trace</h3>
                  </div>
                  {voiceDecisionTrace.length === 0 ? (
                    <p className="text-sm text-[var(--sand-200)]">Run the voice demo to generate a visible trace.</p>
                  ) : (
                    <div className="space-y-3">
                      <div className="rounded-2xl border border-white/8 bg-black/10 p-4 text-sm text-[var(--sand-100)]">
                        {lastVoiceTranscript}
                      </div>
                      {voiceDecisionTrace.map((step) => (
                        <div key={step.id} className="rounded-2xl border border-white/8 bg-white/3 p-4">
                          <div className="font-semibold">{step.title}</div>
                          <div className="mt-2 text-sm text-[var(--sand-200)]">{step.detail}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="field-card rounded-[28px] p-5">
                    <h3 className="text-lg font-semibold">RFI drafts</h3>
                    <div className="mt-3 space-y-3">
                      {rfiDrafts.slice(0, 2).map((draft) => (
                        <div key={draft.id} className="rounded-2xl border border-white/8 bg-white/3 p-4">
                          <div className="font-semibold">{draft.number}</div>
                          <div className="mt-2 text-sm text-[var(--sand-200)]">{draft.question}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="field-card rounded-[28px] p-5">
                    <h3 className="text-lg font-semibold">Resulting notifications</h3>
                    <div className="mt-3 space-y-3">
                      {notifications.slice(0, 3).map((note) => (
                        <div key={note.id} className="rounded-2xl border border-white/8 bg-white/3 p-4">
                          <div className="font-semibold">{note.title}</div>
                          <div className="mt-2 text-sm text-[var(--sand-200)]">{note.body}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
