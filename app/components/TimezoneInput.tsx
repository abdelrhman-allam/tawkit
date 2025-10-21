"use client";
import { useMemo, useState, useEffect } from "react";

export default function TimezoneInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [mounted, setMounted] = useState(false);
  const [localZone, setLocalZone] = useState<string>("UTC");
  
  useEffect(() => {
    setMounted(true);
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (tz) setLocalZone(tz);
      // If the current value is empty, default to local
      if (!value) onChange(tz);
    } catch {}
  }, []);

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
    if (typeof Intl !== "undefined" && (Intl as any).supportedValuesOf) {
      try {
        return (Intl as any).supportedValuesOf("timeZone") as string[];
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