'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Bell } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  ADMIN_NAV_ITEMS,
  STUDENT_NAV_ITEMS,
  DashboardUserSummary,
} from './DashboardNavTypes';
import { UserProfileDropdown } from './UserProfileDropdown';

interface FloatingSidebarProps {
  role: 'ADMIN' | 'STUDENT';
  user?: DashboardUserSummary;
}

export function FloatingSidebar({ role, user }: FloatingSidebarProps) {
  const pathname = usePathname();
  const navItems = role === 'ADMIN' ? ADMIN_NAV_ITEMS : STUDENT_NAV_ITEMS;

  return (
    <TooltipProvider delay={100}>
      <aside
        aria-label="Sidebar Navigation"
        className="hidden md:flex flex-col items-center shrink-0 select-none z-40"
      >
        {/* Main Floating Polymorphic Navigation Rail */}
        <div className="w-13 sm:w-14 rounded-[28px] bg-white/95 backdrop-blur-xl border border-white/80 shadow-[0_12px_36px_rgba(20,40,90,0.07)] p-1.5 sm:p-2 flex flex-col items-center gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);

            return (
              <Tooltip key={item.id}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={`relative size-10 sm:size-10.5 rounded-2xl flex items-center justify-center transition-all duration-200 outline-hidden focus-visible:ring-2 focus-visible:ring-teal-500 ${
                      isActive
                        ? 'bg-[#37447E] text-white shadow-[0_6px_18px_rgba(55,68,126,0.35)] scale-105'
                        : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100/80 active:scale-95'
                    }`}
                  >
                    <Icon className="size-5" />

                    {/* Active Route Pill Bar Indicator */}
                    {isActive && (
                      <motion.span
                        layoutId="activePillIndicator"
                        className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-1 h-5 bg-teal-500 rounded-r-full shadow-xs"
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      />
                    )}
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={12}>
                  <span>{item.label}</span>
                </TooltipContent>
              </Tooltip>
            );
          })}

          {/* Divider */}
          <div className="w-6 h-px bg-slate-200/80 my-1" />

          {/* Notification Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                className="relative size-10 sm:size-10.5 rounded-2xl flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100/80 transition-all active:scale-95 cursor-pointer outline-hidden focus-visible:ring-2 focus-visible:ring-teal-500"
              >
                <Bell className="size-5" />
                <span className="absolute top-2 right-2 size-2 bg-rose-500 rounded-full ring-2 ring-white animate-pulse" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={12}>
              <span>Notifications</span>
            </TooltipContent>
          </Tooltip>

          {/* User Profile Avatar Capsule */}
          <div className="pt-1">
            <UserProfileDropdown user={user} />
          </div>
        </div>
      </aside>
    </TooltipProvider>
  );
}
