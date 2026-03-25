import {
  type SafetyStats,
  type SafetyLevel,
  type SafetyRecommendation,
  type PreAlertStatus,
  calculateSafetyScore,
} from "best-time-ui";

export function getRecommendation(
  stats: SafetyStats,
  activityDuration: number,
  preAlertStatus?: PreAlertStatus
): SafetyRecommendation {
  // Recalculate safety score with pre-alert data when available
  const safetyScore = preAlertStatus
    ? calculateSafetyScore(
        stats.timeSinceLastAlert,
        stats.averageGap,
        stats.trend,
        stats.alertCount24h,
        preAlertStatus
      )
    : stats.safetyScore;

  const { timeSinceLastAlert } = stats;

  let level: SafetyLevel;

  if (safetyScore < 40 || timeSinceLastAlert < activityDuration) {
    level = "dangerous";
  } else if (
    safetyScore > 70 &&
    timeSinceLastAlert > activityDuration * 2
  ) {
    level = "safe";
  } else {
    level = "risky";
  }

  const messages: Record<SafetyLevel, { en: string; he: string }> = {
    safe: {
      en: "NOW IS A GOOD TIME",
      he: "עכשיו זה זמן טוב",
    },
    risky: {
      en: "NOW IS A RISKY TIME",
      he: "עכשיו זה זמן מסוכן",
    },
    dangerous: {
      en: "NOW IS A BAD TIME",
      he: "עכשיו זה זמן רע",
    },
  };

  return {
    level,
    score: safetyScore,
    message: messages[level].en,
    messageHe: messages[level].he,
  };
}
