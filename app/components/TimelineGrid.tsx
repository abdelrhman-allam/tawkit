"use client";
import { motion } from "framer-motion";
import { useMeetingStore } from "@/app/lib/store";
import { buildDayHours } from "@/app/lib/time";
import { useState } from "react";

const colorMap: Record<string, string> = {
  work: "bg-emerald-500/80 hover:bg-emerald-500",
  off: "bg-amber-400/80 hover:bg-amber-400",
  sleep: "bg-rose-400/80 hover:bg-rose-400",
};

const labelMap: Record<string, string> = {
  work: "Working Hours",
  off: "Off Hours",
  sleep: "Sleep Time",
};

export default function TimelineGrid() {
  const { participants, baseUTC } = useMeetingStore();
  const [hoveredCell, setHoveredCell] = useState<string | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="w-full overflow-x-auto glass rounded-xl p-6"
    >
      <h2 className="text-lg font-semibold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        Timeline Overview
      </h2>
      <div className="space-y-4 min-w-[768px]">
        {participants.map((p, idx) => {
          const hours = buildDayHours(baseUTC, p.zone);
          return (
            <motion.div
              key={`${p.zone}-${idx}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.1 }}
              className="border border-black/10 dark:border-white/10 rounded-lg bg-background/50 backdrop-blur-sm overflow-hidden hover-lift"
            >
              <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-500/5 to-purple-500/5">
                <div className="text-sm font-medium">{p.name}</div>
                <div className="text-xs opacity-70 font-mono">{p.zone}</div>
              </div>
              <div
                className="grid gap-[1px] bg-black/10 dark:bg-white/10 p-[1px]"
                style={{ gridTemplateColumns: "repeat(24, minmax(0, 1fr))" }}
              >
                {hours.map((h) => {
                  const cellId = `${p.zone}-${idx}-${h.index}`;
                  const isHovered = hoveredCell === cellId;
                  return (
                    <div
                      key={h.index}
                      className={`relative h-10 ${colorMap[h.status]} flex items-center justify-center text-[10px] font-medium transition-all duration-200 cursor-pointer group`}
                      onMouseEnter={() => setHoveredCell(cellId)}
                      onMouseLeave={() => setHoveredCell(null)}
                    >
                      <span className="opacity-70 group-hover:opacity-100 transition-opacity">
                        {h.label}
                      </span>
                      {isHovered && (
                        <motion.div
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-10 px-3 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded-lg shadow-lg whitespace-nowrap pointer-events-none"
                        >
                          <div className="font-semibold">{h.localTime}</div>
                          <div className="text-[10px] opacity-80">{labelMap[h.status]}</div>
                          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-gray-100"></div>
                        </motion.div>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
        {participants.length === 0 && (
          <p className="text-sm opacity-60 text-center py-8">
            Add participants to view their timelines
          </p>
        )}
      </div>
    </motion.div>
  );
}