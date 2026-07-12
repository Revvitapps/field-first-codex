"use client";

import { useEffect } from "react";
import { useDemoStore } from "@/store/demo-store";

export function EscalationWatcher() {
  const notifications = useDemoStore((state) => state.notifications);
  const escalateNotification = useDemoStore((state) => state.escalateNotification);

  useEffect(() => {
    const pendingTimers = notifications
      .filter(
        (notification) =>
          notification.id.startsWith("live-note-") &&
          notification.ackRequired &&
          notification.status === "pending" &&
          notification.escalatesAt,
      )
      .map((notification) => {
        const timeout = new Date(notification.escalatesAt ?? "").getTime() - Date.now();
        const handle = window.setTimeout(
          () => escalateNotification(notification.id),
          Math.max(timeout, 0),
        );

        return handle;
      });

    return () => {
      pendingTimers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [escalateNotification, notifications]);

  return null;
}
