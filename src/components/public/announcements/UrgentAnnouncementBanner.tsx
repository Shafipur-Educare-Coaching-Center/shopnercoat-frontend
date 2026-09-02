'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Download } from 'lucide-react';
import { Announcement } from '@/types/announcement.types';
import { Announcements3DBeacon } from './Announcements3DBeacon';

interface UrgentAnnouncementBannerProps {
  announcement: Announcement;
  onViewDetail: (ann: Announcement) => void;
}

export function UrgentAnnouncementBanner({
  announcement,
  onViewDetail,
}: UrgentAnnouncementBannerProps) {
  const text = `${announcement.title} ${announcement.content}`.toLowerCase();
  const isResult = text.includes('result') || text.includes('merit') || text.includes('score');
  const actionLabel = isResult ? 'View Results Portal' : 'Read Full Notice';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative rounded-2xl bg-[#F0F7FA] border border-slate-200/90 border-l-4 border-l-red-500 p-6 sm:p-8 shadow-xs overflow-hidden group"
    >
      {/* 3D Holographic Dispatch Beacon (Top Right) */}
      <div className="absolute top-2 right-2 sm:right-4 z-10 hidden sm:block">
        <Announcements3DBeacon isUrgent className="w-24 h-24 sm:w-28 sm:h-28" />
      </div>

      <div className="relative z-10 max-w-2xl">
        {/* Header Tag: URGENT • LIVE */}
        <div className="flex items-center gap-2 mb-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
          <span className="text-xs font-mono font-bold tracking-widest text-red-600 uppercase">
            LIVE
          </span>
        </div>

        {/* Title */}
        <h2 className="font-heading text-xl sm:text-2xl lg:text-[26px] font-bold text-slate-900 leading-tight mb-3 group-hover:text-teal-950 transition-colors">
          {announcement.title}
        </h2>

        {/* Content Excerpt */}
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal line-clamp-3 mb-6">
          {announcement.content}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => onViewDetail(announcement)}
            className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-700 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <span>{actionLabel}</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </button>

          {announcement.attachmentUrl && (
            <a
              href={announcement.attachmentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-white border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-teal-700 transition-colors shadow-2xs"
            >
              <Download className="w-4 h-4 text-teal-600" />
              <span>Official Circular (PDF)</span>
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
