"use client";

import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { t } from "@/lib/i18n";
import { regions, Region } from "@/lib/regions";
import { searchCities, getCityEnglishName } from "@/lib/cityNames";

interface Props {
  selectedRegion: string;
  onRegionChange: (regionId: string) => void;
  /** All unique city names extracted from current alert data */
  availableCities: string[];
  selectedCity: string | null;
  onCityChange: (city: string | null) => void;
}

export default function LocationSelector({
  selectedRegion,
  onRegionChange,
  availableCities,
  selectedCity,
  onCityChange,
}: Props) {
  const { lang } = useLanguage();
  const [citySearch, setCitySearch] = useState("");
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowCityDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const filteredCities = citySearch.length >= 2
    ? searchCities(citySearch, availableCities).slice(0, 12)
    : [];

  const regionName = (r: Region) => (lang === "he" ? r.nameHe : r.nameEn);

  return (
    <section className="w-full max-w-md mx-auto px-4">
      <div className="bracket-frame px-5 py-4">
        <span className="font-mono text-xs text-cream/40 uppercase tracking-wider block mb-3">
          {t(lang, "location")}
        </span>

        {/* Region grid */}
        <div className="flex flex-wrap gap-2 mb-4">
          {regions.map((r) => (
            <button
              key={r.id}
              onClick={() => {
                onRegionChange(r.id);
                onCityChange(null);
                setCitySearch("");
              }}
              className={`px-3 py-1.5 text-xs font-mono rounded-sm border transition-all duration-500 ease-smooth ${
                selectedRegion === r.id && !selectedCity
                  ? "border-cream/40 bg-cream/10 text-cream"
                  : "border-cream/10 text-cream/35 hover:text-cream/55 hover:border-cream/20"
              }`}
            >
              {regionName(r)}
            </button>
          ))}
        </div>

        {/* City search */}
        <div className="relative" ref={dropdownRef}>
          <input
            type="text"
            value={
              selectedCity
                ? lang === "he"
                  ? selectedCity
                  : getCityEnglishName(selectedCity)
                : citySearch
            }
            onChange={(e) => {
              if (selectedCity) onCityChange(null);
              setCitySearch(e.target.value);
              setShowCityDropdown(true);
            }}
            onFocus={() => {
              if (citySearch.length >= 2) setShowCityDropdown(true);
            }}
            placeholder={t(lang, "searchCity")}
            className="w-full bg-transparent border border-cream/15 rounded-sm px-3 py-2 font-mono text-sm text-cream placeholder:text-cream/25 focus:outline-none focus:border-cream/30 transition-colors duration-300"
            dir={lang === "he" ? "rtl" : "ltr"}
          />

          {selectedCity && (
            <button
              onClick={() => {
                onCityChange(null);
                setCitySearch("");
              }}
              className="absolute top-1/2 -translate-y-1/2 ltr:right-3 rtl:left-3 right-3 text-cream/40 hover:text-cream/70 transition-colors text-sm"
            >
              ✕
            </button>
          )}

          {showCityDropdown && filteredCities.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-bg border border-cream/15 rounded-sm max-h-48 overflow-y-auto z-50">
              {filteredCities.map((city) => (
                <button
                  key={city}
                  onClick={() => {
                    onCityChange(city);
                    setCitySearch("");
                    setShowCityDropdown(false);
                    onRegionChange("all");
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 font-mono text-sm text-cream/70 hover:bg-cream/8 hover:text-cream transition-colors duration-200"
                >
                  <span className="text-cream/40 text-xs">{getCityEnglishName(city)}</span>
                  <span dir="rtl">{city}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
