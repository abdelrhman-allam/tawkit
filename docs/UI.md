# 🧭 MEETINGTIME.ZONE — Developer Build Plan (Enhanced UI/UX)

## 🎨 UI/UX Vision

**Goal:**  
Make scheduling across time zones **visually intuitive**, **frictionless**, and **aesthetically modern**.

**Tone:**  
Professional + minimalist + confident — “Calendly meets Notion”.

**Design Keywords:**  
Clean, minimal, dark-mode friendly, smooth animations, 1-screen experience.

**Framework:**  
- Next.js 15 (App Router)
- Tailwind CSS + shadcn/ui components
- Framer Motion for transitions
- Lucide-react icons

---

## 🧩 Phase 1 — UI/UX Layout

### 🧱 Page Layout
**Components:**
- `Navbar` — logo + dark/light toggle  
- `MeetingForm` — form inputs + participant manager  
- `TimelineGrid` — visual timeline of time zones  
- `ShareBar` — share link + copy button  
- `Footer` — copyright + attribution  

**Grid Layout (Desktop):**

---

## 🎛️ Phase 2 — UI Components & Behaviors

### 1. Navbar
- Fixed top bar.
- Logo left: “🕐 MeetingTime.zone”
- Right: Dark/light mode toggle (use system preference default).
- Add subtle drop shadow when scrolling.

### 2. Meeting Form
- Input fields:
  - “Meeting Start Time” (datetime-local)
  - “Duration” (minutes)
  - “Add Participant”:
    - Name
    - Timezone (searchable dropdown — use `Intl.supportedValuesOf('timeZone')`)
- Add participant cards inline below form (editable/removable).
- Use glassmorphism cards with hover lift animation.
- Buttons: rounded-lg, accent color `blue-500`, subtle gradient hover.

### 3. Timeline Grid
- Horizontal scrollable grid.
- Each row = 1 participant.
- Columns = 24 hours (00 → 23).
- Color-coded cells:
  - 🟩 Work hours (8–18)
  - 🟨 Off hours (6–8 / 18–22)
  - 🟥 Sleep (22–6)
- Tooltip on hover: local time + label.
- Animate transitions on time change.
- Highlight “overlap zone” (shared working hours) with glowing border.

### 4. ShareBar
- Show generated URL once data entered.
- “Copy Link” button with success animation.
- Share via Clipboard API + toast feedback (“Link copied ✅”).

### 5. Footer
- Minimal text: “© 2025 MeetingTime.zone – Built for remote teams”
- Light gray text on dark backgrounds, no distractions.

---

## ⚙️ Phase 3 — Core Logic

**Main state (Zustand):**
```ts
{
  baseTime: ISOString,
  duration: number,
  participants: [{ name: string; timezone: string }],
}
