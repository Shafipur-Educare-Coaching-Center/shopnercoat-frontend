# EXAM & RESULT MANAGEMENT SYSTEM
## Frontend Requirements & Technical Specification
**Public Website, Authentication, Student Dashboard, Admin Dashboard and Admit Card Experience**

**Next.js • TypeScript • shadcn/ui • Tailwind CSS • Three.js • React Hook Form • Zod • TanStack Query**

### Document Control
| Item | Definition |
| :--- | :--- |
| Version | 1.0 |
| Status | Final Requirements & Technical Specification |
| Prepared For | Project Development Team |
| Document Purpose | Define the final frontend scope, navigation, user flows, page-level behavior, validation, permissions and integration expectations. |
| Primary Audience | Frontend developers, UI/UX designers, QA engineers and technical reviewers |
| Requirement Source | Normalized from client requirements and subsequent admit-card workflow additions. |
| Scope | MVP and production-oriented baseline; future enhancements are explicitly identified. |
| Change Rule | Any change to authentication, numbering, exam lifecycle, result rules, or admit-card generation must be reflected in both frontend and backend specifications. |

---

## 1. Purpose and Scope
This document defines the final frontend requirements for a role-based examination and result management application. It translates the client requirements into implementable pages, flows, components and UI behaviors.

* Public website with Home, How to Register, Announcements and Ranking pages.
* Student account creation with mobile OTP verification and mandatory profile completion.
* Student dashboard for profile management, exam enrollment, admit-card collection and result viewing.
* Admin dashboard for students, exams, enrollments, admit cards, results, rankings and announcements.
* Automatic and manual admit-card generation status, email delivery visibility and student download/print access.
* Responsive design for mobile, tablet and desktop with consistent loading, error and permission states.

> **Terminology:** Where the original requirement said “role” in result lookup context, this specification uses “roll number”. User role remains ADMIN or STUDENT.

| Actor | Primary Capabilities |
| :--- | :--- |
| **Public Visitor** | View landing content, registration instructions, published announcements, published top-three rankings and optional public verification pages. |
| **Student** | Register, verify mobile, complete profile, enroll in exams, collect admit cards, view own results and manage allowed profile fields. |
| **Admin** | Manage students, exams, enrollments, admit cards, results, rankings, announcements and own profile/settings. |

---

## 2. Product Overview and User Roles
The application serves public visitors, registered students and administrators. Public pages are accessible without authentication; dashboard pages are role-protected.

### 2.1 Core Student Journey
1. Student submits full name, date of birth and mobile number.
2. System sends OTP to the mobile number; student verifies the OTP.
3. Student completes mandatory profile fields and uploads photo and signature.
4. Backend assigns unique roll number and registration number and sends them by SMS.
5. Student enters the dashboard and enrolls in an open exam.
6. After exam registration closes, admit card is generated automatically; admin can also trigger generation manually.
7. Generated admit card appears in the dashboard and is sent to the student’s verified email address.
8. After the exam, admin enters and publishes results; student can view the published result.

---

## 3. Frontend Technology Stack

| Area | Technology | Use |
| :--- | :--- | :--- |
| Framework | Next.js | Routing, rendering, layouts and production web application structure. |
| Language | TypeScript | Strict type safety across components, services and API models. |
| UI | shadcn/ui + Tailwind CSS | Accessible reusable components and application styling. |
| Visual Enhancement | Three.js | Optional lightweight hero/branding visual only where it improves the public experience. |
| Forms | React Hook Form | Form state, controlled submission and validation integration. |
| Validation | Zod | Client-side schemas aligned with backend validation contracts. |
| Server State | TanStack Query | Caching, fetching, mutations, invalidation and async state handling. |
| Images | next/image | Optimized student photos, gallery images and public media. |

> **Design Principle:** Three.js must never block core content, authentication, dashboard usability or mobile performance. It is an enhancement, not a dependency for business workflows.

---

## 4. Frontend Architecture Principles
* Use Next.js route groups to separate public, authentication and dashboard experiences.
* Group feature-specific UI, hooks, schemas, API services and types by domain where practical.
* Keep server state in TanStack Query rather than duplicating API data in global client stores.
* Treat backend authorization as authoritative; frontend guards improve UX but are not security boundaries.
* Prefer reusable domain components such as `ExamCard`, `StudentTable`, `ResultTable`, `AdmitCardCard` and `AnnouncementCard`.
* Use URL query parameters for shareable filters, pagination and search state on admin listing pages.
* Centralize API errors, toast messages, auth handling and permission fallbacks.

---

## 5. Layouts and Global Navigation

### 5.1 Public Layout
* Responsive Navbar
* Main content area
* Footer
* Optional announcement strip for urgent published notices

| Navigation Item | Route |
| :--- | :--- |
| Home | `/` |
| How to Register | `/how-to-register` |
| Announcements | `/announcements` |
| Ranking | `/ranking` |
| Login | `/login` |
| Register | `/register` |

### 5.2 Authentication Layout
* Login
* Initial Registration
* OTP Verification
* Profile Completion
* Optional password setup/recovery if the selected login design uses passwords

### 5.3 Student Dashboard Layout
Dashboard • Profile • Exams • My Enrollments • Admit Cards • Results • Announcements • Logout

### 5.4 Admin Dashboard Layout
Dashboard • Students • Exams • Enrollments • Admit Cards • Results • Rankings • Announcements • Profile • Settings • Logout

---

## 6. Public Website Requirements

### 6.1 Home Page
**Route:** `/`
* Hero section with platform identity, concise purpose statement and primary/secondary CTAs.
* Photo gallery with responsive grid, optimized images, lazy loading and optional lightbox.
* FAQ accordion covering registration, OTP, enrollment, admit cards, roll/registration numbers and results.
* Latest announcements preview linking to the full announcement page.
* Optional latest published ranking/top-three preview.
* Consistent navbar and footer with contact/organization information.

### 6.2 How to Register
**Route:** `/how-to-register`. The page must visually explain the end-to-end student registration workflow using a stepper, timeline or cards.
1. Enter name, date of birth and mobile number.
2. Verify the OTP sent to the submitted mobile number.
3. Complete personal, parent and address information.
4. Upload passport-size photo and signature.
5. Submit the profile.
6. Receive unique roll and registration number by SMS.
7. Access the student dashboard.

### 6.3 Announcements
* Display only backend-published announcements.
* Support title, body, published date, optional expiry date and optional attachment/link.
* Expired or unpublished announcements must not be shown to public users.

### 6.4 Ranking Page
* Display admin-published top three students for an exam.
* Show position, student name, obtained mark, college/institution, exam name and optional image.
* Provide exam selector or grouped rankings if multiple exams are published.

---

## 7. Student Registration and Authentication

### 7.1 Initial Registration
**Route:** `/register`

| Field | Requirement |
| :--- | :--- |
| Full Name | Required; validate reasonable length and allowed characters. |
| Date of Birth | Required; cannot be a future date. |
| Mobile Number | Required; normalized and validated against supported Bangladesh mobile-number format. |

* On successful submission, navigate to OTP verification.
* Show duplicate-account feedback returned by backend without leaking unnecessary account details.

### 7.2 OTP Verification
**Route:** `/verify-otp`
* OTP input
* Masked mobile number
* Verify action
* Resend OTP action
* Cooldown countdown
* Expired/invalid/too-many-attempts states
* Change mobile number option where allowed

### 7.3 Profile Completion
**Route:** `/complete-profile`

| Group | Fields |
| :--- | :--- |
| Personal | Full name, date of birth, email address, personal mobile number, passport-size photo. |
| Parents | Father’s name, father’s mobile number, mother’s name, mother’s mobile number. |
| Address | Present address, permanent address, “same as present address” convenience option. |
| Documents | Passport-size photograph and signature upload. |

> **Completion Rule:** The student is not considered fully registered until mandatory profile data and uploads pass backend validation. Roll and registration numbers are created by the backend only.

### 7.4 Login
**Route:** `/login`
* The exact credential model was not specified in the raw requirement. Recommended baseline: mobile number + password, with password creation during profile completion; OTP remains the verification and recovery mechanism. If the product chooses OTP-only login, the frontend route remains the same but the form changes.
* Handle login success and role-based redirect.
* Handle expired sessions and refresh failures.
* Provide logout from all dashboards.
* Never store sensitive tokens in insecure client storage if the backend uses HttpOnly cookies.

---

## 8. Student Dashboard

### 8.1 Dashboard Home
* Student name and photo
* Roll number
* Registration number
* Profile status
* Upcoming/open exams
* Enrolled exams
* Available admit cards
* Latest published result
* Latest announcements

### 8.2 Profile
* View all profile fields.
* Edit allowed fields.
* Verified email and mobile cannot be directly changed; they require re-verification.
* Roll number, registration number and role are immutable from student UI.

### 8.3 Exams and Enrollment
| Exam Display | Student Action |
| :--- | :--- |
| Exam title/code, date/time, total marks, registration opening/closing, status | View details |
| Registration open and student eligible | Enroll |
| Already enrolled | View enrollment; no duplicate enrollment action |
| Registration closed | Enrollment disabled |
| Result published | Open result where authorized |

### 8.4 Admit Cards
**Route:** `/dashboard/student/admit-cards`
* List generated admit cards for the authenticated student.
* Show exam name, exam date, generated date and card status.
* Allow preview, PDF download and print.
* If email delivery fails, dashboard download must remain available.
* Do not show cards before generation or after revocation.

### 8.5 Results
* List published results for enrolled exams.
* Result detail includes student name, roll number, registration number, exam, obtained marks, total marks, percentage, pass/fail/other status and rank if published.
* Student can only view own results.

---

## 9. Admin Dashboard

### 9.1 Dashboard Overview
* Total students, Total/open/upcoming exams, Total enrollments
* Admit-card generation summary
* Published/unpublished result counts
* Recent registrations, Recent announcements
* Optional trend charts

### 9.2 Student Management
* Paginated student list (search by name, roll, registration number or mobile)
* Filter by account/registration status
* View student profile and edit allowed administrative fields
* Activate/suspend account
* View enrolled exams, admit cards and results

### 9.3 Exam Management
* Create, view, update and delete/cancel exam according to lifecycle rules.
* Manage exam title, code, description, marks, dates, enrollment window, instructions and status.
* Manage centre, venue, room and optional seat allocation data required for admit cards.

### 9.4 Enrollment Management
* Select exam and view enrolled students.
* Search/filter by roll, registration or student name.
* View enrollment details and cancel/remove where business rules permit.

### 9.5 Admit Card Management
* Select exam and view registration deadline and eligible student count.
* View automatic-generation status and progress.
* Manually trigger batch generation after registration closes.
* Generate/regenerate an individual card where authorized.
* Retry failed generation or failed emails.
* Preview generated cards and download individual cards.
* Show batch metrics: total, generated, failed, email sent and email failed.

### 9.6 Result Management
* Select exam and view enrolled students.
* Enter, update or reset marks subject to backend rules. Support bulk mark entry UI.
* View calculated percentage/status/ranking.
* Publish results explicitly; unpublished results are invisible to students.
* Warn before modifying already published data.

### 9.7 Ranking Management
* Preview computed ranking for selected exam.
* Select/publish top three students to the public ranking page.
* Publish/unpublish ranking independently from internal rank calculation.

### 9.8 Announcement Management
* Create, edit, delete/archive, publish and unpublish announcements.
* Support optional attachment and expiry date.
* Display clear Draft, Published and Archived states.

---

## 10. Admit Card Experience
The admit card is a core exam artifact. It should be visually polished and printable while remaining data-driven. The generated PDF is produced by the backend, but the frontend must support preview, status visibility and collection workflows.

### 10.1 Required Admit Card Content
| Section | Information |
| :--- | :--- |
| Organization Header | Logo, organization name, exam authority, exam name, session/year. |
| Candidate | Roll number, registration number, full name, father’s name, mother’s name, photo, optional institution/college, optional question language. |
| Exam | Exam date, reporting time, start/end time, centre, venue, room, optional seat number. |
| Verification | Unique admit-card number and recommended QR verification code. |
| Signatures | Student signature plus authorized authority signature. |
| Instructions | Exam-specific instructions and prohibited items/arrival rules. |

### 10.2 Reference Layout Supplied by Client
> *Reference only: the production design should use the same information hierarchy while adopting the project’s own branding, colors, logo and typography.*

### 10.3 Admit Card Status UX
| Status | Student/Admin UI Behavior |
| :--- | :--- |
| NOT_AVAILABLE | No download; explain that admit cards are created after registration closes. |
| PROCESSING | Show progress/status indicator; disable duplicate generation action. |
| AVAILABLE | Enable preview, download and print. |
| FAILED | Admin sees retry action; student should not see a broken link. |
| REVOKED | Student access disabled; admin sees reason/history where available. |

---

## 11. Route Map
| Route | Access | Purpose |
| :--- | :--- | :--- |
| `/` | Public | Home |
| `/how-to-register` | Public | Registration instructions |
| `/announcements` | Public | Published announcements |
| `/ranking` | Public | Published top-three rankings |
| `/login` | Auth | Login |
| `/register` | Auth | Initial student registration |
| `/verify-otp` | Auth | Mobile OTP verification |
| `/complete-profile` | Auth | Mandatory profile completion |
| `/dashboard/student` | Student | Dashboard home |
| `/dashboard/student/profile` | Student | Profile |
| `/dashboard/student/exams` | Student | Available exams |
| `/dashboard/student/enrollments` | Student | My enrollments |
| `/dashboard/student/admit-cards` | Student | Admit-card list |
| `/dashboard/student/admit-cards/[id]` | Student | Admit-card preview |
| `/dashboard/student/results` | Student | Results |
| `/dashboard/admin` | Admin | Dashboard overview |
| `/dashboard/admin/students` | Admin | Student management |
| `/dashboard/admin/exams` | Admin | Exam management |
| `/dashboard/admin/enrollments` | Admin | Enrollment management |
| `/dashboard/admin/admit-cards` | Admin | Admit-card management |
| `/dashboard/admin/results` | Admin | Result management |
| `/dashboard/admin/rankings` | Admin | Ranking publishing |
| `/dashboard/admin/announcements` | Admin | Announcement management |
| `/dashboard/admin/profile` | Admin | Own profile |
| `/dashboard/admin/settings` | Admin | System/template settings |

---

## 12. Forms and Validation
* Use **React Hook Form + Zod** for all interactive forms.
* Frontend validation improves UX; backend validation remains authoritative.
* Map backend field errors back to the relevant form control.
* Prevent repeated submission while mutation is pending.
* Use confirmation dialogs for destructive or publication actions.

**Schemas Folder Structure:**
```text
src/schemas/
  auth.schema.ts
  student.schema.ts
  exam.schema.ts
  enrollment.schema.ts
  admit-card.schema.ts
  result.schema.ts
  announcement.schema.ts
```

---

## 13. Server-State and API Integration
* Use **TanStack Query** for students, exams, enrollments, admit cards, results, rankings, announcements and profiles.
* Use deterministic query keys by feature and identifier.
* Invalidate/refetch affected queries after successful mutations.
* Use pagination and debounced search for admin lists.
* Do not cache sensitive responses longer than needed.

> **Recommended Pattern:** Components should consume typed feature hooks (for example `useStudentAdmitCards` or `useExamResults`) rather than issuing ad-hoc fetch calls throughout the UI.

---

## 14. Authentication and Route Protection
* Unauthenticated users attempting dashboard routes are redirected to `/login`.
* Student users cannot access admin dashboard routes.
* Admin-only UI elements should be hidden from students, but backend authorization remains mandatory.
* Handle 401 by attempting the approved refresh/session flow; if it fails, clear local auth state and redirect to login.
* Handle 403 with a dedicated forbidden state instead of exposing partial content.

---

## 15. Uploads and Media UX
* Passport-size photo uploader with preview, accepted format/size hint and replacement flow.
* Signature uploader with preview and transparent/clean-background guidance where useful.
* Client-side checks may reject clearly invalid files early, but backend performs final MIME, size and security validation.
* Show upload progress if backend supports direct/multipart upload.
* Use optimized images for dashboard and public display.

---

## 16. UI States and Notifications
| State | Standard Behavior |
| :--- | :--- |
| Loading | Skeletons or progress indicators; avoid layout jumps. |
| Empty | Explain why no data exists and provide the next relevant action. |
| Success | Toast/inline confirmation and updated data. |
| Validation Error | Field-level feedback. |
| API Error | Human-readable message and retry where safe. |
| 401/403 | Login redirect or forbidden state. |
| 404 | Dedicated not-found view. |
| Background Processing | Poll/refetch or server-event strategy if implemented; show admit-card batch progress. |

---

## 17. Responsive Design and Accessibility
* Support mobile, tablet, laptop and desktop breakpoints.
* Collapse dashboard sidebar on small screens.
* Convert wide admin tables to horizontal scroll or compact card/list alternatives where necessary.
* Use semantic HTML, accessible labels, keyboard navigation and clear focus states.
* Use shadcn/ui primitives correctly for dialogs, accordions, menus and form controls.
* Provide alt text for meaningful images and avoid conveying critical information through color alone.

---

## 18. Performance and Security Responsibilities
* Use dynamic import/lazy loading for Three.js and heavy dashboard modules.
* Use `next/image` for gallery and profile media.
* Avoid over-fetching; request paginated/filter-specific datasets.
* Never expose secret keys, OTPs, refresh tokens or privileged configuration to the browser.
* Do not trust client-side role or student identifiers for authorization.
* Avoid rendering unpublished results/rankings or revoked admit cards from stale cache.

---

## 19. Recommended Folder Structure
```text
src/
├── app/
│   ├── (public)/
│   │   ├── page.tsx
│   │   ├── how-to-register/
│   │   ├── announcements/
│   │   └── ranking/
│   ├── (auth)/
│   │   ├── login/
│   │   ├── register/
│   │   ├── verify-otp/
│   │   └── complete-profile/
│   └── dashboard/
│       ├── student/
│       │   ├── profile/
│       │   ├── exams/
│       │   ├── enrollments/
│       │   ├── admit-cards/
│       │   └── results/
│       └── admin/
│           ├── students/
│           ├── exams/
│           ├── enrollments/
│           ├── admit-cards/
│           ├── results/
│           ├── rankings/
│           └── announcements/
├── components/
│   ├── ui/
│   ├── common/
│   ├── public/
│   ├── student/
│   └── admin/
├── features/
│   ├── auth/
│   ├── students/
│   ├── exams/
│   ├── enrollments/
│   ├── admit-cards/
│   ├── results/
│   ├── rankings/
│   └── announcements/
├── schemas/
├── services/
├── hooks/
├── types/
├── lib/
└── utils/
```

---

## 20. MVP Acceptance Criteria
* Public Home, How to Register, Announcements and Ranking pages are responsive and production-ready.
* Student can complete registration from initial form through OTP and mandatory profile completion.
* Student receives dashboard access only after required registration conditions are met.
* Student can enroll in an eligible open exam exactly once.
* Student can view and download generated admit cards for own enrolled exams only.
* Admin can manage students, exams and enrollments through protected routes.
* Admin can observe automatic admit-card generation, manually trigger generation after registration closes and retry failures.
* Admin can enter/update results and explicitly publish them.
* Students cannot see unpublished results; public users cannot see unpublished rankings or announcements.
* All major pages handle loading, empty, error, unauthorized and responsive states.

---

## 21. Future Enhancements and Open Decisions
* Final student login method: mobile + password (recommended baseline) versus OTP-only login.
* Whether public result lookup is required in addition to authenticated student result access.
* Whether admin needs a visual admit-card template builder or a fixed professionally branded template is sufficient for MVP.
* Automated centre/room/seat allocation versus manual assignment.
* Multiple subjects/components per exam and subject-wise result breakdown.
* Admit-card bulk ZIP download and advanced printing tools.
* Payment, admit-card fees, certificates, attendance, question management and analytics.
