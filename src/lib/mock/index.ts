import type {
  AuditEntry,
  CaptureEvent,
  Classification,
  ControlLevel,
  Notification,
  Persona,
  PhotoAsset,
  Project,
  Rule,
  Task,
  VisibilityLevel,
} from "@/lib/domain";

export interface DemoPhotoSet {
  id: string;
  title: string;
  description: string;
  photoIds: string[];
  classification: Classification;
  suggestedProjectId: string;
  area: string;
  severity: string;
}

export interface ProjectMatch {
  projectId: string;
  confidence: number;
  signals: string[];
}

export interface ActionPreviewItem {
  id: string;
  title: string;
  description: string;
  controlLevel: ControlLevel;
}

export interface CaptureContextInput {
  area: string;
  progressOrProblem: string;
  workStop: string;
  costImpact: string;
  homeownerVisibility: string;
  responsibleParty: string;
}

export interface ExecuteCaptureParams {
  project: Project;
  classification: Classification;
  selectedPhotoIds: string[];
  context: CaptureContextInput;
  rules: Rule[];
}

export const demoPhotoSets: DemoPhotoSet[] = [
  {
    id: "set-safety-birch",
    title: "Birch Lane safety issue",
    description: "Trip hazard at hallway transition during drywall finish work.",
    photoIds: ["photo-hazard-2", "photo-drywall-1"],
    classification: "safety hazard",
    suggestedProjectId: "birch-lane",
    area: "Hallway transition",
    severity: "Safety critical",
  },
  {
    id: "set-design-harbor",
    title: "Harbor View design conflict",
    description: "Window openings appear off against the latest plan.",
    photoIds: ["photo-framing-1", "photo-framing-2"],
    classification: "design conflict",
    suggestedProjectId: "harbor-view",
    area: "West wall framing",
    severity: "Approval required",
  },
  {
    id: "set-delivery-harbor",
    title: "Harbor View delivery check",
    description: "Roof truss delivery staged on site.",
    photoIds: ["photo-delivery-1", "photo-delivery-2"],
    classification: "delivery",
    suggestedProjectId: "harbor-view",
    area: "Laydown yard",
    severity: "FYI",
  },
];

export function getAvailableDemoSets(photoAssets: PhotoAsset[]) {
  return demoPhotoSets.map((set) => ({
    ...set,
    photos: set.photoIds
      .map((photoId) => photoAssets.find((photo) => photo.id === photoId))
      .filter(Boolean) as PhotoAsset[],
  }));
}

export function suggestProjectMatch(projectId: string, projects: Project[]): ProjectMatch {
  const matchedProject = projects.find((project) => project.id === projectId) ?? projects[0];

  if (!matchedProject) {
    return {
      projectId: "",
      confidence: 0,
      signals: [],
    };
  }

  return {
    projectId: matchedProject.id,
    confidence:
      matchedProject.id === "harbor-view" ? 92 : matchedProject.id === "birch-lane" ? 89 : 85,
    signals: [
      "GPS cluster within 180 ft",
      "Active schedule overlap",
      "Recent foreman visits",
    ],
  };
}

export function classifyPhotoSelection(selectedPhotoIds: string[], photoAssets: PhotoAsset[]): Classification {
  const joined = [...selectedPhotoIds].sort().join("|");
  const deterministicMap: Record<string, Classification> = {
    "photo-drywall-1|photo-hazard-2": "safety hazard",
    "photo-delivery-1|photo-delivery-2": "delivery",
    "photo-framing-1|photo-framing-2": "design conflict",
  };

  if (deterministicMap[joined]) {
    return deterministicMap[joined];
  }

  return photoAssets.find((photo) => selectedPhotoIds.includes(photo.id))?.classification ?? "documentation";
}

export function getContextDefaults(classification: Classification) {
  switch (classification) {
    case "safety hazard":
      return {
        progressOrProblem: "Problem",
        workStop: "Yes",
        costImpact: "Possible rework",
        homeownerVisibility: "Internal only",
        responsibleParty: "Foreman",
      };
    case "design conflict":
      return {
        progressOrProblem: "Problem",
        workStop: "Partial hold",
        costImpact: "Potential",
        homeownerVisibility: "Hold pending approval",
        responsibleParty: "Architect / Engineer",
      };
    default:
      return {
        progressOrProblem: "Progress",
        workStop: "No",
        costImpact: "None",
        homeownerVisibility: "External professional",
        responsibleParty: "Builder / GC",
      };
  }
}

export function getMockVoiceTranscript() {
  return "We finished framing the west wall, but the window openings do not match the latest plan. Three framers were here from 7:00 to 3:30.";
}

export function getMockNotificationDelay(persona: Persona) {
  return persona === "Office / PM" ? 800 : 450;
}

export function getVisibilityLevel(label: string): VisibilityLevel {
  if (label.toLowerCase().includes("homeowner")) {
    return 3;
  }

  if (label.toLowerCase().includes("external")) {
    return 2;
  }

  return 1;
}

export function getActionPreview(classification: Classification, rules: Rule[]): ActionPreviewItem[] {
  const safetyRule = rules.find((rule) => rule.id === "rule-safety-escalation");
  const progressRule = rules.find((rule) => rule.id === "rule-progress-daily-log");
  const designRule = rules.find((rule) => rule.id === "rule-design-rfi");

  if (classification === "safety hazard") {
    if (!safetyRule) {
      return [
        {
          id: "local-only",
          title: "Hold locally only",
          description: "Safety escalation rule is disabled, so this capture stays local and unactioned.",
          controlLevel: "prohibited from automation",
        },
      ];
    }

    return [
      {
        id: "attach-log",
        title: "Attach to daily log",
        description: "Record the hazard photos in today’s daily log immediately.",
        controlLevel: "automatic with undo",
      },
      {
        id: "create-punch",
        title: "Create punch / corrective item",
        description: "Open a corrective action item that cannot close without evidence.",
        controlLevel: "recommendation requiring approval",
      },
      {
        id: "notify-superintendent",
        title: "Notify superintendent",
        description: "Send a safety-critical alert and require acknowledgement within 30 seconds.",
        controlLevel: safetyRule.controlLevel,
      },
      {
        id: "escalate-office",
        title: "Escalate to safety manager",
        description: "If ignored, escalate visibly to Office / PM while keeping the homeowner inbox clean.",
        controlLevel: safetyRule.controlLevel,
      },
    ];
  }

  if (classification === "design conflict") {
    if (!designRule) {
      return [
        {
          id: "local-only",
          title: "Store without routing",
          description: "Design-conflict automation is disabled, so no RFI or notification will be created.",
          controlLevel: "prohibited from automation",
        },
      ];
    }

    return [
      {
        id: "attach-log",
        title: "Attach to daily log",
        description: "Capture field evidence with the active location context.",
        controlLevel: "automatic with undo",
      },
      {
        id: "draft-rfi",
        title: "Draft RFI",
        description: "Create an RFI recommendation with a drawing reference and evidence bundle.",
        controlLevel: designRule.controlLevel,
      },
      {
        id: "notify-team",
        title: "Notify superintendent and architect",
        description: "Route internally only until validated.",
        controlLevel: "recommendation requiring approval",
      },
      {
        id: "hold-homeowner",
        title: "Hold homeowner update",
        description: "Prevent homeowner-facing messaging until the conflict is reviewed.",
        controlLevel: "mandatory human approval",
      },
    ];
  }

  return [
    {
      id: "attach-log",
      title: "Attach to daily log",
      description: "File progress evidence into the project record.",
      controlLevel: progressRule?.controlLevel ?? "automatic with undo",
    },
    {
      id: "notify-superintendent",
      title: "Notify superintendent",
      description: "Send a concise field update for rapid awareness.",
      controlLevel: "automatic with undo",
    },
  ];
}

export function executeCapture({
  project,
  classification,
  selectedPhotoIds,
  context,
  rules,
}: ExecuteCaptureParams): {
  captureEvent: CaptureEvent;
  notifications: Notification[];
  tasks: Task[];
  auditEntries: AuditEntry[];
} {
  const safetyRuleEnabled = rules.some((rule) => rule.id === "rule-safety-escalation");
  const designRuleEnabled = rules.some((rule) => rule.id === "rule-design-rfi");
  const now = new Date();
  const createdAt = now.toISOString();
  const visibilityLevel = getVisibilityLevel(context.homeownerVisibility);
  const actionPlan = getActionPreview(classification, rules);
  const ruleIds =
    classification === "safety hazard"
      ? safetyRuleEnabled
        ? ["rule-safety-escalation"]
        : []
      : classification === "design conflict"
        ? designRuleEnabled
          ? ["rule-design-rfi"]
          : []
        : ["rule-progress-daily-log"];

  const severity =
    classification === "safety hazard"
      ? "Safety critical"
      : classification === "design conflict"
        ? "Approval required"
        : classification === "delivery"
          ? "FYI"
          : "Action required";

  const captureEvent: CaptureEvent = {
    id: `capture-live-${now.getTime()}`,
    projectId: project.id,
    createdAt,
    createdBy: "Foreman",
    classification,
    area: context.area,
    summary: `${context.progressOrProblem}: ${classification} recorded at ${context.area}.`,
    severity,
    visibilityLevel,
    syncState: "Verified on server",
    photoIds: selectedPhotoIds,
    routeRuleIds: ruleIds,
    actionSummary: actionPlan.map((item) => item.title),
  };

  const notifications: Notification[] = [];
  const tasks: Task[] = [];
  const auditEntries: AuditEntry[] = [
    {
      id: `audit-live-${now.getTime()}-1`,
      timestamp: createdAt,
      projectId: project.id,
      actor: "FieldFirst mock engine",
      action: `Classified capture as ${classification}`,
      why: `Deterministic demo-set match with area ${context.area}.`,
      ruleId: ruleIds[0],
      controlLevel: "automatic",
      visibilityLevel,
    },
  ];

  if (classification === "safety hazard" && safetyRuleEnabled) {
    const escalateAt = new Date(now.getTime() + 30_000).toISOString();
    notifications.push({
      id: `live-note-${now.getTime()}-super`,
      projectId: project.id,
      createdAt,
      title: "Safety hazard requires acknowledgement",
      body: `${context.area} has been flagged. Work stop: ${context.workStop}.`,
      severity: "Safety critical",
      status: "pending",
      recipientRoles: ["Superintendent"],
      visibilityLevel: 1,
      routeReason: "Rule safety-escalation triggered on capture confirmation.",
      ackRequired: true,
      escalatesAt: escalateAt,
      controlLevel: "mandatory human approval",
    });
    tasks.push({
      id: `live-task-${now.getTime()}-hazard`,
      projectId: project.id,
      title: `Correct safety hazard at ${context.area}`,
      type: "punch",
      status: "open",
      assignedTo: "Foreman",
      dueDate: createdAt.slice(0, 10),
      evidenceRequired: true,
      evidencePhotoIds: [],
      summary: "Corrective item opened from live safety capture.",
    });
    auditEntries.push({
      id: `audit-live-${now.getTime()}-2`,
      timestamp: createdAt,
      projectId: project.id,
      actor: "FieldFirst mock engine",
      action: "Notified superintendent and started 30-second escalation timer",
      why: "Safety closures require human acknowledgement.",
      ruleId: "rule-safety-escalation",
      controlLevel: "mandatory human approval",
      visibilityLevel: 1,
    });
  } else if (classification === "design conflict" && designRuleEnabled) {
    notifications.push({
      id: `live-note-${now.getTime()}-design`,
      projectId: project.id,
      createdAt,
      title: "Design conflict held for review",
      body: `${context.area} flagged. Homeowner visibility remains on hold until approval.`,
      severity: "Approval required",
      status: "sent",
      recipientRoles: ["Superintendent", "Architect / Engineer"],
      visibilityLevel: 1,
      routeReason: "Rule design-rfi created internal review path only.",
      ackRequired: false,
      controlLevel: "recommendation requiring approval",
    });
    tasks.push({
      id: `live-task-${now.getTime()}-rfi`,
      projectId: project.id,
      title: `Review design conflict at ${context.area}`,
      type: "approval",
      status: "open",
      assignedTo: "Architect / Engineer",
      dueDate: createdAt.slice(0, 10),
      evidenceRequired: false,
      evidencePhotoIds: [],
      summary: "RFI recommendation drafted from live capture.",
    });
    auditEntries.push({
      id: `audit-live-${now.getTime()}-2`,
      timestamp: createdAt,
      projectId: project.id,
      actor: "FieldFirst mock engine",
      action: "Drafted RFI recommendation and held homeowner update",
      why: "Design conflict requires internal review before any external message.",
      ruleId: "rule-design-rfi",
      controlLevel: "recommendation requiring approval",
      visibilityLevel: 1,
    });
  } else {
    notifications.push({
      id: `live-note-${now.getTime()}-progress`,
      projectId: project.id,
      createdAt,
      title: "Field update filed",
      body: `${classification} capture attached to daily log for ${project.name}.`,
      severity: "FYI",
      status: "sent",
      recipientRoles: ["Superintendent"],
      visibilityLevel,
      routeReason: "Progress routing auto-filed to daily log.",
      ackRequired: false,
      controlLevel: "automatic with undo",
    });
  }

  if ((classification === "safety hazard" && !safetyRuleEnabled) || (classification === "design conflict" && !designRuleEnabled)) {
    auditEntries.push({
      id: `audit-live-${now.getTime()}-2`,
      timestamp: createdAt,
      projectId: project.id,
      actor: "FieldFirst mock engine",
      action: "Skipped automation because the routing rule is disabled",
      why: "Rule builder settings prohibit automated follow-up for this classification.",
      controlLevel: "prohibited from automation",
      visibilityLevel,
    });
  }

  return { captureEvent, notifications, tasks, auditEntries };
}
