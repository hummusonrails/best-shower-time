import { ProcessedAlert, SafetyStats, SafetyLevel, SafetyRecommendation } from "./types";

export function computeStats(alerts: ProcessedAlert[]): SafetyStats {
  const now = Date.now();

  if (alerts.length === 0) {
    return {
      timeSinceLastAlert: Infinity,
      averageGap: Infinity,
      alertCount24h: 0,
      trend: "stable",
      safetyScore: 95,
      lastAlertTime: null,
    };
  }

  // Sort by timestamp descending (most recent first)
  const sorted = [...alerts].sort((a, b) => b.timestamp - a.timestamp);

  // Time since last alert (in minutes)
  const timeSinceLastAlert = (now - sorted[0].timestamp) / (1000 * 60);

  // Alerts in last 24 hours
  const twentyFourHoursAgo = now - 24 * 60 * 60 * 1000;
  const recent24h = sorted.filter((a) => a.timestamp > twentyFourHoursAgo);
  const alertCount24h = recent24h.length;

  // Average gap between alerts (last 6 hours)
  const sixHoursAgo = now - 6 * 60 * 60 * 1000;
  const recent6h = sorted.filter((a) => a.timestamp > sixHoursAgo);
  let averageGap = Infinity;
  if (recent6h.length > 1) {
    const gaps: number[] = [];
    for (let i = 0; i < recent6h.length - 1; i++) {
      gaps.push((recent6h[i].timestamp - recent6h[i + 1].timestamp) / (1000 * 60));
    }
    averageGap = gaps.reduce((sum, g) => sum + g, 0) / gaps.length;
  }

  // Trend: compare first half vs second half of recent alerts
  let trend: "increasing" | "decreasing" | "stable" = "stable";
  if (recent24h.length >= 4) {
    const mid = Math.floor(recent24h.length / 2);
    const recentHalf = recent24h.slice(0, mid);
    const olderHalf = recent24h.slice(mid);

    // Compare alert density (alerts per hour)
    const recentSpan = recentHalf.length > 1
      ? (recentHalf[0].timestamp - recentHalf[recentHalf.length - 1].timestamp) / (1000 * 60 * 60)
      : 1;
    const olderSpan = olderHalf.length > 1
      ? (olderHalf[0].timestamp - olderHalf[olderHalf.length - 1].timestamp) / (1000 * 60 * 60)
      : 1;

    const recentRate = recentHalf.length / Math.max(recentSpan, 0.5);
    const olderRate = olderHalf.length / Math.max(olderSpan, 0.5);

    if (recentRate > olderRate * 1.3) trend = "increasing";
    else if (recentRate < olderRate * 0.7) trend = "decreasing";
  }

  // Safety score calculation
  const safetyScore = calculateSafetyScore(
    timeSinceLastAlert,
    averageGap,
    trend,
    alertCount24h
  );

  const lastDate = new Date(sorted[0].timestamp);
  const lastAlertTime = lastDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return {
    timeSinceLastAlert,
    averageGap,
    alertCount24h,
    trend,
    safetyScore,
    lastAlertTime,
  };
}

function calculateSafetyScore(
  timeSinceLastAlert: number,
  averageGap: number,
  trend: "increasing" | "decreasing" | "stable",
  alertCount24h: number
): number {
  // Component 1: Time since last alert (40%)
  // 0 min = 0, 30 min = 50, 60+ min = 100
  const timeScore = Math.min(100, (timeSinceLastAlert / 60) * 100);

  // Component 2: Average gap (25%)
  // 0 min = 0, 30 min = 50, 60+ min = 100
  const gapScore = averageGap === Infinity ? 100 : Math.min(100, (averageGap / 60) * 100);

  // Component 3: Trend (20%)
  const trendScore = trend === "decreasing" ? 80 : trend === "stable" ? 50 : 20;

  // Component 4: Time of day / frequency (15%)
  // 0 alerts = 100, 5 = 75, 10 = 50, 20+ = 0
  const freqScore = Math.max(0, 100 - alertCount24h * 5);

  const weighted =
    timeScore * 0.4 + gapScore * 0.25 + trendScore * 0.2 + freqScore * 0.15;

  return Math.round(Math.max(0, Math.min(100, weighted)));
}

export function getRecommendation(
  stats: SafetyStats,
  activityDuration: number
): SafetyRecommendation {
  const { safetyScore, timeSinceLastAlert } = stats;

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

export function formatDuration(minutes: number): string {
  if (minutes === Infinity) return "N/A";
  if (minutes < 1) return "<1 min";
  if (minutes < 60) return `${Math.round(minutes)} min`;
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}
