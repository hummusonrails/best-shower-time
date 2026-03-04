"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { t } from "@/lib/i18n";
import { syncScheduleToSW } from "./ServiceWorkerRegistration";
import useDeviceType from "@/hooks/useDeviceType";
import InstallPrompt from "@/components/InstallPrompt";

interface ShowerScheduleProps {
  duration: number;
}

const STORAGE_KEY = "bst-shower-schedule";

export default function ShowerSchedule({ duration }: ShowerScheduleProps) {
  const { lang } = useLanguage();
  const { isMobile, isStandalone } = useDeviceType();
  const [enabled, setEnabled] = useState(false);
  const [time, setTime] = useState("07:00");
  const [permissionState, setPermissionState] = useState<
    "default" | "granted" | "denied" | "unsupported"
  >("default");
  const backupTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Check notification support + permission on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!("Notification" in window) || !("serviceWorker" in navigator)) {
      setPermissionState("unsupported");
      return;
    }

    setPermissionState(Notification.permission as "default" | "granted" | "denied");

    // Restore saved schedule
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const saved = JSON.parse(raw);
        if (saved.time) setTime(saved.time);
        if (saved.enabled && Notification.permission === "granted") {
          setEnabled(true);
        }
      } catch {
        // ignore
      }
    }
  }, []);

  // Save schedule + sync to SW whenever it changes
  useEffect(() => {
    if (typeof window === "undefined") return;

    const schedule = { enabled, time, duration };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(schedule));
    syncScheduleToSW();
  }, [enabled, time, duration]);

  // Client-side backup timer
  const setupBackupTimer = useCallback(() => {
    if (backupTimerRef.current) {
      clearTimeout(backupTimerRef.current);
      backupTimerRef.current = null;
    }

    if (!enabled || !time) return;

    const now = new Date();
    const [h, m] = time.split(":").map(Number);

    // Reminder fires 1 minute before scheduled time
    let reminderH = h;
    let reminderM = m - 1;
    if (reminderM < 0) {
      reminderM = 59;
      reminderH = (reminderH - 1 + 24) % 24;
    }

    const target = new Date();
    target.setHours(reminderH, reminderM, 0, 0);

    // If target is in the past, schedule for tomorrow
    if (target.getTime() <= now.getTime()) {
      target.setDate(target.getDate() + 1);
    }

    const ms = target.getTime() - now.getTime();
    // Only set timer if within 24 hours
    if (ms > 0 && ms < 24 * 60 * 60 * 1000) {
      backupTimerRef.current = setTimeout(async () => {
        try {
          const params = new URLSearchParams();
          params.set("region", localStorage.getItem("bst-region") || "all");
          const city = localStorage.getItem("bst-city");
          if (city) params.set("city", city);
          params.set("duration", String(duration));

          const res = await fetch(`/api/safety-check?${params.toString()}`);
          const data = await res.json();

          const levelEmoji: Record<string, string> = {
            safe: "\u2705",
            risky: "\u26A0\uFE0F",
            dangerous: "\u274C",
          };
          const emoji = levelEmoji[data.level] || "";

          if (Notification.permission === "granted") {
            new Notification("Best Shower Time", {
              body: `${emoji} ${data.message}\nScore: ${data.score}/100`,
              icon: "/icons/icon-192.png",
              tag: "shower-reminder",
            });
          }
        } catch {
          if (Notification.permission === "granted") {
            new Notification("Best Shower Time", {
              body: "Could not check safety status \u2014 open the app to see.",
              icon: "/icons/icon-192.png",
              tag: "shower-reminder",
            });
          }
        }
      }, ms);
    }
  }, [enabled, time, duration]);

  useEffect(() => {
    setupBackupTimer();
    return () => {
      if (backupTimerRef.current) clearTimeout(backupTimerRef.current);
    };
  }, [setupBackupTimer]);

  const handleToggle = async () => {
    if (enabled) {
      setEnabled(false);
      return;
    }

    if (permissionState === "unsupported") return;

    if (Notification.permission === "default") {
      const result = await Notification.requestPermission();
      setPermissionState(result as "granted" | "denied");
      if (result !== "granted") return;
    } else if (Notification.permission === "denied") {
      setPermissionState("denied");
      return;
    }

    setEnabled(true);
  };

  // Hide entirely on desktop
  if (!isMobile) return null;

  return (
    <>
      {isMobile && !isStandalone && <InstallPrompt />}
      <div className="bracket-frame px-4 py-4 w-full">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-serif text-lg md:text-xl text-cream/90">
            {t(lang, "showerReminder")}
          </h3>
          <button
            onClick={handleToggle}
            disabled={permissionState === "unsupported"}
            className={`relative w-11 h-6 rounded-full transition-colors duration-300 ${
              enabled ? "bg-safety" : "bg-cream/20"
            } ${permissionState === "unsupported" ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
            aria-label={t(lang, "showerReminder")}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-bg transition-transform duration-300 ${
                enabled ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        <p className="text-xs text-cream/40 font-mono mb-3">
          {t(lang, "reminderDescription")}
        </p>

        <div className="flex items-center gap-3">
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="time-input bg-cream/5 border border-cream/15 rounded px-3 py-1.5 text-cream font-mono text-sm outline-none focus:border-cream/30 transition-colors"
          />
          {enabled && (
            <span className="text-xs text-safety/70 font-mono">
              {lang === "he" ? "\u2705 \u05E4\u05E2\u05D9\u05DC" : "\u2705 Active"}
            </span>
          )}
        </div>

        {permissionState === "denied" && (
          <p className="text-xs text-danger/70 font-mono mt-2">
            {t(lang, "notificationsDenied")}
          </p>
        )}
        {permissionState === "unsupported" && (
          <p className="text-xs text-warning/70 font-mono mt-2">
            {t(lang, "notificationsUnsupported")}
          </p>
        )}
      </div>
    </>
  );
}
