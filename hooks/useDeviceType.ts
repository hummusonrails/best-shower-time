"use client";

import { useState, useEffect } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

interface DeviceType {
  isMobile: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  isStandalone: boolean;
  installPrompt: BeforeInstallPromptEvent | null;
}

const SSR_DEFAULTS: DeviceType = {
  isMobile: false,
  isIOS: false,
  isAndroid: false,
  isStandalone: false,
  installPrompt: null,
};

export default function useDeviceType(): DeviceType {
  const [device, setDevice] = useState<DeviceType>(SSR_DEFAULTS);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const ua = navigator.userAgent;
    const isIOS = /iPhone|iPad|iPod/i.test(ua);
    const isAndroid = /Android/i.test(ua);
    const isMobile = isIOS || isAndroid;
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as unknown as { standalone?: boolean }).standalone === true;

    setDevice({ isMobile, isIOS, isAndroid, isStandalone, installPrompt: null });

    const handler = (e: Event) => {
      e.preventDefault();
      setDevice((prev) => ({
        ...prev,
        installPrompt: e as BeforeInstallPromptEvent,
      }));
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  return device;
}
