'use client';

import React, { useState, useEffect, useTransition, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Exam } from '@/types/exam.types';
import { Result } from '@/types/result.types';
import { getAdminExamResultsAction } from '@/features/admin/results/actions/getAdminExamResultsAction';
import { publishRankingSnapshotAction } from '@/features/admin/rankings/actions/publishRankingSnapshotAction';
import { RankingPublisherHeader } from './RankingPublisherHeader';
import { RankingTop10Preview } from './RankingTop10Preview';

interface RankingPublisherContainerProps {
  initialResults: Result[];
  exams: Exam[];
  initialExamId?: string;
}

export function RankingPublisherContainer({
  initialResults,
  exams,
  initialExamId,
}: RankingPublisherContainerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [selectedExamId, setSelectedExamId] = useState<string>(() => {
    if (initialExamId) return initialExamId;
    return exams[0]?.id || '';
  });

  const [results, setResults] = useState<Result[]>(initialResults);

  const selectedExam = exams.find((e) => e.id === selectedExamId) || exams[0];

  const fetchResultsForExam = useCallback((examId: string) => {
    if (!examId) return;
    startTransition(async () => {
      const res = await getAdminExamResultsAction(examId);
      if (res.success && res.results) {
        setResults(res.results);
      }
    });
  }, []);

  useEffect(() => {
    if (selectedExamId) {
      fetchResultsForExam(selectedExamId);
    }
  }, [selectedExamId, fetchResultsForExam]);

  const handleRefresh = () => {
    if (selectedExamId) {
      fetchResultsForExam(selectedExamId);
    }
    startTransition(() => {
      router.refresh();
      toast.success('Ranking Snapshot Synchronized');
    });
  };

  const handlePublish = () => {
    if (!selectedExamId) {
      toast.error('Select Exam', { description: 'Please select an exam to publish ranking snapshot.' });
      return;
    }

    startTransition(async () => {
      const res = await publishRankingSnapshotAction(selectedExamId);
      if (res.success) {
        toast.success('Public Leaderboard Updated', {
          description: 'Top-10 merit ranking snapshot is now live on /ranking!',
        });
        handleRefresh();
      } else {
        toast.error('Publish Failed', { description: res.error });
      }
    });
  };

  const isExamPublished = selectedExam?.status === 'RESULT_PUBLISHED';

  return (
    <div className="w-full flex flex-col select-none">
      
      {/* 1. Header with Controls & Publish Action */}
      <RankingPublisherHeader
        selectedExamId={selectedExamId}
        onExamChange={setSelectedExamId}
        exams={exams}
        onPublish={handlePublish}
        onRefresh={handleRefresh}
        isPublishing={isPending}
        isRefreshing={isPending}
        isExamPublished={isExamPublished}
      />

      {/* 2. Top-10 Visual Podium Preview */}
      <RankingTop10Preview results={results} />

    </div>
  );
}
