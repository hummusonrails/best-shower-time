"use client";

import { useLanguage } from "@/lib/LanguageContext";
import { t } from "@/lib/i18n";

interface Props {
  lastUpdated: Date | null;
}

export default function Footer({ lastUpdated }: Props) {
  const { lang } = useLanguage();

  return (
    <footer className="w-full py-8 px-4 mt-8 border-t border-divider">
      <div className="flex flex-col items-center gap-2 text-center">
        <p className="font-mono text-xs text-cream/30">
          {t(lang, "dataSource")}
        </p>
        {lastUpdated && (
          <p className="font-mono text-xs text-cream/20">
            {t(lang, "lastUpdated")}:{" "}
            {lastUpdated.toLocaleTimeString(lang === "he" ? "he-IL" : "en-US", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </p>
        )}
        <p className="font-mono text-xs text-cream/15">
          {t(lang, "autoRefresh")}
        </p>
        <p className="font-mono text-xs text-cream/30 mt-2">
          {lang === "he" ? "נבנה ע״י" : "Made by"}{" "}
          <a
            href="https://www.hummusonrails.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-cream/50 hover:text-cream transition-colors duration-300 underline underline-offset-2"
          >
            Ben Greenberg
          </a>
        </p>
        <a
          href="https://buymeacoffee.com/bengreenberg"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-lg bg-surface-1 hover:bg-surface-2 font-mono text-xs text-cream/50 hover:text-cream transition-all duration-500 ease-smooth"
        >
          <span>☕</span>
          <span>{lang === "he" ? "קנו לי קפה" : "Buy me a coffee"}</span>
        </a>
      </div>
    </footer>
  );
}
