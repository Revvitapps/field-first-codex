"use client";

import Image from "next/image";
import { CheckCircle2, Link as LinkIcon, Mail, MessageSquare } from "lucide-react";
import { useDemoStore } from "@/store/demo-store";
import { formatDate } from "@/lib/selectors";
import { SyncStateBadge } from "@/components/app/sync-state-badge";

export function HomeownerPortalView() {
  const projects = useDemoStore((state) => state.projects);
  const notifications = useDemoStore((state) => state.notifications);
  const captureEvents = useDemoStore((state) => state.captureEvents);
  const threads = useDemoStore((state) => state.threads);
  const photoAssets = useDemoStore((state) => state.photoAssets);
  const portalMagicLinkActive = useDemoStore((state) => state.portalMagicLinkActive);
  const changeOrderApproved = useDemoStore((state) => state.changeOrderApproved);
  const activatePortalMagicLink = useDemoStore((state) => state.activatePortalMagicLink);
  const approveHomeownerChangeOrder = useDemoStore((state) => state.approveHomeownerChangeOrder);

  const project = projects.find((entry) => entry.id === "harbor-view");
  const homeownerFeed = notifications.filter(
    (notification) => notification.recipientRoles.includes("Homeowner") && notification.visibilityLevel === 3,
  );
  const galleryItems = captureEvents.filter((event) => event.projectId === "harbor-view" && event.visibilityLevel === 3);
  const homeownerThread = threads.find((thread) => thread.audience === "homeowner" && thread.projectId === "harbor-view");

  if (!portalMagicLinkActive) {
    return (
      <div className="page-shell pb-28">
        <div className="field-card rounded-[32px] p-6">
          <p className="text-kicker text-xs text-[var(--teal-400)]">Homeowner portal</p>
          <h1 className="mt-3 text-3xl font-semibold">Magic link simulation</h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--sand-200)]">
            The portal is reached without a visible password flow. This simulates the curated homeowner entry point from an emailed magic link.
          </p>
          <div className="mt-6 rounded-[28px] border border-white/8 bg-white/3 p-5">
            <div className="flex items-start gap-4">
              <Mail className="mt-1 h-5 w-5 text-[var(--teal-400)]" />
              <div>
                <div className="font-semibold">To: Lena Henderson</div>
                <div className="mt-1 text-sm text-[var(--sand-200)]">Your Harbor View weekly update is ready.</div>
                <button
                  type="button"
                  onClick={activatePortalMagicLink}
                  className="mt-4 rounded-2xl bg-[var(--teal-500)] px-4 py-3 text-sm font-semibold text-[var(--ink-950)]"
                >
                  <span className="inline-flex items-center gap-2">
                    <LinkIcon className="h-4 w-4" />
                    Open magic link
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell pb-28">
      <section className="space-y-4">
        <div className="field-card rounded-[32px] p-6">
          <p className="text-kicker text-xs text-[var(--teal-400)]">Homeowner portal</p>
          <div className="mt-3 flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold">{project?.name}</h1>
              <p className="mt-2 text-sm leading-6 text-[var(--sand-200)]">
                Curated-only visibility for milestones, homeowner-safe notes, approvals, and read receipts.
              </p>
            </div>
            <div className="rounded-full bg-white/6 px-3 py-2 text-sm">Magic link active</div>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
          <div className="space-y-4">
            <div className="field-card rounded-[28px] p-5">
              <h2 className="text-lg font-semibold">Curated feed</h2>
              <div className="mt-4 space-y-3">
                {homeownerFeed.map((note) => (
                  <div key={note.id} className="rounded-2xl border border-white/8 bg-white/3 p-4">
                    <div className="font-semibold">{note.title}</div>
                    <div className="mt-2 text-sm leading-6 text-[var(--sand-200)]">{note.body}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="field-card rounded-[28px] p-5">
              <h2 className="text-lg font-semibold">Milestone schedule</h2>
              <div className="mt-4 space-y-3">
                {project?.milestones.map((milestone) => (
                  <div key={milestone.id} className="rounded-2xl border border-white/8 bg-white/3 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="font-semibold">{milestone.label}</div>
                      <span className="rounded-full bg-white/6 px-2 py-1 text-xs capitalize">{milestone.status}</span>
                    </div>
                    <div className="mt-2 text-sm text-[var(--sand-200)]">{formatDate(milestone.date)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="field-card rounded-[28px] p-5">
              <h2 className="text-lg font-semibold">Curated photo gallery</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {galleryItems.map((item) => {
                  const photo = photoAssets.find((asset) => asset.id === item.photoIds[0]);
                  if (!photo) return null;
                  return (
                    <div key={item.id} className="rounded-2xl border border-white/8 bg-white/3 p-3">
                      <Image
                        src={photo.src}
                        alt={photo.label}
                        width={320}
                        height={220}
                        className="h-40 w-full rounded-2xl object-cover"
                      />
                      <div className="mt-3 flex items-center justify-between gap-3">
                        <div className="text-sm text-[var(--sand-200)]">{item.summary}</div>
                        <SyncStateBadge state={item.syncState} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="field-card rounded-[28px] p-5">
              <h2 className="text-lg font-semibold">Change order CO-12</h2>
              <p className="mt-2 text-sm leading-6 text-[var(--sand-200)]">
                Approving this change will increase your contract by $4,850 and extend countertop template coordination by one business day.
              </p>
              <button
                type="button"
                onClick={approveHomeownerChangeOrder}
                disabled={changeOrderApproved}
                className="mt-4 rounded-2xl bg-[var(--amber-400)] px-4 py-3 text-sm font-semibold text-[var(--ink-950)] disabled:opacity-50"
              >
                {changeOrderApproved ? "Approved" : "Approve change order"}
              </button>
              {changeOrderApproved ? (
                <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-[rgba(61,212,193,0.18)] px-3 py-2 text-sm text-[var(--teal-400)]">
                  <CheckCircle2 className="h-4 w-4" />
                  Approval recorded in audit trail
                </div>
              ) : null}
            </div>

            <div className="field-card rounded-[28px] p-5">
              <div className="mb-4 flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-[var(--teal-400)]" />
                <h2 className="text-lg font-semibold">Message thread</h2>
              </div>
              <div className="space-y-3">
                {homeownerThread?.messages.map((message) => (
                  <div key={message.id} className="rounded-2xl border border-white/8 bg-white/3 p-4">
                    <div className="font-semibold">{message.sender}</div>
                    <div className="mt-2 text-sm text-[var(--sand-200)]">{message.body}</div>
                    <div className="mt-3 text-xs text-[var(--sand-200)]">
                      Read by: {message.readBy.join(", ")}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
