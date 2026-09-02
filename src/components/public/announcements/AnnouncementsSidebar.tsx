'use client';

import React from 'react';
import Link from 'next/link';
import {
  Calendar,
  BookOpen,
  HelpCircle,
  Mail,
  TrendingUp,
  ExternalLink,
} from 'lucide-react';
import { ROUTES } from '@/constants/routes';

interface AnnouncementsSidebarProps {
  selectedTag: string | null;
  onSelectTag: (tag: string) => void;
}

const QUICK_LINKS = [
  {
    title: 'Academic Calendar 2024-25',
    href: '#',
    icon: Calendar,
  },
  {
    title: 'Syllabus Archives',
    href: '#',
    icon: BookOpen,
  },
  {
    title: 'Admissions FAQ',
    href: ROUTES.HOW_TO_REGISTER,
    icon: HelpCircle,
  },
  {
    title: 'Contact Registrar',
    href: '#contact',
    icon: Mail,
  },
];

const TRENDING_TOPICS = [
  '#MBBS2024',
  '#ClinicalTrials',
  '#AnatomyLab',
  '#MeritList',
  '#AdmitCard',
  '#BScNursing',
];

export function AnnouncementsSidebar({
  selectedTag,
  onSelectTag,
}: AnnouncementsSidebarProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* 1. Quick Links Card */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
        <h3 className="font-heading font-bold text-slate-900 text-lg mb-4">
          Quick Links
        </h3>

        <ul className="flex flex-col gap-3">
          {QUICK_LINKS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <li key={idx}>
                <Link
                  href={item.href}
                  className="flex items-center justify-between text-sm text-slate-600 hover:text-primary transition-colors py-1 group"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors" />
                    <span className="font-medium">{item.title}</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-300 group-hover:text-primary transition-colors" />
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* 2. Trending Topics Card */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4 text-emerald-600" />
          <h3 className="font-heading font-bold text-slate-900 text-lg">
            Trending Topics
          </h3>
        </div>

        <div className="flex flex-wrap gap-2">
          {TRENDING_TOPICS.map((tag) => {
            const isSelected = selectedTag === tag;
            return (
              <button
                key={tag}
                type="button"
                onClick={() => onSelectTag(tag)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all select-none cursor-pointer ${
                  isSelected
                    ? 'bg-primary text-white shadow-xs'
                    : 'bg-slate-50 border border-slate-200/80 text-slate-600 hover:bg-teal-50 hover:text-primary hover:border-teal-200'
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
