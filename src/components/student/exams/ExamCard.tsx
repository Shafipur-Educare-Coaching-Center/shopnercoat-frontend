'use client';

import React from 'react';
import Link from 'next/link';
import { Exam } from '@/types/exam.types';
import { ROUTES } from '@/constants/routes';
import {
  Calendar,
  Clock,
  MapPin,
  FileText,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';

interface ExamCardProps {
  exam: Exam;
  isEnrolled: boolean;
  onOpenSyllabus: (exam: Exam) => void;
  onEnrollClick: (exam: Exam) => void;
}

export function ExamCard({
  exam,
  isEnrolled,
  onOpenSyllabus,
  onEnrollClick,
}: ExamCardProps) {
  const formattedDate = exam.examDate
    ? new Date(exam.examDate).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Friday, Oct 24, 2026';

  const timeDisplay = exam.startTime && exam.endTime
    ? `${exam.startTime} - ${exam.endTime}`
    : '10:00 AM - 11:00 AM';

  const isRegistrationOpen = exam.status === 'REGISTRATION_OPEN' || !exam.status;

  return (
    <div className="rounded-[28px] bg-white border border-slate-200/80 p-5 sm:p-6 shadow-[0_10px_30px_rgba(15,118,110,0.04)] hover:shadow-[0_15px_35px_rgba(15,118,110,0.08)] hover:border-teal-300 transition-all flex flex-col justify-between group">
      
      {/* Top Header Row */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="font-mono text-xs font-black px-2.5 py-1 rounded-xl bg-teal-50 text-[#00695C] border border-teal-200/80 shadow-2xs">
            {exam.code}
          </span>

          {isEnrolled ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-[11px] font-bold">
              <CheckCircle2 className="size-3 text-emerald-600" />
              Enrolled Candidate
            </span>
          ) : isRegistrationOpen ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-cyan-50 text-[#0891B2] border border-cyan-200/80 text-[11px] font-bold animate-pulse">
              <Sparkles className="size-3" />
              Open for Registration
            </span>
          ) : (
            <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
              Registration Closed
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-heading font-black text-base sm:text-lg text-slate-900 group-hover:text-[#00796B] transition-colors line-clamp-1">
          {exam.title}
        </h3>

        <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
          {exam.description || 'Full-length centralized medical admission model test with dense national rank calibration.'}
        </p>

        {/* Schedule & Location */}
        <div className="mt-4 space-y-2 py-3 border-y border-slate-100 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <Calendar className="size-4 text-[#00796B] shrink-0" />
            <span className="font-semibold text-slate-800">{formattedDate}</span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-500">{timeDisplay}</span>
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="size-4 text-[#00796B] shrink-0" />
            <span className="truncate">Shafipur Central Examination Hall</span>
          </div>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-3 gap-2 my-4 text-center">
          <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
            <span className="font-mono font-bold text-xs text-slate-900 block">
              {exam.totalMarks || 100}
            </span>
            <span className="text-[10px] text-slate-400 font-medium">Total Marks</span>
          </div>

          <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
            <span className="font-mono font-bold text-xs text-slate-900 block">
              60 Mins
            </span>
            <span className="text-[10px] text-slate-400 font-medium">Duration</span>
          </div>

          <div className="p-2 rounded-xl bg-rose-50/60 border border-rose-100">
            <span className="font-mono font-bold text-xs text-rose-600 block">
              -0.25
            </span>
            <span className="text-[10px] text-rose-500 font-medium">Penalty</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-2 flex items-center gap-2">
        <button
          type="button"
          onClick={() => onOpenSyllabus(exam)}
          className="py-2.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <FileText className="size-3.5 text-slate-500" />
          <span>Syllabus</span>
        </button>

        {isEnrolled ? (
          <Link
            href="/dashboard/student/enrollments"
            className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-2xs"
          >
            <span>View Hall Pass</span>
            <ArrowRight className="size-3.5" />
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => onEnrollClick(exam)}
            disabled={!isRegistrationOpen}
            className="flex-1 py-2.5 px-4 rounded-xl bg-[#00695C] hover:bg-[#00594D] text-white text-xs font-bold transition-all shadow-xs hover:shadow-sm active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Enroll Now</span>
            <ArrowRight className="size-3.5" />
          </button>
        )}
      </div>

    </div>
  );
}

export default ExamCard;
