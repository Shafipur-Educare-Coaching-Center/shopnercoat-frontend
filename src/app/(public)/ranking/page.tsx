import React from 'react';
import { getPublicExamsForRanking, getPublicRanking } from '@/server/ranking.service';
import { RankingContainer } from '@/components/public/ranking';
import { PublishedExamOption, MOCK_EXAM } from '@/data/rankingData';
import { PublishedRanking } from '@/types/ranking.types';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Top Student Rankings & Leaderboard | ShopnerCoat Medical Exam Board',
  description:
    'Track top performing medical candidates across national MBBS, Clinical Anatomy, and Pre-Med qualifier examinations.',
};

export default async function RankingPage() {
  let initialExams: PublishedExamOption[] = [MOCK_EXAM];
  let initialRanking: PublishedRanking | null = null;
  const initialExamId = MOCK_EXAM.id;

  try {
    // 1. Fetch all real exams from backend GET /exams
    const examsData = await getPublicExamsForRanking();
    if (examsData && examsData.length > 0) {
      const realExams: PublishedExamOption[] = examsData.map((e) => ({
        id: e.id,
        title: e.title,
        code: e.code,
        category: 'MBBS',
        scope: 'National',
        examDate: e.examDate,
        tags: [e.code || 'Exam', e.status || 'Live'],
        isMock: false,
      }));

      // Combine exactly 1 mock exam with all fetched backend exams
      initialExams = [MOCK_EXAM, ...realExams];
    }
  } catch (err) {
    console.warn('Could not load server exams for ranking page:', err);
  }

  // If there's an initial real exam selected or rankings snapshot
  if (initialExamId && initialExamId !== MOCK_EXAM.id) {
    try {
      initialRanking = await getPublicRanking(initialExamId);
    } catch {
      // Handled gracefully in RankingContainer
    }
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-[#E8F8F5]/40 via-white to-[#FAF8FF] pt-24 sm:pt-28 pb-20">
      
      {/* Ambient Medical Decorative Glows */}
      <div
        className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-primary/6 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute top-1/2 left-8 w-[420px] h-[420px] bg-teal-300/8 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Ranking Container (Hero card with 3D podium + Single-exam ranking list) */}
        <RankingContainer
          initialExams={initialExams}
          initialRanking={initialRanking}
          initialExamId={initialExamId}
        />

      </div>
    </div>
  );
}
