'use client';

import React from 'react';
import { Users, CheckCircle2, Clock, FileText } from 'lucide-react';
import { ExamEnrollmentAdmin } from '@/types/exam.types';

interface EnrollmentStatsBannerProps {
  enrollments: ExamEnrollmentAdmin[];
}

export function EnrollmentStatsBanner({ enrollments }: EnrollmentStatsBannerProps) {
  const total = enrollments.length;
  const enrolledCount = enrollments.filter((e) => e.status === 'ENROLLED').length;
  const pendingCount = enrollments.filter((e) => e.status === 'PENDING_APPROVAL').length;
  const admitCardsIssued = enrollments.filter((e) => e.admitCard?.status === 'GENERATED').length;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 select-none">
      
      {/* Total Candidates */}
      <div className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-[0_4px_20px_rgba(20,40,90,0.03)] flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Total Candidates
          </span>
          <strong className="font-heading font-black text-2xl text-slate-900 mt-0.5 block">
            {total}
          </strong>
        </div>
        <div className="size-11 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#37447E]">
          <Users className="size-5" />
        </div>
      </div>

      {/* Confirmed Enrolled */}
      <div className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-[0_4px_20px_rgba(20,40,90,0.03)] flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold text-teal-600 uppercase tracking-wider block">
            Confirmed Enrolled
          </span>
          <strong className="font-heading font-black text-2xl text-teal-800 mt-0.5 block">
            {enrolledCount}
          </strong>
        </div>
        <div className="size-11 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600">
          <CheckCircle2 className="size-5" />
        </div>
      </div>

      {/* Pending Verification */}
      <div className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-[0_4px_20px_rgba(20,40,90,0.03)] flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider block">
            Pending Verification
          </span>
          <strong className="font-heading font-black text-2xl text-amber-800 mt-0.5 block">
            {pendingCount}
          </strong>
        </div>
        <div className="size-11 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
          <Clock className="size-5" />
        </div>
      </div>

      {/* Admit Cards Issued */}
      <div className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-[0_4px_20px_rgba(20,40,90,0.03)] flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold text-sky-600 uppercase tracking-wider block">
            Admit Cards Issued
          </span>
          <strong className="font-heading font-black text-2xl text-sky-900 mt-0.5 block">
            {admitCardsIssued}
          </strong>
        </div>
        <div className="size-11 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600">
          <FileText className="size-5" />
        </div>
      </div>

    </div>
  );
}
