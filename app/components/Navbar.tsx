"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Navbar() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Determine current theme safely after mount
  const effectiveTheme = mounted ? (resolvedTheme ?? theme) : undefined;
  const isDark = effectiveTheme === "dark";

  function toggleTheme() {
    setTheme(isDark ? "light" : "dark");
  }

  return (
    <nav className="w-full flex items-center justify-between py-4 px-6 border-b border-black/10 dark:border-white/10">
      <div className="flex items-center gap-2">
        <span className="text-xl font-semibold">🕐 MeetingTime.zone</span>
      </div>
      <div className="flex items-center gap-3">
        {/* Sun/Moon slide toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          className="relative h-8 w-16 rounded-full border border-black/10 dark:border-white/20 bg-black/5 dark:bg-white/10 overflow-hidden"
        >
          {/* Track icons */}
          <div className="absolute inset-0 flex items-center justify-between px-2 text-yellow-500 dark:text-yellow-400">
            <span className="text-sm">🌞</span>
            <span className="text-sm">🌙</span>
          </div>
          {/* Sliding knob */}
          {mounted && (
            <motion.div
              layout
              initial={false}
              animate={{ x: isDark ? 32 : 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="h-7 w-7 rounded-full bg-white dark:bg-black shadow-sm border border-black/10 dark:border-white/10 absolute top-0.5 left-0.5 flex items-center justify-center"
            >
              <span className="text-xs">{isDark ? "🌙" : "🌞"}</span>
            </motion.div>
          )}
        </button>
        {/* Optional: quick System button to respect OS preference */}
        <button
          className="rounded-md px-3 py-1 text-sm border border-black/10 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/10"
          onClick={() => setTheme("system")}
        >
          System
        </button>
      </div>
    </nav>
  );
}