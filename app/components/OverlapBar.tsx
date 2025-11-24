"use client";
import { useMeetingStore } from "@/app/lib/store";
import { buildDayHours, computeOverlapIndices, suggestBestStart } from "@/app/lib/time";
import { motion } from "framer-motion";

export default function OverlapBar() {
  const { participants, baseUTC, duration } = useMeetingStore();

  const statusRows = participants.map((p) => buildDayHours(baseUTC, p.zone).map((h) => h.status));
  const overlap = computeOverlapIndices(statusRows);
  const suggestion = suggestBestStart(overlap, duration);
  const requiredHours = Math.max(1, Math.ceil(duration / 60));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      className="glass rounded-xl p-6 space-y-4 hover-lift"
    >
      <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        Overlap Analysis
      </h3>
      <div
        className="grid gap-[1px] bg-black/10 dark:bg-white/10 p-[1px] rounded-lg overflow-hidden"
        style={{ gridTemplateColumns: "repeat(24, minmax(0, 1fr))" }}
      >
        {Array.from({ length: 24 }, (_, i) => {
          const on = overlap.includes(i);
          const inSuggest = suggestion !== null && i >= (suggestion as number) && i < (suggestion as number) + requiredHours;
          return (
            <motion.div
              key={i}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.3, delay: i * 0.02 }}
              className={`h-8 transition-all duration-200 ${on
                  ? "bg-gradient-to-t from-emerald-500 to-emerald-400"
                  : "bg-gray-200/50 dark:bg-gray-700/50"
                } ${inSuggest ? "ring-2 ring-inset ring-blue-500 animate-pulse" : ""}`}
            />
          );
        })}
      </div>
      {overlap.length === 0 ? (
        <p className="text-sm opacity-60 text-center">
          ⚠️ No perfect overlap in work hours. Consider adjusting duration or time.
        </p>
      ) : (
        <p className="text-sm opacity-60 text-center">
          ✓ {overlap.length} hour{overlap.length > 1 ? "s" : ""} of shared work time
          {suggestion !== null && " • Highlighted region fits meeting duration"}
        </p>
      )}
    </motion.div>
  );
}