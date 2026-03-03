"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Header from "@/components/Header";
import SafetyVerdict from "@/components/SafetyVerdict";
import ActivitySelector from "@/components/ActivitySelector";
import LocationSelector from "@/components/LocationSelector";
import StatsGrid from "@/components/StatsGrid";
import AlertTimeline from "@/components/AlertTimeline";
import HowItWorks from "@/components/HowItWorks";
import Footer from "@/components/Footer";
import { ProcessedAlert, ActivityType, SafetyStats, SafetyRecommendation } from "@/lib/types";
import { computeStats, getRecommendation } from "@/lib/safety";
import { filterAlertsByRegion } from "@/lib/regions";

const REFRESH_INTERVAL = 30_000;

export default function Home() {
  const [alerts, setAlerts] = useState<ProcessedAlert[]>([]);
  const [stats, setStats] = useState<SafetyStats | null>(null);
  const [recommendation, setRecommendation] = useState<SafetyRecommendation | null>(null);
  const [activity, setActivity] = useState<ActivityType>("shower");
  const [duration, setDuration] = useState(8);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

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

  // Recompute stats when filtered alerts or duration change
  useEffect(() => {
    const newStats = computeStats(filteredAlerts);
    setStats(newStats);
    setRecommendation(getRecommendation(newStats, duration));
  }, [filteredAlerts, duration]);

  return (
    <div className="min-h-screen flex flex-col items-center">
      <div className="w-full max-w-xl">
        <Header />

        <main className="flex flex-col items-center gap-8 pb-8">
          <SafetyVerdict recommendation={recommendation} />
          <ActivitySelector
            activity={activity}
            duration={duration}
            onActivityChange={setActivity}
            onDurationChange={setDuration}
          />
          <LocationSelector
            selectedRegion={selectedRegion}
            onRegionChange={setSelectedRegion}
            availableCities={availableCities}
            selectedCity={selectedCity}
            onCityChange={setSelectedCity}
          />
          <StatsGrid stats={stats} />
          <AlertTimeline alerts={filteredAlerts} />
          <HowItWorks />
        </main>

        <Footer lastUpdated={lastUpdated} />
      </div>
    </div>
  );
}
