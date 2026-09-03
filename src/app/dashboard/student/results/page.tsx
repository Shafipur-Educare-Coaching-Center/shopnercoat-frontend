import React from 'react';
import { Metadata } from 'next';
import { getAccessToken } from '@/lib/server/getTokens';
import { getMyResults } from '@/server/result.service';
import { getStudentMe } from '@/server/student.service';
import { MyResultsView } from '@/components/student/results';

export const metadata: Metadata = {
  title: 'My Results & Scorecards | Shopner Coat Student Portal',
  description:
    'Review your medical admission mock test scorecards, OMR evaluation breakdowns, and national rank standings.',
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function StudentResultsPage() {
  const token = await getAccessToken();

  const [results, student] = await Promise.all([
    getMyResults(token!).catch(() => []),
    getStudentMe(token!).catch(() => null),
  ]);

  return <MyResultsView results={results} student={student} />;
}
