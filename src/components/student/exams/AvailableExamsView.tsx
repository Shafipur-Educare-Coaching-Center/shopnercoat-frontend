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

  // If no exams returned from backend, supply rich standard model test series
  const displayExams: Exam[] = exams.length > 0
    ? exams
    : [
        {
          id: 'exam-08',
          title: 'National Medical Mock Test 08 (Full Syllabus)',
          code: 'NMT-08',
          description: 'Comprehensive full-length Central Medical Admission mock test covering all 5 core subjects with dense rank calibration.',
          examDate: '2026-10-24T10:00:00.000Z',
          startTime: '10:00 AM',
          endTime: '11:00 AM',
          registrationStartAt: '2026-09-01T00:00:00.000Z',
          registrationEndAt: '2026-10-23T23:59:59.000Z',
          instructions: 'Standard medical exam board conduct rules apply.',
          totalMarks: 100,
          passMarks: 40,
          status: 'REGISTRATION_OPEN',
          createdBy: 'admin-1',
          createdAt: '2026-09-01T00:00:00.000Z',
          updatedAt: '2026-09-01T00:00:00.000Z',
        },
        {
          id: 'exam-09',
          title: 'Chemistry Subject Final Mock Test (Paper 01 & 02)',
          code: 'NMT-09',
          description: 'Intensive Chemistry specialized model test covering Organic, Inorganic, and Physical Chemistry MCQs with -0.25 penalty.',
          examDate: '2026-11-07T10:00:00.000Z',
          startTime: '10:00 AM',
          endTime: '11:00 AM',
          registrationStartAt: '2026-09-01T00:00:00.000Z',
          registrationEndAt: '2026-11-06T23:59:59.000Z',
          instructions: 'Standard medical exam board conduct rules apply.',
          totalMarks: 100,
          passMarks: 40,
          status: 'REGISTRATION_OPEN',
          createdBy: 'admin-1',
          createdAt: '2026-09-01T00:00:00.000Z',
          updatedAt: '2026-09-01T00:00:00.000Z',
        },
        {
          id: 'exam-10',
          title: 'Biology Subject Final Mock Test (Botany & Zoology)',
          code: 'NMT-10',
          description: 'High-yield Biology clinical model test focusing on Genetics, Human Physiology, Ecology, and Cell Biology.',
          examDate: '2026-11-14T10:00:00.000Z',
          startTime: '10:00 AM',
          endTime: '11:00 AM',
          registrationStartAt: '2026-09-01T00:00:00.000Z',
          registrationEndAt: '2026-11-13T23:59:59.000Z',
          instructions: 'Standard medical exam board conduct rules apply.',
          totalMarks: 100,
          passMarks: 40,
          status: 'REGISTRATION_OPEN',
          createdBy: 'admin-1',
          createdAt: '2026-09-01T00:00:00.000Z',
          updatedAt: '2026-09-01T00:00:00.000Z',
        },
        {
          id: 'exam-11',
          title: 'Physics & General Knowledge Combined Mock Test',
          code: 'NMT-11',
          description: 'Speed and accuracy test targeting Physics numerical problems, English grammar rules, and Bangladesh liberation war affairs.',
          examDate: '2026-11-21T10:00:00.000Z',
          startTime: '10:00 AM',
          endTime: '11:00 AM',
          registrationStartAt: '2026-09-01T00:00:00.000Z',
          registrationEndAt: '2026-11-20T23:59:59.000Z',
          instructions: 'Standard medical exam board conduct rules apply.',
          totalMarks: 100,
          passMarks: 40,
          status: 'REGISTRATION_OPEN',
          createdBy: 'admin-1',
          createdAt: '2026-09-01T00:00:00.000Z',
          updatedAt: '2026-09-01T00:00:00.000Z',
        },
        {
          id: 'exam-12',
          title: 'Grand National Medical Pre-Admission Final',
          code: 'NMT-12',
          description: 'Final full-length nationwide dress rehearsal simulator mirroring the official DGHS medical admission question standard.',
          examDate: '2026-11-28T10:00:00.000Z',
          startTime: '10:00 AM',
          endTime: '11:00 AM',
          registrationStartAt: '2026-09-01T00:00:00.000Z',
          registrationEndAt: '2026-11-27T23:59:59.000Z',
          instructions: 'Standard medical exam board conduct rules apply.',
          totalMarks: 100,
          passMarks: 40,
          status: 'REGISTRATION_OPEN',
          createdBy: 'admin-1',
          createdAt: '2026-09-01T00:00:00.000Z',
          updatedAt: '2026-09-01T00:00:00.000Z',
        },
      ];

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
