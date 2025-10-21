"use client";
import Navbar from "./Navbar";
import MeetingForm from "./MeetingForm";
import ParticipantList from "./ParticipantList";
import TimelineGrid from "./TimelineGrid";
import OverlapBar from "./OverlapBar";
import WorldMap from "./WorldMap";
import ShareLink from "./ShareLink";
import Footer from "./Footer";
import { useEffect } from "react";
import { useMeetingStore } from "@/app/lib/store";
import type { MeetingState } from "@/app/lib/url";

export default function HomeClient({ initialState }: { initialState: MeetingState | null }) {
  const { baseUTC, setBaseUTC, setDuration, setParticipants } = useMeetingStore();

  useEffect(() => {
    if (initialState) {
      // Apply URL-decoded state
      setBaseUTC(initialState.t);
      setDuration(initialState.dur);
      setParticipants(initialState.participants);
    } else if (baseUTC === "2025-01-01T12:00:00.000Z") {
      // Update to current time + 1 hour only if still using static default
      const dynamicDefault = new Date(Date.now() + 60 * 60 * 1000).toISOString();
      setBaseUTC(dynamicDefault);
    }
  }, [initialState, baseUTC, setBaseUTC, setDuration, setParticipants]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 w-full max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <MeetingForm />
          <ParticipantList />
          <ShareLink />
        </div>
        <div className="space-y-6">
          <OverlapBar />
          <WorldMap />
          <TimelineGrid />
        </div>
      </div>
      <Footer />
    </div>
  );
}