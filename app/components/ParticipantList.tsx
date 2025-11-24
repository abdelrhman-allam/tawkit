"use client";
import { useMeetingStore } from "@/app/lib/store";
import { motion, AnimatePresence } from "framer-motion";

export default function ParticipantList() {
  const { participants, removeParticipant } = useMeetingStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.05 }}
      className="glass rounded-xl p-6 space-y-4 hover-lift"
    >
      <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        Participants
      </h3>
      {participants.length === 0 && (
        <p className="text-sm opacity-60 text-center py-4">
          No participants yet. Add some above.
        </p>
      )}
      <ul className="space-y-3">
        <AnimatePresence mode="popLayout">
          {participants.map((p, idx) => (
            <motion.li
              key={`${p.name}-${idx}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20, height: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-between border border-black/10 dark:border-white/10 rounded-lg px-4 py-3 bg-gradient-to-r from-blue-500/5 to-purple-500/5 hover-lift"
            >
              <div>
                <div className="text-sm font-medium">{p.name}</div>
                <div className="text-xs opacity-70 font-mono">{p.zone}</div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-xs rounded-lg px-3 py-1.5 border border-rose-400 text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors duration-200 font-medium"
                onClick={() => removeParticipant(idx)}
              >
                Remove
              </motion.button>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </motion.div>
  );
}