"use client";

import { ReactNode } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

interface Props {
  children: ReactNode;
  direction?: "up" | "left" | "right" | "down";
  delay?: number;
  threshold?: number;
  className?: string;
}

const directionClasses = {
  up: "translate-y-8",
  down: "-translate-y-8",
  left: "translate-x-8",
  right: "-translate-x-8",
};

export default function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  threshold = 0.15,
  className = "",
}: Props) {
  const { ref, isVisible } = useScrollReveal({ threshold });

  return (
    <div
      ref={ref}
      className={`transition-all duration-800 ease-smooth ${
        isVisible
          ? "opacity-100 translate-x-0 translate-y-0"
          : `opacity-0 ${directionClasses[direction]}`
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
