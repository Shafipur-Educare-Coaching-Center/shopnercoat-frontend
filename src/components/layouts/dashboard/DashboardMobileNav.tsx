'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ADMIN_NAV_ITEMS,
  STUDENT_NAV_ITEMS,
} from './DashboardNavTypes';

interface DashboardMobileNavProps {
  role: 'ADMIN' | 'STUDENT';
}

export function DashboardMobileNav({ role }: DashboardMobileNavProps) {
  const pathname = usePathname();
  const allItems = role === 'ADMIN' ? ADMIN_NAV_ITEMS : STUDENT_NAV_ITEMS;
  // Display the top 5 primary routes on mobile bar
  const primaryItems = allItems.slice(0, 5);

  return (
    <nav
      aria-label="Mobile Navigation"
      className="fixed bottom-3 inset-x-3 z-40 md:hidden select-none"
    >
      <div className="bg-white/95 backdrop-blur-2xl border border-white/80 shadow-[0_12px_36px_rgba(20,40,90,0.12)] rounded-full px-3 py-2 flex items-center justify-around">
        {primaryItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.id}
              href={item.href}
              className={`relative p-2 rounded-2xl flex flex-col items-center gap-0.5 transition-all ${
                isActive
                  ? 'text-[#37447E] font-bold scale-110'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              <div
                className={`p-1.5 rounded-xl transition-colors ${
                  isActive ? 'bg-[#37447E]/10 text-[#37447E]' : ''
                }`}
              >
                <Icon className="size-5" />
              </div>
              <span className="text-[10px] tracking-tight">{item.label.split(' ')[0]}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
