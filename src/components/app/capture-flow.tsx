"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Camera, Check, LocateFixed, MapPinned, Search, Sparkles } from "lucide-react";
import { useDemoStore } from "@/store/demo-store";
import { classifyPhotoSelection, getAvailableDemoSets, getContextDefaults, suggestProjectMatch } from "@/lib/mock";
import type { Classification, Project } from "@/lib/domain";

type Step = "select" | "gps" | "classifying" | "context" | "done";

interface UploadStub {
  id: string;
  name: string;
}

function classifyBadgeTone(classification: Classification) {
  if (classification === "safety hazard") return "bg-[rgba(221,93,79,0.2)] text-[#ffb1a7]";
  if (classification === "design conflict") return "bg-[rgba(61,212,193,0.18)] text-[var(--teal-400)]";
  return "bg-white/6 text-[var(--sand-50)]";
}

function projectName(project?: Project) {
  return project?.name ?? "Unassigned project";
}

export function CaptureFlow() {
  const projects = useDemoStore((state) => state.projects);
  const photoAssets = useDemoStore((state) => state.photoAssets);
  const selectProject = useDemoStore((state) => state.selectProject);
  const addTemporaryProject = useDemoStore((state) => state.addTemporaryProject);

  const demoSets = useMemo(() => getAvailableDemoSets(photoAssets), [photoAssets]);
  const [step, setStep] = useState<Step>("select");
  const [selectedDemoSetId, setSelectedDemoSetId] = useState<string>(demoSets[0]?.id ?? "");
  const [selectedPhotoIds, setSelectedPhotoIds] = useState<string[]>(demoSets[0]?.photoIds ?? []);
  const [uploadedPhotos, setUploadedPhotos] = useState<UploadStub[]>([]);
  const [chosenProjectId, setChosenProjectId] = useState<string>(demoSets[0]?.suggestedProjectId ?? projects[0]?.id ?? "");
  const [classification, setClassification] = useState<Classification | null>(null);
  const [showProjectPicker, setShowProjectPicker] = useState(false);
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [address, setAddress] = useState("");
  const [duplicateMessage, setDuplicateMessage] = useState("");
  const [contextAnswers, setContextAnswers] = useState({
    area: demoSets[0]?.area ?? "",
    progressOrProblem: "",
    workStop: "",
    costImpact: "",
    homeownerVisibility: "",
    responsibleParty: "",
  });

  const selectedSet = demoSets.find((set) => set.id === selectedDemoSetId) ?? demoSets[0];
  const projectMatch = suggestProjectMatch(chosenProjectId || selectedSet?.suggestedProjectId || "", projects);
  const matchedProject = projects.find((project) => project.id === projectMatch.projectId);
  const chosenProject = projects.find((project) => project.id === chosenProjectId) ?? matchedProject;

  useEffect(() => {
    if (step !== "classifying") {
      return;
    }

    const timer = window.setTimeout(() => {
      const nextClassification = classifyPhotoSelection(selectedPhotoIds, photoAssets);
      setClassification(nextClassification);
      const defaults = getContextDefaults(nextClassification);
      setContextAnswers((current) => ({
        ...current,
        area: selectedSet?.area ?? current.area,
        ...defaults,
      }));
      setStep("context");
    }, 1500);

    return () => window.clearTimeout(timer);
  }, [photoAssets, selectedPhotoIds, selectedSet, step]);

  function handleDemoSet(id: string) {
    const nextSet = demoSets.find((set) => set.id === id);
    if (!nextSet) return;
    setSelectedDemoSetId(id);
    setSelectedPhotoIds(nextSet.photoIds);
    setUploadedPhotos([]);
    setChosenProjectId(nextSet.suggestedProjectId);
    setContextAnswers((current) => ({
      ...current,
      area: nextSet.area,
    }));
  }

  function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []).slice(0, 5);
    setUploadedPhotos(
      files.map((file, index) => ({
        id: `upload-${index + 1}`,
        name: file.name,
      })),
    );
    setSelectedPhotoIds([]);
  }

  function continueToGps() {
    if (selectedPhotoIds.length === 0 && uploadedPhotos.length === 0) return;
    setStep("gps");
  }

  function confirmProject(projectId: string) {
    setChosenProjectId(projectId);
    selectProject(projectId);
    setStep("classifying");
    setShowProjectPicker(false);
    setShowNewAddress(false);
  }

  function saveNewAddress() {
    const duplicate = projects.find((project) =>
      project.address.toLowerCase().includes(address.trim().toLowerCase()) ||
      address.trim().toLowerCase().includes(project.address.toLowerCase()),
    );

    if (duplicate) {
      setDuplicateMessage(`Duplicate found: ${duplicate.name}`);
      return;
    }

    const tempProject = addTemporaryProject(address);
    setDuplicateMessage("");
    confirmProject(tempProject.id);
  }

  return (
    <section className="space-y-4">
      <div className="field-card rounded-[28px] p-5">
        <p className="text-kicker text-xs text-[var(--amber-400)]">Capture</p>
        <div className="mt-3 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold">Five-photo workflow</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--sand-200)]">
              Up to five photos, mock GPS recognition, deterministic classification, and unresolved context capture in under a minute.
            </p>
          </div>
          <div className="rounded-full bg-white/6 px-3 py-2 text-sm capitalize">{step}</div>
        </div>
      </div>

      {step === "select" ? (
        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="field-card rounded-[28px] p-5">
            <div className="mb-4 flex items-center gap-2">
              <Camera className="h-5 w-5 text-[var(--amber-400)]" />
              <h3 className="text-lg font-semibold">1. Select up to 5 photos</h3>
            </div>
            <div className="space-y-3">
              {demoSets.map((set) => (
                <button
                  key={set.id}
                  type="button"
                  onClick={() => handleDemoSet(set.id)}
                  className={`block w-full rounded-[24px] border p-4 text-left transition ${
                    selectedDemoSetId === set.id
                      ? "border-[var(--amber-400)] bg-[rgba(239,187,87,0.08)]"
                      : "border-white/8 bg-white/3 hover:border-white/20"
                  }`}
                >
                  <div className="font-semibold">{set.title}</div>
                  <div className="mt-1 text-sm text-[var(--sand-200)]">{set.description}</div>
                  <div className="mt-3 flex gap-2">
                    {set.photos.map((photo) => (
                      <Image
                        key={photo.id}
                        src={photo.src}
                        alt={photo.label}
                        width={88}
                        height={66}
                        className="h-16 w-20 rounded-xl border border-white/10 object-cover"
                      />
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="field-card rounded-[28px] p-5">
              <div className="text-sm font-semibold">Take or upload</div>
              <p className="mt-2 text-sm text-[var(--sand-200)]">
                Demo uses deterministic bundled photo sets. File uploads fall back to single-photo classification.
              </p>
              <label className="mt-4 flex cursor-pointer items-center justify-center rounded-2xl border border-dashed border-white/14 bg-white/3 px-4 py-6 text-center">
                <input type="file" accept="image/*" capture="environment" multiple className="hidden" onChange={handleFileUpload} />
                <span className="text-sm text-[var(--sand-100)]">Tap to upload or capture from camera</span>
              </label>
              {uploadedPhotos.length > 0 ? (
                <div className="mt-4 space-y-2">
                  {uploadedPhotos.map((photo) => (
                    <div key={photo.id} className="rounded-xl border border-white/8 bg-black/10 px-3 py-2 text-sm">
                      {photo.name}
                    </div>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="field-card rounded-[28px] p-5">
              <div className="text-sm font-semibold">Current selection</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {(selectedPhotoIds.length > 0
                  ? selectedPhotoIds.map((photoId) => photoAssets.find((photo) => photo.id === photoId)?.label ?? photoId)
                  : uploadedPhotos.map((photo) => photo.name)
                ).map((label) => (
                  <span key={label} className="rounded-full bg-white/6 px-3 py-2 text-xs">
                    {label}
                  </span>
                ))}
              </div>
              <button
                type="button"
                onClick={continueToGps}
                className="mt-5 touch-target w-full rounded-2xl bg-[var(--amber-400)] px-4 py-3 text-sm font-semibold text-[var(--ink-950)] transition hover:brightness-95"
              >
                Continue to location check
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {step === "gps" ? (
        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="field-card rounded-[28px] p-5">
            <div className="mb-4 flex items-center gap-2">
              <LocateFixed className="h-5 w-5 text-[var(--teal-400)]" />
              <h3 className="text-lg font-semibold">2. Mock GPS confidence check</h3>
            </div>
            <div className="rounded-[24px] border border-white/8 bg-black/10 p-4">
              <div className="text-kicker text-[11px] text-[var(--sand-200)]">Confidence</div>
              <div className="mt-2 text-4xl font-semibold">{projectMatch.confidence}%</div>
              <div className="mt-2 text-lg font-semibold">Are you at {projectName(matchedProject)}?</div>
              <p className="mt-2 text-sm text-[var(--sand-200)]">{matchedProject?.address}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {projectMatch.signals.map((signal) => (
                  <span key={signal} className="rounded-full bg-white/6 px-3 py-2 text-xs">
                    {signal}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <button type="button" onClick={() => confirmProject(projectMatch.projectId)} className="touch-target rounded-2xl bg-[var(--teal-500)] px-4 py-3 text-sm font-semibold text-[var(--ink-950)]">
                Yes, use this project
              </button>
              <button type="button" onClick={() => setShowProjectPicker(true)} className="touch-target rounded-2xl border border-white/12 px-4 py-3 text-sm">
                Choose another nearby project
              </button>
              <button type="button" onClick={() => setShowProjectPicker(true)} className="touch-target rounded-2xl border border-white/12 px-4 py-3 text-sm">
                Search all projects
              </button>
              <button type="button" onClick={() => setShowNewAddress(true)} className="touch-target rounded-2xl border border-white/12 px-4 py-3 text-sm">
                Add a new address
              </button>
            </div>
            <button type="button" onClick={() => setShowProjectPicker(true)} className="mt-3 text-sm text-[var(--sand-200)] underline-offset-4 hover:underline">
              Not project-related
            </button>
          </div>

          <div className="space-y-4">
            {showProjectPicker ? (
              <div className="field-card rounded-[28px] p-5">
                <div className="mb-4 flex items-center gap-2">
                  <Search className="h-5 w-5 text-[var(--teal-400)]" />
                  <h3 className="text-lg font-semibold">Choose project</h3>
                </div>
                <div className="space-y-3">
                  {projects.map((project) => (
                    <button
                      key={project.id}
                      type="button"
                      onClick={() => confirmProject(project.id)}
                      className="block w-full rounded-2xl border border-white/8 bg-white/3 p-4 text-left"
                    >
                      <div className="font-semibold">{project.name}</div>
                      <div className="mt-1 text-sm text-[var(--sand-200)]">{project.address}</div>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {showNewAddress ? (
              <div className="field-card rounded-[28px] p-5">
                <div className="mb-4 flex items-center gap-2">
                  <MapPinned className="h-5 w-5 text-[var(--amber-400)]" />
                  <h3 className="text-lg font-semibold">Temporary project creation</h3>
                </div>
                <input
                  value={address}
                  onChange={(event) => setAddress(event.target.value)}
                  placeholder="Enter jobsite address"
                  className="w-full rounded-2xl border border-white/10 bg-black/10 px-4 py-3 outline-none"
                />
                <div className="mt-3 rounded-2xl border border-dashed border-white/12 px-4 py-5 text-sm text-[var(--sand-200)]">
                  Map placeholder: pending office geocode review
                </div>
                {duplicateMessage ? <div className="mt-3 text-sm text-[#ffb1a7]">{duplicateMessage}</div> : null}
                <button type="button" onClick={saveNewAddress} className="mt-4 touch-target w-full rounded-2xl bg-[var(--amber-400)] px-4 py-3 text-sm font-semibold text-[var(--ink-950)]">
                  Save pending address
                </button>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      {step === "classifying" ? (
        <div className="field-card rounded-[28px] p-8 text-center">
          <Sparkles className="mx-auto h-12 w-12 animate-pulse text-[var(--teal-400)]" />
          <h3 className="mt-4 text-2xl font-semibold">3. Analyzing photos...</h3>
          <p className="mt-2 text-sm text-[var(--sand-200)]">
            Mock visual classification is deterministic for each demo set so the walkthrough is repeatable live.
          </p>
        </div>
      ) : null}

      {step === "context" ? (
        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="field-card rounded-[28px] p-5">
            <div className="mb-4 flex items-center gap-3">
              <h3 className="text-lg font-semibold">4. Unresolved context questions</h3>
              {classification ? (
                <span className={`rounded-full px-2 py-1 text-xs capitalize ${classifyBadgeTone(classification)}`}>
                  {classification}
                </span>
              ) : null}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="space-y-2 text-sm">
                <span className="text-[var(--sand-200)]">Area of home / site</span>
                <input
                  value={contextAnswers.area}
                  onChange={(event) => setContextAnswers((current) => ({ ...current, area: event.target.value }))}
                  className="w-full rounded-2xl border border-white/10 bg-black/10 px-4 py-3 outline-none"
                />
              </label>
              <label className="space-y-2 text-sm">
                <span className="text-[var(--sand-200)]">Progress vs. problem</span>
                <input
                  value={contextAnswers.progressOrProblem}
                  onChange={(event) => setContextAnswers((current) => ({ ...current, progressOrProblem: event.target.value }))}
                  className="w-full rounded-2xl border border-white/10 bg-black/10 px-4 py-3 outline-none"
                />
              </label>
              <label className="space-y-2 text-sm">
                <span className="text-[var(--sand-200)]">Work stop?</span>
                <input
                  value={contextAnswers.workStop}
                  onChange={(event) => setContextAnswers((current) => ({ ...current, workStop: event.target.value }))}
                  className="w-full rounded-2xl border border-white/10 bg-black/10 px-4 py-3 outline-none"
                />
              </label>
              <label className="space-y-2 text-sm">
                <span className="text-[var(--sand-200)]">Cost impact?</span>
                <input
                  value={contextAnswers.costImpact}
                  onChange={(event) => setContextAnswers((current) => ({ ...current, costImpact: event.target.value }))}
                  className="w-full rounded-2xl border border-white/10 bg-black/10 px-4 py-3 outline-none"
                />
              </label>
              <label className="space-y-2 text-sm">
                <span className="text-[var(--sand-200)]">Homeowner visibility?</span>
                <input
                  value={contextAnswers.homeownerVisibility}
                  onChange={(event) => setContextAnswers((current) => ({ ...current, homeownerVisibility: event.target.value }))}
                  className="w-full rounded-2xl border border-white/10 bg-black/10 px-4 py-3 outline-none"
                />
              </label>
              <label className="space-y-2 text-sm">
                <span className="text-[var(--sand-200)]">Responsible party</span>
                <input
                  value={contextAnswers.responsibleParty}
                  onChange={(event) => setContextAnswers((current) => ({ ...current, responsibleParty: event.target.value }))}
                  className="w-full rounded-2xl border border-white/10 bg-black/10 px-4 py-3 outline-none"
                />
              </label>
            </div>
            <button type="button" onClick={() => setStep("done")} className="mt-5 touch-target w-full rounded-2xl bg-[var(--teal-500)] px-4 py-3 text-sm font-semibold text-[var(--ink-950)]">
              Preview next-step actions
            </button>
          </div>

          <div className="field-card rounded-[28px] p-5">
            <div className="text-sm font-semibold">Capture snapshot</div>
            <div className="mt-3 space-y-3">
              <div className="rounded-2xl border border-white/8 bg-white/3 p-4">
                <div className="text-kicker text-[11px] text-[var(--sand-200)]">Project</div>
                <div className="mt-2 text-base font-semibold">{projectName(chosenProject)}</div>
              </div>
              <div className="rounded-2xl border border-white/8 bg-white/3 p-4">
                <div className="text-kicker text-[11px] text-[var(--sand-200)]">Selected photos</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedPhotoIds.map((photoId) => (
                    <span key={photoId} className="rounded-full bg-white/6 px-3 py-2 text-xs">
                      {photoAssets.find((photo) => photo.id === photoId)?.label ?? photoId}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {step === "done" ? (
        <div className="field-card rounded-[28px] p-5">
          <div className="flex items-center gap-3">
            <Check className="h-6 w-6 text-[var(--teal-400)]" />
            <div>
              <h3 className="text-xl font-semibold">Capture context complete</h3>
              <p className="mt-1 text-sm text-[var(--sand-200)]">
                Phase 2 ends with captured context. Phase 3 turns this into an action plan, routing, escalation, and a formal audit trail.
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
