# ShopnerCoat Backend — Frontend Integration Guide

> **Base URL:** `http://localhost:5080/api/v1` (development) · `https://api.shopnercoat.xyz/api/v1` (production)  
> **Interactive Swagger UI:** `GET /docs` or `GET /api-docs`  
> **Raw OpenAPI JSON:** `GET /docs.json`

---

## Table of Contents

1. [Authentication Flow](#1-authentication-flow)
2. [HTTP Headers & Token Strategy](#2-http-headers--token-strategy)
3. [Standard Response Envelope](#3-standard-response-envelope)
4. [Error Response Format](#4-error-response-format)
5. [Enums & Constants](#5-enums--constants)
6. [Data Models (Complete Shapes)](#6-data-models-complete-shapes)
7. [Auth Endpoints](#7-auth-endpoints)
8. [Upload Endpoint](#8-upload-endpoint)
9. [Student Endpoints](#9-student-endpoints)
10. [Exam Endpoints](#10-exam-endpoints)
11. [Enrollment Endpoints](#11-enrollment-endpoints)
12. [Admit Card Endpoints](#12-admit-card-endpoints)
13. [Result Endpoints](#13-result-endpoints)
14. [Ranking Endpoints](#14-ranking-endpoints)
15. [Announcement Endpoints](#15-announcement-endpoints)
16. [Integration Notes](#16-integration-notes)

---

## 1. Authentication Flow

```
[ Register ] → OTP SMS sent → [ Verify OTP ] → verifiedToken
                                                      ↓
                                        [ Complete Profile ]
                                                      ↓
                                            rollNumber + registrationNumber assigned
                                                      ↓
                                       Registration Confirmation Email sent

[ Login (Mobile / Email / Roll Number) ] → accessToken + refreshToken
```

### State Machine: Student Account

```
PENDING (OTP not verified)
   ↓ verify-otp
PENDING (OTP verified, profile not complete)
   ↓ complete-profile
ACTIVE (ready to login, enroll in exams)
   ↓ (admin action)
SUSPENDED (cannot login)
```

---

## 2. HTTP Headers & Token Strategy

### For all authenticated routes:
```http
Authorization: Bearer <accessToken>
Content-Type: application/json
```

### For profile completion only:
```http
Authorization: Bearer <verifiedToken>
```

### Token Lifetimes:
| Token | Lifetime | Where |
|-------|----------|-------|
| `accessToken` | 1 day | `Authorization: Bearer` header |
| `refreshToken` | 7 days | Body or `HttpOnly` cookie |
| `verifiedToken` | Short-lived (1 use) | After OTP verification only |

### Admin Default Credentials:
| Field | Value |
|-------|-------|
| Email / Mobile | `admin@shopnercoat.xyz` / `01700000000` |
| Password | `Admin@123456` |
| Role | `ADMIN` |

---

## 3. Standard Response Envelope

Every successful API response returns:

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "totalPages": 5
  }
}
```

> `meta` is only present on paginated list endpoints.  
> `message` may be absent on simple data fetch endpoints.

---

## 4. Error Response Format

```json
{
  "success": false,
  "message": "Human-readable error description",
  "errors": [
    { "field": "mobileNumber", "message": "Invalid mobile number format" }
  ],
  "hint": "Additional guidance"
}
```

| HTTP Status | Meaning |
|-------------|---------|
| `400` | Validation error / Bad input |
| `401` | Unauthenticated (missing/invalid token) |
| `403` | Forbidden (wrong role, account suspended) |
| `404` | Resource not found |
| `409` | Conflict (duplicate mobile, exam code, etc.) |
| `422` | Unprocessable entity |
| `429` | Rate limit (OTP cooldown — wait 60 seconds) |
| `500` | Server error |

---

## 5. Enums & Constants

### `Role`
```ts
'STUDENT' | 'ADMIN'
```

### `UserStatus`
```ts
'PENDING' | 'ACTIVE' | 'SUSPENDED'
```

### `RegistrationStatus`
```ts
'PENDING' | 'VERIFIED' | 'COMPLETED'
```

### `ExamStatus` (State Machine — one direction only)
```
DRAFT → REGISTRATION_OPEN → REGISTRATION_CLOSED → UPCOMING → ONGOING → COMPLETED → RESULT_PUBLISHED
                                           ↘ CANCELLED (from any state except RESULT_PUBLISHED)
```
```ts
'DRAFT' | 'REGISTRATION_OPEN' | 'REGISTRATION_CLOSED' | 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'RESULT_PUBLISHED' | 'CANCELLED'
```

### `EnrollmentStatus`
```ts
'ENROLLED' | 'CANCELLED' | 'DISQUALIFIED'
```

### `AdmitCardStatus`
```ts
'GENERATED' | 'REVOKED' | 'REGENERATING'
```

### `EmailDeliveryStatus`
```ts
'PENDING' | 'SENT' | 'FAILED'
```

### `ResultStatus`
```ts
'PASSED' | 'FAILED'
```

### `AnnouncementStatus`
```ts
'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
```

---

## 6. Data Models (Complete Shapes)

### `User`
```ts
{
  id: string;               // UUID
  mobileNumber: string;     // e.g. "01712345678"
  email: string | null;     // optional
  role: Role;               // 'STUDENT' | 'ADMIN'
  mobileVerified: boolean;
  emailVerified: boolean;
  status: UserStatus;       // 'PENDING' | 'ACTIVE' | 'SUSPENDED'
  createdAt: string;        // ISO 8601
  updatedAt: string;
}
```

### `Student`
```ts
{
  id: string;                    // UUID
  userId: string;                // Reference to User
  fullName: string;
  dateOfBirth: string;           // ISO 8601 date
  fatherName: string;
  motherName: string;
  parentMobileNumber: string;
  guardianMobileNumber: string | null;
  presentAddress: string;
  permanentAddress: string;
  photoUrl: string;              // Cloudinary URL (.webp)
  signatureUrl: string;          // Cloudinary URL (.webp)
  rollNumber: number;            // 7-digit random e.g. 4528647
  registrationNumber: number;    // 7-digit random e.g. 5735101
  collegeName: string | null;
  registrationStatus: RegistrationStatus;
  createdAt: string;
  updatedAt: string;
  user?: User;                   // Included in /me endpoint
}
```

### `Exam`
```ts
{
  id: string;                     // UUID
  title: string;                  // e.g. "HSC Admission Model Test 2026"
  code: string;                   // Unique uppercase e.g. "HSC-MT-2026"
  description: string;
  totalMarks: number;
  passMarks: number;
  examDate: string;               // ISO 8601 datetime
  startTime: string;              // e.g. "10:00 AM"
  endTime: string;                // e.g. "11:15 AM"
  registrationStartAt: string;    // ISO 8601 datetime
  registrationEndAt: string;      // ISO 8601 datetime
  instructions: string;
  status: ExamStatus;
  createdBy: string;              // Admin User ID
  createdAt: string;
  updatedAt: string;
  centres?: ExamCentre[];         // Included in GET /:id
}
```

### `ExamCentre`
```ts
{
  id: string;
  examId: string;
  name: string;         // e.g. "Shafipur Educare Coaching Center"
  address: string;      // e.g. "Shafipur, Gazipur, Dhaka"
  venue: string;        // e.g. "Academic Building 1"
  capacity: number;
  createdAt: string;
  updatedAt: string;
  rooms?: ExamRoom[];
}
```

### `ExamRoom`
```ts
{
  id: string;
  centreId: string;
  roomNumber: string;   // e.g. "101"
  capacity: number;     // e.g. 30
  createdAt: string;
  updatedAt: string;
}
```

### `ExamSeatAssignment`
```ts
{
  id: string;
  examId: string;
  studentId: string;
  centreId: string;
  roomId: string;
  seatNumber: string;   // e.g. "Seat-1"
  createdAt: string;
  updatedAt: string;
  student?: { fullName, rollNumber, registrationNumber, photoUrl };
  centre?: { name, address, venue };
  room?: { roomNumber };
}
```

### `ExamEnrollment`
```ts
{
  id: string;
  examId: string;
  studentId: string;
  status: EnrollmentStatus;   // 'ENROLLED' | 'CANCELLED' | 'DISQUALIFIED'
  createdAt: string;
  updatedAt: string;
  exam?: Exam;
  admitCard?: AdmitCard;
  result?: Result;
}
```

### `AdmitCard`
```ts
{
  id: string;
  examId: string;
  studentId: string;
  enrollmentId: string;
  admitCardNumber: string;       // e.g. "AC-HSC-MT-2026-4528647"
  locationSnapshot: {
    centreName: string;
    address: string;
    venue: string;
    roomNumber: string;
    seatNumber: string;
  };
  pdfUrl: string;                // Cloudinary RAW PDF download URL
  storageKey: string;            // Cloudinary public_id
  verificationToken: string;     // 32-char hex for QR code
  status: AdmitCardStatus;       // 'GENERATED' | 'REVOKED' | 'REGENERATING'
  generatedAt: string;
  emailStatus: EmailDeliveryStatus;
  emailedAt: string | null;
  version: number;               // Increments on regeneration
  createdAt: string;
  updatedAt: string;
}
```

### `Result`
```ts
{
  id: string;
  examId: string;
  studentId: string;
  enrollmentId: string;
  // Input fields (entered by admin)
  totalAnswered: number;
  skipped: number;
  correctAnswered: number;
  wrongAnswered: number;
  deductMark: number;            // Total mark deducted for wrong answers
  // Server-calculated (never submit these from frontend)
  obtainedMarks: number;         // = (correct marks) - deductMark, minimum 0
  percentage: number;            // 2 decimal places
  position: number | null;       // Assigned on result publish
  resultStatus: ResultStatus;    // 'PASSED' | 'FAILED'
  published: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### `PublishedRanking`
```ts
{
  id: string;
  examId: string;
  published: boolean;
  publishedAt: string;
  metadata: {
    topRankers: Array<{
      position: number;
      studentId: string;
      fullName: string;
      rollNumber: number;
      photoUrl: string;
      obtainedMarks: number;
      percentage: number;
    }>
  } | null;
  createdAt: string;
  updatedAt: string;
}
```

### `Announcement`
```ts
{
  id: string;
  title: string;
  content: string;
  status: AnnouncementStatus;   // 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  publishedAt: string | null;
  expiresAt: string | null;
  attachmentUrl: string | null;  // Optional PDF/image URL
  createdBy: string;             // Admin User ID
  createdAt: string;
  updatedAt: string;
}
```

---

## 7. Auth Endpoints

### `POST /auth/register`
Initiates student registration. Sends 6-digit OTP via SMS.

**Body (all required unless noted):**
```json
{
  "fullName": "string",           // required
  "dateOfBirth": "2004-05-15",   // required — ISO date
  "mobileNumber": "01712345678", // required — 11 digit BD number
  "password": "SecureP@ss123",   // required — min 8 chars
  "email": "user@example.com"    // optional
}
```

**Success `200`:**
```json
{
  "success": true,
  "message": "OTP sent to mobile number. Valid for 2 minutes",
  "data": { "mobileNumber": "01712345678" }
}
```

**Errors:** `409` duplicate mobile/email · `429` OTP cooldown (60s)

---

### `POST /auth/verify-otp`
Verifies the SMS OTP. Returns a short-lived `verifiedToken` to complete profile.

**Body:**
```json
{
  "mobileNumber": "01712345678", // required
  "otp": "123456"               // required — 6 digits
}
```

**Success `200`:**
```json
{
  "success": true,
  "message": "Mobile number verified successfully",
  "data": {
    "verifiedToken": "eyJhbGci..."
  }
}
```

**Errors:** `400` invalid/expired OTP

---

### `POST /auth/resend-otp`
Resends OTP. Subject to 60-second cooldown.

**Body:**
```json
{
  "mobileNumber": "01712345678" // required
}
```

**Errors:** `429` cooldown active

---

### `POST /auth/login`
Authenticates and issues tokens. Accepts **Mobile Number**, **Email**, or **7-Digit Roll Number**.

**Body:**
```json
{
  "mobileNumber": "01712345678", // required — also accepts email or roll number
  "password": "SecureP@ss123"   // required
}
```

**Success `200`:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGci...",
    "refreshToken": "eyJhbGci...",
    "user": {
      "id": "uuid",
      "mobileNumber": "01712345678",
      "email": "user@example.com",
      "role": "STUDENT",
      "status": "ACTIVE",
      "studentId": "uuid"          // null if ADMIN
    }
  }
}
```

**Errors:** `401` wrong password · `403` account suspended · `404` account not found

---

### `POST /auth/refresh-token`
Rotates refresh token and issues a new access token.

**Body:**
```json
{
  "refreshToken": "eyJhbGci..." // required — or sent as HttpOnly cookie
}
```

**Success `200`:**
```json
{
  "data": {
    "accessToken": "eyJhbGci...",
    "refreshToken": "eyJhbGci..."
  }
}
```

---

### `POST /auth/logout` 🔒
Revokes the current refresh session. Requires `Bearer` token.

**Success `200`:** `{ "success": true, "message": "Logged out successfully" }`

---

### `GET /auth/me` 🔒
Returns the currently authenticated user's identity.

**Success `200`:**
```json
{
  "data": {
    "id": "uuid",
    "mobileNumber": "01712345678",
    "email": "user@example.com",
    "role": "STUDENT",
    "status": "ACTIVE",
    "studentId": "uuid"
  }
}
```

---

## 8. Upload Endpoint

### `POST /upload` 🔒
Processes and uploads an image. Validates file binary headers, converts to `.webp`, and stores on Cloudinary.

**Request:** `multipart/form-data`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `file` | `File` | ✅ | Image file (JPEG / PNG / WEBP, max 5MB) |
| `subfolder` | `string` | ❌ | Target Cloudinary subfolder (e.g. `students/photos`) |

**Success `201`:**
```json
{
  "data": {
    "url": "https://res.cloudinary.com/dhm4oaodu/image/upload/v.../exam_system/students/photos/photo_1234567.webp",
    "key": "exam_system/students/photos/photo_1234567",
    "filename": "photo_1234567.webp",
    "format": "webp",
    "originalName": "my_photo.jpg"
  }
}
```

> ⚠️ **You must upload photo and signature first, then use the returned `url` in Complete Profile.**

---

## 9. Student Endpoints

### `POST /students/complete-profile` 🔒 *(verifiedToken)*
Completes the student profile. Assigns random 7-digit Roll & Registration Numbers. Sends Bengali confirmation email.

**Auth:** `Authorization: Bearer <verifiedToken>` (from verify-otp)

**Body:**
| Field | Type | Required |
|-------|------|----------|
| `fullName` | `string` | ✅ |
| `dateOfBirth` | `string` (ISO date) | ✅ |
| `fatherName` | `string` | ✅ |
| `motherName` | `string` | ✅ |
| `parentMobileNumber` | `string` | ✅ |
| `presentAddress` | `string` | ✅ |
| `permanentAddress` | `string` | ✅ |
| `photoUrl` | `string` (Cloudinary URL) | ✅ |
| `signatureUrl` | `string` (Cloudinary URL) | ✅ |
| `guardianMobileNumber` | `string` | ❌ |
| `collegeName` | `string` | ❌ |

**Success `201`:**
```json
{
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "fullName": "Rahim Uddin",
    "rollNumber": 4528647,
    "registrationNumber": 5735101,
    "registrationStatus": "COMPLETED"
  }
}
```

**Errors:** `409` profile already completed · `401` invalid verifiedToken

---

### `GET /students/me` 🔒 *(STUDENT)*
Returns the authenticated student's full profile.

**Success `200`:** Returns full `Student` object with nested `user`.

---

### `PATCH /students/me` 🔒 *(STUDENT)*
Updates allowed profile fields.

**Body (all optional):**
```json
{
  "fatherName": "string",
  "motherName": "string",
  "presentAddress": "string",
  "permanentAddress": "string",
  "photoUrl": "string",
  "signatureUrl": "string",
  "collegeName": "string"
}
```

---

### `GET /students/admin/list` 🔒 *(ADMIN)*
Lists all students with search and pagination.

**Query Params:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | `number` | `1` | Page number |
| `limit` | `number` | `10` | Results per page (max 100) |
| `search` | `string` | — | Searches fullName, rollNumber, registrationNumber |

**Success `200`:** Returns paginated list with `meta`.

---

## 10. Exam Endpoints

### `GET /exams`
Lists all exams. Public, no auth required.

**Query Params:**
| Param | Type | Description |
|-------|------|-------------|
| `status` | `ExamStatus` | Filter by lifecycle status |
| `page` | `number` | Page number |
| `limit` | `number` | Results per page |

---

### `GET /exams/:id`
Returns exam detail including nested centres and rooms.

**Success `200`:** Returns `Exam` object with `centres[].rooms[]` nested.

---

### `POST /exams` 🔒 *(ADMIN)*
Creates a new exam. Defaults to `DRAFT` status.

**Body:**
| Field | Type | Required |
|-------|------|----------|
| `title` | `string` | ✅ |
| `code` | `string` | ✅ (auto-uppercased, must be unique) |
| `description` | `string` | ✅ |
| `totalMarks` | `number` | ✅ |
| `passMarks` | `number` | ✅ (must be ≤ totalMarks) |
| `examDate` | `string` (ISO datetime) | ✅ |
| `startTime` | `string` | ✅ e.g. `"10:00 AM"` |
| `endTime` | `string` | ✅ e.g. `"11:15 AM"` |
| `registrationStartAt` | `string` (ISO datetime) | ✅ |
| `registrationEndAt` | `string` (ISO datetime) | ✅ (must be before examDate) |
| `instructions` | `string` | ✅ |
| `status` | `'DRAFT' \| 'REGISTRATION_OPEN'` | ❌ (defaults to `DRAFT`) |

---

### `PATCH /exams/:id` 🔒 *(ADMIN)*
Updates exam fields or transitions lifecycle status.

**Body (all optional):** Same fields as create, plus:
```json
{
  "status": "REGISTRATION_OPEN"
}
```

> Allowed transitions: `DRAFT→REGISTRATION_OPEN→REGISTRATION_CLOSED→UPCOMING→ONGOING→COMPLETED→RESULT_PUBLISHED` and `any→CANCELLED`

---

### `POST /exams/:id/centres` 🔒 *(ADMIN)*
Adds an exam centre/venue.

**Body:**
| Field | Type | Required |
|-------|------|----------|
| `name` | `string` | ✅ e.g. `"Shafipur Educare Coaching Center"` |
| `address` | `string` | ✅ |
| `venue` | `string` | ✅ e.g. `"Academic Building 1"` |
| `capacity` | `number` (integer) | ✅ |

---

### `GET /exams/:id/centres` 🔒 *(ADMIN)*
Lists all centres with their rooms for an exam.

---

### `DELETE /exams/centres/:centreId` 🔒 *(ADMIN)*
Deletes a centre and all its rooms.

---

### `POST /exams/centres/:centreId/rooms` 🔒 *(ADMIN)*
Adds a room to an exam centre.

**Body:**
| Field | Type | Required |
|-------|------|----------|
| `roomNumber` | `string` | ✅ e.g. `"101"` |
| `capacity` | `number` (integer) | ✅ |

---

### `DELETE /exams/rooms/:roomId` 🔒 *(ADMIN)*
Deletes a room.

---

### `POST /exams/:id/seat-plan/auto-assign` 🔒 *(ADMIN)*
**Smart Auto Seat Allocation.** Assigns all `ENROLLED` students to configured rooms in roll number order.

> Prerequisite: At least one Centre and Room must be configured for the exam.

**Success `200`:**
```json
{
  "data": {
    "message": "Successfully allocated seats for 120 students across 1 centre(s).",
    "totalAssigned": 120,
    "totalRoomsUsed": 3
  }
}
```

---

### `GET /exams/:id/seat-plan` 🔒 *(ADMIN)*
Returns the complete seat plan with student details, room, and seat numbers.

---

### `POST /exams/:id/seat-plan/manual` 🔒 *(ADMIN)*
Manually assigns or moves a student's seat.

**Body:**
```json
{
  "studentId": "uuid",  // required
  "centreId": "uuid",   // required
  "roomId": "uuid",     // required
  "seatNumber": "Seat-5" // required
}
```

---

## 11. Enrollment Endpoints

### `POST /enrollments/:examId/enroll` 🔒 *(STUDENT)*
Enrolls the authenticated student in an exam.

**Requirements:**
- Exam must have `status: "REGISTRATION_OPEN"`
- `registrationEndAt` must not have passed
- Student profile must be `COMPLETED` and account `ACTIVE`

**Success `201`:**
```json
{
  "message": "Enrolled successfully",
  "data": { "id": "uuid", "examId": "uuid", "studentId": "uuid", "status": "ENROLLED" }
}
```

**Errors:** `400` registration closed · `409` already enrolled

---

### `GET /enrollments/me` 🔒 *(STUDENT)*
Returns all exams the authenticated student is enrolled in, including admit card and result status.

**Success `200`:** Array of `ExamEnrollment` with nested `exam`, `admitCard`, `result`.

---

### `GET /enrollments/admin/exam/:examId` 🔒 *(ADMIN)*
Lists all enrollments for an exam with pagination.

**Query Params:** `page`, `limit`

---

## 12. Admit Card Endpoints

### `GET /admit-cards/verify/:token`
Public QR code verification endpoint (used by invigilators at exam hall entrance).

**Returns safe, non-PII data only:**
```json
{
  "data": {
    "valid": true,
    "studentName": "Rahim Uddin",
    "rollNumber": 4528647,
    "photoUrl": "https://res.cloudinary.com/...",
    "examTitle": "HSC Admission Model Test 2026",
    "examCode": "HSC-MT-2026",
    "examDate": "2026-10-15T09:00:00.000Z",
    "status": "GENERATED"
  }
}
```

---

### `GET /admit-cards/download/:id`
Direct PDF download endpoint. Streams the admit card as `application/pdf`. Can be opened directly in a browser tab.

> `:id` can be either the `admitCard.id` (UUID) **or** the `verificationToken`.

---

### `GET /admit-cards/me` 🔒 *(STUDENT)*
Returns all admit cards for the authenticated student.

**Each admit card includes:**
- `pdfUrl` — Cloudinary direct PDF URL
- `admitCardNumber` — e.g. `AC-HSC-MT-2026-4528647`
- `locationSnapshot` — Centre, venue, room, seat
- `status`, `emailStatus`, `version`

---

### `POST /admit-cards/admin/exam/:examId/generate` 🔒 *(ADMIN)*
Triggers batch admit card PDF generation for all enrolled students.

- PDFs are generated in background (BullMQ workers)
- Each student receives a Bengali medical-themed email with download link
- Returns immediately with `batchId` — generation runs in background

**Success `202`:**
```json
{
  "data": {
    "batchId": "uuid",
    "totalStudents": 120
  }
}
```

---

### `POST /admit-cards/admin/:id/resend-email` 🔒 *(ADMIN)*
Resends the admit card email for a specific admit card.

---

## 13. Result Endpoints

### `GET /results/me` 🔒 *(STUDENT)*
Returns the authenticated student's published results.

> Results are only visible to students after admin publishes them via `/results/admin/exam/:examId/publish`.

**Each result includes:** `obtainedMarks`, `percentage`, `position`, `resultStatus`

---

### `POST /results/admin/record` 🔒 *(ADMIN)*
Records a single student's mark entry.

**Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `examId` | `string` (UUID) | ✅ | |
| `studentId` | `string` (UUID) | ✅ | |
| `totalAnswered` | `number` (integer) | ✅ | Total questions attempted |
| `skipped` | `number` (integer) | ✅ | Questions left blank |
| `correctAnswered` | `number` (integer) | ✅ | Correct answers |
| `wrongAnswered` | `number` (integer) | ✅ | Wrong answers |
| `deductMark` | `number` (float) | ✅ | Total mark deducted |

> `obtainedMarks`, `percentage`, `resultStatus`, `position` are **server-calculated** — never send these from frontend.

---

### `POST /results/admin/bulk` 🔒 *(ADMIN)*
Bulk mark entry in a single request.

**Body:**
```json
{
  "examId": "uuid",
  "results": [
    {
      "studentId": "uuid",
      "totalAnswered": 90,
      "skipped": 10,
      "correctAnswered": 80,
      "wrongAnswered": 10,
      "deductMark": 2.5
    }
  ]
}
```

---

### `POST /results/admin/exam/:examId/publish` 🔒 *(ADMIN)*
Publishes all results for an exam. Assigns dense rankings using 4-level tiebreaker.

> **Tiebreaker order:** `obtainedMarks DESC` → `correctAnswered DESC` → `wrongAnswered ASC` → `totalAnswered DESC`

Sets exam status to `RESULT_PUBLISHED`.

---

### `GET /results/admin/exam/:examId` 🔒 *(ADMIN)*
Returns full mark sheet with all results, positions, and breakdowns for an exam (including unpublished records).

---

## 14. Ranking Endpoints

### `GET /rankings/public/:examId`
Public endpoint. Returns the Top-3 published ranking snapshot for an exam.

**Success `200`:**
```json
{
  "data": {
    "examId": "uuid",
    "publishedAt": "2026-10-20T12:00:00.000Z",
    "metadata": {
      "topRankers": [
        {
          "position": 1,
          "studentId": "uuid",
          "fullName": "Rahim Uddin",
          "rollNumber": 4528647,
          "photoUrl": "https://...",
          "obtainedMarks": 95.5,
          "percentage": 95.5
        }
      ]
    }
  }
}
```

---

### `POST /rankings/admin/exam/:examId/publish` 🔒 *(ADMIN)*
Creates or updates the public Top-3 ranking snapshot from published results.

---

## 15. Announcement Endpoints

### `GET /announcements/public`
Public endpoint. Returns all currently `PUBLISHED` announcements that have not expired.

**Success `200`:** Array of `Announcement` objects, ordered by `publishedAt DESC`.

---

### `GET /announcements/:id`
Returns a single announcement by its UUID.

---

### `GET /announcements/admin/list` 🔒 *(ADMIN)*
Returns **all** announcements regardless of status (Draft, Published, Archived). For the Admin dashboard.

---

### `POST /announcements/admin` 🔒 *(ADMIN)*
Creates a new announcement. Defaults to `PUBLISHED` status and sets `publishedAt = now()`.

**Body:**
| Field | Type | Required | Default |
|-------|------|----------|---------|
| `title` | `string` | ✅ | |
| `content` | `string` | ✅ | |
| `status` | `AnnouncementStatus` | ❌ | `"PUBLISHED"` |
| `publishedAt` | `string` (ISO datetime) | ❌ | `now()` |
| `expiresAt` | `string` (ISO datetime) | ❌ | `null` (never expires) |
| `attachmentUrl` | `string` (URL) | ❌ | |

---

### `PATCH /announcements/admin/:id` 🔒 *(ADMIN)*
Updates announcement fields or transitions its status.

**Body (all optional):** Same fields as create.

> Allowed status transitions: `DRAFT↔PUBLISHED↔ARCHIVED`

---

### `DELETE /announcements/admin/:id` 🔒 *(ADMIN)*
Permanently deletes an announcement.

---

## 16. Integration Notes

### Auth Headers Summary
| Route type | Header |
|------------|--------|
| Public | No header needed |
| Student / Admin | `Authorization: Bearer <accessToken>` |
| Complete Profile only | `Authorization: Bearer <verifiedToken>` |

### Roll Number & Registration Number
- Both are **7-digit cryptographically random integers** (e.g. `4528647`)
- They are assigned **once** during `POST /students/complete-profile`
- They cannot be changed
- Students can login using their Roll Number in the `mobileNumber` field of `/auth/login`

### Time Zones
- All datetime fields are stored and returned as **UTC ISO 8601** strings
- Bangladesh is UTC+6 — convert `examDate`, `registrationStartAt/EndAt` for display
- Example: `"2026-09-04T04:00:00.000Z"` = `10:00 AM` Bangladesh time

### Admit Card PDF
- Download URL format: `GET /api/v1/admit-cards/download/:admitCardId`
- The URL streams raw binary PDF (`Content-Type: application/pdf`)
- Safe to embed in `<iframe>` or open in a new tab for in-browser viewing

### Image Uploads
- Always upload photo and signature **before** calling complete profile
- Accepted formats: `JPEG`, `PNG`, `WEBP` (max 5MB each)
- All images are converted to `.webp` automatically
- Returns a Cloudinary URL in the response — pass that URL in the profile body

### Background Jobs (BullMQ)
The following operations run **asynchronously in the background** — the API returns `200/201/202` immediately:
- SMS OTP dispatch
- Admit Card PDF generation
- Admit Card email delivery (Bengali template via Resend)

### Pagination Pattern
All paginated endpoints return a `meta` object:
```json
{
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "totalPages": 5
  }
}
```

### Admin Default Account
```
Email:    admin@shopnercoat.xyz
Mobile:   01700000000
Password: Admin@123456
Role:     ADMIN
```
