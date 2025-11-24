"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Navbar() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Determine current theme safely after mount
  const effectiveTheme = mounted ? (resolvedTheme ?? theme) : undefined;
  const isDark = effectiveTheme === "dark";

  function toggleTheme() {
    setTheme(isDark ? "light" : "dark");
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`sticky top-0 z-50 w-full flex items-center justify-between py-4 px-6 border-b transition-all duration-300 ${
        scrolled
          ? "glass-strong shadow-md border-black/10 dark:border-white/10"
          : "bg-background/80 backdrop-blur-sm border-black/5 dark:border-white/5"
      }`}
    >
      <div className="flex items-center gap-2">
        <motion.span
          className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          🕐 MeetingTime.zone
        </motion.span>
      </div>
      <div className="flex items-center gap-3">
        {/* Sun/Moon slide toggle */}
        <motion.button
          type="button"
          onClick={toggleTheme}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative h-8 w-16 rounded-full border border-black/10 dark:border-white/20 bg-gradient-to-r from-blue-500/10 to-purple-500/10 overflow-hidden hover-lift"
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
              className="h-7 w-7 rounded-full bg-white dark:bg-gray-800 shadow-lg border border-black/10 dark:border-white/10 absolute top-0.5 left-0.5 flex items-center justify-center"
            >
              <span className="text-xs">{isDark ? "🌙" : "🌞"}</span>
            </motion.div>
          )}
        </motion.button>
      </div>
    </motion.nav>
  );
}