import React from 'react';
import { Metadata } from 'next';
import { getAccessToken } from '@/lib/server/getTokens';
import { getExams } from '@/server/exam.service';
import { getAdminStudentList } from '@/server/student.service';
import { getAdminExamResults } from '@/server/result.service';
import { ResultDirectoryContainer } from '@/components/admin/results';

import { Result } from '@/types/result.types';

export const metadata: Metadata = {
  title: 'Result Management & Tabulation | ShopnerCoat Admin',
  description:
    'Examinee score recording, bulk mark sheet tabulation, 4-level dense tiebreaker ranking, and public leaderboard publishing.',
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface ResultsPageProps {
  searchParams: Promise<{
    examId?: string;
  }>;
}

export default async function AdminResultsPage({ searchParams }: ResultsPageProps) {
  const token = await getAccessToken();
  const params = await searchParams;

  const [examsRes, studentsRes] = await Promise.all([
    getExams(),
    getAdminStudentList(token || '', 1, 100),
  ]);

  const exams = examsRes.data || [];
  const students = studentsRes.data || [];

  const targetExamId = params.examId || exams[0]?.id || '';

  let initialResults: Result[] = [];
  if (targetExamId) {
    const resultsRes = await getAdminExamResults(token || '', targetExamId);
    initialResults = resultsRes.data || [];
  }

  return (
    <div className="w-full">
      <ResultDirectoryContainer
        initialResults={initialResults}
        exams={exams}
        students={students}
        initialExamId={targetExamId}
      />
    </div>
  );
}
