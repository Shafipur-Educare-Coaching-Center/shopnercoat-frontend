'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { UpcomingExamPass } from '@/types/student-analytics.types';
import {
  MapPin,
  Download,
  ArrowRight,
  Sparkles,
  CalendarCheck,
  Calendar,
} from 'lucide-react';
import { ROUTES } from '@/constants/routes';

interface UpcomingExamsBannerProps {
  upcomingExam: UpcomingExamPass | null;
}

export function UpcomingExamsBanner({ upcomingExam }: UpcomingExamsBannerProps) {
  // Live countdown state
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    if (upcomingExam?.scheduledDate) {
      const targetTime = new Date(upcomingExam.scheduledDate).getTime();
      const updateTimer = () => {
        const now = Date.now();
        const diff = Math.max(0, targetTime - now);
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      };

      updateTimer();
      const interval = setInterval(updateTimer, 1000);
      return () => clearInterval(interval);
    }
  }, [upcomingExam?.scheduledDate]);

  if (!upcomingExam) {
    return (
      <div className="w-full rounded-[28px] bg-gradient-to-br from-[#00594D] via-[#00695C] to-[#0D9488] text-white p-5 sm:p-6 shadow-[0_15px_35px_rgba(0,89,77,0.2)] flex flex-col justify-between relative overflow-hidden">
        {/* Background ambient lighting */}
        <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-teal-300/10 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-44 h-44 rounded-full bg-cyan-300/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 text-teal-200 text-[10px] font-bold tracking-wider uppercase backdrop-blur-xs border border-white/10">
              <CalendarCheck className="size-3" />
              Live Examination Schedule
            </span>
          </div>

          <div>
            <h3 className="font-heading font-black text-lg sm:text-xl text-white tracking-tight leading-snug">
              No Upcoming Live Test Scheduled
            </h3>
            <p className="text-xs text-teal-100/90 mt-1 leading-relaxed">
              You are not currently registered for an upcoming mock test. Explore available test series to reserve your seat and download your digital Admit Card.
            </p>
          </div>
        </div>

        <div className="relative z-10 pt-5">
          <Link
            href={ROUTES.STUDENT_EXAMS}
            className="w-full py-2.5 px-4 rounded-xl bg-white text-[#00594D] hover:bg-teal-50 font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Browse Available Model Tests</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>
    );
  }

  const examTitle = upcomingExam.examTitle;
  const examCode = upcomingExam.examCode;
  const examCenter = upcomingExam.venue || 'Shafipur Central Examination Hall';
  const downloadHref = upcomingExam.admitCardDownloadUrl || ROUTES.STUDENT_ADMIT_CARDS;
  const scheduleDisplay = upcomingExam.scheduleDisplay || 'Scheduled Live Test';

  return (
    <div className="w-full rounded-[28px] bg-gradient-to-br from-[#00594D] via-[#00695C] to-[#0D9488] text-white p-5 sm:p-6 shadow-[0_15px_35px_rgba(0,89,77,0.2)] flex flex-col justify-between relative overflow-hidden">
      
      {/* Background ambient lighting */}
      <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-teal-300/10 blur-2xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-44 h-44 rounded-full bg-cyan-300/10 blur-2xl pointer-events-none" />

      {/* Top Header */}
      <div className="relative z-10">
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 text-teal-200 text-[10px] font-bold tracking-wider uppercase backdrop-blur-xs border border-white/10">
            <Sparkles className="size-3" />
            Upcoming Live Test
          </span>

          <span className="text-[11px] font-semibold text-teal-200">
            {scheduleDisplay}
          </span>
        </div>

        <div className="mt-3">
          <span className="font-mono text-xs text-teal-300 font-bold">
            {examCode}
          </span>
          <h3 className="font-heading font-black text-lg sm:text-xl text-white tracking-tight leading-snug">
            {examTitle}
          </h3>
        </div>

        {/* Location & Guidelines */}
        <div className="mt-3 flex items-center gap-2 text-xs text-teal-100">
          <MapPin className="size-3.5 text-teal-300 shrink-0" />
          <span className="truncate">{examCenter}</span>
        </div>
      </div>

      {/* Live Countdown Timer Grid */}
      <div className="relative z-10 my-4 py-3 px-3.5 rounded-2xl bg-black/20 border border-white/10 backdrop-blur-md">
        <p className="text-[10px] font-bold uppercase tracking-wider text-teal-300 mb-2">
          Exam Countdown Clock
        </p>

        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="p-1.5 rounded-xl bg-white/10">
            <span className="font-mono font-black text-base sm:text-lg block leading-none">
              {String(timeLeft.days).padStart(2, '0')}
            </span>
            <span className="text-[9px] uppercase tracking-wider text-teal-200">Days</span>
          </div>

          <div className="p-1.5 rounded-xl bg-white/10">
            <span className="font-mono font-black text-base sm:text-lg block leading-none">
              {String(timeLeft.hours).padStart(2, '0')}
            </span>
            <span className="text-[9px] uppercase tracking-wider text-teal-200">Hours</span>
          </div>

          <div className="p-1.5 rounded-xl bg-white/10">
            <span className="font-mono font-black text-base sm:text-lg block leading-none">
              {String(timeLeft.minutes).padStart(2, '0')}
            </span>
            <span className="text-[9px] uppercase tracking-wider text-teal-200">Mins</span>
          </div>

          <div className="p-1.5 rounded-xl bg-white/10">
            <span className="font-mono font-black text-base sm:text-lg text-teal-300 block leading-none">
              {String(timeLeft.seconds).padStart(2, '0')}
            </span>
            <span className="text-[9px] uppercase tracking-wider text-teal-200">Secs</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="relative z-10 flex items-center gap-2.5">
        <Link
          href={downloadHref}
          className="flex-1 py-2.5 px-3.5 rounded-xl bg-white text-[#00594D] hover:bg-teal-50 font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5"
        >
          <Download className="size-3.5" />
          <span>Download Admit PDF</span>
        </Link>

        <Link
          href={ROUTES.STUDENT_EXAMS}
          className="py-2.5 px-3 rounded-xl bg-white/15 hover:bg-white/20 text-white font-bold text-xs border border-white/15 transition-colors flex items-center justify-center"
          title="View Available Exams"
        >
          <ArrowRight className="size-3.5" />
        </Link>
      </div>

    </div>
  );
}

export default UpcomingExamsBanner;
