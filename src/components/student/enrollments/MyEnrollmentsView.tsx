'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ExamEnrollmentAdmin } from '@/types/exam.types';
import { AdmitCard } from '@/types/admit-card.types';
import { Student } from '@/types/student.types';
import { EnrollmentHeader } from './EnrollmentHeader';
import { EnrollmentMetricCards } from './EnrollmentMetricCards';
import { EnrollmentPassCard } from './EnrollmentPassCard';
import { SeatPlanModal } from './SeatPlanModal';
import { ROUTES } from '@/constants/routes';
import {
  CreditCard,
  Sparkles,
  Inbox,
  ArrowRight,
} from 'lucide-react';

export type EnrollmentFilterTab = 'ALL' | 'UPCOMING' | 'COMPLETED';

interface MyEnrollmentsViewProps {
  enrollments: ExamEnrollmentAdmin[];
  admitCards: AdmitCard[];
  student: Student | null;
  bestRank?: number | null;
}

export function MyEnrollmentsView({
  enrollments,
  admitCards,
  student,
  bestRank,
}: MyEnrollmentsViewProps) {
  const [activeTab, setActiveTab] = useState<EnrollmentFilterTab>('ALL');
  const [selectedSeatPlan, setSelectedSeatPlan] = useState<{
    enrollment: ExamEnrollmentAdmin;
    admitCard?: AdmitCard | null;
  } | null>(null);

  const studentName = student?.fullName || 'Candidate Student';
  const rollNumber = student?.rollNumber || '---';

  // Map Admit Cards by examId
  const admitCardsMap = new Map<string, AdmitCard>();
  admitCards.forEach((ac) => {
    if (ac.examId) admitCardsMap.set(ac.examId, ac);
  });

  // Use real live enrollments directly
  const displayEnrollments = enrollments;

  // Tab Filtering
  const filteredEnrollments = displayEnrollments.filter((item) => {
    if (activeTab === 'UPCOMING') return item.status === 'ENROLLED';
    if (activeTab === 'COMPLETED') return item.status === 'COMPLETED';
    return true;
  });

  const upcomingCount = displayEnrollments.filter((e) => e.status === 'ENROLLED').length;
  const completedCount = displayEnrollments.filter((e) => e.status === 'COMPLETED').length;

  const tabs: { id: EnrollmentFilterTab; label: string; count: number }[] = [
    { id: 'ALL', label: 'All Registered Passes', count: displayEnrollments.length },
    { id: 'UPCOMING', label: 'Upcoming Live Tests', count: upcomingCount },
    { id: 'COMPLETED', label: 'Completed & Scored', count: completedCount },
  ];

  // Dynamic assigned seat from real upcoming admit card or centre
  const upcomingEnrollment = displayEnrollments.find((e) => e.status === 'ENROLLED');
  const upcomingAdmitCard = upcomingEnrollment?.admitCard || (upcomingEnrollment?.examId ? admitCardsMap.get(upcomingEnrollment.examId) : undefined);
  const assignedSeatDisplay = upcomingAdmitCard?.locationSnapshot?.seatNumber || upcomingEnrollment?.centre?.seatNumber || (displayEnrollments.length > 0 ? 'Seat Allocated' : 'No Seats');

  return (
    <div className="w-full flex flex-col gap-6 sm:gap-7 pb-10">
      
      {/* 1. Candidate Enrollment Header with 3D Holographic Pass */}
      <EnrollmentHeader
        studentName={studentName}
        rollNumber={rollNumber}
        totalPasses={displayEnrollments.length}
      />

      {/* 2. Top KPI Metric Cards */}
      <EnrollmentMetricCards
        totalEnrolled={displayEnrollments.length}
        upcomingCount={upcomingCount}
        assignedSeat={assignedSeatDisplay}
        bestRank={bestRank}
      />

      {/* 3. Filter Tabs */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-1.5 p-1 bg-white border border-slate-200/80 rounded-2xl shadow-2xs overflow-x-auto">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#00796B] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        <Link
          href={ROUTES.STUDENT_EXAMS}
          className="text-xs font-bold text-[#00796B] hover:text-[#00594D] flex items-center gap-1 hover:underline transition-colors shrink-0"
        >
          <span>Explore More Available Exams</span>
          <ArrowRight className="size-3.5" />
        </Link>
      </div>

      {/* 4. Digital Admit Pass Cards List */}
      {filteredEnrollments.length > 0 ? (
        <div className="space-y-4 sm:space-y-5">
          {filteredEnrollments.map((enrollment) => {
            const matchedAdmitCard = (enrollment.admitCard as AdmitCard | undefined) || (enrollment.examId ? admitCardsMap.get(enrollment.examId) : undefined);

            return (
              <EnrollmentPassCard
                key={enrollment.id}
                enrollment={enrollment}
                admitCard={matchedAdmitCard}
                candidateName={studentName}
                candidateRoll={rollNumber}
                onOpenSeatPlan={(enr, ac) =>
                  setSelectedSeatPlan({ enrollment: enr, admitCard: ac })
                }
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
            No Exam Passes Found
          </h3>
          <p className="text-xs text-slate-500 max-w-sm">
            You do not have any registered exam passes in this category. Register for upcoming model tests to secure your seat.
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

      {/* 5. Seat Plan Visual Modal */}
      <SeatPlanModal
        enrollment={selectedSeatPlan?.enrollment || null}
        admitCard={selectedSeatPlan?.admitCard}
        onClose={() => setSelectedSeatPlan(null)}
      />

    </div>
  );
}

export default MyEnrollmentsView;
