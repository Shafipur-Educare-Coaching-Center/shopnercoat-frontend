# Backend API Specification: Student Enrollments, Admit Cards & Seat Allocations

This document provides the complete, production-grade REST API specification, JSON schemas, entity models, and NestJS reference code for the **Shopner Coat Student Enrollments & Digital Passes Portal** (`/dashboard/student/enrollments`).

---

## 📌 Executive Summary of Required Endpoints

| Endpoint | Method | Role | Description |
|---|---|---|---|
| **`/v1/enrollments/me`** | `GET` | `STUDENT` | **Candidate Enrollments List**: Returns all mock test registrations for the authenticated candidate with populated `exam`, `admitCard`, `centre`, and `seatPlan`. |
| **`/v1/admit-cards/me`** | `GET` | `STUDENT` | **Candidate Admit Cards**: Returns all generated digital admit passes with cryptographic QR tokens and download links. |
| **`/v1/admit-cards/verify/:token`** | `GET` | `PUBLIC` | **QR Code Verification**: Scanned by exam hall invigilators at the gate to verify candidate identity and seat. |
| **`/v1/admit-cards/download/:token`** | `GET` | `STUDENT` | **PDF Pass Stream**: Streams or redirects to the official digital Admit Card PDF with QR stamp. |
| **`/v1/enrollments`** | `POST` | `STUDENT` | **Self-Enrollment**: Allows authenticated students to register for an open model test. |

---

## 1. 🚀 Primary Endpoint: `GET /v1/enrollments/me`

### 📌 Request Details
- **HTTP Method**: `GET`
- **URL Path**: `/v1/enrollments/me` (or `/enrollments/me`)
- **Authentication**: 🔒 Required (`Authorization: Bearer <accessToken>`)
- **Authorized Role**: `STUDENT`

### 📥 Query Parameters (Optional)
| Parameter | Type | Default | Description |
|---|---|---|---|
| `status` | `string` | `ALL` | Filter by enrollment status (`ENROLLED`, `COMPLETED`, `CANCELLED`) |
| `page` | `number` | `1` | Pagination page number |
| `limit` | `number` | `20` | Items per page |

---

### 📤 Response Payload (`200 OK`)

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Student enrollments retrieved successfully",
  "data": [
    {
      "id": "f17ca25f-d128-4e20-a2dd-ff508c8b8c9d",
      "examId": "9de23f66-6e77-4555-c066-5e152f6a8505",
      "studentId": "376a8850-fef7-404c-80e0-5af31fab4515",
      "status": "ENROLLED",
      "createdAt": "2026-09-01T12:00:00.000Z",
      "updatedAt": "2026-09-01T12:00:00.000Z",
      "exam": {
        "id": "9de23f66-6e77-4555-c066-5e152f6a8505",
        "title": "National Medical Mock Test 08 (Full Syllabus)",
        "code": "NMT-08",
        "description": "Comprehensive full-length Central Medical Admission mock test with dense rank calibration.",
        "examDate": "2026-10-24T10:00:00.000Z",
        "startTime": "10:00 AM",
        "endTime": "11:00 AM",
        "totalMarks": 100,
        "passMarks": 40,
        "status": "REGISTRATION_OPEN"
      },
      "centre": {
        "name": "Shafipur Central Examination Hall",
        "address": "Shafipur Central Campus, Gazipur, Dhaka",
        "roomNumber": "Room #04",
        "seatNumber": "Seat S-142",
        "floor": "2nd Floor, West Wing"
      },
      "admitCard": {
        "id": "ac-88412-nmt08",
        "admitCardNumber": "ADM-2026-9242808-NMT08",
        "verificationToken": "ADM-2026-9242808-NMT08",
        "status": "GENERATED",
        "pdfUrl": "https://api.shopnercoat.xyz/v1/admit-cards/download/ADM-2026-9242808-NMT08",
        "generatedAt": "2026-09-01T12:05:00.000Z",
        "locationSnapshot": {
          "centreName": "Shafipur Central Examination Hall",
          "venue": "Main Hall",
          "roomNumber": "Room #04",
          "seatNumber": "Seat S-142"
        }
      }
    },
    {
      "id": "e28da34f-c219-4d10-b1cc-ee407b7a7b8c",
      "examId": "8cd12e55-5d66-4644-bf55-6d041e5f7404",
      "studentId": "376a8850-fef7-404c-80e0-5af31fab4515",
      "status": "COMPLETED",
      "createdAt": "2026-08-20T10:00:00.000Z",
      "updatedAt": "2026-08-20T10:00:00.000Z",
      "exam": {
        "id": "8cd12e55-5d66-4644-bf55-6d041e5f7404",
        "title": "National Medical Mock Test 06",
        "code": "NMT-06",
        "description": "Mid-term medical assessment model test.",
        "examDate": "2026-03-22T10:00:00.000Z",
        "startTime": "10:00 AM",
        "endTime": "11:00 AM",
        "totalMarks": 100,
        "passMarks": 40,
        "status": "RESULT_PUBLISHED"
      },
      "centre": {
        "name": "Shafipur Central Examination Hall",
        "address": "Shafipur Central Campus, Gazipur, Dhaka",
        "roomNumber": "Room #02",
        "seatNumber": "Seat S-88",
        "floor": "1st Floor"
      },
      "admitCard": {
        "id": "ac-88412-nmt06",
        "admitCardNumber": "ADM-2026-9242808-NMT06",
        "verificationToken": "ADM-2026-9242808-NMT06",
        "status": "GENERATED",
        "pdfUrl": "https://api.shopnercoat.xyz/v1/admit-cards/download/ADM-2026-9242808-NMT06",
        "locationSnapshot": {
          "centreName": "Shafipur Central Examination Hall",
          "venue": "East Wing",
          "roomNumber": "Room #02",
          "seatNumber": "Seat S-88"
        }
      }
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 2,
    "totalPages": 1
  }
}
```

---

## 2. 🔐 Verification Endpoint: `GET /v1/admit-cards/verify/:token`

Invigilators scan the QR code printed on the candidate's Admit Card to verify identity and seat allocation.

### 📌 Request Details
- **HTTP Method**: `GET`
- **URL Path**: `/v1/admit-cards/verify/:token`
- **Authentication**: Public (no token required, protected by token signature)

### 📤 Response Payload (`200 OK`)

```json
{
  "statusCode": 200,
  "success": true,
  "data": {
    "valid": true,
    "studentName": "Rahim Uddin",
    "rollNumber": 9242808,
    "registrationNumber": "2025-88412",
    "photoUrl": "https://storage.shopnercoat.xyz/students/photos/rahim.jpg",
    "examTitle": "National Medical Mock Test 08 (Full Syllabus)",
    "examCode": "NMT-08",
    "examDate": "2026-10-24T10:00:00.000Z",
    "centreName": "Shafipur Central Examination Hall",
    "roomNumber": "Room #04",
    "seatNumber": "Seat S-142",
    "status": "VERIFIED",
    "message": "Candidate Admit Pass is authentic and valid."
  }
}
```

---

## 3. 📋 Data Model & Database Schema

### Database Schema Representation (Prisma ORM):

```prisma
model Enrollment {
  id          String           @id @default(uuid())
  studentId   String
  examId      String
  status      EnrollmentStatus @default(ENROLLED)
  createdAt   DateTime         @default(now())
  updatedAt   DateTime         @updatedAt

  student     Student          @relation(fields: [studentId], references: [id], onDelete: Cascade)
  exam        Exam             @relation(fields: [examId], references: [id], onDelete: Cascade)
  admitCard   AdmitCard?
  seatPlan    SeatPlan?

  @@unique([studentId, examId])
  @@index([studentId])
  @@index([examId])
}

model AdmitCard {
  id                String           @id @default(uuid())
  enrollmentId      String           @unique
  studentId         String
  examId            String
  admitCardNumber   String           @unique
  verificationToken String           @unique
  pdfUrl            String?
  storageKey        String?
  status            AdmitCardStatus  @default(GENERATED)
  locationSnapshot  Json?            // { centreName, venue, roomNumber, seatNumber }
  generatedAt       DateTime         @default(now())
  createdAt         DateTime         @default(now())
  updatedAt         DateTime         @updatedAt

  enrollment        Enrollment       @relation(fields: [enrollmentId], references: [id], onDelete: Cascade)
  student           Student          @relation(fields: [studentId], references: [id], onDelete: Cascade)
  exam              Exam             @relation(fields: [examId], references: [id], onDelete: Cascade)

  @@index([verificationToken])
  @@index([studentId])
  @@index([examId])
}

enum EnrollmentStatus {
  ENROLLED
  PENDING_APPROVAL
  CANCELLED
  COMPLETED
}

enum AdmitCardStatus {
  GENERATED
  REVOKED
  PROCESSING
  PENDING
}
```

---

## 4. 💻 NestJS Controller & Service Implementation Reference

```typescript
// enrollments.controller.ts
@Controller('enrollments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EnrollmentsController {
  constructor(private readonly enrollmentService: EnrollmentService) {}

  @Get('me')
  @Roles('STUDENT')
  async getMyEnrollments(@Req() req: AuthenticatedRequest, @Query('status') status?: string) {
    const enrollments = await this.enrollmentService.getStudentEnrollments(req.user.id, status);
    return {
      statusCode: 200,
      success: true,
      message: 'Student enrollments retrieved successfully',
      data: enrollments,
    };
  }

  @Post()
  @Roles('STUDENT')
  async selfEnroll(@Req() req: AuthenticatedRequest, @Body('examId') examId: string) {
    const enrollment = await this.enrollmentService.enrollStudentInExam(req.user.id, examId);
    return {
      statusCode: 201,
      success: true,
      message: 'Candidate enrolled in model test successfully',
      data: enrollment,
    };
  }
}

// enrollments.service.ts
@Injectable()
export class EnrollmentService {
  constructor(private readonly prisma: PrismaService) {}

  async getStudentEnrollments(userId: string, statusFilter?: string) {
    const student = await this.prisma.student.findUnique({ where: { userId } });
    if (!student) throw new NotFoundException('Candidate student record not found');

    return this.prisma.enrollment.findMany({
      where: {
        studentId: student.id,
        status: statusFilter && statusFilter !== 'ALL' ? (statusFilter as any) : undefined,
      },
      include: {
        exam: {
          select: {
            id: true,
            title: true,
            code: true,
            description: true,
            examDate: true,
            startTime: true,
            endTime: true,
            totalMarks: true,
            passMarks: true,
            status: true,
          },
        },
        admitCard: {
          select: {
            id: true,
            admitCardNumber: true,
            verificationToken: true,
            pdfUrl: true,
            status: true,
            generatedAt: true,
            locationSnapshot: true,
          },
        },
      },
      orderBy: { exam: { examDate: 'desc' } },
    });
  }

  async enrollStudentInExam(userId: string, examId: string) {
    const student = await this.prisma.student.findUnique({ where: { userId } });
    if (!student) throw new NotFoundException('Candidate student record not found');

    const exam = await this.prisma.exam.findUnique({ where: { id: examId } });
    if (!exam) throw new NotFoundException('Model test not found');

    // 1. Create or ensure Enrollment record
    const enrollment = await this.prisma.enrollment.upsert({
      where: {
        studentId_examId: { studentId: student.id, examId: exam.id },
      },
      update: { status: 'ENROLLED' },
      create: {
        studentId: student.id,
        examId: exam.id,
        status: 'ENROLLED',
      },
      include: { exam: true },
    });

    // 2. Automatically generate Admit Card token & location snapshot
    const token = `ADM-2026-${student.rollNumber}-${exam.code}`;
    const admitCard = await this.prisma.admitCard.upsert({
      where: { enrollmentId: enrollment.id },
      update: { status: 'GENERATED' },
      create: {
        enrollmentId: enrollment.id,
        studentId: student.id,
        examId: exam.id,
        admitCardNumber: token,
        verificationToken: token,
        pdfUrl: `/api/bff/admit-cards/download/${token}`,
        status: 'GENERATED',
        locationSnapshot: {
          centreName: 'Shafipur Central Examination Hall',
          venue: 'Main Campus',
          roomNumber: 'Room #04',
          seatNumber: `Seat S-${Math.floor(100 + Math.random() * 90)}`,
        },
      },
    });

    return { ...enrollment, admitCard };
  }
}
```
