"use client";
import { motion } from "framer-motion";
import { useMeetingStore } from "@/app/lib/store";
import { buildDayHours } from "@/app/lib/time";

const colorMap: Record<string, string> = {
  work: "bg-green-500/70",
  off: "bg-yellow-400/70",
  sleep: "bg-rose-400/70",
};

export default function TimelineGrid() {
  const { participants, baseUTC } = useMeetingStore();

  return (
    <div className="w-full overflow-x-auto">
      <div className="space-y-4 min-w-[768px]">
        {participants.map((p, idx) => {
          const hours = buildDayHours(baseUTC, p.zone);
          return (
            <motion.div
              key={`${p.zone}-${idx}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="border border-black/10 dark:border-white/10 rounded-md bg-background/30 backdrop-blur-sm"
            >
              <div className="flex items-center justify-between px-3 py-2">
                <div className="text-sm font-medium">{p.name}</div>
                <div className="text-xs opacity-70">{p.zone}</div>
              </div>
              <div
                className="grid gap-[1px] bg-black/10 dark:bg-white/10 p-[1px] rounded-md"
                style={{ gridTemplateColumns: "repeat(24, minmax(0, 1fr))" }}
              >
                {hours.map((h) => (
                  <div key={h.index} className={`h-8 ${colorMap[h.status]} flex items-center justify-center text-[11px]`}> 
                    {h.label}
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
        {participants.length === 0 && (
          <p className="text-xs opacity-70">Add participants to view timelines.</p>
        )}
      </div>
    </div>
  );
}