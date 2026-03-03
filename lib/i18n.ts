import { Language } from "./types";

const translations = {
  en: {
    appName: "Best Shower Time",
    appNameSub: "הזמן הטוב למקלחת",
    shower: "Shower",
    toilet: "Toilet",
    minutes: "min",
    timeSinceLastAlert: "Time Since Last Alert",
    averageGap: "Average Gap (6h)",
    alertCount: "Alerts (24h)",
    trendLabel: "Trend",
    increasing: "Increasing",
    decreasing: "Decreasing",
    stable: "Stable",
    safetyScore: "Safety Score",
    timeline: "24-Hour Alert Timeline",
    howItWorks: "How It Works",
    howItWorksContent:
      "This app analyzes real-time rocket alert data from Pikud HaOref to estimate the safest times for activities where you can't easily reach a safe room. The safety score is based on time since the last alert, average gaps between alerts, frequency trends, and time-of-day patterns.",
    disclaimer:
      "This is not a substitute for Pikud HaOref guidelines. Always follow official instructions.",
    dataSource: "Data source: Tzeva Adom / Pikud HaOref",
    lastUpdated: "Last updated",
    autoRefresh: "Auto-refreshes every 30s",
    noAlerts: "No recent alerts",
    activityDuration: "Activity Duration",
    now: "Now",
    alerts: "alerts",
    location: "Location",
    searchCity: "Search city...",
  },
  he: {
    appName: "הזמן הטוב למקלחת",
    appNameSub: "Best Shower Time",
    shower: "מקלחת",
    toilet: "שירותים",
    minutes: "דק׳",
    timeSinceLastAlert: "זמן מאז ההתרעה האחרונה",
    averageGap: "מרווח ממוצע (6 שעות)",
    alertCount: "התרעות (24 שעות)",
    trendLabel: "מגמה",
    increasing: "עולה",
    decreasing: "יורדת",
    stable: "יציבה",
    safetyScore: "ציון בטיחות",
    timeline: "ציר זמן התרעות — 24 שעות",
    howItWorks: "איך זה עובד",
    howItWorksContent:
      "האפליקציה מנתחת נתוני התרעות בזמן אמת מפיקוד העורף כדי להעריך את הזמנים הבטוחים ביותר לפעילויות שבהן קשה להגיע לממ״ד. ציון הבטיחות מבוסס על הזמן מאז ההתרעה האחרונה, מרווחים ממוצעים בין התרעות, מגמות תדירות ודפוסי שעות.",
    disclaimer:
      "אפליקציה זו אינה תחליף להנחיות פיקוד העורף. פעלו תמיד לפי ההוראות הרשמיות.",
    dataSource: "מקור נתונים: צבע אדום / פיקוד העורף",
    lastUpdated: "עודכן לאחרונה",
    autoRefresh: "מתרענן אוטומטית כל 30 שניות",
    noAlerts: "אין התרעות אחרונות",
    activityDuration: "משך הפעילות",
    now: "עכשיו",
    alerts: "התרעות",
    location: "מיקום",
    searchCity: "חפש עיר...",
  },
} as const;

export type TranslationKey = keyof (typeof translations)["en"];

export function t(lang: Language, key: TranslationKey): string {
  return translations[lang][key];
}

export default translations;
