"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Classification, DemoState, Notification, Persona, Project, Rule } from "@/lib/domain";
import type { CaptureContextInput } from "@/lib/mock";
import { cloneSeedState } from "@/lib/seed";
import { executeCapture } from "@/lib/mock";

interface DemoStore extends DemoState {
  setPersona: (persona: Persona) => void;
  selectProject: (projectId: string) => void;
  toggleOfflineMode: () => void;
  resetDemoData: () => void;
  updateRule: (ruleId: string, updates: Partial<Rule>) => void;
  addTemporaryProject: (address: string) => Project;
  executeCaptureFlow: (input: {
    projectId: string;
    classification: Classification;
    selectedPhotoIds: string[];
    context: CaptureContextInput;
  }) => void;
  runVoiceLogDemo: () => void;
  acknowledgeNotification: (notificationId: string) => void;
  escalateNotification: (notificationId: string) => void;
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
      executeCaptureFlow: ({ projectId, classification, selectedPhotoIds, context }) =>
        set((state) => {
          const project = state.projects.find((entry) => entry.id === projectId) ?? state.projects[0];

          if (!project) {
            return state;
          }

          const result = executeCapture({
            project,
            classification,
            selectedPhotoIds,
            context,
            rules: state.rules.filter((rule) => rule.enabled),
          });

          const today = new Date().toISOString().slice(0, 10);
          const logs = state.dailyLogs.map((log) =>
            log.projectId === project.id && log.date === today
              ? {
                  ...log,
                  photoIds: [...result.captureEvent.photoIds, ...log.photoIds],
                  captureEventIds: [result.captureEvent.id, ...log.captureEventIds],
                }
              : log,
          );

          return {
            captureEvents: [result.captureEvent, ...state.captureEvents],
            notifications: [...result.notifications, ...state.notifications],
            tasks: [...result.tasks, ...state.tasks],
            auditTrail: [...result.auditEntries, ...state.auditTrail],
            dailyLogs: logs,
          };
        }),
      runVoiceLogDemo: () =>
        set((state) => {
          const projectId = "harbor-view";
          const now = new Date().toISOString();
          const transcript =
            "We finished framing the west wall, but the window openings do not match the latest plan. Three framers were here from 7:00 to 3:30.";
          const trace = [
            {
              id: "voice-trace-1",
              title: "Transcript captured",
              detail: transcript,
            },
            {
              id: "voice-trace-2",
              title: "Project and location extracted",
              detail: "Matched to 115 Harbor View Drive, west wall framing zone.",
            },
            {
              id: "voice-trace-3",
              title: "Labor parsed",
              detail: "Three framers × 8.5 hours = 25.5 labor hours.",
            },
            {
              id: "voice-trace-4",
              title: "Classification inferred",
              detail: "Progress update with potential design conflict.",
            },
            {
              id: "voice-trace-5",
              title: "Action recommendation",
              detail: "Draft RFI recommendation, notify superintendent, hold homeowner notification.",
            },
          ];

          const dailyLogs = state.dailyLogs.map((log) =>
            log.projectId === projectId && log.date === now.slice(0, 10)
              ? {
                  ...log,
                  workforce: [
                    { role: "Framers", count: 3, hours: 25.5 },
                    ...log.workforce.filter((entry) => entry.role !== "Framers"),
                  ],
                  workPerformed: [
                    "Voice log: Finished framing the west wall; flagged window opening mismatch.",
                    ...log.workPerformed,
                  ],
                }
              : log,
          );

          return {
            dailyLogs,
            notifications: [
              {
                id: `voice-note-${Date.now()}`,
                projectId,
                createdAt: now,
                title: "Voice log flagged possible design conflict",
                body: "Superintendent review requested. Homeowner-facing update remains held.",
                severity: "Approval required",
                status: "sent",
                recipientRoles: ["Superintendent"],
                visibilityLevel: 1,
                routeReason: "Voice-to-log parser inferred design conflict from west wall framing note.",
                ackRequired: false,
                controlLevel: "recommendation requiring approval",
              },
              ...state.notifications,
            ],
            rfiDrafts: state.rfiDrafts.some((draft) => draft.number === "RFI-205")
              ? state.rfiDrafts
              : [
                  {
                    id: `voice-rfi-${Date.now()}`,
                    projectId,
                    number: "RFI-205",
                    question:
                      "Voice log noted that west wall window openings do not match the latest plan. Confirm dimensions before roof framing continues.",
                    drawingRef: "A5.4 / A6.1",
                    ballInCourt: "Axis Studio",
                    dueDate: now.slice(0, 10),
                  },
                  ...state.rfiDrafts,
                ],
            auditTrail: [
              {
                id: `audit-voice-${Date.now()}`,
                timestamp: now,
                projectId,
                actor: "FieldFirst mock engine",
                action: "Processed voice log into labor, log entry, and RFI recommendation",
                why: "Transcript referenced completed framing work and a likely design conflict.",
                ruleId: "rule-design-rfi",
                controlLevel: "recommendation requiring approval",
                visibilityLevel: 1,
              },
              ...state.auditTrail,
            ],
            voiceDecisionTrace: trace,
            lastVoiceTranscript: transcript,
          };
        }),
      acknowledgeNotification: (notificationId) =>
        set((state) => ({
          notifications: state.notifications.map((notification) =>
            notification.id === notificationId
              ? { ...notification, status: "acknowledged", escalatesAt: undefined }
              : notification,
          ),
          auditTrail: [
            {
              id: `audit-ack-${Date.now()}`,
              timestamp: new Date().toISOString(),
              projectId:
                state.notifications.find((notification) => notification.id === notificationId)?.projectId ??
                state.selectedProjectId,
              actor: "Superintendent",
              action: "Acknowledged safety notification",
              why: "Acknowledgement received before escalation deadline.",
              ruleId: "rule-safety-escalation",
              controlLevel: "mandatory human approval",
              visibilityLevel: 1,
            },
            ...state.auditTrail,
          ],
        })),
      escalateNotification: (notificationId) =>
        set((state) => {
          const original = state.notifications.find((notification) => notification.id === notificationId);

          if (!original || original.status !== "pending") {
            return state;
          }

          const escalatedNote: Notification = {
            id: `live-note-escalated-${Date.now()}`,
            projectId: original.projectId,
            createdAt: new Date().toISOString(),
            title: "Safety escalation sent to Office / PM",
            body: `${original.title} was ignored past the acknowledgement timer.`,
            severity: "Safety critical",
            status: "escalated",
            recipientRoles: ["Office / PM"],
            visibilityLevel: 1,
            routeReason: "30-second live demo escalation fired automatically.",
            ackRequired: false,
            controlLevel: "mandatory human approval",
          };

          return {
            notifications: [
              { ...original, status: "escalated", escalatesAt: undefined },
              escalatedNote,
              ...state.notifications.filter((notification) => notification.id !== notificationId),
            ],
            auditTrail: [
              {
                id: `audit-escalate-${Date.now()}`,
                timestamp: new Date().toISOString(),
                projectId: original.projectId,
                actor: "FieldFirst mock engine",
                action: "Escalated unacknowledged safety issue to Office / PM",
                why: "Safety acknowledgement timer expired with no response.",
                ruleId: "rule-safety-escalation",
                controlLevel: "mandatory human approval",
                visibilityLevel: 1,
              },
              ...state.auditTrail,
            ],
          };
        }),
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
        voiceDecisionTrace: state.voiceDecisionTrace,
        lastVoiceTranscript: state.lastVoiceTranscript,
        offlineMode: state.offlineMode,
      }),
    },
  ),
);
