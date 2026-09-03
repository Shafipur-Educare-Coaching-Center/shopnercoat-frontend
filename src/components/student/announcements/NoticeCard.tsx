'use client';

import React from 'react';
import { Announcement } from '@/types/announcement.types';
import {
  Calendar,
  FileText,
  Paperclip,
  ArrowRight,
  AlertTriangle,
  Megaphone,
  CheckCircle2,
} from 'lucide-react';

interface NoticeCardProps {
  announcement: Announcement;
  onOpenDetail: (anc: Announcement) => void;
}

export function NoticeCard({
  announcement,
  onOpenDetail,
}: NoticeCardProps) {
  const formattedDate = announcement.publishedAt || announcement.createdAt
    ? new Date(announcement.publishedAt || announcement.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Session 2026';

  const isUrgent =
    announcement.title.toLowerCase().includes('urgent') ||
    announcement.title.toLowerCase().includes('guideline') ||
    announcement.title.toLowerCase().includes('instruction');

  return (
    <div
      onClick={() => onOpenDetail(announcement)}
      className="w-full rounded-[24px] bg-white border border-slate-200/80 p-5 sm:p-6 shadow-[0_10px_30px_rgba(15,118,110,0.03)] hover:shadow-[0_15px_35px_rgba(15,118,110,0.07)] hover:border-teal-300 transition-all flex flex-col justify-between space-y-4 cursor-pointer group"
    >
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 font-mono text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-lg">
              <Calendar className="size-3 text-[#00796B]" />
              {formattedDate}
            </span>

            {isUrgent ? (
              <span className="inline-flex items-center gap-1 font-bold text-[10px] text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md">
                <AlertTriangle className="size-3 text-rose-500" />
                Urgent Notice
              </span>
            ) : null}
          </div>

          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-[10px] font-bold">
            <CheckCircle2 className="size-3 text-emerald-600" />
            Official Bulletin
          </span>
        </div>

        {/* Title */}
        <h3 className="font-heading font-black text-base sm:text-lg text-slate-900 group-hover:text-[#00796B] transition-colors leading-snug">
          {announcement.title}
        </h3>

        {/* Content Snippet */}
        <p className="text-xs text-slate-600 mt-2 font-medium line-clamp-3 leading-relaxed">
          {announcement.content}
        </p>
      </div>

      {/* Bottom Footer Row */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        {announcement.attachmentUrl ? (
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#00796B] bg-teal-50 px-2.5 py-1 rounded-xl border border-teal-200/70">
            <Paperclip className="size-3.5" />
            PDF Circular Attached
          </span>
        ) : (
          <span className="text-[11px] text-slate-400 font-medium">
            Central Board Circular
          </span>
        )}

        <button
          type="button"
          className="text-xs font-bold text-[#00796B] group-hover:text-[#00594D] flex items-center gap-1 transition-colors"
        >
          <span>Read Notice</span>
          <ArrowRight className="size-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
}

export default NoticeCard;
