import type { SyncState } from "@/lib/domain";

const tones: Record<SyncState, string> = {
  "Saved locally": "bg-[rgba(239,187,87,0.18)] text-[var(--amber-400)]",
  Uploading: "bg-[rgba(61,212,193,0.18)] text-[var(--teal-400)]",
  "Upload failed - retrying": "bg-[rgba(221,93,79,0.18)] text-[#ffb1a7]",
  "Verified on server": "bg-white/6 text-[var(--sand-100)]",
};

export function SyncStateBadge({ state }: { state: SyncState }) {
  return <span className={`rounded-full px-2 py-1 text-xs ${tones[state]}`}>{state}</span>;
}
