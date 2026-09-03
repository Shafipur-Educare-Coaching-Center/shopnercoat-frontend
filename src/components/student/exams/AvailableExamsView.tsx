'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Exam, ExamEnrollmentAdmin } from '@/types/exam.types';
import { ExamDiscoveryHeader } from './ExamDiscoveryHeader';
import { ExamFilterBar, ExamFilterStatus } from './ExamFilterBar';
import { ExamCard } from './ExamCard';
import { ExamSyllabusModal } from './ExamSyllabusModal';
import { EnrollConfirmDialog } from './EnrollConfirmDialog';
import { BookOpen, Sparkles, Inbox } from 'lucide-react';
import { evaluateExamRegistration } from '@/lib/dateUtils';

interface AvailableExamsViewProps {
  exams: Exam[];
  enrollments: ExamEnrollmentAdmin[];
}

export function AvailableExamsView({ exams, enrollments }: AvailableExamsViewProps) {
  const router = useRouter();

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<ExamFilterStatus>('ALL');

  // Modal States
  const [selectedSyllabusExam, setSelectedSyllabusExam] = useState<Exam | null>(null);
  const [selectedEnrollExam, setSelectedEnrollExam] = useState<Exam | null>(null);

  // Set of enrolled exam IDs
  const enrolledExamIds = new Set(enrollments.map((e) => e.examId));

  // Use real exams from backend directly (no mock fallbacks)
  const displayExams: Exam[] = exams;

  // Filtering Logic
  const filteredExams = displayExams.filter((exam) => {
    // Search Query filter
    const matchesSearch =
      exam.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exam.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (exam.description && exam.description.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    // Status filter
    const isEnrolled = enrolledExamIds.has(exam.id);
    if (selectedStatus === 'ENROLLED') return isEnrolled;
    if (selectedStatus === 'OPEN') return evaluateExamRegistration(exam).isOpen;
    if (selectedStatus === 'UPCOMING') {
      const examTime = exam.examDate ? new Date(exam.examDate).getTime() : 0;
      return examTime >= Date.now();
    }

    return true;
  });

  return (
    <div className="w-full flex flex-col gap-6 sm:gap-7 pb-10">
      
      {/* 1. Discovery Hero Banner with 3D Knowledge Core */}
      <ExamDiscoveryHeader
        totalAvailable={displayExams.length}
        enrolledCount={enrolledExamIds.size}
      />

      {/* 2. Interactive Search & Status Filter Bar */}
      <ExamFilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        totalResults={filteredExams.length}
      />

      {/* 3. Available Exams Cards Grid */}
      {filteredExams.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 items-stretch">
          {filteredExams.map((exam) => {
            const isEnrolled = enrolledExamIds.has(exam.id);
            return (
              <ExamCard
                key={exam.id}
                exam={exam}
                isEnrolled={isEnrolled}
                onOpenSyllabus={(ex) => setSelectedSyllabusExam(ex)}
                onEnrollClick={(ex) => setSelectedEnrollExam(ex)}
              />
            );
          })}
        </div>
      ) : (
        <div className="w-full rounded-[28px] bg-white border border-slate-200/80 p-12 text-center flex flex-col items-center justify-center space-y-3 shadow-2xs">
          <div className="size-16 rounded-2xl bg-teal-50 text-[#00796B] flex items-center justify-center">
            <Inbox className="size-8" />
          </div>
          <h3 className="font-heading font-black text-lg text-slate-900">
            No Model Tests Found
          </h3>
          <p className="text-xs text-slate-500 max-w-sm">
            No examinations match your search or selected filter. Try changing your filters or search keywords.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedStatus('ALL');
            }}
            className="mt-2 px-4 py-2 rounded-xl bg-teal-50 text-[#00796B] font-bold text-xs hover:bg-teal-100 transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* 4. Syllabus Breakdown Modal */}
      <ExamSyllabusModal
        exam={selectedSyllabusExam}
        onClose={() => setSelectedSyllabusExam(null)}
      />

      {/* 5. Enrollment Confirmation Dialog */}
      <EnrollConfirmDialog
        exam={selectedEnrollExam}
        onClose={() => setSelectedEnrollExam(null)}
        onSuccess={() => {
          router.refresh();
        }}
      />

    </div>
  );
}

export default AvailableExamsView;
