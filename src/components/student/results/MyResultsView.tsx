'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Result } from '@/types/result.types';
import { Student } from '@/types/student.types';
import { ResultHeader } from './ResultHeader';
import { ResultMetricCards } from './ResultMetricCards';
import { ResultFilterBar, ResultFilterStatus } from './ResultFilterBar';
import { ResultCard } from './ResultCard';
import { ResultDetailModal } from './ResultDetailModal';
import { ROUTES } from '@/constants/routes';
import {
  Trophy,
  Inbox,
  ArrowRight,
} from 'lucide-react';

interface MyResultsViewProps {
  results: Result[];
  student: Student | null;
}

export function MyResultsView({ results, student }: MyResultsViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<ResultFilterStatus>('ALL');
  const [selectedDetailResult, setSelectedDetailResult] = useState<Result | null>(null);

  const studentName = student?.fullName || 'Candidate Student';
  const rollNumber = student?.rollNumber || '---';

  // Compute Aggregate Stats
  const totalEvaluated = results.length;
  const totalPassed = results.filter((r) => r.resultStatus === 'PASSED').length;
  const totalObtained = results.reduce((sum, r) => sum + (Number(r.obtainedMarks) || 0), 0);
  const averageMarks = totalEvaluated > 0 ? totalObtained / totalEvaluated : 0;

  const totalCorrect = results.reduce((sum, r) => sum + (Number(r.correctAnswered) || 0), 0);
  const totalWrong = results.reduce((sum, r) => sum + (Number(r.wrongAnswered) || 0), 0);
  const totalAttempted = totalCorrect + totalWrong;
  const accuracyPercentage = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0;

  const positions = results
    .map((r) => r.position)
    .filter((p): p is number => typeof p === 'number' && p > 0);
  const bestRank = positions.length > 0 ? Math.min(...positions) : null;

  // Filtering Logic
  const filteredResults = results.filter((r) => {
    // Search filter
    const matchesSearch =
      (r.exam?.title && r.exam.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (r.exam?.code && r.exam.code.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    // Status filter
    if (selectedStatus === 'PASSED') return r.resultStatus === 'PASSED';
    if (selectedStatus === 'FAILED') return r.resultStatus === 'FAILED';
    if (selectedStatus === 'TOP_TIER') return r.position !== null && r.position <= 10;

    return true;
  });

  return (
    <div className="w-full flex flex-col gap-6 sm:gap-7 pb-10">
      
      {/* 1. Header with 3D Golden Merit Visualizer */}
      <ResultHeader
        studentName={studentName}
        rollNumber={rollNumber}
        totalEvaluated={totalEvaluated}
        bestRank={bestRank}
      />

      {/* 2. Top KPI Metric Cards */}
      <ResultMetricCards
        bestRank={bestRank}
        averageMarks={averageMarks}
        accuracyPercentage={accuracyPercentage}
        totalPassed={totalPassed}
        totalEvaluated={totalEvaluated}
      />

      {/* 3. Filter & Search Bar */}
      <ResultFilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        totalResults={filteredResults.length}
      />

      {/* 4. Scorecard Cards Grid */}
      {filteredResults.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 items-stretch">
          {filteredResults.map((r) => (
            <ResultCard
              key={r.id}
              result={r}
              onOpenDetail={(res) => setSelectedDetailResult(res)}
            />
          ))}
        </div>
      ) : (
        <div className="w-full rounded-[28px] bg-white border border-slate-200/80 p-12 text-center flex flex-col items-center justify-center space-y-3 shadow-2xs">
          <div className="size-16 rounded-2xl bg-teal-50 text-[#00796B] flex items-center justify-center">
            <Inbox className="size-8" />
          </div>
          <h3 className="font-heading font-black text-lg text-slate-900">
            No Scorecards Published Yet
          </h3>
          <p className="text-xs text-slate-500 max-w-sm">
            You do not have any evaluated examination scorecards matching this filter. Once your OMR sheets are graded, scorecards and merit ranks will appear here.
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

      {/* 5. Result Detail & Subject Breakdown Modal */}
      <ResultDetailModal
        result={selectedDetailResult}
        onClose={() => setSelectedDetailResult(null)}
      />

    </div>
  );
}

export default MyResultsView;
