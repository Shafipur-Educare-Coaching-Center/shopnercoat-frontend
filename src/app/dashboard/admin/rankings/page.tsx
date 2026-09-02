import React from 'react';
import { Metadata } from 'next';
import { getAccessToken } from '@/lib/server/getTokens';
import { getExams } from '@/server/exam.service';
import { getAdminExamResults } from '@/server/result.service';
import { RankingPublisherContainer } from '@/components/admin/rankings';
import { Result } from '@/types/result.types';

export const metadata: Metadata = {
  title: 'Ranking Publisher | ShopnerCoat Admin',
  description: 'Preview Top-10 merit list and publish public 3D podium ranking snapshots to candidates.',
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface RankingsPageProps {
  searchParams: Promise<{
    examId?: string;
  }>;
}

export default async function AdminRankingsPage({ searchParams }: RankingsPageProps) {
  const token = await getAccessToken();
  const params = await searchParams;

  const examsRes = await getExams();
  const exams = examsRes.data || [];

  const targetExamId = params.examId || exams[0]?.id || '';

  let initialResults: Result[] = [];
  if (targetExamId) {
    const resultsRes = await getAdminExamResults(token || '', targetExamId);
    initialResults = resultsRes.data || [];
  }

  return (
    <div className="w-full">
      <RankingPublisherContainer
        initialResults={initialResults}
        exams={exams}
        initialExamId={targetExamId}
      />
    </div>
  );
}
