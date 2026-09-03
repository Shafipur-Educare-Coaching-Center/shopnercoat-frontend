import React from 'react';
import { Metadata } from 'next';
import { getAccessToken } from '@/lib/server/getTokens';
import { getExams } from '@/server/exam.service';
import { getMyEnrollments } from '@/server/enrollment.service';
import { AvailableExamsView } from '@/components/student/exams';

export const metadata: Metadata = {
  title: 'Available Model Tests | Shopner Coat Student Portal',
  description:
    'Discover and register for centralized medical admission model tests, subject finals, and nationwide rank benchmark exams.',
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function StudentExamsPage() {
  const token = await getAccessToken();

  const [examsRes, enrollments] = await Promise.all([
    getExams().catch(() => ({ data: [] })),
    getMyEnrollments(token!).catch(() => []),
  ]);

  const exams = examsRes?.data || [];

  return <AvailableExamsView exams={exams} enrollments={enrollments} />;
}
