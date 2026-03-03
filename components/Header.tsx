"use client";

import { useLanguage } from "@/lib/LanguageContext";
import { t } from "@/lib/i18n";

export default function Header() {
  const { lang, setLang } = useLanguage();

  return (
    <header className="flex items-center justify-between w-full py-6 px-4">
      <div>
        <h1 className="font-serif italic text-2xl md:text-3xl text-cream">
          {t(lang, "appName")}
        </h1>
        <p className="font-serif italic text-sm text-cream/50 mt-0.5">
          {t(lang, "appNameSub")}
        </p>
      </div>

      <div className="flex items-center gap-0 border border-cream/20 rounded-sm overflow-hidden">
        <button
          onClick={() => setLang("en")}
          className={`px-3 py-1.5 text-sm font-mono transition-all duration-500 ease-smooth ${
            lang === "en"
              ? "bg-cream/10 text-cream"
              : "text-cream/40 hover:text-cream/60"
          }`}
        >
          EN
        </button>
        <div className="w-px h-6 bg-cream/20" />
        <button
          onClick={() => setLang("he")}
          className={`px-3 py-1.5 text-sm font-mono transition-all duration-500 ease-smooth ${
            lang === "he"
              ? "bg-cream/10 text-cream"
              : "text-cream/40 hover:text-cream/60"
          }`}
        >
          עב
        </button>
      </div>
    </header>
  );
}
