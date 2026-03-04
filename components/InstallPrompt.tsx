"use client";

import useDeviceType from "@/hooks/useDeviceType";
import { useLanguage } from "@/lib/LanguageContext";
import { t } from "@/lib/i18n";

function IOSShareIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="inline-block align-text-bottom mx-0.5"
    >
      <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" />
      <polyline points="16 6 12 2 8 6" />
      <line x1="12" y1="2" x2="12" y2="15" />
    </svg>
  );
}

export default function InstallPrompt() {
  const { isMobile, isIOS, isAndroid, isStandalone, installPrompt } =
    useDeviceType();
  const { lang } = useLanguage();

  // Mode D — Already installed
  if (isStandalone) return null;

  // Mode A — iOS mobile (not standalone)
  if (isMobile && isIOS) {
    const text = t(lang, "installCTAiOS");
    const parts = text.split("{icon}");
    return (
      <div className="card px-5 py-4 w-full">
        <p className="text-xs text-cream/60 font-mono leading-relaxed">
          <span className="mr-1">📲</span>
          {parts[0]}
          <IOSShareIcon />
          {parts[1]}
        </p>
      </div>
    );
  }

  // Mode B — Android mobile (not standalone)
  if (isMobile && isAndroid) {
    if (installPrompt) {
      return (
        <div className="card px-5 py-4 w-full">
          <div className="flex items-center justify-between">
            <p className="text-xs text-cream/60 font-mono">
              <span className="mr-1">📲</span>
              {t(lang, "installCTAAndroid")}
            </p>
            <button
              onClick={() => installPrompt.prompt()}
              className="ml-3 px-3 py-1 text-xs font-mono rounded-lg bg-surface-2 hover:bg-cream/10 text-cream/80 transition-colors whitespace-nowrap"
            >
              {t(lang, "installButton")}
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="card px-5 py-4 w-full">
        <p className="text-xs text-cream/60 font-mono">
          <span className="mr-1">📲</span>
          {t(lang, "installCTAAndroid")}
        </p>
      </div>
    );
  }

  // Mode C — Desktop
  if (!isMobile) {
    return (
      <div className="card px-5 py-4 w-full">
        <p className="text-xs text-cream/60 font-mono">
          <span className="mr-1">📱</span>
          {t(lang, "installCTADesktop")}
        </p>
      </div>
    );
  }

  return null;
}
