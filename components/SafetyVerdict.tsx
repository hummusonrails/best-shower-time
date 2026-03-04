"use client";

import { useMemo, useState, useEffect } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { SafetyRecommendation } from "@/lib/types";
import { useCountUp } from "@/hooks/useCountUp";

interface Props {
  recommendation: SafetyRecommendation | null;
}

const colorMap = {
  safe: "text-safety",
  risky: "text-warning",
  dangerous: "text-danger",
};

const strokeMap = {
  safe: "#4ADE80",
  risky: "#FBBF24",
  dangerous: "#EF4444",
};

function CharacterReveal({ text, level }: { text: string; level: string }) {
  const characters = useMemo(() => text.split(""), [text]);

  return (
    <span aria-label={text}>
      {characters.map((char, i) => (
        <span
          key={`${text}-${i}`}
          className={`inline-block transition-all duration-500 ease-smooth font-serif italic text-2xl md:text-4xl ${colorMap[level as keyof typeof colorMap]}`}
          style={{
            animationName: "char-reveal",
            animationDuration: "500ms",
            animationTimingFunction: "cubic-bezier(0.75, 0, 0.25, 1)",
            animationDelay: `${i * 30}ms`,
            animationFillMode: "both",
          }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </span>
  );
}

export default function SafetyVerdict({ recommendation }: Props) {
  const { lang } = useLanguage();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const hasScore = mounted && recommendation !== null;
  const displayScore = useCountUp(recommendation?.score ?? 0, hasScore);

  if (!recommendation) {
    return (
      <section className="flex flex-col items-center py-12 gap-6">
        <div className="w-36 h-36 rounded-full border-2 border-cream/10 flex items-center justify-center animate-pulse">
          <span className="font-mono text-cream/30 text-lg">...</span>
        </div>
      </section>
    );
  }

  const { level, score } = recommendation;
  const message = lang === "he" ? recommendation.messageHe : recommendation.message;

  // SVG gauge
  const radius = 62;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;

  return (
    <section className="flex flex-col items-center py-8 md:py-12 gap-6">
      {/* Score gauge */}
      <div
        className="relative w-40 h-40 rounded-full gauge-entrance"
      >
        <svg viewBox="0 0 140 140" className="w-full h-full -rotate-90">
          <circle
            cx="70"
            cy="70"
            r={radius}
            fill="none"
            stroke="rgba(255,238,200,0.08)"
            strokeWidth="4"
          />
          <circle
            cx="70"
            cy="70"
            r={radius}
            fill="none"
            stroke={strokeMap[level]}
            strokeWidth="4"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-smooth"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`font-mono text-4xl font-bold ${colorMap[level]}`}>
            {displayScore}
          </span>
          <span className="font-mono text-xs text-cream/40 mt-1 uppercase tracking-widest">
            {lang === "he" ? "ציון" : "score"}
          </span>
        </div>
      </div>

      {/* Verdict text with character reveal */}
      <div
        className="bg-surface-1 rounded-xl px-8 py-5 transition-all duration-700 ease-smooth"
      >
        <h2 className="text-center" key={message}>
          <CharacterReveal text={message} level={level} />
        </h2>
      </div>
    </section>
  );
}
