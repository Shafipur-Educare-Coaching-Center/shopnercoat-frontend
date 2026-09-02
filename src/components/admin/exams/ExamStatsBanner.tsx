'use client';

import React from 'react';
import { FileText, Sparkles, Clock, Trophy } from 'lucide-react';
import { Exam } from '@/types/exam.types';

interface ExamStatsBannerProps {
  exams: Exam[];
}

export function ExamStatsBanner({ exams }: ExamStatsBannerProps) {
  const regOpenCount = exams.filter((e) => e.status === 'REGISTRATION_OPEN').length;
  const upcomingCount = exams.filter((e) => e.status === 'UPCOMING').length;
  const publishedCount = exams.filter((e) => e.status === 'RESULT_PUBLISHED').length;

  const stats = [
    {
      label: 'Total Model Tests',
      value: exams.length.toString(),
      subtext: 'Scheduled Sessions',
      icon: FileText,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50 border-indigo-200/80',
    },
    {
      label: 'Open for Registration',
      value: regOpenCount.toString(),
      subtext: 'Accepting Candidates',
      icon: Sparkles,
      color: 'text-teal-600',
      bg: 'bg-teal-50 border-teal-200/80',
    },
    {
      label: 'Upcoming Test Dates',
      value: upcomingCount.toString(),
      subtext: 'Seat Allocation Ready',
      icon: Clock,
      color: 'text-sky-600',
      bg: 'bg-sky-50 border-sky-200/80',
    },
    {
      label: 'Merit Results Published',
      value: publishedCount.toString(),
      subtext: 'Public Rankings Live',
      icon: Trophy,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50 border-emerald-200/80',
    },
  ];

  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 mb-6">
      {stats.map((st) => {
        const Icon = st.icon;
        return (
          <div
            key={st.label}
            className="rounded-2xl bg-white/95 border border-white/90 shadow-[0_4px_16px_rgba(20,40,90,0.04)] p-4 backdrop-blur-xl flex items-center gap-3.5 select-none"
          >
            <div className={`size-11 rounded-xl border ${st.bg} flex items-center justify-center shrink-0`}>
              <Icon className={`size-5 ${st.color}`} />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider truncate">
                {st.label}
              </p>
              <p className="font-heading font-extrabold text-lg text-slate-900 leading-tight mt-0.5 truncate">
                {st.value}
              </p>
              <p className="text-[11px] text-slate-500 font-medium truncate">
                {st.subtext}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
