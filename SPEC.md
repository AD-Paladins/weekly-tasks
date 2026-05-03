# TaskFlow - Developer Weekly Task Reporting System

## 1. Project Overview

**Project Name**: TaskFlow
**Type**: Web Application (PWA-capable)
**Core Functionality**: A zero-friction weekly task reporting system that lets developers log daily bullet points and auto-generates professional weekly summaries via AI.
**Target Users**: Software developers who need to submit weekly task reports.

---

## 2. UI/UX Specification

### Layout Structure

**Pages**:
1. `/` - Landing/Login (simplified auth)
2. `/dashboard` - Main dashboard with weekly reports list
3. `/entry` - Quick entry form for daily notes
4. `/report/[id]` - View generated weekly report

**Responsive Breakpoints**:
- Mobile: < 640px (primary focus)
- Tablet: 640px - 1024px
- Desktop: > 1024px

### Visual Design

**Color Palette**:
- Background Primary: `#0a0a0b` (near-black)
- Background Secondary: `#18181b` (zinc-900)
- Background Tertiary: `#27272a` (zinc-800)
- Text Primary: `#fafafa` (zinc-50)
- Text Secondary: `#a1a1aa` (zinc-400)
- Text Muted: `#71717a` (zinc-500)
- Accent Primary: `#22d3ee` (cyan-400)
- Accent Secondary: `#06b6d4` (cyan-500)
- Success: `#4ade80` (green-400)
- Warning: `#fbbf24` (amber-400)
- Error: `#f87171` (red-400)
- Border: `#3f3f46` (zinc-700)

**Typography**:
- Font Family: `"Inter", system-ui, sans-serif`
- Heading 1: 32px / bold
- Heading 2: 24px / semibold
- Heading 3: 18px / semibold
- Body: 14px / regular
- Small: 12px / regular

**Spacing System**:
- Base unit: 4px
- xs: 4px, sm: 8px, md: 16px, lg: 24px, xl: 32px, 2xl: 48px

**Visual Effects**:
- Cards: `border border-zinc-800 rounded-xl bg-zinc-900/50`
- Buttons: `rounded-lg px-4 py-2 font-medium transition-all`
- Inputs: `bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2`
- Shadows: `shadow-lg shadow-black/20`
- Hover states: `hover:bg-zinc-800` or `hover:border-zinc-600`

### Components

**Quick Entry Form**:
- Large textarea (min 100px height) for bullet points
- Date picker (defaults to today)
- "Save Entry" button - full width on mobile
- Character count indicator
- Auto-save draft to localStorage

**Report Dashboard**:
- Weekly summary cards in grid (1 col mobile, 2 col tablet, 3 col desktop)
- Each card shows: week range, task count, AI summary preview, status badge
- Floating action button (FAB) for quick entry on mobile
- Pull-to-refresh on mobile

**AI Summary Display**:
- Structured sections: Accomplishments, Challenges, Next Week Goals
- Copy to clipboard button
- Regenerate button (re-triggers AI)

**Status Badges**:
- Draft: `bg-zinc-700 text-zinc-300`
- Pending Review: `bg-amber-500/20 text-amber-400`
- Completed: `bg-green-500/20 text-green-400`

---

## 3. Database Schema (Prisma)

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  tasks         Task[]
  weeklyReports WeeklyReport[]
}

model Task {
  id          String   @id @default(cuid())
  userId      String
  content     String   @db.Text
  date        DateTime
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  user        User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  weeklyReport WeeklyReport?

  @@index([userId])
  @@index([date])
}

model WeeklyReport {
  id          String   @id @default(cuid())
  userId      String
  weekStart   DateTime
  weekEnd     DateTime
  aiSummary   String?  @db.Text
  status      String   @default("draft") // draft, pending, completed
  rawNotes    String?  @db.Text
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  user        User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  tasks       Task[]

  @@unique([userId, weekStart])
  @@index([userId])
  @@index([weekStart])
}
```

---

## 4. System Architecture

```
/weekly-tasks
├── prisma/
│   └── schema.prisma
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── entry/
│   │   │   └── page.tsx
│   │   ├── report/[id]/
│   │   │   └── page.tsx
│   │   └── api/
│   │       ├── tasks/
│   │       │   └── route.ts
│   │       ├── reports/
│   │       │   └── route.ts
│   │       └── ai-summary/
│   │           └── route.ts
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   └── Textarea.tsx
│   │   ├── QuickEntry.tsx
│   │   ├── ReportCard.tsx
│   │   ├── AISummary.tsx
│   │   └── Navigation.tsx
│   ├── lib/
│   │   ├── prisma.ts
│   │   └── utils.ts
│   └── types/
│       └── index.ts
├── public/
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.js
```

---

## 5. API Routes

### POST /api/tasks
- Body: `{ content: string, date: string }`
- Creates a new task entry for the user

### GET /api/reports
- Query: `{ userId: string }`
- Returns all weekly reports for the user

### POST /api/ai-summary
- Body: `{ weekStart: string, weekEnd: string }`
- Fetches tasks for the week, sends to LLM, returns synthesized summary

---

## 6. Functionality Specification

### Core Features

1. **Quick Entry**: Mobile-optimized form to log daily bullet points
2. **Weekly Report Generation**: Auto-group tasks by week
3. **AI Summarization**: LLM transforms raw notes into professional summary
4. **Report Dashboard**: View all weekly reports with status
5. **Local Draft Save**: Auto-save form content to localStorage

### User Flows

1. **Add Daily Task**:
   - Open app → Tap FAB → Enter bullet points → Save
   - Task appears in today's list

2. **Generate Weekly Report**:
   - Navigate to dashboard → Select week → Click "Generate Summary"
   - AI processes tasks → Displays structured summary

3. **View/Edit Report**:
   - Tap report card → View full summary → Copy or regenerate

---

## 7. Acceptance Criteria

- [ ] Dark mode UI renders correctly on all screen sizes
- [ ] Quick entry form saves tasks to database
- [ ] Tasks auto-group by week on dashboard
- [ ] AI summary generates coherent professional summary from bullet points
- [ ] Mobile FAB navigates to entry page
- [ ] Report cards show correct status badges
- [ ] Form inputs have proper focus states
- [ ] No layout shifts on page load
- [ ] Touch targets minimum 44px on mobile