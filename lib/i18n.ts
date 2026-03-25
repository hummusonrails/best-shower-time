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
    "prealert.tapDetails": "Tap for details",
    "prealert.modalTitle": "Pre-Alert Details",
    "prealert.modalDesc": "Pre-alerts are cell broadcast warnings sent by the Home Front Command when missile launches are detected, minutes before sirens may activate.",
    "prealert.regionNote.nationwide": "These warnings were issued nationwide (no specific region targeted).",
    "prealert.regionNote.regional": "These warnings were detected in or near your selected region.",
    "prealert.scoreImpact": "Score Impact",
    "prealert.scoreImpact.active": "Active warnings cap your safety score at 35, making the verdict 'dangerous' regardless of siren history.",
    "prealert.scoreImpact.multi": "Multiple recent warnings cap your score at 55, preventing a 'safe' verdict while the situation is volatile.",
    "prealert.scoreImpact.exit": "The most recent event was declared over. A small bonus is applied to your score.",
    "prealert.scoreImpact.low": "Low-level warning activity has a mild effect on your score.",
    "prealert.close": "Close",
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
    "prealert.tapDetails": "לחצו לפרטים",
    "prealert.modalTitle": "פרטי התרעה מוקדמת",
    "prealert.modalDesc": "התרעות מוקדמות הן הודעות שידור סלולרי שנשלחות על ידי פיקוד העורף כאשר מזוהים שיגורי טילים, דקות לפני שצפירות עלולות להתחיל.",
    "prealert.regionNote.nationwide": "אזהרות אלו הופצו ברמה ארצית (ללא אזור מסוים).",
    "prealert.regionNote.regional": "אזהרות אלו זוהו באזור שבחרתם או בסמוך לו.",
    "prealert.scoreImpact": "השפעה על הציון",
    "prealert.scoreImpact.active": "אזהרות פעילות מגבילות את ציון הבטיחות ל-35, והציון הופך ל׳מסוכן׳ ללא קשר להיסטוריית הצפירות.",
    "prealert.scoreImpact.multi": "מספר אזהרות אחרונות מגבילות את הציון ל-55, ומונעות ציון ׳בטוח׳ בזמן שהמצב תנודתי.",
    "prealert.scoreImpact.exit": "האירוע האחרון הוכרז כסיום. בונוס קטן מתווסף לציון שלכם.",
    "prealert.scoreImpact.low": "פעילות אזהרה ברמה נמוכה משפיעה במידה מתונה על הציון.",
    "prealert.close": "סגור",
  },
};

export const translations = mergeTranslations(sharedTranslations, siteTranslations);
