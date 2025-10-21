"use client";
import { useMemo, useState, useEffect, useRef } from "react";

export default function TimezoneInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [mounted, setMounted] = useState(false);
  const initializedRef = useRef(false);
  
  useEffect(() => {
    setMounted(true);
    if (initializedRef.current) return;
    initializedRef.current = true;
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      // If the current value is empty, default to local
      if (!value && tz) onChange(tz);
    } catch {}
  }, [onChange, value]);

  const zones = useMemo(() => {
    // Always use fallback list to ensure consistency between server and client
    const fallbackZones = [
      "UTC",
      "America/New_York",
      "America/Los_Angeles",
      "America/Chicago",
      "Europe/London",
      "Europe/Paris",
      "Europe/Berlin",
      "Asia/Tokyo",
      "Asia/Singapore",
      "Asia/Shanghai",
      "Australia/Sydney",
      "Pacific/Auckland",
    ];

    if (!mounted) return fallbackZones;

    // Only try to get full list on client after mount
    type IntlWithSupported = typeof Intl & { supportedValuesOf?: (key: string) => string[] };
    const intlObj: IntlWithSupported = Intl as IntlWithSupported;
    if (typeof intlObj !== "undefined" && typeof intlObj.supportedValuesOf === "function") {
      try {
        return intlObj.supportedValuesOf("timeZone") as string[];
      } catch {}
    }
    return fallbackZones;
  }, [mounted]);

  return (
    <div className="w-full">
      <input
        list="tz-list"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-black/10 dark:border-white/10 px-3 py-2 text-sm bg-transparent"
        placeholder="Select a timezone (e.g., Europe/London)"
      />
      <datalist id="tz-list">
        {zones.map((z) => (
          <option key={z} value={z} />
        ))}
      </datalist>
    </div>
  );
}