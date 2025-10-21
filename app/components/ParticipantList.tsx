"use client";
import { useMeetingStore } from "@/app/lib/store";

export default function ParticipantList() {
  const { participants, removeParticipant } = useMeetingStore();

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold">Participants</h3>
      {participants.length === 0 && (
        <p className="text-xs opacity-70">No participants yet. Add some below.</p>
      )}
      <ul className="space-y-2">
        {participants.map((p, idx) => (
          <li key={`${p.name}-${idx}`} className="flex items-center justify-between border border-black/10 dark:border-white/10 rounded-md px-3 py-2">
            <div>
              <div className="text-sm font-medium">{p.name}</div>
              <div className="text-xs opacity-70">{p.zone}</div>
            </div>
            <button
              className="text-xs rounded-md px-2 py-1 border border-rose-400 text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20"
              onClick={() => removeParticipant(idx)}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}