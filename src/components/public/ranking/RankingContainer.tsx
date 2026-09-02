'use client';

import React, { useState } from 'react';
import {
  PublishedExamOption,
  FALLBACK_EXAMS,
  MOCK_EXAM,
  MOCK_RANKERS,
  normalizeRankers,
} from '@/data/rankingData';
import { PublishedRanking, RankerDisplayItem } from '@/types/ranking.types';
import { RankingHeroCard } from './RankingHeroCard';
import { SingleExamRankingList } from './SingleExamRankingList';

interface RankingContainerProps {
  initialExams?: PublishedExamOption[];
  initialRanking?: PublishedRanking | null;
  initialExamId?: string;
}

export function RankingContainer({
  initialExams,
  initialRanking,
  initialExamId,
}: RankingContainerProps) {
  const exams = initialExams && initialExams.length > 0 ? initialExams : FALLBACK_EXAMS;
  
  const [selectedExam, setSelectedExam] = useState<PublishedExamOption>(() => {
    if (initialExamId) {
      const match = exams.find((e) => e.id === initialExamId);
      if (match) return match;
    }
    return exams[0] || MOCK_EXAM;
  });

  const [rankers, setRankers] = useState<RankerDisplayItem[]>(() => {
    if (selectedExam.isMock || selectedExam.id === MOCK_EXAM.id) {
      return MOCK_RANKERS;
    }
    if (initialRanking?.metadata?.topRankers && initialRanking.metadata.topRankers.length > 0) {
      return normalizeRankers(initialRanking.metadata.topRankers, false);
    }
    return [];
  });

  const [isLoading, setIsLoading] = useState(false);
  const [popperTriggerKey, setPopperTriggerKey] = useState<string | number>('init-load');

  // Handle Exam Selection Change
  const handleSelectExam = async (exam: PublishedExamOption) => {
    if (exam.id === selectedExam.id) return;
    
    setSelectedExam(exam);
    setIsLoading(true);
    // Trigger celebratory poppers animation upon exam switch
    setPopperTriggerKey(`exam-${exam.id}-${Date.now()}`);

    // If switching to mock sample exam, immediately set mock rankers
    if (exam.isMock || exam.id === MOCK_EXAM.id) {
      setRankers(MOCK_RANKERS);
      setIsLoading(false);
      return;
    }

    try {
      // Fetch public ranking snapshot for the chosen backend exam: /ranking/public/:examId
      const res = await fetch(`/api/bff/rankings/public/${exam.id}`);
      if (res.ok) {
        const json = await res.json();
        const topRankers = json?.data?.metadata?.topRankers;
        if (topRankers && Array.isArray(topRankers) && topRankers.length > 0) {
          setRankers(normalizeRankers(topRankers, false));
        } else {
          setRankers([]);
        }
      } else {
        setRankers([]);
      }
    } catch (err) {
      console.warn('Could not fetch ranking for exam:', exam.id, err);
      setRankers([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Top 3 students for the 3D Podium pillars (dynamically updates based on selected exam's rankers)
  const topRankers = rankers.slice(0, 3);

  return (
    <div className="w-full flex flex-col items-center">
      {/* 1. Top Hero Card: "The best students" + Dropdown Selector + 3D Podium & Poppers */}
      <RankingHeroCard
        exams={exams}
        selectedExam={selectedExam}
        onSelectExam={handleSelectExam}
        topRankers={topRankers}
        popperTriggerKey={popperTriggerKey}
      />

      {/* 2. Single-Exam Ranking Leaderboard List */}
      <SingleExamRankingList
        rankers={rankers}
        isLoading={isLoading}
      />
    </div>
  );
}
