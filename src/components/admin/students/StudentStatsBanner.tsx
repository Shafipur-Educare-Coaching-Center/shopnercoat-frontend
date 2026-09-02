'use client';

import React from 'react';
import { Users, CheckCircle2, Clock, School } from 'lucide-react';
import { Student } from '@/types/student.types';

interface StudentStatsBannerProps {
  students: Student[];
  totalCount: number;
}

export function StudentStatsBanner({ students, totalCount }: StudentStatsBannerProps) {
  const activeCount = students.filter((s) => s.registrationStatus === 'COMPLETED').length;
  const pendingCount = students.filter((s) => s.registrationStatus === 'PENDING').length;

  const stats = [
    {
      label: 'Total Registered Candidates',
      value: totalCount.toLocaleString(),
      subtext: 'HSC Medical Seekers',
      icon: Users,
      color: 'text-teal-600',
      bg: 'bg-teal-50 border-teal-200/80',
    },
    {
      label: 'Verified & Profile Complete',
      value: `${activeCount} / ${students.length}`,
      subtext: 'Issued 7-digit Roll #',
      icon: CheckCircle2,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50 border-emerald-200/80',
    },
    {
      label: 'Pending Applications',
      value: `${pendingCount}`,
      subtext: 'Awaiting parent / photo review',
      icon: Clock,
      color: 'text-amber-600',
      bg: 'bg-amber-50 border-amber-200/80',
    },
    {
      label: 'Leading HSC Institution',
      value: 'Notre Dame College',
      subtext: '24% of Candidate Base',
      icon: School,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50 border-indigo-200/80',
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
