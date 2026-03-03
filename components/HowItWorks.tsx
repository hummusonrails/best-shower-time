"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { t } from "@/lib/i18n";

export default function HowItWorks() {
  const { lang } = useLanguage();
  const [open, setOpen] = useState(false);

  return (
    <section className="w-full px-4">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 group w-full"
      >
        <span className="font-serif italic text-lg text-cream/50 group-hover:text-cream/70 transition-colors duration-500 ease-smooth">
          {t(lang, "howItWorks")}
        </span>
        <span
          className={`text-cream/30 transition-transform duration-500 ease-smooth ${
            open ? "rotate-90" : ""
          }`}
        >
          →
        </span>
      </button>

      <div
        className={`overflow-hidden transition-all duration-700 ease-smooth ${
          open ? "max-h-96 opacity-100 mt-3" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bracket-frame px-5 py-4">
          <p className="font-sans text-sm text-cream/60 leading-relaxed mb-4">
            {t(lang, "howItWorksContent")}
          </p>
          <p className="font-mono text-xs text-warning/70 leading-relaxed">
            ⚠ {t(lang, "disclaimer")}
          </p>
        </div>
      </div>
    </section>
  );
}
