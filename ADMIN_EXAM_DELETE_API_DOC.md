# Backend API Documentation: `DELETE /exams/:id`

This document details the required specification for implementing the **Hard Delete / Permanently Remove Exam Endpoint** (`DELETE /exams/:id`) on the backend REST API server.

---

## 📌 Endpoint Overview

| Property | Value |
|---|---|
| **HTTP Method** | `DELETE` |
| **URL Path** | `/v1/exams/:id` (or `/exams/:id`) |
| **Authentication** | 🔒 Required (`Authorization: Bearer <token>`) |
| **Authorized Roles** | `ADMIN` only |

---

## 📥 Request Parameters

### 1. Path Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `id` | `string` (UUID) | ✅ Required | Unique ID of the target model test to delete |

### 2. Query Parameters (Optional)

| Parameter | Type | Default | Description |
|---|---|---|---|
| `force` | `boolean` | `false` | If `true`, bypasses restriction when exam status is `COMPLETED` or `RESULT_PUBLISHED` |

---

## 🔄 Execution Logic & Database Cascade Rules

When processing `DELETE /exams/:id`:

1. **Verify Authorization**: Ensure the requesting user has the `ADMIN` role.
2. **Find Target Exam**: Locate exam by `id`. If not found, return `404 Not Found`.
3. **Safety Check**:
   - If exam status is `COMPLETED` or `RESULT_PUBLISHED` and `force !== true`, return `400 Bad Request` (`"Cannot delete completed exam with published merit list. Use force=true to override."`).
4. **Cascade Deletion**:
   - Delete associated **Seat Allocations** (`SeatPlan` records).
   - Delete associated **Candidate Enrollments** (`Enrollment` records).
   - Delete associated **Exam Rooms** (`ExamRoom` records).
   - Delete associated **Exam Centres** (`ExamCentre` records).
5. **Delete Exam**: Remove the record from the `Exam` table.

---

## 📤 HTTP Response Payloads

### 1. Success Response (`200 OK`)

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Model test deleted successfully",
  "data": {
    "id": "4ee3fdcd-7e52-439e-9428-a69e9dd29aed",
    "deletedAt": "2026-09-03T01:24:00.000Z"
  }
}
```

### 2. Unauthorized Error (`401 Unauthorized`)

```json
{
  "statusCode": 401,
  "error": "Unauthorized",
  "message": "Bearer access token is missing or invalid"
}
```

### 3. Forbidden Error (`403 Forbidden`)

```json
{
  "statusCode": 403,
  "error": "Forbidden",
  "message": "Administrative privileges required to delete model tests"
}
```

### 4. Not Found Error (`404 Not Found`)

```json
{
  "statusCode": 404,
  "error": "Not Found",
  "message": "Exam with ID '4ee3fdcd-7e52-439e-9428-a69e9dd29aed' not found"
}
```

---

## 💻 NestJS Example Implementation Reference

```typescript
@Delete(':id')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
async deleteExam(
  @Param('id') id: string,
  @Query('force') force?: boolean,
) {
  const exam = await this.examService.findById(id);
  if (!exam) {
    throw new NotFoundException(`Exam with ID '${id}' not found`);
  }

  if (['COMPLETED', 'RESULT_PUBLISHED'].includes(exam.status) && !force) {
    throw new BadRequestException(
      'Cannot delete completed exam with published merit list. Pass force=true query parameter to force delete.',
    );
  }

  await this.examService.deleteExamWithCascade(id);

  return {
    statusCode: 200,
    success: true,
    message: 'Model test deleted successfully',
    data: { id, deletedAt: new Date().toISOString() },
  };
}
```
