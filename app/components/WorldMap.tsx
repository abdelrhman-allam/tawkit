"use client";
import { useMemo } from "react";
import { useMeetingStore } from "@/app/lib/store";
import { DateTime } from "luxon";

export default function WorldMap() {
  const { participants } = useMeetingStore();

  const points = useMemo(() => {
    const zones = Array.from(new Set(participants.map((p) => p.zone)));
    return zones.map((z) => {
      const offsetMinutes = DateTime.now().setZone(z).offset; // minutes
      const offsetHours = offsetMinutes / 60; // [-12..+14]
      const leftPct = ((offsetHours + 12) / 24) * 100; // 0..100
      return { zone: z, left: Math.min(100, Math.max(0, leftPct)) };
    });
  }, [participants]);

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold">World Map (by UTC offset)</h3>
      <div className="relative h-24 w-full rounded-md overflow-hidden border border-black/10 dark:border-white/10">
        {/* Simplified world strip background */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-blue-700 to-blue-900 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900" />
        {/* 24-hour markers */}
        <div className="absolute inset-0 grid" style={{ gridTemplateColumns: "repeat(24, 1fr)" }}>
          {Array.from({ length: 24 }, (_, i) => (
            <div key={i} className="border-r border-black/10 dark:border-white/5" />
          ))}
        </div>
        {/* Points for selected time zones */}
        {points.map((p) => (
          <div
            key={p.zone}
            className="absolute top-1/2 -translate-y-1/2"
            style={{ left: `${p.left}%` }}
            title={p.zone}
          >
            <div className="h-3 w-3 rounded-full bg-yellow-300 ring-2 ring-yellow-500 shadow" />
          </div>
        ))}
        {/* Legend */}
        <div className="absolute bottom-1 left-1 right-1 text-[10px] text-white/80 flex justify-between">
          <span>UTC−12</span>
          <span>UTC±0</span>
          <span>UTC+12</span>
        </div>
      </div>
      <p className="text-xs opacity-70">Dots are positioned by current UTC offset of each selected timezone.</p>
    </div>
  );
}