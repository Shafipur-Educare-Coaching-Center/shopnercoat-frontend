# Backend API Documentation: Administrative Enrollment Management & 403 Diagnosis

This document details the required backend specification and diagnosis for `POST /enrollments/admin/enroll`.

---

## 🚨 Diagnosis for `403 Forbidden: Insufficient privileges`

When `POST /enrollments/admin/enroll` was called by an Admin user, the backend returned `403 Forbidden: Insufficient privileges`.

### Why this happens on the backend:

1. **Role Guard Mismatch**:
   - The NestJS controller for `POST /enrollments/admin/enroll` might be guarded with `@Roles('STUDENT')` instead of `@Roles('ADMIN')`.
   - Ensure the route handler has `@UseGuards(JwtAuthGuard, RolesGuard)` and `@Roles('ADMIN')`.

2. **`studentId` Payload Format**:
   - In the frontend dialog, ensure the candidate's **UUID** (`376a8850-fef7-404c-80e0-5af31fab4515`) is sent in `studentId`, **not** the student's Roll Number (`9242808`).
   - We updated the frontend so the candidate dropdown automatically maps Roll Number `9242808` to Student UUID `376a8850-fef7-404c-80e0-5af31fab4515`.

---

## 📌 `POST /enrollments/admin/enroll` Specification

| Property | Value |
|---|---|
| **HTTP Method** | `POST` |
| **URL Path** | `/v1/enrollments/admin/enroll` |
| **Authentication** | 🔒 Required (`Authorization: Bearer <token>`) |
| **Authorized Roles** | `ADMIN` only |

### Request Body JSON (`application/json`)

```json
{
  "studentId": "376a8850-fef7-404c-80e0-5af31fab4515",
  "examId": "3c580fb6-42e6-4697-af02-2d4b149d135e",
  "status": "ENROLLED"
}
```

### Response Payload (`201 Created`)

```json
{
  "statusCode": 201,
  "success": true,
  "message": "Candidate enrolled in model test successfully",
  "data": {
    "id": "f17ca25f-d128-4e20-a2dd-ff508c8b8c9d",
    "examId": "3c580fb6-42e6-4697-af02-2d4b149d135e",
    "studentId": "376a8850-fef7-404c-80e0-5af31fab4515",
    "status": "ENROLLED",
    "createdAt": "2026-09-03T02:00:00.000Z"
  }
}
```

---

## 💻 NestJS Reference Controller & DTO Code for Backend Team

```typescript
// admin-enroll.dto.ts
import { IsUUID, IsEnum, IsOptional } from 'class-validator';

export class AdminEnrollDto {
  @IsUUID('4', { message: 'studentId must be a valid candidate Student UUID' })
  studentId: string;

  @IsUUID('4', { message: 'examId must be a valid Model Test UUID' })
  examId: string;

  @IsOptional()
  @IsEnum(['ENROLLED', 'PENDING_APPROVAL', 'CANCELLED', 'COMPLETED'])
  status?: string = 'ENROLLED';
}

// enrollments.controller.ts
@Post('admin/enroll')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
async adminEnrollStudent(@Body() dto: AdminEnrollDto) {
  const enrollment = await this.enrollmentService.adminEnrollStudent(dto);
  return {
    statusCode: 201,
    success: true,
    message: 'Candidate enrolled in model test successfully',
    data: enrollment,
  };
}
```
