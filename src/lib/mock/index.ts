import type { Classification, Persona, PhotoAsset, Project } from "@/lib/domain";

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
