'use client';

import React from 'react';
import { Megaphone, CheckCircle2, FileEdit, Archive } from 'lucide-react';
import { Announcement } from '@/types/announcement.types';

interface AnnouncementStatsBannerProps {
  announcements: Announcement[];
}

export function AnnouncementStatsBanner({ announcements }: AnnouncementStatsBannerProps) {
  const total = announcements.length;
  const publishedCount = announcements.filter((a) => a.status === 'PUBLISHED').length;
  const draftCount = announcements.filter((a) => a.status === 'DRAFT').length;
  const archivedCount = announcements.filter((a) => a.status === 'ARCHIVED').length;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 select-none">
      
      {/* 1. Total Notices */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-3">
        <div className="size-10 rounded-xl bg-indigo-50 border border-indigo-200/80 flex items-center justify-center text-indigo-600 shrink-0">
          <Megaphone className="size-5" />
        </div>
        <div>
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Notices</p>
          <p className="font-heading font-black text-xl text-slate-900 mt-0.5">{total}</p>
        </div>
      </div>

      {/* 2. Live Published */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-3">
        <div className="size-10 rounded-xl bg-teal-50 border border-teal-200/80 flex items-center justify-center text-teal-600 shrink-0">
          <CheckCircle2 className="size-5" />
        </div>
        <div>
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Live Published</p>
          <p className="font-heading font-black text-xl text-teal-700 mt-0.5">{publishedCount}</p>
        </div>
      </div>

      {/* 3. Draft Notices */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-3">
        <div className="size-10 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-600 shrink-0">
          <FileEdit className="size-5" />
        </div>
        <div>
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Drafts in Queue</p>
          <p className="font-heading font-black text-xl text-amber-700 mt-0.5">{draftCount}</p>
        </div>
      </div>

      {/* 4. Archived */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-3">
        <div className="size-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 shrink-0">
          <Archive className="size-5" />
        </div>
        <div>
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Archived</p>
          <p className="font-heading font-black text-xl text-slate-700 mt-0.5">{archivedCount}</p>
        </div>
      </div>

    </div>
  );
}
