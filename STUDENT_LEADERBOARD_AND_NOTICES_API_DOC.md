# Backend API Specification: Student Leaderboard, Merit Standings & Official Notices Engine

This document details the complete REST API contract, JSON schema definitions, entity models, and NestJS controller/service reference code for the **Student Leaderboard & Standings** (`/dashboard/student/rankings`) and **Official Notices & Bulletins** (`/dashboard/student/announcements`) portals.

---

## 📌 Executive Summary of Endpoints

| Portal | Endpoint | Method | Role | Description |
|---|---|---|---|---|
| **Leaderboard** | **`/v1/rankings/public/:examId`** | `GET` | `PUBLIC` / `STUDENT` | Returns top rankers and dense merit standings for a specific model test. |
| **Leaderboard** | **`/v1/rankings/exam/:examId/me`** | `GET` | `STUDENT` | *(Recommended)* Returns the authenticated candidate's exact rank position, percentile, and score delta relative to top 10 for the given exam. |
| **Leaderboard** | **`/v1/exams`** | `GET` | `PUBLIC` / `STUDENT` | Lists all published mock tests to populate the leaderboard exam selector dropdown. |
| **Notices** | **`/v1/announcements/public`** | `GET` | `PUBLIC` / `STUDENT` | Returns all active published board announcements and circulars. |
| **Notices** | **`/v1/announcements/:id`** | `GET` | `PUBLIC` / `STUDENT` | Returns full announcement content and attachment links. |
| **Notices** | **`/v1/announcements/student/feed`** | `GET` | `STUDENT` | *(Recommended)* Returns prioritized announcements tailored for student feed with category tags and urgency levels. |

---

## 1. 🏆 Leaderboard API: `GET /v1/rankings/public/:examId`

### 📥 Path Parameters
| Param | Type | Description |
|---|---|---|
| `examId` | `UUID` | ID of the mock test to retrieve national merit ranking for. |

### 📤 Response Payload (`200 OK`)
```json
{
  "statusCode": 200,
  "success": true,
  "message": "National ranking retrieved successfully",
  "data": {
    "exam": {
      "id": "8cd12e55-5d66-4644-bf55-6d041e5f7404",
      "title": "National Medical Mock Test 06",
      "code": "NMT-06",
      "examDate": "2026-03-22T10:00:00.000Z",
      "totalMarks": 100,
      "passMarks": 40,
      "totalExaminees": 1420,
      "averageScore": 74.2,
      "topScore": 96.5
    },
    "topRankers": [
      {
        "position": 1,
        "studentId": "std-001",
        "fullName": "Tahmid Hasan",
        "rollNumber": "9242801",
        "collegeName": "Notre Dame College",
        "photoUrl": "https://api.shopnercoat.xyz/uploads/avatars/std-001.jpg",
        "obtainedMarks": 96.5,
        "percentage": 96.5,
        "correctCount": 97,
        "wrongCount": 2,
        "remarks": "National Rank 1 • Gold Laureate",
        "tags": ["Gold Medal", "DMC 1st Choice"]
      },
      {
        "position": 2,
        "studentId": "std-002",
        "fullName": "Sumaiya Akter",
        "rollNumber": "9242802",
        "collegeName": "Viqarunnisa Noon College",
        "photoUrl": "https://api.shopnercoat.xyz/uploads/avatars/std-002.jpg",
        "obtainedMarks": 95.0,
        "percentage": 95.0,
        "correctCount": 96,
        "wrongCount": 4,
        "remarks": "National Rank 2 • Silver Laureate",
        "tags": ["Silver Medal", "Top Scorer"]
      },
      {
        "position": 3,
        "studentId": "std-003",
        "fullName": "Abrar Fahad",
        "rollNumber": "9242803",
        "collegeName": "Dhaka City College",
        "photoUrl": null,
        "obtainedMarks": 94.25,
        "percentage": 94.25,
        "correctCount": 95,
        "wrongCount": 3,
        "remarks": "National Rank 3 • Bronze Laureate",
        "tags": ["Bronze Medal"]
      }
    ],
    "rankings": [
      {
        "position": 4,
        "studentId": "std-004",
        "fullName": "Nusrat Jahan",
        "rollNumber": "9242804",
        "collegeName": "Holy Cross College",
        "obtainedMarks": 93.0,
        "percentage": 93.0,
        "correctCount": 94,
        "wrongCount": 4
      }
    ]
  }
}
```

---

## 2. 📢 Official Notices API: `GET /v1/announcements/public`

### 📤 Response Payload (`200 OK`)
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Public announcements fetched successfully",
  "data": [
    {
      "id": "anc-101",
      "title": "National Medical Mock Test 08 — Central Hall Guidelines & OMR Bubble Rules",
      "content": "All registered medical aspirants for NMT-08 are hereby notified that exam gates will strictly close 15 minutes prior to the 10:00 AM session. Only standard black ballpoint pens and 2B pencils are permissible. Mobile phones and smartwatches are strictly prohibited.",
      "category": "EXAM_GUIDELINES",
      "priority": "URGENT",
      "pinned": true,
      "status": "PUBLISHED",
      "publishedAt": "2026-09-02T08:00:00.000Z",
      "expiresAt": "2026-10-30T23:59:59.000Z",
      "attachmentUrl": "https://api.shopnercoat.xyz/uploads/notices/NMT08_OMR_Instructions.pdf",
      "createdAt": "2026-09-02T08:00:00.000Z"
    },
    {
      "id": "anc-102",
      "title": "National Merit Cutoff Calibration & DMC Eligibility Matrix Released",
      "content": "The central evaluation committee has published the benchmark score percentiles for Session 2025/2026 medical college admission predictions.",
      "category": "MERIT_RESULTS",
      "priority": "IMPORTANT",
      "pinned": false,
      "status": "PUBLISHED",
      "publishedAt": "2026-08-25T10:00:00.000Z",
      "expiresAt": null,
      "attachmentUrl": null,
      "createdAt": "2026-08-25T10:00:00.000Z"
    }
  ]
}
```

---

## 3. 💾 NestJS Service & Controller Reference Implementation

```typescript
// ranking.controller.ts
@Controller('rankings')
export class RankingController {
  constructor(private readonly rankingService: RankingService) {}

  @Get('public/:examId')
  async getPublicRanking(@Param('examId') examId: string) {
    const data = await this.rankingService.getExamLeaderboard(examId);
    return {
      statusCode: 200,
      success: true,
      data,
    };
  }

  @Get('exam/:examId/me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('STUDENT')
  async getStudentStanding(
    @Req() req: AuthenticatedRequest,
    @Param('examId') examId: string,
  ) {
    const standing = await this.rankingService.getStudentExamStanding(req.user.id, examId);
    return {
      statusCode: 200,
      success: true,
      data: standing,
    };
  }
}
```
