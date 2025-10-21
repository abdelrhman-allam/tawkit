import { create } from "zustand";
import type { Participant } from "@/app/lib/url";

export type MeetingStore = {
  baseUTC: string;
  duration: number;
  participants: Participant[];
  setBaseUTC: (iso: string) => void;
  setDuration: (mins: number) => void;
  addParticipant: (p: Participant) => void;
  removeParticipant: (index: number) => void;
  setParticipants: (ps: Participant[]) => void;
  reset: () => void;
};

// Use a static default to avoid hydration mismatch, will be updated on client
const staticDefaultUTC = "2025-01-01T12:00:00.000Z";

export const useMeetingStore = create<MeetingStore>((set) => ({
  baseUTC: staticDefaultUTC,
  duration: 60,
  participants: [],
  setBaseUTC: (iso) => set({ baseUTC: iso }),
  setDuration: (mins) => set({ duration: mins }),
  addParticipant: (p) => set((s) => ({ participants: [...s.participants, p] })),
  removeParticipant: (index) => set((s) => ({ participants: s.participants.filter((_, i) => i !== index) })),
  setParticipants: (ps) => set({ participants: ps }),
  reset: () => set({ baseUTC: staticDefaultUTC, duration: 60, participants: [] }),
}));