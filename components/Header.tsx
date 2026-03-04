"use client";

import { useLanguage } from "@/lib/LanguageContext";
import { t } from "@/lib/i18n";

export default function Header() {
  const { lang, setLang } = useLanguage();

  return (
    <header>
      <div className="flex items-center justify-between w-full py-6 px-4">
        <div>
          <h1 className="font-serif italic text-2xl md:text-3xl text-cream">
            {t(lang, "appName")}
          </h1>
          <p className="font-serif italic text-sm text-cream/50 mt-0.5">
            {t(lang, "appNameSub")}
          </p>
        </div>

        <div className="flex items-center gap-0 rounded-lg bg-surface-1 overflow-hidden">
          <button
            onClick={() => setLang("en")}
            className={`px-3 py-1.5 text-sm font-mono transition-all duration-500 ease-smooth ${
              lang === "en"
                ? "bg-surface-2 text-cream"
                : "text-cream/40 hover:text-cream/60"
            }`}
          >
            EN
          </button>
          <button
            onClick={() => setLang("he")}
            className={`px-3 py-1.5 text-sm font-mono transition-all duration-500 ease-smooth ${
              lang === "he"
                ? "bg-surface-2 text-cream"
                : "text-cream/40 hover:text-cream/60"
            }`}
          >
            עב
          </button>
        </div>
      </div>
      <div className="h-px bg-divider" />
    </header>
  );
}
