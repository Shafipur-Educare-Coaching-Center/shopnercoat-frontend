'use client';

import React from 'react';
import Link from 'next/link';
import { Announcement } from '@/types/announcement.types';
import {
  X,
  Calendar,
  Download,
  Paperclip,
  Megaphone,
  Printer,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';

interface NoticeDetailModalProps {
  announcement: Announcement | null;
  onClose: () => void;
}

export function NoticeDetailModal({
  announcement,
  onClose,
}: NoticeDetailModalProps) {
  if (!announcement) return null;

  const formattedDate = announcement.publishedAt || announcement.createdAt
    ? new Date(announcement.publishedAt || announcement.createdAt).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Session 2026';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in-50 duration-200">
      
      {/* Modal Container */}
      <div className="w-full max-w-xl bg-white rounded-[28px] sm:rounded-[32px] border border-slate-200 p-6 sm:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        
        {/* Header Controls */}
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-teal-50 text-[#00695C] border border-teal-200">
                OFFICIAL BULLETIN
              </span>
              <span className="text-[11px] font-bold text-slate-400">
                Central Examination Board
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Calendar className="size-3.5 text-[#00796B]" />
              <span>{formattedDate}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              title="Print Circular"
            >
              <Printer className="size-4" />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        {/* Notice Title Banner */}
        <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-200/80">
          <h2 className="font-heading font-black text-lg sm:text-xl text-slate-900 leading-snug">
            {announcement.title}
          </h2>
        </div>

        {/* Notice Content Body */}
        <div className="p-4 rounded-2xl bg-slate-50/60 border border-slate-100 space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
          {announcement.content}
        </div>

        {/* Attachment Card if available */}
        {announcement.attachmentUrl ? (
          <div className="p-4 rounded-2xl bg-gradient-to-br from-[#00594D] to-[#00796B] text-white flex items-center justify-between gap-4 shadow-md">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                <Paperclip className="size-5 text-teal-200" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-teal-200">
                  Official Attachment
                </p>
                <p className="font-bold text-xs sm:text-sm text-white truncate">
                  Circular Document / Schedule PDF
                </p>
              </div>
            </div>

            <Link
              href={announcement.attachmentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl bg-white text-[#00594D] hover:bg-teal-50 font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5 shrink-0"
            >
              <Download className="size-3.5" />
              <span>Download PDF</span>
            </Link>
          </div>
        ) : null}

        {/* Security & Verification Footer */}
        <div className="pt-2 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <ShieldCheck className="size-3.5 text-emerald-600" />
            Digitally Authenticated
          </span>
          <span>Shafipur Educare Coaching Center</span>
        </div>

      </div>

    </div>
  );
}

export default NoticeDetailModal;
