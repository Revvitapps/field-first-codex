export type Persona = "Foreman" | "Superintendent" | "Homeowner" | "Office / PM";

export type Role =
  | Persona
  | "Builder / GC"
  | "Supplier"
  | "Subcontractor"
  | "Architect / Engineer";

export type Severity =
  | "FYI"
  | "Action required"
  | "Approval required"
  | "Blocking issue"
  | "Safety critical"
  | "Financial critical"
  | "Client sensitive"
  | "Emergency";

export type VisibilityLevel = 1 | 2 | 3;

export type ControlLevel =
  | "automatic"
  | "automatic with undo"
  | "recommendation requiring approval"
  | "mandatory human approval"
  | "prohibited from automation";

export type Classification =
  | "progress"
  | "damage"
  | "safety hazard"
  | "design conflict"
  | "delivery"
  | "warranty"
  | "documentation";

export type SyncState = "Saved locally" | "Uploading" | "Upload failed - retrying" | "Verified on server";

export type NotificationStatus = "pending" | "sent" | "acknowledged" | "escalated";

export interface CommunicationPolicy {
  progressPhotos: string;
  safetyAlerts: string;
  costAlerts: string;
  scheduleAlerts: string;
  clientFacingNotes: string;
}

export interface Contact {
  id: string;
  name: string;
  role: Role;
  company: string;
  phone: string;
  email: string;
  projectIds: string[];
  communicationPolicy: CommunicationPolicy;
}

export interface Milestone {
  id: string;
  label: string;
  date: string;
  status: "done" | "current" | "upcoming" | "at-risk";
}

export interface Activity {
  id: string;
  label: string;
  crew: string;
  start: string;
  end: string;
  percentComplete: number;
  dependencyIds: string[];
  status: "queued" | "active" | "blocked" | "complete" | "at-risk";
}

export interface Project {
  id: string;
  name: string;
  address: string;
  projectType: string;
  homeownerName?: string;
  pendingOfficeReview?: boolean;
  lat: number;
  lng: number;
  phase: string;
  percentComplete: number;
  contractValue: number;
  personaAccess: Persona[];
  milestones: Milestone[];
  activities: Activity[];
}

export interface PhotoAsset {
  id: string;
  label: string;
  src: string;
  classification: Classification;
}

export interface CaptureEvent {
  id: string;
  projectId: string;
  createdAt: string;
  createdBy: Role;
  classification: Classification;
  area: string;
  summary: string;
  severity: Severity;
  visibilityLevel: VisibilityLevel;
  syncState: SyncState;
  photoIds: string[];
  routeRuleIds: string[];
  actionSummary: string[];
}

export interface Notification {
  id: string;
  projectId: string;
  createdAt: string;
  title: string;
  body: string;
  severity: Severity;
  status: NotificationStatus;
  recipientRoles: Role[];
  visibilityLevel: VisibilityLevel;
  routeReason: string;
  ackRequired: boolean;
  escalatesAt?: string;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  type: "task" | "punch" | "approval";
  status: "open" | "in-progress" | "blocked" | "complete";
  assignedTo: Role;
  dueDate: string;
  evidenceRequired: boolean;
  evidencePhotoIds: string[];
  summary: string;
}

export interface WorkforceEntry {
  role: string;
  count: number;
  hours: number;
}

export interface DailyLog {
  id: string;
  projectId: string;
  date: string;
  weather: string;
  workforce: WorkforceEntry[];
  workPerformed: string[];
  delays: string[];
  visitors: string[];
  photoIds: string[];
  captureEventIds: string[];
}

export interface RuleAction {
  type: string;
  target: string;
  description: string;
}

export interface Rule {
  id: string;
  name: string;
  trigger: string;
  conditions: string[];
  actions: RuleAction[];
  controlLevel: ControlLevel;
  enabled: boolean;
  summary: string;
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  projectId: string;
  actor: string;
  action: string;
  why: string;
  ruleId?: string;
  controlLevel: ControlLevel;
  visibilityLevel: VisibilityLevel;
}

export interface RfiDraft {
  id: string;
  projectId: string;
  number: string;
  question: string;
  drawingRef: string;
  ballInCourt: string;
  dueDate: string;
}

export interface MessageThread {
  id: string;
  projectId: string;
  audience: "homeowner" | "internal";
  title: string;
  messages: {
    id: string;
    sender: string;
    sentAt: string;
    body: string;
    readBy: string[];
  }[];
}

export interface DemoState {
  currentPersona: Persona;
  selectedProjectId: string;
  projects: Project[];
  contacts: Contact[];
  photoAssets: PhotoAsset[];
  captureEvents: CaptureEvent[];
  notifications: Notification[];
  tasks: Task[];
  dailyLogs: DailyLog[];
  rules: Rule[];
  auditTrail: AuditEntry[];
  rfiDrafts: RfiDraft[];
  threads: MessageThread[];
  offlineMode: boolean;
}
