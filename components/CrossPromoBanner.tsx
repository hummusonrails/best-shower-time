"use client";

import { useLanguage } from "@/lib/LanguageContext";

export default function CrossPromoBanner() {
  const { lang } = useLanguage();

  return (
    <a
      href="https://bestwalkingtime.com"
      target="_blank"
      rel="noopener noreferrer"
      className="group block w-full px-4 py-2 bg-surface-1/50 hover:bg-surface-1 border-b border-divider transition-all duration-500 ease-smooth"
    >
      <p className="text-center font-mono text-[11px] text-cream/25 group-hover:text-cream/45 transition-colors duration-500 ease-smooth">
        {lang === "he" ? (
          <>
            {"גם צריכים לצאת? בדקו את "}
            <span className="font-serif italic text-cream/35 group-hover:text-cream/60 transition-colors duration-500">
              Best Walk Time
            </span>
            {" \u2192"}
          </>
        ) : (
          <>
            {"Need to go outside too? Check out "}
            <span className="font-serif italic text-cream/35 group-hover:text-cream/60 transition-colors duration-500">
              Best Walk Time
            </span>
            {" \u2192"}
          </>
        )}
      </p>
    </a>
  );
}
