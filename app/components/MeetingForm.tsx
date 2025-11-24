"use client";
import { useState, useEffect } from "react";
import TimezoneInput from "./TimezoneInput";
import { useMeetingStore } from "@/app/lib/store";
import { DateTime } from "luxon";
import DatePicker from "react-datepicker";
import { motion } from "framer-motion";

export default function MeetingForm() {
  const { baseUTC, setBaseUTC, duration, setDuration, addParticipant } = useMeetingStore();
  const [name, setName] = useState("");
  const [zone, setZone] = useState("UTC");
  // Default zone to user timezone on mount
  useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (tz) setZone(tz);
    } catch { }
  }, []);

  // Track local timezone for combining date/time selections
  const [localZone, setLocalZone] = useState<string>("UTC");
  useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      setLocalZone(tz ?? "UTC");
    } catch { }
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
    } catch { }
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
    const iso = combined.toISO();
    if (iso) setBaseUTC(iso);
  }

  function addCurrentParticipant() {
    if (!zone) return;
    const pName = name.trim() || zone;
    addParticipant({ name: pName, zone });
    setName("");
    setZone("UTC");
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass rounded-xl p-6 space-y-5 hover-lift"
    >
      <h2 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        Meeting Details
      </h2>

      {/* Date & Time Section */}
      <div className="space-y-4 p-4 rounded-lg bg-gradient-to-r from-blue-500/5 to-purple-500/5 border border-black/5 dark:border-white/5">
        <div className="space-y-2">
          <label className="text-sm font-medium block">Date</label>
          <DatePicker
            selected={dateObj}
            onChange={(d: Date | null) => {
              setDateObj(d);
              updateBaseFromParts(d, null);
            }}
            dateFormat="yyyy-MM-dd"
            placeholderText="Select date"
            className="w-full rounded-lg border border-black/10 dark:border-white/10 px-4 py-2.5 text-sm bg-background/50 backdrop-blur-sm transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            calendarStartDay={1}
          />

          {/* Quick Select Buttons */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                const today = new Date();
                setDateObj(today);
                updateBaseFromParts(today, null);
              }}
              className="px-3 py-1.5 text-xs rounded-md bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 transition-colors duration-200"
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => {
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                setDateObj(tomorrow);
                updateBaseFromParts(tomorrow, null);
              }}
              className="px-3 py-1.5 text-xs rounded-md bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 transition-colors duration-200"
            >
              Tomorrow
            </button>
            <button
              type="button"
              onClick={() => {
                const nextWeek = new Date();
                nextWeek.setDate(nextWeek.getDate() + 7);
                setDateObj(nextWeek);
                updateBaseFromParts(nextWeek, null);
              }}
              className="px-3 py-1.5 text-xs rounded-md bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 transition-colors duration-200"
            >
              Next Week
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium block">Time</label>
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
            className="w-full rounded-lg border border-black/10 dark:border-white/10 px-4 py-2.5 text-sm bg-background/50 backdrop-blur-sm transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
          <div className="flex items-center gap-2 text-xs opacity-60 mt-1.5">
            <span className="font-mono">UTC: {baseUTC}</span>
            <span>•</span>
            <span>Your timezone: {localZone}</span>
          </div>
        </div>
      </div>


      {/* Duration Section */}
      <div className="space-y-3">
        <label className="text-sm font-medium block">Duration</label>

        {/* Quick Select Duration Buttons */}
        <div className="grid grid-cols-4 gap-2">
          {[15, 30, 45, 60].map((mins) => (
            <button
              key={mins}
              type="button"
              onClick={() => setDuration(mins)}
              className={`px-3 py-2 text-sm rounded-lg border transition-all duration-200 ${duration === mins
                  ? "bg-blue-500 text-white border-blue-500 shadow-md"
                  : "bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/20"
                }`}
            >
              {mins} min
            </button>
          ))}
        </div>

        {/* Custom Duration Input */}
        <div className="flex items-center gap-2">
          <span className="text-xs opacity-60">Custom:</span>
          <input
            type="number"
            min={5}
            step={5}
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value, 10) || 60)}
            className="flex-1 rounded-lg border border-black/10 dark:border-white/10 px-3 py-2 text-sm bg-background/50 backdrop-blur-sm transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            placeholder="Enter minutes"
          />
          <span className="text-xs opacity-60">minutes</span>
        </div>
      </div>

      <div className="pt-4 border-t border-black/10 dark:border-white/10 space-y-3">
        <label className="text-sm font-medium block">Add Participant</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg border border-black/10 dark:border-white/10 px-4 py-2.5 text-sm bg-background/50 backdrop-blur-sm transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          placeholder="Name (optional)"
        />
        <TimezoneInput value={zone} onChange={setZone} />
        <motion.button
          onClick={addCurrentParticipant}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full rounded-lg px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
        >
          Add Participant
        </motion.button>
      </div>
    </motion.div>
  );
}