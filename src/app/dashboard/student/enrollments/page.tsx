import React from 'react';
import { Metadata } from 'next';
import { getAccessToken } from '@/lib/server/getTokens';
import { getMyEnrollments } from '@/server/enrollment.service';
import { getMyAdmitCards } from '@/server/admit-card.service';
import { getStudentMe } from '@/server/student.service';
import { getMyResults } from '@/server/result.service';
import { MyEnrollmentsView } from '@/components/student/enrollments';

export const metadata: Metadata = {
  title: 'My Exam Enrollments & Passes | Shopner Coat Student Portal',
  description:
    'View your registered medical admission mock tests, download verified digital Admit Cards, and inspect examination hall seat allocations.',
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function StudentEnrollmentsPage() {
  const token = await getAccessToken();

  const [enrollments, admitCards, student, results] = await Promise.all([
    getMyEnrollments(token!).catch(() => []),
    getMyAdmitCards(token!).catch(() => []),
    getStudentMe(token!).catch(() => null),
    getMyResults(token!).catch(() => []),
  ]);

  // Compute best national rank if available from published results
  const positions = results
    .map((r) => r.position)
    .filter((p): p is number => typeof p === 'number' && p > 0);
  const bestRank = positions.length > 0 ? Math.min(...positions) : null;

  return (
    <MyEnrollmentsView
      enrollments={enrollments}
      admitCards={admitCards}
      student={student}
      bestRank={bestRank}
    />
  );
}
