"use client";
import { useEffect, useMemo, useState } from "react";
import { useMeetingStore } from "@/app/lib/store";
import { encodeState } from "@/app/lib/url";

export default function ShareLink() {
  const { baseUTC, duration, participants } = useMeetingStore();
  const [copied, setCopied] = useState(false);

  const link = useMemo(() => {
    const qs = encodeState({ t: baseUTC, dur: duration, participants });
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    return `${origin}/${qs}`;
  }, [baseUTC, duration, participants]);

  useEffect(() => {
    if (!copied) return;
    const id = setTimeout(() => setCopied(false), 1500);
    return () => clearTimeout(id);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
    } catch {}
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold">Share</h3>
      <div className="flex gap-2 items-center">
        <input value={link} readOnly className="flex-1 rounded-md border border-black/10 dark:border-white/10 px-3 py-2 text-xs bg-transparent" />
        <button onClick={copy} className="rounded-md px-3 py-2 text-sm border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/15">
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
    </div>
  );
}