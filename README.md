# 🏥 Shopner Coat — Medical Admission Examination & Merit Analytics Portal

> **Production-Grade Next.js 16 Web Application for Medical College Admission Mock Tests, Seat Allocation, Holographic Admit Cards, Dense Merit Standings & Administrative Operations.**

---

## 📌 Table of Contents

1. [Executive Overview](#1-executive-overview)
2. [Technology Stack & System Architecture](#2-technology-stack--system-architecture)
3. [Project Directory & File Structure](#3-project-directory--file-structure)
4. [Authentication & Authorization Lifecycle](#4-authentication--authorization-lifecycle)
5. [Student Dashboard Suite (7 Portals)](#5-student-dashboard-suite-7-portals)
6. [Admin Management Suite (9 Portals)](#6-admin-management-suite-9-portals)
7. [BFF (Backend For Frontend) Proxy Architecture](#7-bff-backend-for-frontend-proxy-architecture)
8. [Complete REST API Contract & Integration Specifications](#8-complete-rest-api-contract--integration-specifications)
9. [Installation, Environment & Production Build](#9-installation-environment--production-build)

---

## 1. Executive Overview

**Shopner Coat** (স্বপ্নার কোট) is a high-performance web platform engineered for medical college admission candidates (HSC 1st & 2nd Timers) and central examination administrators. 

### Key Highlights:
- **Interactive 3D Three.js Visualizations**: Interactive WebGL holograms (DNA helix, golden podium, radio beacon, admission pass shield) reacting to mouse parallax.
- **Biometric Security & Digital QR Passes**: Cryptographically verifiable Admit Cards with QR tokens for gate invigilator scanning.
- **Smart Seat Plan Engine**: Automated roll-ordered seat allocation across physical examination halls, centres, and rooms.
- **Dense 4-Tier Merit Rankings**: Real-time percentile calibration with tiebreakers (`obtainedMarks DESC` → `correctAnswered DESC` → `wrongAnswered ASC` → `totalAnswered DESC`).
- **Complete Administrative Control**: End-to-end exam lifecycle management, bulk OMR mark entries, batch PDF generation via BullMQ, and real-time audit logging.

---

## 2. Technology Stack & System Architecture

```
                                  ┌────────────────────────────────────────┐
                                  │      Shopner Coat Client UI (Web)      │
                                  │   Next.js 16 (App Router) + React 19   │
                                  └──────────────────┬─────────────────────┘
                                                     │
                             ┌───────────────────────┴───────────────────────┐
                             │                                               │
               ┌─────────────▼─────────────┐                   ┌─────────────▼─────────────┐
               │  Server Actions & SSR     │                   │  BFF Route Proxies        │
               │  (Next.js Server Runtime) │                   │  (/api/bff/* API Routes)  │
               └─────────────┬─────────────┘                   └─────────────┬─────────────┘
                             │                                               │
                             └───────────────────────┬───────────────────────┘
                                                     │ HTTP / REST (JWT Bearer)
                                       ┌─────────────▼─────────────┐
                                       │   Shopner Coat NestJS     │
                                       │   Central Backend Engine  │
                                       │ (api.shopnercoat.xyz/v1)  │
                                       └─────────────┬─────────────┘
                                                     │
                             ┌───────────────────────┴───────────────────────┐
                             │                                               │
               ┌─────────────▼─────────────┐                   ┌─────────────▼─────────────┐
               │    PostgreSQL / Prisma    │                   │   Cloudinary + BullMQ     │
               │    (Database Engine)      │                   │ (PDF Pass & Email Worker) │
               └───────────────────────────┘                   └───────────────────────────┘
```

| Layer | Technologies |
|---|---|
| **Framework** | Next.js 16.3.3 (App Router, Turbopack, React 19) |
| **Language & Types** | TypeScript 5.8 (Strict type checking, zero `any` in core pipelines) |
| **Styling & Design System** | Tailwind CSS v4, CSS Variables, Custom Medical Color Tokens (`#00594D`, `#06B6D4`, `#10B981`) |
| **Animation & 3D Graphics** | Three.js, `@react-three/fiber`, `@react-three/drei`, Motion (`framer-motion`) |
| **Forms & Validation** | React Hook Form, Zod v3 |
| **Data Fetching** | Server Components with `server-only` client, Next.js BFF proxy routes, Cache revalidation |
| **Icons & Media** | Lucide React, Cloudinary CDN (.webp optimization, RAW PDF streaming) |

---

## 3. Project Directory & File Structure

```
d:/edu/ShopnerCoat-Frontend/
├── public/                                # Static images, brand assets & favicons
├── src/
│   ├── app/                               # Next.js App Router Root
│   │   ├── (auth)/                        # Authentication Route Group
│   │   │   ├── complete-profile/          # 2nd step registration (roll & reg # assignment)
│   │   │   ├── login/                     # 3-Way login (Mobile, Email, Roll #)
│   │   │   ├── register/                  # OTP registration step 1
│   │   │   └── verify-otp/                # 6-Digit SMS OTP verification
│   │   ├── (public)/                      # Public Marketing & Information Routes
│   │   │   ├── announcements/             # Public circulars feed
│   │   │   ├── how-to-register/           # Registration visual guide
│   │   │   ├── ranking/                   # Public Top-3 laurels snapshot
│   │   │   └── page.tsx                   # Landing Page
│   │   ├── admin/login/                   # Dedicated Admin Authentication
│   │   ├── admit-cards/verify/[token]/    # Invigilator QR verification gate
│   │   ├── api/bff/                       # Backend For Frontend API Proxy Layer
│   │   │   ├── admin/audit-logs/          # Admin audit logs proxy
│   │   │   ├── admit-cards/               # Digital admit cards proxy
│   │   │   ├── announcements/             # Bulletins proxy
│   │   │   ├── auth/                      # Authentication & token proxy
│   │   │   ├── enrollments/               # Exam registrations proxy
│   │   │   ├── exams/                     # Model test discovery proxy
│   │   │   ├── rankings/                  # Leaderboard proxy
│   │   │   ├── results/                   # Scorecard & merit proxy
│   │   │   ├── students/                  # Candidate identity & stats proxy
│   │   │   └── upload/                    # Cloudinary upload proxy
│   │   └── dashboard/                     # Authenticated Dashboard Portals
│   │       ├── admin/                     # 🛡️ Admin Management Suite (9 Portals)
│   │       │   ├── admit-cards/           # Batch PDF generation & email tracking
│   │       │   ├── announcements/         # Circulars authoring & management
│   │       │   ├── enrollments/           # Candidate seat roster
│   │       │   ├── exams/                 # Exam lifecycle & venue configuration
│   │       │   ├── rankings/              # Top-3 national laurel publisher
│   │       │   ├── results/               # Mark entry & merit publishing
│   │       │   ├── settings/              # System configurations
│   │       │   ├── students/              # Candidate directory & identity
│   │       │   └── page.tsx               # Admin KPI Executive Overview
│   │       └── student/                   # 🎓 Student Candidate Suite (7 Portals)
│   │           ├── admit-cards/           # Digital hall passes & printable paper
│   │           ├── announcements/         # Official notices & circulars
│   │           ├── enrollments/           # Registered mock tests & seat allocation
│   │           ├── exams/                 # Model test catalog & self-enrollment
│   │           ├── profile/               # Personal credentials & password change
│   │           ├── rankings/              # National leaderboard & merit standings
│   │           ├── results/               # Scorecards & subject breakdown
│   │           └── page.tsx               # Student Analytics & Progression Home
│   ├── components/                        # Reusable Presentation & 3D Components
│   │   ├── admin/                         # Admin UI Modules (Overview, Exams, Students, etc.)
│   │   ├── student/                       # Student UI Modules (3D Visualizers, Cards, Modals)
│   │   │   ├── admit-cards/               # 3D Pass Shield, Pass Cards, Print Modal
│   │   │   ├── announcements/             # 3D Radio Beacon, Notice Cards, Detail Modal
│   │   │   ├── dashboard/                 # 3D Matrix, Progression Spline, Negative Audit
│   │   │   ├── enrollments/               # 3D Holographic Pass, Ticket Cards
│   │   │   ├── exams/                     # 3D Subject Spheres, Syllabus Breakdown
│   │   │   ├── profile/                   # 3D Aspirant DNA, Personal Form, Security Form
│   │   │   ├── rankings/                  # 3D Gold Podium, Top 3 Laureates, Merit Table
│   │   │   └── results/                   # 3D Golden Laurel, Scorecards, Subject Modal
│   │   └── ui/                            # Base UI Primitives (Button, Modal, Dropdown, Badges)
│   ├── constants/                         # Global routes, API base URLs & config constants
│   ├── features/                          # Feature-specific Server Actions & Schemas
│   ├── lib/                               # Core utilities, API client & token cookie helpers
│   ├── schemas/                           # Zod validation schemas
│   ├── server/                            # Server-side service fetchers
│   └── types/                             # TypeScript type declarations & interfaces
└── package.json                           # Dependencies and build scripts
```

---

## 4. Authentication & Authorization Lifecycle

```
[ Step 1: POST /auth/register ] ───► Sends 6-Digit SMS OTP
                │
                ▼
[ Step 2: POST /auth/verify-otp ] ──► Returns single-use 'verifiedToken'
                │
                ▼
[ Step 3: POST /students/complete-profile ] ──► Cryptographically generates 7-digit Roll # & Reg #
                │
                ▼
[ Step 4: POST /auth/login ] ──► Issues 'accessToken' (1 day) & 'refreshToken' (7 days)
```

### Roles & Access Matrix:
- **`STUDENT`**: Access to `/dashboard/student/*`, exam enrollment, admit card downloads, personal results, merit rank standing.
- **`ADMIN`**: Access to `/dashboard/admin/*`, exam creation, seat assignment, result publish, admit card batch generation.
- **`PUBLIC`**: Landing page, how to register, public announcements, published Top-3 rankings, gate QR verification (`/admit-cards/verify/:token`).

---

## 5. Student Dashboard Suite (7 Portals)

### 1. 📈 Dashboard Home & Analytics (`/dashboard/student`)
- **Three.js 3D Calibration Matrix (`Student3DCalibrationMatrix`)**: 3D gyroscope core reacting to cursor movements.
- **Performance Progression Curve**: Multi-series trajectory spline comparing candidate score vs Top-10 benchmark.
- **Negative Marking Audit**: Penalty deductions breakdown (-0.25 marks per wrong answer).
- **Upcoming Test Countdown**: Real-time countdown timer to the next scheduled mock test.
- **Recent Scorecards**: Dense rankings and historical performance summary.

### 2. 📚 Available Model Tests (`/dashboard/student/exams`)
- **Three.js 3D Discovery Visualizer (`Exam3DDiscoveryVisualizer`)**: Orbiting medical subject spheres (Biology, Chemistry, Physics, English, GK).
- **Exam Details & Syllabus Breakdown**: Subject marks distribution, pass marks, and test guidelines.
- **One-Click Enrollment Action**: Direct enrollment trigger calling `POST /v1/enrollments/:examId/enroll`.

### 3. 🎫 My Enrollments & Seat Passes (`/dashboard/student/enrollments`)
- **Three.js 3D Holographic Pass (`Enrollment3DTicketVisualizer`)**: Rotating pass badge with medical laurel wreaths.
- **Perforated Ticket Cards**: Exam date, session timing, status pill, and venue overview.
- **Live Seat Allocation Map**: Exact hall venue, room number, and assigned bench seat (`Room #04`, `Seat S-142`).

### 4. 🪪 My Admit Cards (`/dashboard/student/admit-cards`)
- **Three.js 3D Pass Shield (`AdmitCard3DVisualizer`)**: Holographic digital pass shield with cyan & gold orbital rings.
- **Cryptographic QR Pass Card**: Admit card number, QR verification token, venue snapshot, and download trigger.
- **Printable High-Res Paper Modal (`AdmitCardPrintModal`)**: Official examination board layout with watermark and native `window.print()` trigger.
- **Exam Hall Regulations Modal (`AdmitCardRulesModal`)**: Stationery rules, biometric scanning, and gate closure policy.

### 5. 📊 My Results & Merit Analytics (`/dashboard/student/results`)
- **Three.js 3D Golden Merit Laurel (`Result3DMeritVisualizer`)**: 3D golden laurel with orbital rank rings.
- **4 Key Performance Indicators**: National Dense Rank, Mean Marks, OMR Accuracy Rate, Pass Percentage.
- **Comprehensive Scorecards**: Total answered, skipped, correct, wrong, and net deductions.
- **Subject-Wise Calibration Modal (`ResultDetailModal`)**: Marks breakdown across 5 medical admission subjects.

### 6. 🏆 Leaderboard & Merit Standings (`/dashboard/student/rankings`)
- **Three.js 3D Golden Podium (`Leaderboard3DPodiumVisualizer`)**: Tiered Gold (#1), Silver (#2), and Bronze (#3) podiums with rotating star crown.
- **Dynamic Exam Selector**: Switch between model tests with instant client-side data updates.
- **Candidate Personal Standing Banner**: Instant rank, percentage, and qualification badge for the selected test.
- **Top 3 Laureates Podium Cards**: Avatar, candidate roll, college, score, and remarks.
- **Full National Merit Table**: Filterable and searchable dense rankings list with candidate row highlighting.

### 7. 📢 Official Notices & Bulletins (`/dashboard/student/announcements`)
- **Three.js 3D Radio Beacon (`Notice3DBroadcastVisualizer`)**: Holographic broadcast megaphone with dual pulsing radio wave rings.
- **Urgent Bulletin Feed**: Priority indicators, published date pills, and summary snippets.
- **Interactive Notice Reader Modal (`NoticeDetailModal`)**: Full circular content with direct PDF attachment download and print triggers.

### 8. 👤 My Profile & Account Settings (`/dashboard/student/profile`)
- **Three.js 3D Aspirant DNA Hologram (`Profile3DAvatarVisualizer`)**: Medical icosahedron core with emerald and cyan helix rings.
- **Immutable Board Credentials**: Permanent candidate name, date of birth, roll number, and registration number.
- **Editable Profile Information**: College name, father's name, mother's name, addresses, and avatar photo URL (`PATCH /v1/students/me`).
- **Account Security**: Change password form (`POST /v1/auth/change-password`) and login identifier summary.

---

## 6. Admin Management Suite (9 Portals)

| Portal | Route | Primary Capabilities |
|---|---|---|
| **Executive Overview** | `/dashboard/admin` | 4 Real-time KPI Cards, Candidate Age Demographics Bar Chart, HSC College Distribution Donut, System Audit Logs Table. |
| **Exam Management** | `/dashboard/admin/exams` | Create exams (`POST /exams`), transition status (`PATCH /exams/:id`), add centres/rooms, trigger auto seat allocation. |
| **Candidate Directory** | `/dashboard/admin/students` | Search and filter students by status (`ACTIVE`, `PENDING`, `SUSPENDED`), view full profiles, update or remove candidate accounts. |
| **Enrollment Roster** | `/dashboard/admin/enrollments` | View exam-wise candidate registrations, verify seat assignments, filter by centre. |
| **Admit Card Engine** | `/dashboard/admin/admit-cards` | Trigger batch PDF generation via BullMQ worker, monitor email delivery status, regenerate single passes, resend emails. |
| **Results & Mark Entry** | `/dashboard/admin/results` | Single mark entry, bulk JSON import, 4-tier tiebreaker calculation, and one-click result publishing. |
| **National Rankings** | `/dashboard/admin/rankings` | Publish public Top-3 laurels snapshot from published scorecards. |
| **Notices & Bulletins** | `/dashboard/admin/announcements` | Create, edit, and archive circulars with PDF attachments (`POST /announcements/admin`). |
| **System Settings** | `/dashboard/admin/settings` | Examination board configuration, system security policies, and administrative credentials. |

---

## 7. BFF (Backend For Frontend) Proxy Architecture

All client-side components interact with the backend through dedicated Next.js API Routes (`/api/bff/*`). This provides:
1. **Cookie-to-Bearer Token Translation**: Reads `accessToken` from secure HttpOnly cookies and attaches `Authorization: Bearer <token>`.
2. **Standardized Error Formatting**: Normalizes backend validation errors into consistent JSON envelopes.
3. **Optimized Caching & Cache-Control**: Passes `no-store` headers and handles ETag/304 conditional validation.

---

## 8. Complete REST API Contract & Integration Specifications

### Primary Base URLs:
- **Production**: `https://api.shopnercoat.xyz/v1`
- **Development**: `http://localhost:5080/v1`

### Endpoint Matrix:

| Category | Endpoint | Method | Role | Description |
|---|---|---|---|---|
| **Auth** | `/auth/register` | `POST` | `PUBLIC` | Initiates registration; sends 6-digit SMS OTP. |
| **Auth** | `/auth/verify-otp` | `POST` | `PUBLIC` | Verifies OTP; issues `verifiedToken`. |
| **Auth** | `/auth/login` | `POST` | `PUBLIC` | Authenticates via Mobile, Email, or 7-Digit Roll #. |
| **Auth** | `/auth/refresh-token`| `POST` | `PUBLIC` | Rotates refresh token; issues new access token. |
| **Auth** | `/auth/logout` | `POST` | `AUTHENTICATED`| Revokes session tokens. |
| **Auth** | `/auth/me` | `GET` | `AUTHENTICATED`| Returns authenticated user identity and role. |
| **Auth** | `/auth/change-password`| `POST`| `AUTHENTICATED`| Updates account password. |
| **Student** | `/students/complete-profile` | `POST` | `VERIFIED` | Assigns Roll # and Registration #. |
| **Student** | `/students/me` | `GET` | `STUDENT` | Returns candidate's profile and user object. |
| **Student** | `/students/me` | `PATCH` | `STUDENT` | Updates editable profile fields (`collegeName`, `addresses`, `parents`, `photoUrl`). |
| **Student** | `/students/admin/list` | `GET` | `ADMIN` | Paginated candidate list with status search. |
| **Student** | `/students/admin/stats` | `GET` | `ADMIN` | Total, active, pending, suspended counts. |
| **Student** | `/students/admin/demographics` | `GET` | `ADMIN` | Age distribution & top HSC colleges data. |
| **Exam** | `/exams` | `GET` | `PUBLIC` | Lists all published mock tests. |
| **Exam** | `/exams/:id` | `GET` | `PUBLIC` | Detailed exam data with nested centres & rooms. |
| **Exam** | `/exams` | `POST` | `ADMIN` | Creates new model test in `DRAFT` status. |
| **Exam** | `/exams/:id` | `PATCH` | `ADMIN` | Updates exam fields and lifecycle status. |
| **Exam** | `/exams/admin/stats` | `GET` | `ADMIN` | Exam counts by status, centres & pending results. |
| **Exam Centre**| `/exams/:id/centres` | `POST` | `ADMIN` | Adds venue centre with capacity. |
| **Exam Room** | `/exams/centres/:centreId/rooms` | `POST` | `ADMIN` | Adds room to centre. |
| **Seat Plan** | `/exams/:id/seat-plan/auto-assign` | `POST` | `ADMIN` | Auto-assigns enrolled students to seats in roll order. |
| **Seat Plan** | `/exams/:id/seat-plan` | `GET` | `ADMIN` | Returns full seat allocation matrix. |
| **Enrollment** | `/enrollments/:examId/enroll` | `POST` | `STUDENT` | Candidate self-enrollment. |
| **Enrollment** | `/enrollments/me` | `GET` | `STUDENT` | Returns candidate's registrations with seat details. |
| **Enrollment** | `/enrollments/admin/exam/:examId` | `GET` | `ADMIN` | Lists all candidate enrollments for an exam. |
| **Admit Card** | `/admit-cards/verify/:token` | `GET` | `PUBLIC` | QR code verification scan at exam hall gate. |
| **Admit Card** | `/admit-cards/download/:id` | `GET` | `PUBLIC`/`STUDENT`| Streams raw printable PDF pass (`application/pdf`). |
| **Admit Card** | `/admit-cards/me` | `GET` | `STUDENT` | Returns all digital passes for candidate. |
| **Admit Card** | `/admit-cards/admin/exam/:examId/generate` | `POST` | `ADMIN` | Triggers BullMQ batch PDF generation. |
| **Result** | `/results/me` | `GET` | `STUDENT` | Returns published scorecards and dense rank. |
| **Result** | `/results/admin/record` | `POST` | `ADMIN` | Records single student OMR score. |
| **Result** | `/results/admin/bulk` | `POST` | `ADMIN` | Bulk JSON mark entry. |
| **Result** | `/results/admin/exam/:examId/publish` | `POST` | `ADMIN` | Calculates 4-tier tiebreaker and publishes merit. |
| **Ranking** | `/rankings/public/:examId` | `GET` | `PUBLIC` | Returns Top-3 laurels snapshot & full leaderboard. |
| **Ranking** | `/rankings/admin/exam/:examId/publish` | `POST` | `ADMIN` | Publishes public ranking snapshot. |
| **Notices** | `/announcements/public` | `GET` | `PUBLIC` | Returns active circulars feed. |
| **Notices** | `/announcements/admin/list` | `GET` | `ADMIN` | Lists all circulars (Draft, Published, Archived). |
| **Notices** | `/announcements/admin` | `POST` | `ADMIN` | Publishes new circular with PDF attachment. |
| **Audit Logs** | `/admin/audit-logs` | `GET` | `ADMIN` | Returns paginated system audit activity records. |
| **Upload** | `/upload` | `POST` | `AUTHENTICATED`| Converts image to `.webp` and stores on Cloudinary. |

---

## 9. Installation, Environment & Production Build

### Prerequisites:
- Node.js `>= 20.18.0`
- `pnpm` `>= 9.0.0` (or `npm` / `yarn`)

### Environment Configuration:
Create `.env.local` in the project root:

```env
# Backend API Base URL
NEXT_PUBLIC_API_URL=https://api.shopnercoat.xyz/v1
API_BASE_URL=https://api.shopnercoat.xyz/v1

# Node Environment
NODE_ENV=production
```

### Installation & Scripts:

```bash
# 1. Install all dependencies
pnpm install

# 2. Run local development server with Turbopack
pnpm dev

# 3. Build optimized production bundle
pnpm build

# 4. Start production server
pnpm start

# 5. Run linting checks
pnpm lint
```

---

## 🛡️ License & Ownership

Developed for **Shafipur Educare Coaching Center** & **Shopner Coat Medical Admission System**.  
All rights reserved © 2025–2026.
