'use client';

import React, { useState, useEffect } from 'react';
import {
  PublishedExamOption,
  FALLBACK_EXAMS,
  MOCK_EXAM,
  MOCK_RANKERS,
  normalizeRankers,
} from '@/data/rankingData';
import { RankerDisplayItem } from '@/types/ranking.types';
import { RankingHeroCard } from './RankingHeroCard';
import { SingleExamRankingList } from './SingleExamRankingList';

interface RankingContainerProps {
  initialExams?: PublishedExamOption[];
  initialRanking?: unknown;
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

    const raw = initialRanking as Record<string, unknown> | null;
    const list = Array.isArray(raw)
      ? raw
      : Array.isArray(raw?.data)
      ? (raw.data as unknown[])
      : (raw?.metadata as Record<string, unknown>)?.topRankers || [];

    if (list && Array.isArray(list) && list.length > 0) {
      return normalizeRankers(list, false);
    }
    return [];
  });

  const [isLoading, setIsLoading] = useState(false);
  const [popperTriggerKey, setPopperTriggerKey] = useState<string | number>('init-load');

  // Client-side automatic fresh fetch on mount / exam change without cache
  useEffect(() => {
    let active = true;
    if (!selectedExam.isMock && selectedExam.id !== MOCK_EXAM.id) {
      fetch(`/api/bff/rankings/public/${selectedExam.id}`, { cache: 'no-store' })
        .then((res) => (res.ok ? res.json() : null))
        .then((json) => {
          if (!active || !json) return;
          const raw = json as Record<string, unknown>;
          const list = Array.isArray(raw)
            ? raw
            : Array.isArray(raw?.data)
            ? (raw.data as unknown[])
            : (raw?.metadata as Record<string, unknown>)?.topRankers || [];

          if (list && Array.isArray(list) && list.length > 0) {
            setRankers(normalizeRankers(list, false));
          }
        })
        .catch((err) => console.warn('Fresh mount fetch ranking error:', err));
    }
    return () => {
      active = false;
    };
  }, [selectedExam.id, selectedExam.isMock]);

  // Handle Exam Selection Change
  const handleSelectExam = async (exam: PublishedExamOption) => {
    if (exam.id === selectedExam.id) return;
    
    setSelectedExam(exam);
    setIsLoading(true);
    setPopperTriggerKey(`exam-${exam.id}-${Date.now()}`);

    if (exam.isMock || exam.id === MOCK_EXAM.id) {
      setRankers(MOCK_RANKERS);
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(`/api/bff/rankings/public/${exam.id}`, { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        const raw = json as Record<string, unknown>;
        const list = Array.isArray(raw)
          ? raw
          : Array.isArray(raw?.data)
          ? (raw.data as unknown[])
          : (raw?.metadata as Record<string, unknown>)?.topRankers || [];

        if (list && Array.isArray(list) && list.length > 0) {
          setRankers(normalizeRankers(list, false));
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

  const topRankers = rankers.slice(0, 3);

  return (
    <div className="w-full flex flex-col items-center select-none">
      {/* 1. Top Hero Card: Dropdown Selector + 3D Podium & Poppers */}
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
