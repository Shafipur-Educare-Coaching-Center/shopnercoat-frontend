'use client';

import React from 'react';
import Link from 'next/link';
import { PlusCircle, Award, CreditCard, Users, CheckCircle2, Zap, ArrowRight } from 'lucide-react';

export function QuickActionShortcuts() {
  const actions = [
    {
      title: 'Create Model Test',
      description: 'Schedule a new HSC medical mock test & configure venue halls.',
      icon: PlusCircle,
      href: '/dashboard/admin/exams',
      badge: 'Lifecycle',
      color: 'text-indigo-600 bg-indigo-50 border-indigo-200/80',
    },
    {
      title: 'Enter & Publish Results',
      description: 'Record candidate marks, calculate dense rankings, and publish.',
      icon: Award,
      href: '/dashboard/admin/results',
      badge: 'Action Required',
      color: 'text-amber-600 bg-amber-50 border-amber-200/80',
    },
    {
      title: 'Batch Admit Cards QA',
      description: 'Trigger BullMQ background generation & PDF delivery.',
      icon: CreditCard,
      href: '/dashboard/admin/admit-cards',
      badge: 'Automated',
      color: 'text-sky-600 bg-sky-50 border-sky-200/80',
    },
    {
      title: 'Candidate Directory',
      description: 'Review verified profile applications & issue roll numbers.',
      icon: Users,
      href: '/dashboard/admin/students',
      badge: 'Directory',
      color: 'text-teal-600 bg-teal-50 border-teal-200/80',
    },
  ];

  return (
    <div className="w-full rounded-3xl bg-white/95 border border-white/90 shadow-[0_8px_24px_rgba(20,40,90,0.06)] p-5 sm:p-6 backdrop-blur-xl flex flex-col justify-between select-none">
      
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-600">
              <Zap className="size-4" />
            </div>
            <h3 className="font-heading font-bold text-base sm:text-lg text-slate-900 tracking-tight">
              Quick Administrative Actions
            </h3>
          </div>
          <p className="text-slate-500 text-xs mt-1">
            Rapid shortcuts for routine examination and candidate management.
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-semibold">
          <CheckCircle2 className="size-3 text-emerald-600" />
          <span>Queue Healthy</span>
        </div>
      </div>

      {/* Grid of Shortcuts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-1">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <Link
              key={act.title}
              href={act.href}
              className="group p-3.5 rounded-2xl border border-slate-100 hover:border-teal-200 bg-slate-50/50 hover:bg-teal-50/40 transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className={`size-8 rounded-xl border ${act.color} flex items-center justify-center`}>
                    <Icon className="size-4" />
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white border border-slate-200/80 text-slate-600">
                    {act.badge}
                  </span>
                </div>
                <h4 className="font-heading font-bold text-xs sm:text-sm text-slate-900 group-hover:text-teal-700 transition-colors">
                  {act.title}
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">
                  {act.description}
                </p>
              </div>

              <div className="mt-3 flex items-center gap-1 text-[11px] font-bold text-teal-600 group-hover:text-teal-700">
                <span>Launch</span>
                <ArrowRight className="size-3 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Footer System Status */}
      <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
        <span className="font-mono text-[11px]">System Status: API v1.0 · BullMQ Queue Online</span>
        <span className="text-emerald-600 font-medium">99.98% Uptime</span>
      </div>

    </div>
  );
}
