"use client";
import { useMemo, useState, useEffect, useRef } from "react";
import { DateTime } from "luxon";
import { motion, AnimatePresence } from "framer-motion";

interface TimezoneOption {
  value: string;
  label: string;
  offset: string;
  region: string;
  currentTime: string;
}

export default function TimezoneInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const initializedRef = useRef(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    if (initializedRef.current) return;
    initializedRef.current = true;
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (!value && tz) onChange(tz);
    } catch { }
  }, [onChange, value]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const timezones = useMemo((): TimezoneOption[] => {
    const popularZones = [
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

    let allZones = popularZones;

    if (mounted) {
      type IntlWithSupported = typeof Intl & { supportedValuesOf?: (key: string) => string[] };
      const intlObj: IntlWithSupported = Intl as IntlWithSupported;
      if (typeof intlObj !== "undefined" && typeof intlObj.supportedValuesOf === "function") {
        try {
          allZones = intlObj.supportedValuesOf("timeZone") as string[];
        } catch { }
      }
    }

    return allZones.map((tz) => {
      const dt = DateTime.now().setZone(tz);
      const offset = dt.offset / 60;
      const offsetStr = offset >= 0 ? `+${offset}` : `${offset}`;
      const region = tz.split("/")[0] || "Other";

      return {
        value: tz,
        label: tz.replace(/_/g, " "),
        offset: `UTC${offsetStr}`,
        region,
        currentTime: dt.toFormat("HH:mm"),
      };
    });
  }, [mounted]);

  const filteredTimezones = useMemo(() => {
    if (!searchQuery) return timezones;
    const query = searchQuery.toLowerCase();
    return timezones.filter(
      (tz) =>
        tz.label.toLowerCase().includes(query) ||
        tz.offset.toLowerCase().includes(query) ||
        tz.region.toLowerCase().includes(query)
    );
  }, [timezones, searchQuery]);

  const groupedTimezones = useMemo(() => {
    const groups: Record<string, TimezoneOption[]> = {};
    filteredTimezones.forEach((tz) => {
      if (!groups[tz.region]) groups[tz.region] = [];
      groups[tz.region].push(tz);
    });
    return groups;
  }, [filteredTimezones]);

  const selectedTimezone = timezones.find((tz) => tz.value === value);

  const handleSelect = (tzValue: string) => {
    onChange(tzValue);
    setIsOpen(false);
    setSearchQuery("");
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Selected Value Display */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full rounded-lg border border-black/10 dark:border-white/10 px-4 py-2.5 text-sm bg-background/50 backdrop-blur-sm transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 flex items-center justify-between hover:bg-background/70"
      >
        <div className="flex items-center gap-2 flex-1 text-left">
          <span className="text-lg">🌍</span>
          {selectedTimezone ? (
            <div className="flex-1">
              <div className="font-medium">{selectedTimezone.label}</div>
              <div className="text-xs opacity-60 flex gap-2">
                <span>{selectedTimezone.offset}</span>
                <span>•</span>
                <span>{selectedTimezone.currentTime}</span>
              </div>
            </div>
          ) : (
            <span className="opacity-60">Select timezone...</span>
          )}
        </div>
        <motion.svg
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="w-4 h-4 opacity-60"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </motion.svg>
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-2 glass rounded-lg shadow-lg border border-black/10 dark:border-white/10 overflow-hidden"
          >
            {/* Search Input */}
            <div className="p-3 border-b border-black/10 dark:border-white/10">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search timezone..."
                className="w-full rounded-lg border border-black/10 dark:border-white/10 px-3 py-2 text-sm bg-background/50 backdrop-blur-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                autoFocus
              />
            </div>

            {/* Timezone List */}
            <div className="max-h-64 overflow-y-auto">
              {Object.keys(groupedTimezones).length === 0 ? (
                <div className="p-4 text-center text-sm opacity-60">No timezones found</div>
              ) : (
                Object.entries(groupedTimezones).map(([region, zones]) => (
                  <div key={region}>
                    <div className="px-3 py-2 text-xs font-semibold opacity-60 bg-black/5 dark:bg-white/5 sticky top-0">
                      {region}
                    </div>
                    {zones.map((tz) => (
                      <button
                        key={tz.value}
                        type="button"
                        onClick={() => handleSelect(tz.value)}
                        className={`w-full px-4 py-2.5 text-left hover:bg-blue-500/10 transition-colors duration-150 flex items-center justify-between ${tz.value === value ? "bg-blue-500/20" : ""
                          }`}
                      >
                        <div className="flex-1">
                          <div className="text-sm font-medium">{tz.label}</div>
                          <div className="text-xs opacity-60 flex gap-2">
                            <span>{tz.offset}</span>
                            <span>•</span>
                            <span>{tz.currentTime}</span>
                          </div>
                        </div>
                        {tz.value === value && (
                          <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}