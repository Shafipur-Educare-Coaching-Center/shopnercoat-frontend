'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AdmitCard } from '@/types/admit-card.types';
import { Student } from '@/types/student.types';
import { AdmitCardHeader } from './AdmitCardHeader';
import { AdmitCardFilterBar, AdmitCardFilterStatus } from './AdmitCardFilterBar';
import { AdmitCardPassCard } from './AdmitCardPassCard';
import { AdmitCardPrintModal } from './AdmitCardPrintModal';
import { AdmitCardRulesModal } from './AdmitCardRulesModal';
import { ROUTES } from '@/constants/routes';
import {
  FileCheck2,
  Inbox,
  ArrowRight,
} from 'lucide-react';

interface MyAdmitCardsViewProps {
  admitCards: AdmitCard[];
  student: Student | null;
}

export function MyAdmitCardsView({
  admitCards,
  student,
}: MyAdmitCardsViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<AdmitCardFilterStatus>('ALL');
  const [selectedPrintCard, setSelectedPrintCard] = useState<AdmitCard | null>(null);
  const [isRulesOpen, setIsRulesOpen] = useState(false);

  const studentName = student?.fullName || 'Candidate Student';
  const rollNumber = student?.rollNumber || '---';

  // Filtering Logic
  const filteredCards = admitCards.filter((card) => {
    // Search filter
    const matchesSearch =
      (card.exam?.title && card.exam.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (card.exam?.code && card.exam.code.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (card.admitCardNumber && card.admitCardNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (card.verificationToken && card.verificationToken.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    // Status filter
    if (selectedStatus === 'ACTIVE') {
      const examDate = card.exam?.examDate ? new Date(card.exam.examDate).getTime() : 0;
      return examDate >= Date.now() || card.status === 'GENERATED';
    }
    if (selectedStatus === 'ARCHIVED') {
      const examDate = card.exam?.examDate ? new Date(card.exam.examDate).getTime() : 0;
      return examDate < Date.now() && examDate > 0;
    }

    return true;
  });

  return (
    <div className="w-full flex flex-col gap-6 sm:gap-7 pb-10">
      
      {/* 1. Header with 3D Holographic Pass Visualizer */}
      <AdmitCardHeader
        studentName={studentName}
        rollNumber={rollNumber}
        totalPasses={admitCards.length}
      />

      {/* 2. Interactive Search & Status Filters */}
      <AdmitCardFilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        totalResults={filteredCards.length}
      />

      {/* 3. Cards List */}
      {filteredCards.length > 0 ? (
        <div className="space-y-4 sm:space-y-5">
          {filteredCards.map((card) => (
            <AdmitCardPassCard
              key={card.id}
              admitCard={card}
              studentName={studentName}
              rollNumber={rollNumber}
              onOpenPrintPreview={(c) => setSelectedPrintCard(c)}
              onOpenRules={() => setIsRulesOpen(true)}
            />
          ))}
        </div>
      ) : (
        <div className="w-full rounded-[28px] bg-white border border-slate-200/80 p-12 text-center flex flex-col items-center justify-center space-y-3 shadow-2xs">
          <div className="size-16 rounded-2xl bg-teal-50 text-[#00796B] flex items-center justify-center">
            <Inbox className="size-8" />
          </div>
          <h3 className="font-heading font-black text-lg text-slate-900">
            No Admit Cards Issued
          </h3>
          <p className="text-xs text-slate-500 max-w-sm">
            You do not have any issued Admit Cards in this category. Enroll in upcoming medical model tests to generate your verified digital hall pass.
          </p>
          <Link
            href={ROUTES.STUDENT_EXAMS}
            className="mt-2 px-5 py-2.5 rounded-xl bg-[#00695C] text-white font-bold text-xs hover:bg-[#00594D] transition-colors inline-flex items-center gap-1.5"
          >
            <span>Browse Available Model Tests</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      )}

      {/* 4. Fullscreen Print Layout Preview Modal */}
      <AdmitCardPrintModal
        admitCard={selectedPrintCard}
        studentName={studentName}
        rollNumber={rollNumber}
        onClose={() => setSelectedPrintCard(null)}
      />

      {/* 5. Exam Hall Regulations Modal */}
      <AdmitCardRulesModal
        isOpen={isRulesOpen}
        onClose={() => setIsRulesOpen(false)}
      />

    </div>
  );
}

export default MyAdmitCardsView;
