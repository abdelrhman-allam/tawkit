"use client";
import { useState, useEffect } from "react";
import TimezoneInput from "./TimezoneInput";
import { useMeetingStore } from "@/app/lib/store";
import { DateTime } from "luxon";
import DatePicker from "react-datepicker";

export default function MeetingForm() {
  const { baseUTC, setBaseUTC, duration, setDuration, addParticipant } = useMeetingStore();
  const [name, setName] = useState("");
  const [zone, setZone] = useState("UTC");
  // Default zone to user timezone on mount
  useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (tz) setZone(tz);
    } catch {}
  }, []);

  // Track local timezone for combining date/time selections
  const [localZone, setLocalZone] = useState<string>("UTC");
  useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      setLocalZone(tz ?? "UTC");
    } catch {}
  }, []);

  // Local date/time state derived from baseUTC (always UTC when stored)
  const [dateObj, setDateObj] = useState<Date | null>(null);
  const [timeObj, setTimeObj] = useState<Date | null>(null);

  useEffect(() => {
    try {
      // Convert stored UTC to local zone for UI pickers
      const dtLocal = DateTime.fromISO(baseUTC, { zone: localZone });
      setDateObj(dtLocal.startOf("day").toJSDate());
      setTimeObj(dtLocal.toJSDate());
    } catch {}
  }, [baseUTC, localZone]);

  function updateBaseFromParts(nextDate: Date | null, nextTime: Date | null) {
    // Use current state if not provided
    const dSource = nextDate ?? dateObj;
    const tSource = nextTime ?? timeObj;
    // If either is missing, do not update yet
    if (!dSource || !tSource) return;

    const dLocal = DateTime.fromJSDate(dSource, { zone: localZone });
    const tLocal = DateTime.fromJSDate(tSource, { zone: localZone });
    const combined = DateTime.fromObject(
      {
        year: dLocal.year,
        month: dLocal.month,
        day: dLocal.day,
        hour: tLocal.hour,
        minute: tLocal.minute,
      },
      { zone: localZone }
    ).toUTC();
    setBaseUTC(combined.toISO());
  }

  function addCurrentParticipant() {
    if (!zone) return;
    const pName = name.trim() || zone;
    addParticipant({ name: pName, zone });
    setName("");
    setZone("UTC");
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Date</label>
        <DatePicker
          selected={dateObj}
          onChange={(d: Date | null) => {
            setDateObj(d);
            updateBaseFromParts(d, null);
          }}
          dateFormat="yyyy-MM-dd"
          placeholderText="Select date"
          className="w-full rounded-md border border-black/10 dark:border-white/10 px-3 py-2 text-sm bg-transparent"
          calendarStartDay={1}
        />
      </div>

      <div>
        <label className="text-sm font-medium">Time</label>
        <DatePicker
          selected={timeObj}
          onChange={(t: Date | null) => {
            setTimeObj(t);
            updateBaseFromParts(null, t);
          }}
          showTimeSelect
          showTimeSelectOnly
          timeIntervals={15}
          timeCaption="Time"
          dateFormat="HH:mm"
          placeholderText="Select time"
          className="w-full rounded-md border border-black/10 dark:border-white/10 px-3 py-2 text-sm bg-transparent"
        />
        <p className="text-xs opacity-70 mt-1">Combined ISO (UTC): {baseUTC}</p>
      </div>

      <div>
        <label className="text-sm font-medium">Duration (minutes)</label>
        <input
          type="number"
          min={15}
          step={15}
          value={duration}
          onChange={(e) => setDuration(parseInt(e.target.value, 10) || 60)}
          className="w-full rounded-md border border-black/10 dark:border-white/10 px-3 py-2 text-sm bg-transparent"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Add Participant</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-md border border-black/10 dark:border-white/10 px-3 py-2 text-sm bg-transparent"
          placeholder="Name (optional)"
        />
        <TimezoneInput value={zone} onChange={setZone} />
        <button
          onClick={addCurrentParticipant}
          className="mt-2 rounded-md px-3 py-2 text-sm border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/15"
        >
          Add Participant
        </button>
      </div>
    </div>
  );
}