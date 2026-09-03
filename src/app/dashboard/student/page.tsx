import React from 'react';
import { Metadata } from 'next';
import { getAccessToken } from '@/lib/server/getTokens';
import { getStudentAnalytics } from '@/server/student-analytics.service';
import {
  StudentDashboardHeader,
  StudentMetricCards,
  PerformanceProgressionChart,
  OmrAccuracyPieChart,
  NegativeMarkingAuditChart,
  UpcomingExamsBanner,
  RecentResultsTable,
} from '@/components/student/dashboard';

export const metadata: Metadata = {
  title: 'Candidate Dashboard | Shopner Coat Medical Exam Board',
  description:
    'Comprehensive medical candidate performance analytics, OMR precision calibration, and national merit rankings.',
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function StudentDashboardPage() {
  const token = await getAccessToken();

  const analytics = await getStudentAnalytics(token!);

  return (
    <div className="w-full flex flex-col gap-6 sm:gap-7 pb-10">
      
      {/* 1. Header Hero with 3D Interactive Three.js Calibration Matrix */}
      <StudentDashboardHeader studentProfile={analytics.studentProfile} />

      {/* 2. Top 4 High-Impact KPI Performance Cards */}
      <StudentMetricCards kpiSummary={analytics.kpiSummary} />

      {/* 3. Analytics Grid Row 1: Performance Progression Spline + OMR Accuracy Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
        <div className="lg:col-span-7 flex">
          <PerformanceProgressionChart progressionTrend={analytics.progressionTrend} />
        </div>
        <div className="lg:col-span-5 flex">
          <OmrAccuracyPieChart breakdown={analytics.omrAccuracyBreakdown} />
        </div>
      </div>

      {/* 4. Analytics Grid Row 2: Negative Marking Audit Bar Chart + Upcoming Mock Test Countdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
        <div className="lg:col-span-7 flex">
          <NegativeMarkingAuditChart auditData={analytics.negativeMarkingAudit} />
        </div>
        <div className="lg:col-span-5 flex">
          <UpcomingExamsBanner upcomingExam={analytics.upcomingExam} />
        </div>
      </div>

      {/* 5. Recent Scorecards & Evaluation Sheet */}
      <div className="w-full">
        <RecentResultsTable recentScorecards={analytics.recentScorecards} />
      </div>

    </div>
  );
}
