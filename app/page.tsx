"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Header,
  InstallPrompt,
  HowItWorks,
  Footer,
  ScrollReveal,
  CrossPromoBanner,
  computeStats,
  computePreAlertStatus,
  filterAlertsByRegion,
  useTranslation,
  type ProcessedAlert,
  type SafetyStats,
  type SafetyRecommendation,
  type PreAlertStatus,
} from "best-time-ui";
import ActivitySelector from "@/components/ActivitySelector";
import LocationSelector from "@/components/LocationSelector";
import { SafetyVerdict, StatsGrid, AlertTimeline } from "best-time-ui";
import PreAlertStatusCard from "@/components/PreAlertStatusCard";
import { getRecommendation } from "@/lib/safety";
import { usePreAlerts } from "@/hooks/usePreAlerts";
import { ActivityType } from "@/lib/types";

const REFRESH_INTERVAL = 120_000;

export default function Home() {
  const [alerts, setAlerts] = useState<ProcessedAlert[]>([]);
  const [stats, setStats] = useState<SafetyStats | null>(null);
  const [recommendation, setRecommendation] = useState<SafetyRecommendation | null>(null);
  const [activity, setActivity] = useState<ActivityType>("shower");
  const [duration, setDuration] = useState(8);
  const [exitTime, setExitTime] = useState(2);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [preAlertStatus, setPreAlertStatus] = useState<PreAlertStatus | null>(null);
  const preAlerts = usePreAlerts(REFRESH_INTERVAL);
  const { t } = useTranslation();

  // Persist location in localStorage
  useEffect(() => {
    const savedRegion = localStorage.getItem("bst-region");
    const savedCity = localStorage.getItem("bst-city");
    if (savedRegion) setSelectedRegion(savedRegion);
    if (savedCity) setSelectedCity(savedCity);
  }, []);

  useEffect(() => {
    localStorage.setItem("bst-region", selectedRegion);
  }, [selectedRegion]);

  useEffect(() => {
    if (selectedCity) {
      localStorage.setItem("bst-city", selectedCity);
    } else {
      localStorage.removeItem("bst-city");
    }
  }, [selectedCity]);

  // Extract unique cities from alert data for the search
  const availableCities = useMemo(() => {
    const citySet = new Set<string>();
    for (const alert of alerts) {
      for (const city of alert.cities) {
        citySet.add(city);
      }
    }
    return Array.from(citySet).sort();
  }, [alerts]);

  // Filter alerts by selected location
  const filteredAlerts = useMemo(() => {
    if (selectedCity) {
      return alerts.filter((a) => a.cities.some((c) => c.includes(selectedCity)));
    }
    return alerts.filter((a) => filterAlertsByRegion(a.cities, selectedRegion));
  }, [alerts, selectedRegion, selectedCity]);

  const fetchAlerts = useCallback(async () => {
    try {
      const res = await fetch("/api/alerts");
      const data: ProcessedAlert[] = await res.json();
      setAlerts(data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Failed to fetch alerts:", error);
    }
  }, []);

  // Initial fetch + polling
  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchAlerts]);

  // Effective duration: activity time + exit buffer (shower only)
  const effectiveDuration = activity === "shower" ? duration + exitTime : duration;

  // Compute pre-alert status when pre-alerts or region change
  useEffect(() => {
    if (preAlerts.length > 0) {
      const regionId = selectedRegion !== "all" ? selectedRegion : null;
      setPreAlertStatus(computePreAlertStatus(preAlerts, regionId));
    } else {
      setPreAlertStatus(null);
    }
  }, [preAlerts, selectedRegion]);

  // Recompute stats when filtered alerts, duration, or pre-alert status change
  useEffect(() => {
    const newStats = computeStats(filteredAlerts);
    setStats(newStats);
    setRecommendation(
      getRecommendation(newStats, effectiveDuration, preAlertStatus ?? undefined)
    );
  }, [filteredAlerts, effectiveDuration, preAlertStatus]);

  return (
    <div className="min-h-screen flex flex-col items-center">
      <div className="w-full max-w-xl">
        <ScrollReveal direction="down">
          <Header />
        </ScrollReveal>
        <CrossPromoBanner
          sites={[
            { href: "https://bestwalkingtime.com", name: "Best Walk Time", promptEn: "Need to go outside too? Check out", promptHe: "גם צריכים לצאת? בדקו את" },
            { href: "https://bestsleepingtime.com", name: "Best Sleep Time", promptEn: "Need a nap? Check out", promptHe: "צריכים תנומה? בדקו את" },
          ]}
        />

        <main className="flex flex-col items-center gap-10 pb-10">
          <ScrollReveal>
            <SafetyVerdict recommendation={recommendation} />
          </ScrollReveal>
          {preAlertStatus && (
            <div className="w-full px-4">
              <PreAlertStatusCard preAlertStatus={preAlertStatus} selectedRegion={selectedRegion} />
            </div>
          )}
          <ScrollReveal direction="left" delay={100}>
            <ActivitySelector
              activity={activity}
              duration={duration}
              exitTime={exitTime}
              onActivityChange={setActivity}
              onDurationChange={setDuration}
              onExitTimeChange={setExitTime}
            />
          </ScrollReveal>
          <ScrollReveal direction="right" delay={50}>
            <InstallPrompt />
          </ScrollReveal>
          <ScrollReveal direction="right" delay={100} className="relative z-10">
            <LocationSelector
              selectedRegion={selectedRegion}
              onRegionChange={setSelectedRegion}
              availableCities={availableCities}
              selectedCity={selectedCity}
              onCityChange={setSelectedCity}
            />
          </ScrollReveal>
          <ScrollReveal delay={150} className="w-full">
            <StatsGrid stats={stats} />
          </ScrollReveal>
          <ScrollReveal delay={100} className="w-full">
            <AlertTimeline alerts={filteredAlerts} />
          </ScrollReveal>
          <ScrollReveal>
            <HowItWorks />
          </ScrollReveal>
        </main>

        <ScrollReveal>
          <Footer
            lastUpdated={lastUpdated}
            sisterSites={[
              {
                href: "https://bestwalkingtime.com",
                nameEn: "Best Walk Time",
                nameHe: "הזמן הטוב לטיול",
              },
              {
                href: "https://bestsleepingtime.com",
                nameEn: "Best Sleep Time",
                nameHe: "הזמן הטוב לשינה",
              },
            ]}
          />
        </ScrollReveal>
      </div>
    </div>
  );
}
