"use client";
import { useMeetingStore } from "@/app/lib/store";
import { buildDayHours, computeOverlapIndices, suggestBestStart } from "@/app/lib/time";

export default function OverlapBar() {
  const { participants, baseUTC, duration } = useMeetingStore();

  const statusRows = participants.map((p) => buildDayHours(baseUTC, p.zone).map((h) => h.status));
  const overlap = computeOverlapIndices(statusRows);
  const suggestion = suggestBestStart(overlap, duration);
  const requiredHours = Math.max(1, Math.ceil(duration / 60));

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold">Overlap</h3>
      <div
        className="grid gap-[1px] bg-black/10 dark:bg-white/10 p-[1px] rounded-md"
        style={{ gridTemplateColumns: "repeat(24, minmax(0, 1fr))" }}
      >
        {Array.from({ length: 24 }, (_, i) => {
          const on = overlap.includes(i);
          const inSuggest = suggestion !== null && i >= (suggestion as number) && i < (suggestion as number) + requiredHours;
          return (
            <div
              key={i}
              className={`h-6 ${on ? "bg-green-500/70" : "bg-transparent"} ${inSuggest ? "ring-2 ring-green-600" : ""}`}
            />
          );
        })}
      </div>
      {overlap.length === 0 ? (
        <p className="text-xs opacity-70">No perfect overlap in work hours. Consider adjusting duration or time.</p>
      ) : (
        <p className="text-xs opacity-70">Green blocks indicate shared work hours; outlined region fits the meeting duration.</p>
      )}
    </div>
  );
}