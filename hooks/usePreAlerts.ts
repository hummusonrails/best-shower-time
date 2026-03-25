import { useState, useEffect, useCallback } from "react";
import { type PreAlert } from "best-time-ui";

let cache: { data: PreAlert[]; timestamp: number } | null = null;
const CACHE_DURATION = 60 * 1000; // 60 seconds

export function usePreAlerts(refreshInterval: number) {
  const [preAlerts, setPreAlerts] = useState<PreAlert[]>([]);

  const fetchPreAlerts = useCallback(async () => {
    const now = Date.now();
    if (cache && now - cache.timestamp < CACHE_DURATION) {
      setPreAlerts(cache.data);
      return;
    }

    try {
      const res = await fetch("/api/pre-alerts");
      const data: PreAlert[] = await res.json();
      cache = { data, timestamp: now };
      setPreAlerts(data);
    } catch (error) {
      console.error("Failed to fetch pre-alerts:", error);
      if (cache) {
        setPreAlerts(cache.data);
      }
    }
  }, []);

  useEffect(() => {
    fetchPreAlerts();
    const interval = setInterval(fetchPreAlerts, refreshInterval);
    return () => clearInterval(interval);
  }, [fetchPreAlerts, refreshInterval]);

  return preAlerts;
}
