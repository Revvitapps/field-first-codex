"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { DemoState, Persona, Project, Rule } from "@/lib/domain";
import { cloneSeedState } from "@/lib/seed";

interface DemoStore extends DemoState {
  setPersona: (persona: Persona) => void;
  selectProject: (projectId: string) => void;
  toggleOfflineMode: () => void;
  resetDemoData: () => void;
  updateRule: (ruleId: string, updates: Partial<Rule>) => void;
  addTemporaryProject: (address: string) => Project;
}

const initialState = cloneSeedState();

export const useDemoStore = create<DemoStore>()(
  persist(
    (set) => ({
      ...initialState,
      setPersona: (currentPersona) => set({ currentPersona }),
      selectProject: (selectedProjectId) => set({ selectedProjectId }),
      toggleOfflineMode: () => set((state) => ({ offlineMode: !state.offlineMode })),
      resetDemoData: () => set(cloneSeedState()),
      updateRule: (ruleId, updates) =>
        set((state) => ({
          rules: state.rules.map((rule) => (rule.id === ruleId ? { ...rule, ...updates } : rule)),
        })),
      addTemporaryProject: (address) => {
        const id = `temp-project-${Date.now()}`;
        const project: Project = {
          id,
          name: address.split(",")[0] || "New temporary project",
          address,
          projectType: "Pending address review",
          pendingOfficeReview: true,
          lat: 0,
          lng: 0,
          phase: "Pending triage",
          percentComplete: 0,
          contractValue: 0,
          personaAccess: ["Foreman", "Superintendent", "Office / PM"],
          milestones: [{ id: `${id}-ms-1`, label: "Office review", date: "2026-07-13", status: "current" }],
          activities: [],
        };
        set((state) => ({
          projects: [project, ...state.projects],
          selectedProjectId: id,
        }));
        return project;
      },
    }),
    {
      name: "field-first-demo-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        currentPersona: state.currentPersona,
        selectedProjectId: state.selectedProjectId,
        projects: state.projects,
        contacts: state.contacts,
        photoAssets: state.photoAssets,
        captureEvents: state.captureEvents,
        notifications: state.notifications,
        tasks: state.tasks,
        dailyLogs: state.dailyLogs,
        rules: state.rules,
        auditTrail: state.auditTrail,
        rfiDrafts: state.rfiDrafts,
        threads: state.threads,
        offlineMode: state.offlineMode,
      }),
    },
  ),
);
