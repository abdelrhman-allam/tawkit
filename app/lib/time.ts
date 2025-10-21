import { DateTime } from "luxon";

export type HourStatus = "work" | "off" | "sleep";

export function convertToLocal(baseUTC: string, zone: string) {
  const base = DateTime.fromISO(baseUTC, { zone: "utc" });
  return base.setZone(zone);
}

export function getHourStatus(hour: number): HourStatus {
  if (hour >= 8 && hour <= 18) return "work";
  if ((hour >= 6 && hour < 8) || (hour > 18 && hour <= 22)) return "off";
  return "sleep";
}

export function buildDayHours(baseUTC: string, zone: string) {
  // Align columns by UTC hours so all participants share the same column time
  const baseUtc = DateTime.fromISO(baseUTC, { zone: "utc" });
  const startOfUtcDay = baseUtc.startOf("day");
  return Array.from({ length: 24 }, (_, i) => {
    const utcHour = startOfUtcDay.plus({ hours: i });
    const local = utcHour.setZone(zone);
    const hour = local.hour;
    return {
      index: i,
      label: local.toFormat("HH"),
      status: getHourStatus(hour) as HourStatus,
      dateTime: local,
    };
  });
}

export function computeOverlapIndices(statusRows: HourStatus[][]): number[] {
  if (statusRows.length === 0) return [];
  const cols = statusRows[0].length;
  const result: number[] = [];
  for (let c = 0; c < cols; c++) {
    const allWork = statusRows.every((row) => row[c] === "work");
    if (allWork) result.push(c);
  }
  return result;
}

export function suggestBestStart(overlapIndices: number[], durationMinutes: number) {
  // Simple heuristic: choose earliest overlapping hour; duration rounds to hours
  const requiredHours = Math.max(1, Math.ceil(durationMinutes / 60));
  for (let i = 0; i < overlapIndices.length; i++) {
    const start = overlapIndices[i];
    let ok = true;
    for (let k = 1; k < requiredHours; k++) {
      if (!overlapIndices.includes(start + k)) { ok = false; break; }
    }
    if (ok) return start;
  }
  return overlapIndices[0] ?? null;
}