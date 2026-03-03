"use client";

import { useLanguage } from "@/lib/LanguageContext";
import { SafetyRecommendation } from "@/lib/types";

interface Props {
  recommendation: SafetyRecommendation | null;
}

const colorMap = {
  safe: "text-safety",
  risky: "text-warning",
  dangerous: "text-danger",
};

const glowMap = {
  safe: "shadow-[0_0_60px_rgba(74,222,128,0.15)]",
  risky: "shadow-[0_0_60px_rgba(251,191,36,0.15)]",
  dangerous: "shadow-[0_0_60px_rgba(239,68,68,0.15)]",
};

const bgMap = {
  safe: "bg-safety/5",
  risky: "bg-warning/5",
  dangerous: "bg-danger/5",
};

const strokeMap = {
  safe: "#4ADE80",
  risky: "#FBBF24",
  dangerous: "#EF4444",
};

export default function SafetyVerdict({ recommendation }: Props) {
  const { lang } = useLanguage();

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
      <div className={`relative w-40 h-40 ${glowMap[level]} rounded-full`}>
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
            {score}
          </span>
          <span className="font-mono text-xs text-cream/40 mt-1 uppercase tracking-widest">
            {lang === "he" ? "ציון" : "score"}
          </span>
        </div>
      </div>

      {/* Verdict text */}
      <div
        className={`bracket-frame px-8 py-5 ${bgMap[level]} transition-all duration-700 ease-smooth`}
      >
        <h2
          className={`font-serif italic text-2xl md:text-4xl text-center ${colorMap[level]} transition-colors duration-700 ease-smooth`}
        >
          {message}
        </h2>
      </div>
    </section>
  );
}
