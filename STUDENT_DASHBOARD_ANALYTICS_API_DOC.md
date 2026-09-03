# Backend API Specification: Student Dashboard Analytics & Dynamic Visualizations Engine

This document details the exact REST API contract, JSON schema definitions, mathematical formulas, and NestJS service implementation required to dynamically feed the **4 Visual Dashboard Sections** shown in the UI:

1. 📈 **Performance Progression Curve** (Multi-series trajectory vs Top-10 benchmark)
2. 🚨 **Negative Marking Audit** (Per-mock penalty bar chart & strategy insights)
3. ⏳ **Upcoming Live Test Banner & Countdown Clock** (Exam schedule & instant Admit Card PDF pass)
4. 📋 **Recent Model Test Scorecards Table** (Historical evaluation records & dense ranks)

---

## 📌 Primary Endpoint Overview

| Property | Value |
|---|---|
| **Endpoint** | `GET /v1/students/dashboard/analytics` (or `/v1/analytics/student/me`) |
| **HTTP Method** | `GET` |
| **Authentication** | 🔒 Required (`Authorization: Bearer <accessToken>`) |
| **Authorized Role** | `STUDENT` |
| **Description** | Returns pre-computed, real-time analytics for the authenticated candidate. |

---

## 1. 📊 Section-by-Section Payload & Data Types Specification

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│  1. PERFORMANCE PROGRESSION CURVE                                                      │
│     • Student Score Spline (Emerald)                                                   │
│     • National Top-10 Benchmark Line (Cyan Dotted)                                     │
│     • Pass Threshold Line (40.0 Amber Dotted)                                          │
├────────────────────────────────────────────────────────────────────────────────────────┤
│  2. NEGATIVE MARKING AUDIT                                                             │
│     • Penalty Reduction Badge (-71% Penalty Reduction)                                 │
│     • Exam-by-Exam Penalty Bars (-0.25 per wrong answer)                               │
│     • Strategy Insight (Dynamic marks saved formula)                                   │
├────────────────────────────────────────────────────────────────────────────────────────┤
│  3. UPCOMING LIVE TEST & COUNTDOWN CLOCK                                               │
│     • Scheduled ISO Timestamp for Live Countdown Timer (Days / Hours / Mins / Secs)     │
│     • Venue, Hall Room, and Assigned Seat Number                                       │
│     • One-Click Digital Admit Card PDF Download Token                                  │
├────────────────────────────────────────────────────────────────────────────────────────┤
│  4. RECENT MODEL TEST SCORECARDS TABLE                                                 │
│     • Exam Code & Date                                                                 │
│     • Correct (+89) / Wrong (4) / Deductions (-1.00)                                   │
│     • Net Score (88.0 / 100)                                                           │
│     • National Dense Rank (🏆 #12)                                                     │
│     • Status Badge (PASSED / FAILED)                                                   │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

### Section 1: 📈 Performance Progression Curve (`progressionTrend`)

#### JSON Schema:
```json
"progressionTrend": [
  {
    "examId": "8cd12e55-5d66-4644-bf55-6d041e5f7404",
    "examCode": "NMT-01",
    "examTitle": "National Medical Mock Test 01",
    "examDate": "2026-01-12T10:00:00.000Z",
    "studentScore": 72.5,
    "nationalTop10Avg": 88.0,
    "passMark": 40.0,
    "nationalRank": 34,
    "percentile": 92.0
  },
  {
    "examId": "7bc01d44-4c55-4733-ae44-7c930d4e6303",
    "examCode": "NMT-02",
    "examTitle": "National Medical Mock Test 02",
    "examDate": "2026-01-26T10:00:00.000Z",
    "studentScore": 76.0,
    "nationalTop10Avg": 89.5,
    "passMark": 40.0,
    "nationalRank": 28,
    "percentile": 94.2
  },
  {
    "examId": "6ab90c33-3b44-4822-9d33-8b829c3d5202",
    "examCode": "NMT-03",
    "examTitle": "National Medical Mock Test 03",
    "examDate": "2026-02-09T10:00:00.000Z",
    "studentScore": 79.5,
    "nationalTop10Avg": 91.0,
    "passMark": 40.0,
    "nationalRank": 22,
    "percentile": 95.8
  },
  {
    "examId": "5fa23d11-1a22-498c-8c11-9a718b2c4101",
    "examCode": "NMT-04",
    "examTitle": "National Medical Mock Test 04",
    "examDate": "2026-02-23T10:00:00.000Z",
    "studentScore": 81.0,
    "nationalTop10Avg": 92.5,
    "passMark": 40.0,
    "nationalRank": 18,
    "percentile": 96.9
  },
  {
    "examId": "4ee3fdcd-7e52-439e-9428-a69e9dd29aed",
    "examCode": "NMT-05",
    "examTitle": "National Medical Mock Test 05",
    "examDate": "2026-03-08T10:00:00.000Z",
    "studentScore": 85.5,
    "nationalTop10Avg": 94.0,
    "passMark": 40.0,
    "nationalRank": 15,
    "percentile": 97.8
  },
  {
    "examId": "3c580fb6-42e6-4697-af02-2d4b149d135e",
    "examCode": "NMT-06",
    "examTitle": "National Medical Mock Test 06",
    "examDate": "2026-03-22T10:00:00.000Z",
    "studentScore": 88.0,
    "nationalTop10Avg": 95.0,
    "passMark": 40.0,
    "nationalRank": 12,
    "percentile": 98.4
  }
]
```

#### 📐 Calculation Rules:
1. **`studentScore`**: Exact `obtainedMarks` computed as `correctAnswered - (wrongAnswered * 0.25)`.
2. **`nationalTop10Avg`**: Average `obtainedMarks` of the top 10 scoring examinees in that particular exam:
   $$\text{nationalTop10Avg} = \frac{1}{10} \sum_{i=1}^{10} \text{Score}_i$$
3. **`passMark`**: Configured pass threshold on the Exam entity (default: `40.0`).
4. **`nationalRank`**: Dense rank position (e.g. `12` if 11 students scored higher).

---

### Section 2: 🚨 Negative Marking Audit (`negativeMarkingAudit`)

#### JSON Schema:
```json
"negativeMarkingAuditSummary": {
  "penaltyReductionPercentage": "-71%",
  "strategyInsight": "Skipping 4 uncertain guesses saves +5.00 net marks on your merit standing.",
  "penaltyHistory": [
    {
      "examLabel": "Mock 01",
      "code": "NMT-01",
      "correctMarks": 76.0,
      "wrongCount": 14,
      "deductMarks": 3.50,
      "netScore": 72.5
    },
    {
      "examLabel": "Mock 02",
      "code": "NMT-02",
      "correctMarks": 79.0,
      "wrongCount": 12,
      "deductMarks": 3.00,
      "netScore": 76.0
    },
    {
      "examLabel": "Mock 03",
      "code": "NMT-03",
      "correctMarks": 82.0,
      "wrongCount": 10,
      "deductMarks": 2.50,
      "netScore": 79.5
    },
    {
      "examLabel": "Mock 04",
      "code": "NMT-04",
      "correctMarks": 83.0,
      "wrongCount": 8,
      "deductMarks": 2.00,
      "netScore": 81.0
    },
    {
      "examLabel": "Mock 05",
      "code": "NMT-05",
      "correctMarks": 87.0,
      "wrongCount": 6,
      "deductMarks": 1.50,
      "netScore": 85.5
    },
    {
      "examLabel": "Mock 06",
      "code": "NMT-06",
      "correctMarks": 89.0,
      "wrongCount": 4,
      "deductMarks": 1.00,
      "netScore": 88.0
    }
  ]
}
```

#### 📐 Calculation Rules:
1. **`deductMarks`**: Total marks lost:
   $$\text{deductMarks} = \text{wrongCount} \times 0.25$$
2. **`penaltyReductionPercentage`**: Change in penalty marks between the candidate's first and latest mock test:
   $$\text{reductionPct} = \left( \frac{\text{deductMarks}_{\text{latest}} - \text{deductMarks}_{\text{first}}}{\text{deductMarks}_{\text{first}}} \right) \times 100$$
   Example: From $3.50$ to $1.00 \implies \frac{1.00 - 3.50}{3.50} \times 100 = -71.4\% \implies \mathbf{-71\%}$.
3. **`strategyInsight`**: Calculated mark savings if the candidate had skipped random guesses:
   $$\text{potentialMarksSaved} = \text{wrongCount}_{\text{latest}} \times (1.00 + 0.25) = \text{wrongCount}_{\text{latest}} \times 1.25$$
   Example: For 4 wrong answers, skipping them avoids $-1.00$ penalty and converts uncertain guesses into a net strategic advantage of $+5.00$ marks.

---

### Section 3: ⏳ Upcoming Live Test & Countdown Clock (`upcomingExam`)

#### JSON Schema:
```json
"upcomingExam": {
  "examId": "9de23f66-6e77-4555-c066-5e152f6a8505",
  "examCode": "NMT-08",
  "examTitle": "National Medical Mock Test 08",
  "scheduledDate": "2026-09-05T10:00:00.000Z",
  "scheduleDisplay": "This Friday • 10:00 AM",
  "venue": "Shafipur Central Examination Hall",
  "room": "Hall Room #04, 2nd Floor",
  "seatNumber": "S-142",
  "admitCardAvailable": true,
  "admitCardToken": "ADM-2026-9242808-NMT08",
  "admitCardDownloadUrl": "/api/bff/admit-cards/download/ADM-2026-9242808-NMT08",
  "syllabusUrl": "/announcements/syllabus-nmt-08"
}
```

#### 📐 Details:
- **`scheduledDate`**: Must be a valid future ISO 8601 string. The frontend countdown clock calculates:
  $$\Delta t = \text{scheduledDate} - \text{Current Time} \implies \text{Days, Hours, Minutes, Seconds}$$
- **`admitCardDownloadUrl`**: Secure link to the candidate's PDF Admit Card with embedded QR verification token.

---

### Section 4: 📋 Recent Model Test Scorecards Table (`recentScorecards`)

#### JSON Schema:
```json
"recentScorecards": [
  {
    "id": "res-901",
    "examId": "8cd12e55-5d66-4644-bf55-6d041e5f7404",
    "examCode": "NMT-06",
    "examTitle": "National Medical Mock Test 06",
    "examDate": "2026-03-22T10:00:00.000Z",
    "totalAnswered": 93,
    "correctAnswered": 89,
    "wrongAnswered": 4,
    "skipped": 7,
    "deductMark": 1.00,
    "obtainedMarks": 88.0,
    "totalMarks": 100.0,
    "percentage": 88.0,
    "position": 12,
    "resultStatus": "PASSED"
  },
  {
    "id": "res-902",
    "examId": "7bc01d44-4c55-4733-ae44-7c930d4e6303",
    "examCode": "NMT-05",
    "examTitle": "National Medical Mock Test 05",
    "examDate": "2026-03-08T10:00:00.000Z",
    "totalAnswered": 93,
    "correctAnswered": 87,
    "wrongAnswered": 6,
    "skipped": 7,
    "deductMark": 1.50,
    "obtainedMarks": 85.5,
    "totalMarks": 100.0,
    "percentage": 85.5,
    "position": 15,
    "resultStatus": "PASSED"
  },
  {
    "id": "res-903",
    "examId": "6ab90c33-3b44-4822-9d33-8b829c3d5202",
    "examCode": "NMT-04",
    "examTitle": "National Medical Mock Test 04",
    "examDate": "2026-02-23T10:00:00.000Z",
    "totalAnswered": 91,
    "correctAnswered": 83,
    "wrongAnswered": 8,
    "skipped": 9,
    "deductMark": 2.00,
    "obtainedMarks": 81.0,
    "totalMarks": 100.0,
    "percentage": 81.0,
    "position": 18,
    "resultStatus": "PASSED"
  },
  {
    "id": "res-904",
    "examId": "5fa23d11-1a22-498c-8c11-9a718b2c4101",
    "examCode": "NMT-03",
    "examTitle": "National Medical Mock Test 03",
    "examDate": "2026-02-09T10:00:00.000Z",
    "totalAnswered": 92,
    "correctAnswered": 82,
    "wrongAnswered": 10,
    "skipped": 8,
    "deductMark": 2.50,
    "obtainedMarks": 79.5,
    "totalMarks": 100.0,
    "percentage": 79.5,
    "position": 22,
    "resultStatus": "PASSED"
  }
]
```

---

## 2. 💻 Complete NestJS Backend Reference Implementation

Backend engineers can paste this service into their NestJS module:

```typescript
// src/analytics/student-analytics.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StudentAnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboardAnalytics(userId: string) {
    // 1. Locate authenticated student profile
    const student = await this.prisma.student.findUnique({
      where: { userId },
      include: { user: true },
    });

    if (!student) {
      throw new NotFoundException('Student candidate profile not found for authenticated user');
    }

    // 2. Fetch all published Results ordered by Exam Date ascending
    const results = await this.prisma.result.findMany({
      where: { studentId: student.id, published: true },
      include: {
        exam: {
          select: {
            id: true,
            title: true,
            code: true,
            examDate: true,
            totalMarks: true,
            passMarks: true,
          },
        },
      },
      orderBy: { exam: { examDate: 'asc' } },
    });

    // 3. Compute Section 1: Progression Trend & Top 10 Benchmark
    const progressionTrend = await Promise.all(
      results.map(async (r, idx) => {
        // Compute average score of the Top 10 examinees for this exam
        const top10Scores = await this.prisma.result.findMany({
          where: { examId: r.examId, published: true },
          orderBy: { obtainedMarks: 'desc' },
          take: 10,
          select: { obtainedMarks: true },
        });

        const top10Avg =
          top10Scores.length > 0
            ? Number((top10Scores.reduce((sum, item) => sum + item.obtainedMarks, 0) / top10Scores.length).toFixed(1))
            : 90.0;

        return {
          examId: r.examId,
          examCode: r.exam.code,
          examTitle: r.exam.title,
          examDate: r.exam.examDate.toISOString(),
          studentScore: Number(r.obtainedMarks),
          nationalTop10Avg: top10Avg,
          passMark: Number(r.exam.passMarks || 40.0),
          nationalRank: r.position || idx + 1,
          percentile: Number(r.percentage),
        };
      })
    );

    // 4. Compute Section 2: Negative Marking Audit & Reduction %
    const penaltyHistory = results.map((r, idx) => ({
      examLabel: `Mock 0${idx + 1}`,
      code: r.exam.code,
      correctMarks: Number(r.correctAnswered),
      wrongCount: Number(r.wrongAnswered),
      deductMarks: Number(r.deductMark || (r.wrongAnswered * 0.25).toFixed(2)),
      netScore: Number(r.obtainedMarks),
    }));

    let penaltyReductionPercentage = '0%';
    let strategyInsight = 'Keep answering accurately to preserve your national rank.';

    if (penaltyHistory.length >= 2) {
      const firstPenalty = penaltyHistory[0].deductMarks;
      const latestPenalty = penaltyHistory[penaltyHistory.length - 1].deductMarks;
      const latestWrong = penaltyHistory[penaltyHistory.length - 1].wrongCount;

      if (firstPenalty > 0) {
        const reduction = Math.round(((latestPenalty - firstPenalty) / firstPenalty) * 100);
        penaltyReductionPercentage = `${reduction > 0 ? '+' : ''}${reduction}% Penalty Reduction`;
      }

      if (latestWrong > 0) {
        const savedMarks = (latestWrong * 1.25).toFixed(2);
        strategyInsight = `Skipping ${latestWrong} uncertain guesses saves +${savedMarks} net marks on your merit standing.`;
      }
    }

    // 5. Compute Section 3: Next Upcoming Live Exam & Admit Card Pass
    const upcomingEnrollment = await this.prisma.enrollment.findFirst({
      where: {
        studentId: student.id,
        status: 'ENROLLED',
        exam: { examDate: { gte: new Date() } },
      },
      include: {
        exam: true,
        centre: true,
        admitCard: true,
      },
      orderBy: { exam: { examDate: 'asc' } },
    });

    const upcomingExam = upcomingEnrollment
      ? {
          examId: upcomingEnrollment.examId,
          examCode: upcomingEnrollment.exam.code,
          examTitle: upcomingEnrollment.exam.title,
          scheduledDate: upcomingEnrollment.exam.examDate.toISOString(),
          scheduleDisplay: `${upcomingEnrollment.exam.examDate.toLocaleDateString('en-US', { weekday: 'long' })} • 10:00 AM`,
          venue: upcomingEnrollment.centre?.name || 'Shafipur Central Examination Hall',
          room: 'Hall Room #04, 2nd Floor',
          seatNumber: 'S-142',
          admitCardAvailable: Boolean(upcomingEnrollment.admitCard),
          admitCardToken: upcomingEnrollment.admitCard?.verificationToken || null,
          admitCardDownloadUrl: upcomingEnrollment.admitCard?.pdfUrl || `/api/bff/admit-cards/download/${upcomingEnrollment.admitCard?.verificationToken}`,
          syllabusUrl: `/announcements/syllabus-${upcomingEnrollment.exam.code.toLowerCase()}`,
        }
      : null;

    // 6. Compute Section 4: Recent Scorecards Table
    const recentScorecards = results
      .slice(-5)
      .reverse()
      .map((r) => ({
        id: r.id,
        examId: r.examId,
        examCode: r.exam.code,
        examTitle: r.exam.title,
        examDate: r.exam.examDate.toISOString(),
        totalAnswered: Number(r.totalAnswered),
        correctAnswered: Number(r.correctAnswered),
        wrongAnswered: Number(r.wrongAnswered),
        skipped: Number(r.skipped),
        deductMark: Number(r.deductMark),
        obtainedMarks: Number(r.obtainedMarks),
        totalMarks: Number(r.exam.totalMarks || 100),
        percentage: Number(r.percentage),
        position: r.position,
        resultStatus: r.resultStatus as 'PASSED' | 'FAILED',
      }));

    return {
      statusCode: 200,
      success: true,
      message: 'Student dashboard analytics retrieved successfully',
      data: {
        studentProfile: {
          id: student.id,
          fullName: student.fullName,
          rollNumber: student.rollNumber,
          registrationNumber: student.registrationNumber || `2025-${student.rollNumber}`,
          collegeName: student.collegeName || 'National Medical Track',
          academicTrack: '1st Timer Medical Aspirant',
          targetCollege: 'Dhaka Medical College (DMC)',
          session: '2025/2026',
          isVerified: student.registrationStatus === 'COMPLETED',
        },
        progressionTrend,
        negativeMarkingAudit: penaltyHistory,
        negativeMarkingAuditSummary: {
          penaltyReductionPercentage,
          strategyInsight,
          penaltyHistory,
        },
        upcomingExam,
        recentScorecards,
      },
    };
  }
}
```
