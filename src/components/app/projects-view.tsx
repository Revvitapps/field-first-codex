"use client";

import { Building2, MapPin, RotateCcw } from "lucide-react";
import { filterContactsForProject, filterProjectsForPersona, currency, formatDate } from "@/lib/selectors";
import { useDemoStore } from "@/store/demo-store";

export function ProjectsView() {
  const persona = useDemoStore((state) => state.currentPersona);
  const projects = useDemoStore((state) => state.projects);
  const contacts = useDemoStore((state) => state.contacts);
  const selectedProjectId = useDemoStore((state) => state.selectedProjectId);
  const selectProject = useDemoStore((state) => state.selectProject);
  const resetDemoData = useDemoStore((state) => state.resetDemoData);

  const visibleProjects = filterProjectsForPersona(projects, persona);
  const selectedProject =
    visibleProjects.find((project) => project.id === selectedProjectId) ?? visibleProjects[0] ?? projects[0];
  const projectContacts = filterContactsForProject(contacts, selectedProject.id);

  return (
    <section className="space-y-4">
      <div className="field-card rounded-[28px] p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-kicker text-xs text-[var(--clay-300)]">Projects</p>
            <h2 className="mt-3 text-2xl font-semibold">Seeded project model</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--sand-200)]">
              Three projects, milestone progress, contact policies, and schedule dependencies are all driven by the local persisted store.
            </p>
          </div>
          <button
            type="button"
            onClick={resetDemoData}
            className="touch-target rounded-full border border-white/10 px-4 py-2 text-sm text-[var(--sand-100)] transition hover:bg-white/5"
          >
            <span className="inline-flex items-center gap-2">
              <RotateCcw className="h-4 w-4" />
              Reset demo data
            </span>
          </button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="space-y-3">
          {visibleProjects.map((project) => {
            const active = project.id === selectedProject.id;
            return (
              <button
                key={project.id}
                type="button"
                onClick={() => selectProject(project.id)}
                className={`field-card block w-full rounded-[24px] p-4 text-left transition ${
                  active ? "border-[var(--teal-400)]" : "hover:border-white/20"
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-kicker text-[11px] text-[var(--sand-200)]">{project.projectType}</div>
                    <h3 className="mt-2 text-lg font-semibold">{project.name}</h3>
                  </div>
                  <span className="rounded-full bg-white/6 px-2 py-1 text-xs">{project.percentComplete}%</span>
                </div>
                <div className="mt-2 flex items-center gap-2 text-sm text-[var(--sand-200)]">
                  <MapPin className="h-4 w-4" />
                  {project.address}
                </div>
              </button>
            );
          })}
        </div>

        <div className="field-card rounded-[28px] p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-kicker text-xs text-[var(--teal-400)]">{selectedProject.phase}</p>
              <h2 className="mt-2 text-2xl font-semibold">{selectedProject.name}</h2>
              <p className="mt-2 text-sm text-[var(--sand-200)]">{selectedProject.address}</p>
            </div>
            <Building2 className="h-6 w-6 text-[var(--teal-400)]" />
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/8 bg-white/3 p-4">
              <div className="text-kicker text-[11px] text-[var(--sand-200)]">Complete</div>
              <div className="mt-2 text-2xl font-semibold">{selectedProject.percentComplete}%</div>
            </div>
            <div className="rounded-2xl border border-white/8 bg-white/3 p-4">
              <div className="text-kicker text-[11px] text-[var(--sand-200)]">Contract</div>
              <div className="mt-2 text-2xl font-semibold">{currency(selectedProject.contractValue)}</div>
            </div>
            <div className="rounded-2xl border border-white/8 bg-white/3 p-4">
              <div className="text-kicker text-[11px] text-[var(--sand-200)]">Homeowner</div>
              <div className="mt-2 text-lg font-semibold">{selectedProject.homeownerName ?? "Internal only"}</div>
            </div>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1fr]">
            <div>
              <h3 className="text-lg font-semibold">Milestones</h3>
              <div className="mt-3 space-y-3">
                {selectedProject.milestones.map((milestone) => (
                  <div key={milestone.id} className="rounded-2xl border border-white/8 bg-black/10 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <strong>{milestone.label}</strong>
                      <span className="rounded-full bg-white/6 px-2 py-1 text-xs capitalize">{milestone.status}</span>
                    </div>
                    <div className="mt-2 text-sm text-[var(--sand-200)]">{formatDate(milestone.date)}</div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold">Contacts and policy</h3>
              <div className="mt-3 space-y-3">
                {projectContacts.map((contact) => (
                  <div key={contact.id} className="rounded-2xl border border-white/8 bg-black/10 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="font-semibold">{contact.name}</div>
                        <div className="text-sm text-[var(--sand-200)]">
                          {contact.role} • {contact.company}
                        </div>
                      </div>
                      <div className="rounded-full bg-white/6 px-2 py-1 text-xs">{contact.communicationPolicy.progressPhotos}</div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs text-[var(--sand-100)]">
                      <span className="rounded-full bg-white/6 px-2 py-1">Safety: {contact.communicationPolicy.safetyAlerts}</span>
                      <span className="rounded-full bg-white/6 px-2 py-1">Cost: {contact.communicationPolicy.costAlerts}</span>
                      <span className="rounded-full bg-white/6 px-2 py-1">Schedule: {contact.communicationPolicy.scheduleAlerts}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
