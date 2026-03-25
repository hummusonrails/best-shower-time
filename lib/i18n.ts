import { sharedTranslations, mergeTranslations, type Translations } from "best-time-ui";

const siteTranslations: Translations = {
  en: {
    appName: "Best Shower Time",
    appNameSub: "הזמן הטוב למקלחת",
    shower: "Shower",
    toilet: "Toilet",
    activityDuration: "Activity Duration",
    exitTime: "Time to Get Out",
    exitTimeDesc: "How long to towel off and reach safety",
    location: "Location",
    dataSource: "Data source: Tzeva Adom / Pikud HaOref",
    howItWorksContent:
      "This app analyzes real-time rocket alert data from Pikud HaOref to estimate the safest times for activities where you can't easily reach a safe room. The safety score is based on time since the last alert, average gaps between alerts, frequency trends, and time-of-day patterns.",
    "prealert.activeWarnings":
      "Multiple warning events detected recently — shorter showers recommended",
    "prealert.goodWindow":
      "Recent event concluded — good window for a quick shower",
    "prealert.title": "Pre-Alert Activity",
    "prealert.warnings2h": "in 2h",
    "prealert.warnings6h": "in 6h",
    "prealert.exitCleared": "Cleared",
  },
  he: {
    appName: "הזמן הטוב למקלחת",
    appNameSub: "Best Shower Time",
    shower: "מקלחת",
    toilet: "שירותים",
    activityDuration: "משך הפעילות",
    exitTime: "זמן יציאה",
    exitTimeDesc: "כמה זמן להתנגב ולהגיע לממ״ד",
    location: "מיקום",
    dataSource: "מקור נתונים: צבע אדום / פיקוד העורף",
    howItWorksContent:
      "האפליקציה מנתחת נתוני התרעות בזמן אמת מפיקוד העורף כדי להעריך את הזמנים הבטוחים ביותר לפעילויות שבהן קשה להגיע לממ״ד. ציון הבטיחות מבוסס על הזמן מאז ההתרעה האחרונה, מרווחים ממוצעים בין התרעות, מגמות תדירות ודפוסי שעות.",
    "prealert.activeWarnings":
      "זוהו מספר אירועי אזהרה לאחרונה — מומלץ למקלחת קצרה",
    "prealert.goodWindow":
      "אירוע אחרון הסתיים — חלון טוב למקלחת מהירה",
    "prealert.title": "פעילות התרעה מוקדמת",
    "prealert.warnings2h": "ב-2 שע׳",
    "prealert.warnings6h": "ב-6 שע׳",
    "prealert.exitCleared": "ירידת מתח",
  },
};

export const translations = mergeTranslations(sharedTranslations, siteTranslations);
