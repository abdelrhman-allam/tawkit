# 🕐 MeetingTime.zone — Implementation Instructions

## 🎯 Project Overview

**MeetingTime.zone** is a 1-page micro-SaaS tool that helps remote teams quickly find the best overlapping times for meetings across multiple time zones.

The app should:
- Let users **add participants** with city/timezone.
- **Visualize** 24-hour timelines for each participant.
- Highlight overlapping “working hours.”
- Allow users to **generate a shareable link** containing meeting data.
- Work on both **desktop and mobile**.

No backend database is required for the MVP (data lives in URL and session).  
Optional backend (Phase 2) adds user accounts and saving features.

---

## 🧩 Core Features

| Feature | Description |
|----------|--------------|
| **Add Participants** | User adds team members and selects timezones. |
| **Base Meeting Time** | Input a proposed UTC time (e.g., “2025-10-18 T15:00Z”). |
| **Visual Grid** | Show a 24-hour horizontal timeline for each participant. |
| **Overlap Highlight** | Display colored zones: green = working, yellow = off-hours, red = sleep. |
| **Share Link** | Encode data (time + participants) into URL so others can open same view. |
| **Responsive Design** | Layout adapts to mobile screens. |
| **Dark/Light Mode** | Toggle for user preference. |

---

## 🧱 Architecture Overview

| Layer | Technology | Notes |
|-------|-------------|-------|
| **Frontend** | **Next.js 15 (App Router)** | SSR + client components |
| **Styling** | **Tailwind CSS + Framer Motion** | Simple, animated UI |
| **Time Handling** | **Luxon** | For time zone conversions |
| **State Mgmt** | **Zustand / React Context** | Lightweight global state |
| **Persistence** | **URL Query Params + LocalStorage** | No backend for MVP |
| **Hosting** | **Vercel** | Static site + minimal APIs |
| **Analytics** | **Plausible / Umami** | Lightweight, privacy-friendly |

---

## 🧮 Data Flow

### 1️⃣ Input
- Base meeting time (UTC)
- Meeting duration (default = 60 min)
- List of participants `{ name, timezone }`

### 2️⃣ Processing
- Use Luxon to convert UTC → local time for each participant.
- Classify each hour:
  - 08:00 – 18:00 = `work`
  - 06:00 – 07:59 & 18:01 – 22:00 = `off`
  - Otherwise = `sleep`

### 3️⃣ Output
- Render a horizontal timeline (24 columns per participant).
- Color each cell based on classification.
- Highlight overlapping `work` blocks across all participants.

### 4️⃣ Sharing
- Serialize state into a URL string:
