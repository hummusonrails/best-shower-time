"use client";

import { useEffect } from "react";

export function syncScheduleToSW() {
  if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;

  const raw = localStorage.getItem("bst-shower-schedule");
  if (!raw) return;

  try {
    const schedule = JSON.parse(raw);
    // Attach current location preferences
    schedule.region = localStorage.getItem("bst-region") || "all";
    schedule.city = localStorage.getItem("bst-city") || null;

    navigator.serviceWorker.ready.then((registration) => {
      registration.active?.postMessage({
        type: "SYNC_SCHEDULE",
        schedule,
      });
    });
  } catch {
    // Invalid JSON in localStorage — ignore
  }
}

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then(() => {
          // Sync any existing schedule on load
          syncScheduleToSW();
        })
        .catch((err) => {
          console.error("SW registration failed:", err);
        });
    }
  }, []);

  return null;
}
