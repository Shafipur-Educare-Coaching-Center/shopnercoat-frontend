'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Search,
  Sparkles,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  ADMIN_NAV_ITEMS,
  STUDENT_NAV_ITEMS,
  DashboardUserSummary,
} from './DashboardNavTypes';
import { UserProfileDropdown } from './UserProfileDropdown';

interface DashboardHeaderProps {
  role: 'ADMIN' | 'STUDENT';
  user?: DashboardUserSummary;
}

export function DashboardHeader({ role, user }: DashboardHeaderProps) {
  const pathname = usePathname();
  const navItems = role === 'ADMIN' ? ADMIN_NAV_ITEMS : STUDENT_NAV_ITEMS;

  // Find active item label for title
  const currentItem =
    navItems.find((i) =>
      i.exact ? pathname === i.href : pathname.startsWith(i.href)
    ) || navItems[0];

  // Date capsule simulation state
  const [dateRangeIndex, setDateRangeIndex] = useState(0);
  const dateRanges = [
    'Mon 11 - Fri 15 Nov, 2025',
    'Mon 18 - Fri 22 Nov, 2025',
    'Mon 25 - Fri 29 Nov, 2025',
    'Mon 02 - Fri 06 Dec, 2025',
  ];

  const handlePrev = () => {
    setDateRangeIndex((prev) => (prev > 0 ? prev - 1 : dateRanges.length - 1));
  };

  const handleNext = () => {
    setDateRangeIndex((prev) => (prev < dateRanges.length - 1 ? prev + 1 : 0));
  };

  return (
    <header className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5 sm:mb-6 select-none">
      
      {/* 1. Page Title & Role Pill */}
      <div className="flex items-center gap-3">
        <h1 className="font-heading font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight">
          {currentItem?.label || 'Dashboard'}
        </h1>
        <Badge variant={role === 'ADMIN' ? 'calmIndigo' : 'calmTeal'} className="hidden sm:inline-flex">
          {role === 'ADMIN' ? 'Admin Portal' : 'Student Portal'}
        </Badge>
      </div>

      {/* 2. Floating Action Controls (Date Range Navigator + Search Pill) */}
      <div className="flex items-center flex-wrap gap-2.5 sm:gap-3.5">
        
        {/* Floating Date Navigator Capsule matching mockup */}
        <div className="flex items-center gap-1.5 p-1 bg-white/90 backdrop-blur-md rounded-full border border-white/80 shadow-[0_4px_16px_rgba(20,40,90,0.05)]">
          <button
            type="button"
            onClick={handlePrev}
            title="Previous Week"
            className="size-7 sm:size-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <ChevronLeft className="size-4" />
          </button>

          <div className="flex items-center gap-1.5 px-2.5 sm:px-3 text-xs sm:text-[13px] font-medium text-slate-700">
            <CalendarIcon className="size-3.5 text-teal-600" />
            <span>{dateRanges[dateRangeIndex]}</span>
          </div>

          <button
            type="button"
            onClick={handleNext}
            title="Next Week"
            className="size-7 sm:size-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>

        {/* Quick Search Capsule Button */}
        <div className="relative hidden lg:flex items-center">
          <div className="flex items-center gap-2 px-3.5 py-1.5 bg-white/90 backdrop-blur-md rounded-full border border-white/80 shadow-[0_4px_16px_rgba(20,40,90,0.05)] text-xs text-slate-400 hover:text-slate-600 transition-all cursor-pointer">
            <Search className="size-3.5 text-slate-400" />
            <span className="w-24 xl:w-32">Search...</span>
            <kbd className="hidden sm:inline-block font-mono text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-md border border-slate-200">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Public Ranking Fast Jump Button */}
        <a
          href="/ranking"
          target="_blank"
          rel="noopener noreferrer"
          title="Open Public Ranking Page"
          className="hidden xl:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 hover:bg-white text-slate-700 hover:text-teal-700 border border-white/80 shadow-[0_4px_16px_rgba(20,40,90,0.05)] text-xs font-semibold transition-all hover:scale-105 active:scale-95"
        >
          <Sparkles className="size-3.5 text-amber-500" />
          <span>Live Rankings</span>
        </a>

        {/* Mobile Viewport User Profile Trigger */}
        <div className="md:hidden flex items-center">
          <UserProfileDropdown user={user} />
        </div>

      </div>

    </header>
  );
}
