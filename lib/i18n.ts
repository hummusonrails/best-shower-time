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
    exitTime: "Time to Get Out",
    exitTimeDesc: "How long to towel off and reach safety",
    showerReminder: "Daily Reminder",
    reminderDescription: "Get notified 1 minute before your shower time with the current safety status.",
    notificationsDenied: "Notifications are blocked. Enable them in your browser settings.",
    notificationsUnsupported: "Notifications are not supported in this browser.",
    installCTAiOS: "Tap {icon} then \"Add to Home Screen\" to set daily reminders",
    installCTAAndroid: "Tap \u22EE then \"Install App\" to set daily reminders",
    installCTADesktop: "Install on your phone for daily safety alerts before you shower",
    installButton: "Install App",
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
    exitTime: "זמן יציאה",
    exitTimeDesc: "כמה זמן להתנגב ולהגיע לממ״ד",
    showerReminder: "תזכורת יומית",
    reminderDescription: "קבלו התראה דקה לפני זמן המקלחת עם סטטוס הבטיחות הנוכחי.",
    notificationsDenied: "ההתראות חסומות. הפעילו אותן בהגדרות הדפדפן.",
    notificationsUnsupported: "דפדפן זה אינו תומך בהתראות.",
    installCTAiOS: "לחצו על {icon} ואז \"הוסף למסך הבית\" להגדרת תזכורות יומיות",
    installCTAAndroid: "לחצו על \u22EE ואז \"התקן אפליקציה\" להגדרת תזכורות יומיות",
    installCTADesktop: "התקינו בטלפון לקבלת התראות בטיחות יומיות לפני המקלחת",
    installButton: "התקן אפליקציה",
  },
} as const;

export type TranslationKey = keyof (typeof translations)["en"];

export function t(lang: Language, key: TranslationKey): string {
  return translations[lang][key];
}

export default translations;
