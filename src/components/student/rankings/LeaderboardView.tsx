'use client';

import React, { useState, useEffect } from 'react';
import { Exam } from '@/types/exam.types';
import { TopRanker } from '@/types/ranking.types';
import { Result } from '@/types/result.types';
import { Student } from '@/types/student.types';
import { LeaderboardHeader } from './LeaderboardHeader';
import { CandidateRankHighlightCard } from './CandidateRankHighlightCard';
import { PodiumTopRankers } from './PodiumTopRankers';
import { LeaderboardFilterBar, LeaderboardRangeFilter } from './LeaderboardFilterBar';
import { LeaderboardTable } from './LeaderboardTable';

interface LeaderboardViewProps {
  exams: Exam[];
  initialRankers: TopRanker[];
  candidateResults: Result[];
  student: Student | null;
}

export function LeaderboardView({
  exams,
  initialRankers,
  candidateResults,
  student,
}: LeaderboardViewProps) {
  const [selectedExamId, setSelectedExamId] = useState<string>(
    exams.length > 0 ? exams[0].id : ''
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRange, setSelectedRange] = useState<LeaderboardRangeFilter>('ALL');
  const [rankers, setRankers] = useState<TopRanker[]>(initialRankers);
  const [isLoading, setIsLoading] = useState(false);

  const studentName = student?.fullName || 'Candidate Student';
  const rollNumber = student?.rollNumber || '---';

  // Fetch rankings when switching exams on the client
  useEffect(() => {
    if (!selectedExamId) return;

    async function fetchExamRanking() {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/bff/rankings/public/${selectedExamId}`);
        if (res.ok) {
          const json = await res.json();
          if (json.data) {
            const dataObj = json.data;
            const list = Array.isArray(dataObj)
              ? dataObj
              : Array.isArray(dataObj.metadata?.topRankers)
              ? dataObj.metadata.topRankers
              : Array.isArray(dataObj.topRankers)
              ? dataObj.topRankers
              : Array.isArray(dataObj.rankings)
              ? dataObj.rankings
              : [];
            setRankers(list);
          }
        }
      } catch (err) {
        console.warn('Failed to switch exam ranking:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchExamRanking();
  }, [selectedExamId]);

  // Find candidate's result for the currently selected exam
  const candidateResult = candidateResults.find(
    (r) => r.examId === selectedExamId || r.exam?.id === selectedExamId
  ) || null;

  // Filter rankers
  const filteredRankers = rankers.filter((r) => {
    // Search query filter
    const matchesSearch =
      (r.fullName && r.fullName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (r.rollNumber && String(r.rollNumber).includes(searchQuery));

    if (!matchesSearch) return false;

    // Range filter
    if (selectedRange === 'TOP_10') return r.position <= 10;
    if (selectedRange === 'TOP_50') return r.position <= 50;

    return true;
  });

  const topScore = rankers.length > 0 ? Math.max(...rankers.map((r) => Number(r.obtainedMarks) || 0)) : 0;

  return (
    <div className="w-full flex flex-col gap-6 sm:gap-7 pb-10">
      
      {/* 1. Header with 3D Podium & Exam Selector */}
      <LeaderboardHeader
        exams={exams}
        selectedExamId={selectedExamId}
        onSelectExam={setSelectedExamId}
        totalExaminees={rankers.length}
        topScore={topScore}
      />

      {/* 2. Personal Standing Highlight Card */}
      <CandidateRankHighlightCard
        candidateResult={candidateResult}
        studentName={studentName}
        rollNumber={rollNumber}
      />

      {/* 3. Top 3 Gold, Silver, Bronze Podium Cards */}
      <PodiumTopRankers topRankers={rankers.slice(0, 3)} />

      {/* 4. Filter & Search Bar */}
      <LeaderboardFilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedRange={selectedRange}
        setSelectedRange={setSelectedRange}
        totalFiltered={filteredRankers.length}
      />

      {/* 5. Complete National Merit List Table */}
      <LeaderboardTable
        rankers={filteredRankers}
        currentStudentRoll={rollNumber}
      />

    </div>
  );
}

export default LeaderboardView;
