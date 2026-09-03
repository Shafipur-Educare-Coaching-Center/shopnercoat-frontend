# Backend API Specification: Student Admit Cards, Results & Subject Breakdowns

This document outlines the complete REST API contract, JSON schema definitions, and NestJS controller/service reference code for the **My Admit Cards** (`/dashboard/student/admit-cards`) and **My Results** (`/dashboard/student/results`) student portals.

---

## 📌 Executive Summary of Endpoints

| Portal | Endpoint | Method | Role | Description |
|---|---|---|---|---|
| **Admit Cards** | **`/v1/admit-cards/me`** | `GET` | `STUDENT` | Returns all digital Admit Cards issued to the candidate with QR verification tokens and location snapshot. |
| **Admit Cards** | **`/v1/admit-cards/verify/:token`** | `GET` | `PUBLIC` | Scanned by invigilators at the exam gate to verify candidate identity and seat. |
| **Admit Cards** | **`/v1/admit-cards/download/:token`** | `GET` | `STUDENT` | Streams/redirects to the signed official digital Admit Card PDF. |
| **Results** | **`/v1/results/me`** | `GET` | `STUDENT` | Returns all published model test scorecards with marks, penalties, dense rankings, and exam metadata. |
| **Results** | **`/v1/results/me/:resultId`** | `GET` | `STUDENT` | *(Optional)* Detailed subject-wise score breakdown (Biology, Chemistry, Physics, English, GK) and OMR questions. |
| **Results** | **`/v1/results/me/summary`** | `GET` | `STUDENT` | *(Optional)* Aggregate candidate statistics (Highest Rank, Mean Score, OMR Precision, Pass Rate). |

---

## 1. 🎫 Admit Cards Endpoint: `GET /v1/admit-cards/me`

### 📤 Response Payload (`200 OK`)
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Candidate admit cards retrieved successfully",
  "data": [
    {
      "id": "ac-88412-nmt08",
      "examId": "9de23f66-6e77-4555-c066-5e152f6a8505",
      "studentId": "376a8850-fef7-404c-80e0-5af31fab4515",
      "enrollmentId": "f17ca25f-d128-4e20-a2dd-ff508c8b8c9d",
      "admitCardNumber": "ADM-2026-9242808-NMT08",
      "verificationToken": "ADM-2026-9242808-NMT08",
      "status": "GENERATED",
      "pdfUrl": "/api/bff/admit-cards/download/ADM-2026-9242808-NMT08",
      "generatedAt": "2026-09-01T12:05:00.000Z",
      "locationSnapshot": {
        "centreName": "Shafipur Central Examination Hall",
        "venue": "Shafipur Central Campus",
        "roomNumber": "Room #04",
        "seatNumber": "Seat S-142"
      },
      "exam": {
        "id": "9de23f66-6e77-4555-c066-5e152f6a8505",
        "title": "National Medical Mock Test 08 (Full Syllabus)",
        "code": "NMT-08",
        "examDate": "2026-10-24T10:00:00.000Z",
        "startTime": "10:00 AM",
        "endTime": "11:00 AM"
      }
    }
  ]
}
```

---

## 2. 🏆 Results Endpoint: `GET /v1/results/me`

### 📤 Response Payload (`200 OK`)
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Student results retrieved successfully",
  "data": [
    {
      "id": "res-901",
      "examId": "8cd12e55-5d66-4644-bf55-6d041e5f7404",
      "studentId": "376a8850-fef7-404c-80e0-5af31fab4515",
      "totalAnswered": 93,
      "correctAnswered": 89,
      "wrongAnswered": 4,
      "skipped": 7,
      "deductMark": 1.00,
      "obtainedMarks": 88.0,
      "percentage": 88.0,
      "position": 12,
      "resultStatus": "PASSED",
      "published": true,
      "createdAt": "2026-03-22T12:00:00.000Z",
      "exam": {
        "id": "8cd12e55-5d66-4644-bf55-6d041e5f7404",
        "title": "National Medical Mock Test 06",
        "code": "NMT-06",
        "examDate": "2026-03-22T10:00:00.000Z",
        "totalMarks": 100,
        "passMarks": 40
      }
    }
  ]
}
```

---

## 3. 🔬 Optional Detail Endpoint: `GET /v1/results/me/:resultId`

### 📤 Response Payload (`200 OK`)
```json
{
  "statusCode": 200,
  "success": true,
  "data": {
    "id": "res-901",
    "examId": "8cd12e55-5d66-4644-bf55-6d041e5f7404",
    "obtainedMarks": 88.0,
    "position": 12,
    "percentile": 98.4,
    "subjectBreakdown": [
      { "subject": "Biology (Botany & Zoology)", "correct": 28, "wrong": 1, "skipped": 1, "marks": 27.75, "total": 30 },
      { "subject": "Chemistry (Organic & Physical)", "correct": 23, "wrong": 1, "skipped": 1, "marks": 22.75, "total": 25 },
      { "subject": "Physics (Paper 1 & Paper 2)", "correct": 18, "wrong": 1, "skipped": 1, "marks": 17.75, "total": 20 },
      { "subject": "English Language & Vocab", "correct": 12, "wrong": 1, "skipped": 2, "marks": 11.75, "total": 15 },
      { "subject": "General Knowledge & BD Affairs", "correct": 8, "wrong": 0, "skipped": 2, "marks": 8.00, "total": 10 }
    ]
  }
}
```

---

## 4. 💻 NestJS Controller & Service Implementation Reference

```typescript
// results.controller.ts
@Controller('results')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ResultsController {
  constructor(private readonly resultsService: ResultsService) {}

  @Get('me')
  @Roles('STUDENT')
  async getMyResults(@Req() req: AuthenticatedRequest) {
    const results = await this.resultsService.getStudentResults(req.user.id);
    return {
      statusCode: 200,
      success: true,
      data: results,
    };
  }

  @Get('me/:resultId')
  @Roles('STUDENT')
  async getResultDetail(@Req() req: AuthenticatedRequest, @Param('resultId') resultId: string) {
    const detail = await this.resultsService.getStudentResultDetail(req.user.id, resultId);
    return {
      statusCode: 200,
      success: true,
      data: detail,
    };
  }
}
```
