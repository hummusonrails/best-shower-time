export interface Alert {
  id: string;
  timestamp: number;
  cities: string[];
  threat: number;
  isDrill: boolean;
}

export interface ProcessedAlert {
  id: string;
  timestamp: number;
  date: string;
  time: string;
  cities: string[];
  threat: number;
}

export interface SafetyStats {
  timeSinceLastAlert: number; // minutes
  averageGap: number; // minutes
  alertCount24h: number;
  trend: "increasing" | "decreasing" | "stable";
  safetyScore: number; // 0-100
  lastAlertTime: string | null;
}

export type SafetyLevel = "safe" | "risky" | "dangerous";

export interface SafetyRecommendation {
  level: SafetyLevel;
  score: number;
  message: string;
  messageHe: string;
}

export type ActivityType = "shower" | "toilet";

export type Language = "en" | "he";
