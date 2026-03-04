// Best Shower Time — Service Worker
// Handles app shell caching and scheduled shower reminders

const CACHE_NAME = "bst-v1";
const STATIC_ASSETS = ["/", "/manifest.json"];

// Schedule state
let schedule = null; // { enabled, time, region, city, duration }
let checkInterval = null;
let lastFiredMinute = null; // prevent double-firing in same minute

// ─── Install ───────────────────────────────────────────────────────────────────

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// ─── Activate ──────────────────────────────────────────────────────────────────

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// ─── Fetch — Cache strategy ────────────────────────────────────────────────────

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // API calls: network-first
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Static assets: cache-first
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        if (response.ok && event.request.method === "GET") {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      });
    })
  );
});

// ─── Message — Receive schedule from client ────────────────────────────────────

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SYNC_SCHEDULE") {
    schedule = event.data.schedule;

    if (schedule && schedule.enabled) {
      startScheduleChecker();
    } else {
      stopScheduleChecker();
    }
  }
});

// ─── Schedule checker ──────────────────────────────────────────────────────────

function startScheduleChecker() {
  stopScheduleChecker();
  checkInterval = setInterval(checkSchedule, 30 * 1000); // every 30s
  checkSchedule(); // check immediately
}

function stopScheduleChecker() {
  if (checkInterval) {
    clearInterval(checkInterval);
    checkInterval = null;
  }
}

function checkSchedule() {
  if (!schedule || !schedule.enabled || !schedule.time) return;

  const now = new Date();
  const [schedH, schedM] = schedule.time.split(":").map(Number);

  // Calculate reminder time (1 minute before scheduled shower)
  let reminderH = schedH;
  let reminderM = schedM - 1;
  if (reminderM < 0) {
    reminderM = 59;
    reminderH = (reminderH - 1 + 24) % 24;
  }

  const currentH = now.getHours();
  const currentM = now.getMinutes();

  if (currentH === reminderH && currentM === reminderM) {
    const minuteKey = `${currentH}:${currentM}`;
    if (lastFiredMinute === minuteKey) return; // already fired this minute
    lastFiredMinute = minuteKey;
    fireNotification();
  }
}

async function fireNotification() {
  try {
    const params = new URLSearchParams();
    params.set("region", schedule.region || "all");
    if (schedule.city) params.set("city", schedule.city);
    params.set("duration", String(schedule.duration || 10));

    const response = await fetch(`/api/safety-check?${params.toString()}`);
    const data = await response.json();

    const levelEmoji = { safe: "\u2705", risky: "\u26A0\uFE0F", dangerous: "\u274C" };
    const emoji = levelEmoji[data.level] || "";

    await self.registration.showNotification("Best Shower Time", {
      body: `${emoji} ${data.message}\nScore: ${data.score}/100`,
      icon: "/icons/icon-192.png",
      badge: "/icons/icon-192.png",
      tag: "shower-reminder",
      renotify: true,
      data: { url: "/" },
    });
  } catch {
    await self.registration.showNotification("Best Shower Time", {
      body: "Could not check safety status \u2014 open the app to see.",
      icon: "/icons/icon-192.png",
      badge: "/icons/icon-192.png",
      tag: "shower-reminder",
      data: { url: "/" },
    });
  }
}

// ─── Notification click — open/focus app ───────────────────────────────────────

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "/";

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        if (client.url.includes(self.location.origin) && "focus" in client) {
          return client.focus();
        }
      }
      return self.clients.openWindow(url);
    })
  );
});
