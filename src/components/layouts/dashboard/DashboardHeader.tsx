'use client';

import React, { useTransition } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  ADMIN_NAV_ITEMS,
  STUDENT_NAV_ITEMS,
  DashboardUserSummary,
} from './DashboardNavTypes';
import { MedicalLogo } from '@/components/common/MedicalLogo';
import { logoutAction } from '@/features/auth/actions/logoutAction';

interface DashboardHeaderProps {
  role: 'ADMIN' | 'STUDENT';
  user?: DashboardUserSummary;
}

export function DashboardHeader({ role }: DashboardHeaderProps) {
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const navItems = role === 'ADMIN' ? ADMIN_NAV_ITEMS : STUDENT_NAV_ITEMS;

  // Find active item label for title
  const currentItem =
    navItems.find((i) =>
      i.exact ? pathname === i.href : pathname.startsWith(i.href)
    ) || navItems[0];

  const handleLogout = () => {
    startTransition(async () => {
      await logoutAction();
    });
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#EEF3FA]/90 backdrop-blur-xl border-b border-slate-200/60 px-4 sm:px-6 lg:px-8 pt-4 sm:pt-5 pb-3.5 sm:pb-4 flex items-center justify-between select-none transition-all">
      
      {/* 1. Left Section: ShopnerCoat Icon + Dashboard Title + Role Badge */}
      <div className="flex items-center min-w-0">
        
        {/* Floating Brand Logo Squircle (aligned directly above the vertical sidebar rail) */}
        <Link
          href={role === 'ADMIN' ? '/dashboard/admin' : '/dashboard/student'}
          title="ShopnerCoat Dashboard"
          className="size-11 sm:size-12 rounded-2xl bg-white shadow-[0_4px_16px_rgba(20,40,90,0.06)] border border-white/90 flex items-center justify-center p-2 transition-all hover:scale-105 active:scale-95 group shrink-0"
        >
          <MedicalLogo
            variant="icon"
            width={32}
            height={32}
            className="group-hover:scale-105 transition-transform"
          />
        </Link>

        {/* Dashboard Title & Role Badge - shifted right to align vertically with main content text */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 pl-4 sm:pl-6 lg:pl-10">
          <h1 className="font-heading font-extrabold text-lg sm:text-xl lg:text-2xl text-slate-900 tracking-tight truncate">
            {currentItem?.label || 'Dashboard'}
          </h1>
          <Badge
            variant={role === 'ADMIN' ? 'calmIndigo' : 'calmTeal'}
            className="shrink-0 text-[11px]"
          >
            {role === 'ADMIN' ? 'Admin Portal' : 'Student Portal'}
          </Badge>
        </div>

      </div>

      {/* 2. Right Section: Logout Button in the EXACT SAME Line */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          type="button"
          onClick={handleLogout}
          disabled={isPending}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/95 hover:bg-rose-50 text-slate-700 hover:text-rose-600 border border-white/90 shadow-[0_4px_16px_rgba(20,40,90,0.05)] text-xs font-semibold backdrop-blur-md transition-all active:scale-95 disabled:opacity-60 cursor-pointer group outline-hidden focus-visible:ring-2 focus-visible:ring-rose-500"
          title="Sign out of account"
        >
          {isPending ? (
            <Loader2 className="size-4 animate-spin text-rose-500" />
          ) : (
            <LogOut className="size-4 text-slate-500 group-hover:text-rose-600 transition-colors" />
          )}
          <span className="font-medium hidden sm:inline">Logout</span>
        </button>
      </div>

    </header>
  );
}
