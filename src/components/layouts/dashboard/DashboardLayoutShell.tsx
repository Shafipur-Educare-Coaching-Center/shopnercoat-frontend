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
    <div className="relative min-h-screen w-full bg-gradient-to-br from-[#EEF3FA] via-[#F4F7FD] to-[#FAFBFD] text-slate-900 flex overflow-x-hidden">
      
      {/* Subtle Medical Low-Poly Ambient Watermark Glows */}
      <div
        className="fixed top-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-teal-200/10 via-sky-200/10 to-transparent rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="fixed bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-tl from-indigo-200/10 via-purple-200/8 to-transparent rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      {/* 1. Floating Polymorphic Sidebar Rail (Desktop Viewport) */}
      <div className="hidden md:flex pl-4 lg:pl-6 py-4 lg:py-6 shrink-0 sticky top-0 h-screen">
        <FloatingSidebar role={role} user={user} />
      </div>

      {/* 2. Main Content Canvas */}
      <div className="flex-1 min-w-0 flex flex-col p-4 sm:p-5 lg:p-6 pb-24 md:pb-8 relative z-10">
        {/* Dynamic Calm Header with Date Range Capsule & Controls */}
        <DashboardHeader role={role} user={user} />

        {/* Dynamic Page Children Content */}
        <main className="flex-1 w-full max-w-7xl">
          {children}
        </main>
      </div>

      {/* 3. Floating Bottom Navigation Bar (Mobile Viewports < 768px) */}
      <DashboardMobileNav role={role} />

    </div>
  );
}
