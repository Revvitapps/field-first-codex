"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { DemoState, Persona, Rule } from "@/lib/domain";
import { cloneSeedState } from "@/lib/seed";

interface DemoStore extends DemoState {
  setPersona: (persona: Persona) => void;
  selectProject: (projectId: string) => void;
  toggleOfflineMode: () => void;
  resetDemoData: () => void;
  updateRule: (ruleId: string, updates: Partial<Rule>) => void;
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
