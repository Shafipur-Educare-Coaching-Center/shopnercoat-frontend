'use client';

import React, { useState, useEffect, useTransition, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { AdmitCard } from '@/types/admit-card.types';
import { Exam } from '@/types/exam.types';
import { getAdminAdmitCardsAction } from '@/features/admin/admit-cards/actions/getAdminAdmitCardsAction';
import { AdmitCardHeader } from './AdmitCardHeader';
import { AdmitCardStatsBanner } from './AdmitCardStatsBanner';
import { AdmitCardBatchTriggerCard } from './AdmitCardBatchTriggerCard';
import { AdmitCardTable } from './AdmitCardTable';

interface AdmitCardDirectoryContainerProps {
  initialAdmitCards: AdmitCard[];
  exams: Exam[];
}

export function AdmitCardDirectoryContainer({
  initialAdmitCards,
  exams,
}: AdmitCardDirectoryContainerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [admitCards, setAdmitCards] = useState<AdmitCard[]>(initialAdmitCards);
  const [selectedExamId, setSelectedExamId] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch fresh admit cards for selected exam
  const fetchFreshAdmitCards = useCallback((examId: string) => {
    startTransition(async () => {
      const res = await getAdminAdmitCardsAction(examId);
      if (res.success && res.admitCards) {
        setAdmitCards(res.admitCards);
      }
    });
  }, []);

  // Re-fetch when selected exam changes
  useEffect(() => {
    fetchFreshAdmitCards(selectedExamId);
  }, [selectedExamId, fetchFreshAdmitCards]);

  // Filter admit cards by exam & search query
  const filteredCards = useMemo(() => {
    return admitCards.filter((card) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesExam = selectedExamId === 'ALL' || card.examId === selectedExamId;
      const matchesSearch =
        q === '' ||
        (card.admitCardNumber || '').toLowerCase().includes(q) ||
        (card.student?.fullName || '').toLowerCase().includes(q) ||
        String(card.student?.rollNumber || '').includes(q);

      return matchesExam && matchesSearch;
    });
  }, [admitCards, selectedExamId, searchQuery]);

  const handleRefresh = () => {
    fetchFreshAdmitCards(selectedExamId);
    startTransition(() => {
      router.refresh();
      toast.success('Admit Card Directory Synchronized');
    });
  };

  return (
    <div className="w-full flex flex-col select-none">
      
      {/* 1. Page Header */}
      <AdmitCardHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedExamId={selectedExamId}
        onExamChange={setSelectedExamId}
        exams={exams}
        onRefresh={handleRefresh}
        isRefreshing={isPending}
      />

      {/* 2. Metrics Summary Banner */}
      <AdmitCardStatsBanner admitCards={filteredCards} />

      {/* 3. Batch PDF Dispatch Trigger Panel */}
      <AdmitCardBatchTriggerCard
        exams={exams}
        selectedExamId={selectedExamId}
        onSuccess={handleRefresh}
      />

      {/* 4. Admit Cards Register Table */}
      <AdmitCardTable admitCards={filteredCards} />

    </div>
  );
}
