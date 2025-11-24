"use client";
import { useEffect, useMemo, useState } from "react";
import { useMeetingStore } from "@/app/lib/store";
import { encodeState } from "@/app/lib/url";
import { motion, AnimatePresence } from "framer-motion";

export default function ShareLink() {
  const { baseUTC, duration, participants } = useMeetingStore();
  const [copied, setCopied] = useState(false);

  const link = useMemo(() => {
    const qs = encodeState({ t: baseUTC, dur: duration, participants });
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
    const pathPrefix = basePath ? `${basePath}` : "";
    return `${origin}${pathPrefix}/${qs}`;
  }, [baseUTC, duration, participants]);

  useEffect(() => {
    if (!copied) return;
    const id = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(id);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
    } catch { }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="glass rounded-xl p-6 space-y-4 hover-lift relative"
    >
      <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        Share Link
      </h3>
      <div className="flex gap-2 items-center">
        <input
          value={link}
          readOnly
          className="flex-1 rounded-lg border border-black/10 dark:border-white/10 px-4 py-2.5 text-xs bg-background/50 backdrop-blur-sm font-mono"
        />
        <motion.button
          onClick={copy}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="rounded-lg px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg min-w-[80px]"
        >
          {copied ? "✓ Copied" : "Copy"}
        </motion.button>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {copied && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            className="absolute -top-12 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium whitespace-nowrap"
          >
            ✓ Link copied to clipboard!
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}