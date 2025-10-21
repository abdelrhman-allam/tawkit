export type Participant = { name: string; zone: string };

export type MeetingState = {
  t: string; // ISO UTC string
  dur: number; // minutes
  participants: Participant[];
};

function serializeParticipants(participants: Participant[]): string {
  // Encode as name@zone, joined by |
  return participants
    .map((p) => `${encodeURIComponent(p.name)}@${encodeURIComponent(p.zone)}`)
    .join("|");
}

function deserializeParticipants(usersParam: string | null): Participant[] {
  if (!usersParam) return [];
  // Support both | and , separators; and either name@zone or plain zone
  const rawItems = usersParam.split(/[|,]/);
  return rawItems
    .map((item) => item.trim())
    .filter(Boolean)
    .map((token) => {
      const [nameEnc, zoneEnc] = token.includes("@")
        ? token.split("@")
        : ["", token];
      const name = decodeURIComponent(nameEnc || "");
      const zone = decodeURIComponent(zoneEnc);
      return { name: name || zone, zone };
    });
}

export function encodeState(state: MeetingState): string {
  const params = new URLSearchParams();
  params.set("t", state.t);
  params.set("dur", String(state.dur));
  params.set("users", serializeParticipants(state.participants));
  return `?${params.toString()}`;
}

export function decodeState(searchParams: URLSearchParams): MeetingState | null {
  const t = searchParams.get("t");
  const durRaw = searchParams.get("dur");
  const usersRaw = searchParams.get("users");
  if (!t && !durRaw && !usersRaw) return null;
  const dur = durRaw ? parseInt(durRaw, 10) : 60;
  const participants = deserializeParticipants(usersRaw);
  return { t: t || new Date(Date.now() + 60 * 60 * 1000).toISOString(), dur, participants };
}

export function buildShareUrl(state: MeetingState, origin?: string) {
  const base = origin || (typeof window !== "undefined" ? window.location.origin : "");
  return `${base}/${encodeState(state)}`;
}