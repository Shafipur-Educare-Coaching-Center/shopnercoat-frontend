# Backend API Documentation: Administrative Enrollment Management Endpoints

This document details the missing administrative endpoints required by the frontend for full **CRUD operations on Candidate Enrollments** (`/enrollments`).

---

## 📌 Missing Endpoints Summary

| HTTP Method | URL Path | Auth | Purpose |
|---|---|---|---|
| `GET` | `/v1/enrollments/admin/list` | 🔒 Admin | Global paginated list of enrollments across all model tests with filtering |
| `POST` | `/v1/enrollments/admin/enroll` | 🔒 Admin | Admin manual candidate enrollment into an exam (offline/walk-in) |
| `PATCH` | `/v1/enrollments/admin/:id` | 🔒 Admin | Admin update enrollment status (`ENROLLED`, `CANCELLED`, `PENDING_APPROVAL`) |
| `DELETE` | `/v1/enrollments/admin/:id` | 🔒 Admin | Admin revoke / delete candidate enrollment |

---

## 1. `GET /enrollments/admin/list` 🔒 *(ADMIN)*

Lists candidate enrollments globally across all exams or filtered by `examId`.

### Query Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `examId` | `string` (UUID) | ❌ | Filter enrollments for a specific model test |
| `search` | `string` | ❌ | Search by candidate name, roll number, reg number, mobile, or college |
| `status` | `string` | ❌ | Filter by status (`ENROLLED`, `PENDING_APPROVAL`, `CANCELLED`, `COMPLETED`) |
| `page` | `number` | ❌ | Page number (default: `1`) |
| `limit` | `number` | ❌ | Items per page (default: `20`) |

### Success Response (`200 OK`)

```json
{
  "statusCode": 200,
  "success": true,
  "data": [
    {
      "id": "enr-uuid-001",
      "examId": "exam-uuid-001",
      "studentId": "std-uuid-001",
      "status": "ENROLLED",
      "createdAt": "2026-02-15T10:00:00.000Z",
      "updatedAt": "2026-02-15T10:00:00.000Z",
      "exam": {
        "id": "exam-uuid-001",
        "title": "Medical Admission Grand Model Test - 01",
        "code": "MED-GMT-2026-01",
        "examDate": "2026-03-15T10:00:00.000Z"
      },
      "student": {
        "id": "std-uuid-001",
        "fullName": "Sadia Islam",
        "rollNumber": 4528647,
        "collegeName": "Gazipur Govt. Girls College",
        "photoUrl": "https://..."
      },
      "seatPlan": {
        "centreName": "Shafipur Educare Coaching Center",
        "roomNumber": "Room 201",
        "seatNumber": "Seat-12"
      },
      "admitCard": {
        "id": "ac-uuid-001",
        "admitCardNumber": "AC-MED-GMT-2026-01-4528647",
        "status": "GENERATED",
        "pdfUrl": "https://..."
      }
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 348,
    "totalPages": 18
  }
}
```

---

## 2. `POST /enrollments/admin/enroll` 🔒 *(ADMIN)*

Allows an Administrator to manually register/enroll a student into a model test (e.g. offline walk-in applicants).

### Request Body

| Field | Type | Required | Description |
|---|---|---|---|
| `studentId` | `string` (UUID) | ✅ Required | Target student ID |
| `examId` | `string` (UUID) | ✅ Required | Target model test ID |
| `status` | `string` | ❌ Optional | Initial status (`ENROLLED` or `PENDING_APPROVAL`, default: `ENROLLED`) |

### Success Response (`201 Created`)

```json
{
  "statusCode": 201,
  "success": true,
  "message": "Student successfully enrolled in model test",
  "data": {
    "id": "enr-uuid-new",
    "examId": "exam-uuid-001",
    "studentId": "std-uuid-001",
    "status": "ENROLLED",
    "createdAt": "2026-09-03T01:33:00.000Z"
  }
}
```

---

## 3. `PATCH /enrollments/admin/:id` 🔒 *(ADMIN)*

Updates candidate enrollment status or details.

### Request Body

```json
{
  "status": "ENROLLED"
}
```

### Success Response (`200 OK`)

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Enrollment status updated to ENROLLED",
  "data": {
    "id": "enr-uuid-001",
    "status": "ENROLLED",
    "updatedAt": "2026-09-03T01:33:00.000Z"
  }
}
```

---

## 4. `DELETE /enrollments/admin/:id` 🔒 *(ADMIN)*

Revokes or deletes a student's enrollment from an exam.

### Success Response (`200 OK`)

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Candidate enrollment revoked successfully",
  "data": {
    "id": "enr-uuid-001",
    "deletedAt": "2026-09-03T01:33:00.000Z"
  }
}
```
