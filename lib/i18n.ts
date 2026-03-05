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
  },
};

export const translations = mergeTranslations(sharedTranslations, siteTranslations);
