import React from 'react';
import { Metadata } from 'next';
import { getAccessToken } from '@/lib/server/getTokens';
import { getPublicExamsForRanking, getPublicRanking } from '@/server/ranking.service';
import { getMyResults } from '@/server/result.service';
import { getStudentMe } from '@/server/student.service';
import { LeaderboardView } from '@/components/student/rankings';
import { TopRanker } from '@/types/ranking.types';

export const metadata: Metadata = {
  title: 'National Leaderboard & Standings | Shopner Coat Student Portal',
  description:
    'Compare your medical admission mock test performance against candidates nationwide. Track gold laureates, percentiles, and merit standings.',
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function StudentRankingsPage() {
  const token = await getAccessToken();

  const [exams, candidateResults, student] = await Promise.all([
    getPublicExamsForRanking().catch(() => []),
    getMyResults(token!).catch(() => []),
    getStudentMe(token!).catch(() => null),
  ]);

  let initialRankers: TopRanker[] = [];
  if (exams.length > 0) {
    try {
      const rawData = (await getPublicRanking(exams[0].id)) as Record<string, unknown>;
      if (rawData) {
        const metadataObj = rawData?.metadata as Record<string, unknown> | undefined;
        const list = Array.isArray(rawData)
          ? rawData
          : Array.isArray(metadataObj?.topRankers)
          ? metadataObj.topRankers
          : Array.isArray(rawData?.topRankers)
          ? rawData.topRankers
          : Array.isArray(rawData?.rankings)
          ? rawData.rankings
          : [];
        initialRankers = list as TopRanker[];
      }
    } catch {
      initialRankers = [];
    }
  }

  return (
    <LeaderboardView
      exams={exams}
      initialRankers={initialRankers}
      candidateResults={candidateResults}
      student={student}
    />
  );
}
