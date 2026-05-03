# TaskFlow - Developer Weekly Task Reporting System

## 1. Project Overview

**Project Name**: TaskFlow
**Type**: Web Application (PWA-capable)
**Core Functionality**: A zero-friction weekly task reporting system that lets developers log daily bullet points and auto-generates professional weekly summaries via AI.
**Target Users**: Software developers and team administrators.

---

## 2. UI/UX Specification

### Layout Structure

**Pages**:
1. `/` - Landing page (redirects to login if not authenticated)
2. `/login` - Sign in page
3. `/register` - User registration page
4. `/dashboard` - Main dashboard with weekly reports list
5. `/entry` - Quick entry form for daily notes
6. `/report/[id]` - View generated weekly report
7. `/admin` - Admin dashboard (ADMIN only)

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

**AI Summary Display**:
- Structured sections: Accomplishments, Challenges, Next Week Goals
- Copy to clipboard button
- Regenerate button (re-triggers AI)

**Status Badges**:
- Draft: `bg-zinc-700 text-zinc-300`
- Pending Review: `bg-amber-500/20 text-amber-400`
- Completed: `bg-green-500/20 text-green-400`

**Admin Dashboard**:
- User list with role badges
- Enable/Disable user toggle
- Delete user action

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

enum Role {
  ADMIN
  DEVELOPER
}

model User {
  id           String   @id @default(cuid())
  email        String   @unique
  name         String
  password     String
  role         Role     @default(DEVELOPER)
  isActive     Boolean  @default(true)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  tasks         Task[]
  weeklyReports WeeklyReport[]
}

model Task {
  id        String   @id @default(cuid())
  userId    String
  content   String   @db.Text
  date      DateTime
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([date])
}

model WeeklyReport {
  id          String    @id @default(cuid())
  userId      String
  weekStart   DateTime
  weekEnd     DateTime
  aiSummary   String?   @db.Text
  status      String    @default("draft")
  rawNotes    String?   @db.Text
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  user        User       @relation(fields: [userId], references: [id], onDelete: Cascade)

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
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── entry/page.tsx
│   │   ├── report/[id]/page.tsx
│   │   ├── admin/page.tsx
│   │   └── api/
│   │       ├── auth/[...nextauth]/route.ts
│   │       ├── auth/register/route.ts
│   │       ├── tasks/route.ts
│   │       ├── reports/route.ts
│   │       ├── reports/[id]/route.ts
│   │       ├── ai-summary/route.ts
│   │       └── admin/
│   │           ├── users/route.ts
│   │           ├── users/[id]/route.ts
│   │           └── reports/route.ts
│   ├── components/
│   │   ├── AuthProvider.tsx
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
│   │   ├── auth.ts
│   │   └── utils.ts
│   ├── middleware.ts
│   └── types/
│       └── index.ts
├── public/
├── package.json
├── tailwind.config.ts
├── tsconfig.json
├── next.config.js
├── .env
└── .env.example
```

---

## 5. Authentication & Authorization

### Roles
- **ADMIN**: Can view all users, enable/disable users, delete users, view all reports
- **DEVELOPER**: Can only view and manage their own tasks and reports

### Authentication
- NextAuth.js v5 with credentials provider
- JWT-based sessions
- Passwords hashed with bcrypt

### Environment Variables
```
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
OPENAI_API_KEY="sk-..."
```

---

## 6. API Routes

### Authentication
- `POST /api/auth/register` - Register new user (role: DEVELOPER)
- `GET/POST /api/auth/[...nextauth]` - NextAuth handlers

### Tasks (Protected - Authenticated users)
- `POST /api/tasks` - Create task for current user
- `GET /api/tasks` - Get tasks for current user

### Reports (Protected - Authenticated users)
- `GET /api/reports` - Get reports for current user
- `PATCH /api/reports` - Update report status/summary
- `GET /api/reports/[id]` - Get single report

### AI Summary (Protected - Authenticated users)
- `POST /api/ai-summary` - Generate AI summary for user's week

### Admin (Protected - ADMIN only)
- `GET /api/admin/users` - List all users
- `PATCH /api/admin/users` - Enable/disable user
- `DELETE /api/admin/users/[id]` - Delete user
- `GET /api/admin/reports` - View all reports

---

## 7. Functionality Specification

### Core Features

1. **Quick Entry**: Mobile-optimized form to log daily bullet points
2. **Weekly Report Generation**: Auto-group tasks by week
3. **AI Summarization**: LLM transforms raw notes into professional summary
4. **Report Dashboard**: View all weekly reports with status
5. **Local Draft Save**: Auto-save form content to localStorage
6. **User Authentication**: Email/password login with NextAuth
7. **Role-Based Access**: ADMIN and DEVELOPER roles
8. **Admin Dashboard**: Manage users (enable/disable/delete)

### User Flows

1. **Register/Login**:
   - New users register at `/register`
   - Existing users sign in at `/login`
   - After login, redirect to `/dashboard`

2. **Add Daily Task**:
   - Tap FAB or navigate to `/entry`
   - Enter bullet points → Save
   - Auto-creates weekly report if not exists

3. **Generate Weekly Report**:
   - Navigate to dashboard → Select week → Click "Generate Summary"
   - AI processes tasks → Displays structured summary

4. **Admin User Management**:
   - Admin navigates to `/admin`
   - View all users, toggle active status, delete users

---

## 8. Acceptance Criteria

- [x] Dark mode UI renders correctly on all screen sizes
- [x] Quick entry form saves tasks to database
- [x] Tasks auto-group by week on dashboard
- [x] AI summary generates coherent professional summary from bullet points
- [x] Mobile FAB navigates to entry page
- [x] Report cards show correct status badges
- [x] Form inputs have proper focus states
- [x] No layout shifts on page load
- [x] Touch targets minimum 44px on mobile
- [x] Multi-user support with authentication
- [x] Role-based access control (ADMIN/DEVELOPER)
- [x] Admin can manage users (enable/disable/delete)
- [x] Protected routes require authentication
- [x] Admin-only routes restricted to ADMIN role