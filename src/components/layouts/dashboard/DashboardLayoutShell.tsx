'use client';

import React from 'react';
import { FloatingSidebar } from './FloatingSidebar';
import { DashboardHeader } from './DashboardHeader';
import { DashboardMobileNav } from './DashboardMobileNav';
import { DashboardUserSummary } from './DashboardNavTypes';

interface DashboardLayoutShellProps {
  children: React.ReactNode;
  role: 'ADMIN' | 'STUDENT';
  user?: DashboardUserSummary;
}

export function DashboardLayoutShell({
  children,
  role,
  user,
}: DashboardLayoutShellProps) {
  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-[#EEF3FA] via-[#F4F7FD] to-[#FAFBFD] text-slate-900 flex flex-col overflow-x-clip">
      
      {/* Subtle Medical Low-Poly Ambient Watermark Glows */}
      <div
        className="fixed top-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-teal-200/10 via-sky-200/10 to-transparent rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="fixed bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-tl from-indigo-200/10 via-purple-200/8 to-transparent rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      {/* 1. Full-Width Sticky Top Header (Logo + Dashboard Title + Role Badge + Logout Button in SAME Row) */}
      <DashboardHeader role={role} user={user} />

      {/* 2. Body Canvas: Fixed Floating Rail on Left + Scrollable Content Canvas */}
      <div className="w-full flex-1 flex relative">
        
        {/* Fixed Floating Navigation Rail directly beneath the header logo */}
        <div className="hidden md:flex fixed top-[84px] left-4 lg:left-6 z-40">
          <FloatingSidebar role={role} user={user} />
        </div>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 md:pl-24 lg:pl-28 p-4 sm:p-6 lg:p-8 pb-24 md:pb-12">
          {children}
        </main>
      </div>

      {/* 3. Floating Bottom Navigation Bar (Mobile Viewports < 768px) */}
      <DashboardMobileNav role={role} />

    </div>
  );
}
