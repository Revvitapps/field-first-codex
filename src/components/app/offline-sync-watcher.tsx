"use client";

import { useEffect } from "react";
import { useDemoStore } from "@/store/demo-store";

export function OfflineSyncWatcher() {
  const offlineMode = useDemoStore((state) => state.offlineMode);
  const captureEvents = useDemoStore((state) => state.captureEvents);
  const processOfflineQueue = useDemoStore((state) => state.processOfflineQueue);

  useEffect(() => {
    const hasQueuedWork = captureEvents.some(
      (event) => event.syncState === "Saved locally" || event.syncState === "Uploading",
    );

    if (offlineMode || !hasQueuedWork) {
      return;
    }

    const handle = window.setTimeout(() => {
      processOfflineQueue();
    }, 1200);

    return () => window.clearTimeout(handle);
  }, [captureEvents, offlineMode, processOfflineQueue]);

  return null;
}
