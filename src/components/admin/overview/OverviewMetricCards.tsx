'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Users, BookOpen, Building2, Award, ArrowUpRight, AlertCircle } from 'lucide-react';
import { AdminKPIStats } from '@/types/admin-overview.types';

interface OverviewMetricCardsProps {
  stats: AdminKPIStats;
}

export function OverviewMetricCards({ stats }: OverviewMetricCardsProps) {
  const cards = [
    {
      id: 'kpi-candidates',
      title: 'Total Candidates',
      subtitle: 'HSC Medical Seekers',
      value: stats.totalStudents.toLocaleString(),
      growthText: `+${stats.monthlyGrowthPercent}% this month`,
      breakdownText: `${stats.activeStudents.toLocaleString()} Active · ${stats.pendingStudents} Pending`,
      icon: Users,
      iconColor: 'text-teal-600',
      iconBg: 'bg-teal-50 border-teal-200/80',
      href: '/dashboard/admin/students',
      linkText: 'View Directory',
      badge: '1st & 2nd Timers',
    },
    {
      id: 'kpi-exams',
      title: 'Total Model Tests',
      subtitle: 'Exam Lifecycle',
      value: stats.totalExams.toString(),
      growthText: `${stats.openRegistrationExams} Registration Open`,
      breakdownText: `${stats.ongoingExams} Ongoing · ${stats.completedExams} Completed`,
      icon: BookOpen,
      iconColor: 'text-[#37447E]',
      iconBg: 'bg-indigo-50 border-indigo-200/80',
      href: '/dashboard/admin/exams',
      linkText: 'Manage Exams',
      badge: 'Active Season',
    },
    {
      id: 'kpi-centers',
      title: 'Total Exam Centers',
      subtitle: 'Centres & Venues',
      value: `${stats.totalCentres} Centres`,
      growthText: `${stats.totalRooms} Exam Hall Rooms`,
      breakdownText: `${stats.totalCapacity.toLocaleString()} Seating Capacity`,
      icon: Building2,
      iconColor: 'text-sky-600',
      iconBg: 'bg-sky-50 border-sky-200/80',
      href: '/dashboard/admin/exams',
      linkText: 'Venues & Rooms',
      badge: '100% Verified',
    },
    {
      id: 'kpi-results',
      title: 'Pending Results',
      subtitle: 'Mark Entry & Publish',
      value: `${stats.pendingResultsCount} Exams`,
      growthText: 'Action Required',
      breakdownText: `${stats.pendingResultsCandidates} candidates awaiting rank publish`,
      icon: Award,
      iconColor: 'text-amber-600',
      iconBg: 'bg-amber-50 border-amber-200/80',
      href: '/dashboard/admin/results',
      linkText: 'Enter Marks',
      badge: 'High Priority',
      isWarning: stats.pendingResultsCount > 0,
    },
  ];

  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.08 }}
            className="group relative rounded-3xl bg-white/95 border border-white/90 shadow-[0_8px_24px_rgba(20,40,90,0.06)] hover:shadow-[0_12px_32px_rgba(20,40,90,0.1)] p-5 sm:p-6 backdrop-blur-xl transition-all duration-300 flex flex-col justify-between"
          >
            {/* Top Row: Icon + Badge */}
            <div className="flex items-start justify-between gap-3 mb-4">
              <div
                className={`size-12 rounded-2xl border ${card.iconBg} flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform`}
              >
                <Icon className={`size-6 ${card.iconColor}`} />
              </div>

              <span
                className={`text-[10px] sm:text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                  card.isWarning
                    ? 'bg-amber-50 border-amber-300 text-amber-800'
                    : 'bg-slate-50 border-slate-200/80 text-slate-600'
                }`}
              >
                {card.badge}
              </span>
            </div>

            {/* Middle: Big Metric + Title */}
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {card.title}
              </p>
              <h3 className="font-heading font-black text-2xl sm:text-3xl text-slate-900 tracking-tight mt-1">
                {card.value}
              </h3>
              
              <div className="flex items-center gap-1.5 mt-2">
                {card.isWarning ? (
                  <AlertCircle className="size-3.5 text-amber-500 shrink-0" />
                ) : (
                  <ArrowUpRight className="size-3.5 text-emerald-500 shrink-0" />
                )}
                <span
                  className={`text-xs font-semibold ${
                    card.isWarning ? 'text-amber-600' : 'text-emerald-600'
                  }`}
                >
                  {card.growthText}
                </span>
              </div>

              <p className="text-[11px] text-slate-400 mt-1 font-medium truncate">
                {card.breakdownText}
              </p>
            </div>

            {/* Bottom Row: Deep-link */}
            <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-medium">
                {card.subtitle}
              </span>
              <Link
                href={card.href}
                className="text-xs font-bold text-teal-600 group-hover:text-teal-700 flex items-center gap-1 hover:underline transition-all"
              >
                <span>{card.linkText}</span>
                <ArrowUpRight className="size-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
