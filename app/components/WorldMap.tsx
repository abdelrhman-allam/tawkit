"use client";
import { useMemo } from "react";
import { useMeetingStore } from "@/app/lib/store";
import { DateTime } from "luxon";
import { motion } from "framer-motion";

export default function WorldMap() {
  const { participants } = useMeetingStore();

  // Calculate sun position for day/night visualization
  const sunPosition = useMemo(() => {
    const now = DateTime.utc();
    const hour = now.hour + now.minute / 60;
    // Sun position: 0 at midnight UTC, moves 15° per hour
    const sunLongitude = ((hour - 12) * 15) % 360;
    return sunLongitude;
  }, []);

  const participantMarkers = useMemo(() => {
    const zones = Array.from(new Set(participants.map((p) => p.zone)));
    return zones.map((z) => {
      const dt = DateTime.now().setZone(z);
      const offsetMinutes = dt.offset;
      const offsetHours = offsetMinutes / 60;
      // Convert offset to longitude position (-180 to +180)
      const longitude = offsetHours * 15; // 15° per hour
      // Convert to SVG x position (0-360 viewBox)
      const x = ((longitude + 180) / 360) * 360;

      return {
        zone: z,
        x,
        name: participants.find(p => p.zone === z)?.name || z,
        localTime: dt.toFormat("HH:mm")
      };
    });
  }, [participants]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.25 }}
      className="glass rounded-xl p-6 space-y-4 hover-lift"
    >
      <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        World Timezone Map
      </h3>

      <div className="relative w-full h-48 rounded-lg overflow-hidden border border-black/10 dark:border-white/10 bg-gradient-to-b from-blue-900 via-blue-800 to-blue-900 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <svg
          viewBox="0 0 360 180"
          className="w-full h-full"
          preserveAspectRatio="xMidYMid slice"
        >
          {/* Day/Night gradient overlay */}
          <defs>
            <linearGradient id="dayNightGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(0, 0, 50, 0.7)" />
              <stop offset="25%" stopColor="rgba(0, 0, 50, 0.3)" />
              <stop offset="50%" stopColor="rgba(255, 200, 100, 0.1)" />
              <stop offset="75%" stopColor="rgba(0, 0, 50, 0.3)" />
              <stop offset="100%" stopColor="rgba(0, 0, 50, 0.7)" />
            </linearGradient>

            {/* Glow effect for markers */}
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background */}
          <rect width="360" height="180" fill="url(#dayNightGradient)" opacity="0.3" />

          {/* Timezone vertical lines (24 lines, one every 15°) */}
          {Array.from({ length: 24 }, (_, i) => {
            const x = (i * 15);
            const isMainLine = i % 6 === 0; // Highlight every 6 hours (90°)
            return (
              <g key={`tz-line-${i}`}>
                <line
                  x1={x}
                  y1="0"
                  x2={x}
                  y2="180"
                  stroke={isMainLine ? "rgba(255, 255, 255, 0.3)" : "rgba(255, 255, 255, 0.1)"}
                  strokeWidth={isMainLine ? "0.5" : "0.3"}
                  strokeDasharray={isMainLine ? "none" : "2,2"}
                />
                {/* Timezone labels */}
                {isMainLine && (
                  <text
                    x={x}
                    y="10"
                    fill="rgba(255, 255, 255, 0.5)"
                    fontSize="8"
                    textAnchor="middle"
                    className="font-mono"
                  >
                    {i === 0 ? "UTC-12" : i === 12 ? "UTC±0" : i === 18 ? "UTC+6" : `${i - 12 > 0 ? '+' : ''}${i - 12}`}
                  </text>
                )}
              </g>
            );
          })}

          {/* Horizontal latitude lines */}
          {[45, 90, 135].map((y) => (
            <line
              key={`lat-${y}`}
              x1="0"
              y1={y}
              x2="360"
              y2={y}
              stroke="rgba(255, 255, 255, 0.05)"
              strokeWidth="0.3"
            />
          ))}

          {/* Simplified continent outlines */}
          <g opacity="0.4" fill="none" stroke="rgba(100, 200, 100, 0.3)" strokeWidth="1">
            {/* North America */}
            <path d="M 60 40 Q 80 30, 100 40 L 110 60 Q 100 80, 90 90 L 70 85 Q 60 70, 60 40 Z" />
            {/* South America */}
            <path d="M 90 95 Q 95 100, 100 110 L 105 130 Q 100 140, 95 135 L 85 120 Q 85 105, 90 95 Z" />
            {/* Europe */}
            <path d="M 170 35 Q 180 30, 190 35 L 195 50 Q 190 55, 185 55 L 175 50 Q 170 42, 170 35 Z" />
            {/* Africa */}
            <path d="M 175 60 Q 185 55, 195 65 L 200 95 Q 195 115, 185 120 L 175 110 Q 170 85, 175 60 Z" />
            {/* Asia */}
            <path d="M 200 30 Q 240 25, 280 35 L 290 55 Q 285 70, 270 75 L 240 70 Q 210 60, 200 30 Z" />
            {/* Australia */}
            <path d="M 270 110 Q 285 105, 295 115 L 298 130 Q 290 138, 280 135 L 270 125 Q 268 118, 270 110 Z" />
          </g>

          {/* Participant markers */}
          {participantMarkers.map((marker, idx) => (
            <g key={`marker-${marker.zone}`}>
              {/* Marker pulse animation */}
              <motion.circle
                cx={marker.x}
                cy="90"
                r="8"
                fill="rgba(59, 130, 246, 0.2)"
                initial={{ scale: 0 }}
                animate={{ scale: [1, 1.5, 1] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: idx * 0.2,
                }}
              />
              {/* Main marker */}
              <circle
                cx={marker.x}
                cy="90"
                r="4"
                fill="#3b82f6"
                filter="url(#glow)"
                className="cursor-pointer"
              >
                <title>{`${marker.name}\n${marker.zone}\n${marker.localTime}`}</title>
              </circle>
              {/* Marker label */}
              <text
                x={marker.x}
                y="105"
                fill="rgba(255, 255, 255, 0.8)"
                fontSize="7"
                textAnchor="middle"
                className="font-medium pointer-events-none"
              >
                {marker.name}
              </text>
            </g>
          ))}

          {/* Sun indicator (current UTC noon position) */}
          <g opacity="0.6">
            <circle
              cx="180"
              cy="15"
              r="8"
              fill="#fbbf24"
              filter="url(#glow)"
            />
            <text
              x="180"
              y="30"
              fill="rgba(255, 255, 255, 0.6)"
              fontSize="6"
              textAnchor="middle"
            >
              ☀️ UTC Noon
            </text>
          </g>
        </svg>
      </div>

      <div className="text-xs opacity-60 space-y-1">
        <p>• Vertical lines represent timezone boundaries (15° longitude each)</p>
        <p>• Blue markers show participant locations based on their timezone offset</p>
        <p>• Hover over markers to see timezone details</p>
      </div>
    </motion.div>
  );
}