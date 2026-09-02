'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Calendar,
  Download,
  Building2,
  ShieldCheck,
} from 'lucide-react';
import { Announcement } from '@/types/announcement.types';
import {
  categorizeAnnouncement,
  formatAnnouncementDate,
  formatAuthorName,
} from '@/data/announcementsData';

interface AnnouncementDetailModalProps {
  announcement: Announcement | null;
  onClose: () => void;
}

export function AnnouncementDetailModal({
  announcement,
  onClose,
}: AnnouncementDetailModalProps) {
  if (!announcement) return null;

  const category = categorizeAnnouncement(announcement);
  const formattedDate = formatAnnouncementDate(
    announcement.publishedAt || announcement.createdAt
  );
  const authorName = formatAuthorName(announcement.createdBy);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        />

        {/* Modal Dialog Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-2xl max-h-[85vh] bg-white rounded-3xl border border-slate-200/90 shadow-2xl p-6 sm:p-8 overflow-y-auto z-10 flex flex-col justify-between"
        >
          {/* Header */}
          <div>
            <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-100 mb-5">
              <div className="flex items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200/80 text-primary text-xs font-mono font-bold tracking-wide uppercase">
                  {category}
                </span>
                <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {formattedDate}
                </span>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Title */}
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-slate-900 leading-tight mb-4">
              {announcement.title}
            </h2>

            {/* Authority / Creator badge */}
            <div className="flex items-center gap-2 mb-6 text-xs text-slate-600 font-medium">
              <Building2 className="w-4 h-4 text-primary" />
              <span>Published by: <strong>{authorName}</strong></span>
            </div>

            {/* Content Body */}
            <div className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal whitespace-pre-line space-y-4 mb-8">
              <p>{announcement.content}</p>
            </div>
          </div>

          {/* Footer & Attachment Action */}
          <div className="pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-emerald-700 font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Official Board Notice • Digitally Signed</span>
            </div>

            <div className="flex items-center gap-3">
              {announcement.attachmentUrl ? (
                <a
                  href={announcement.attachmentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-teal-700 transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Circular (PDF)</span>
                </a>
              ) : (
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold transition-colors cursor-pointer"
                >
                  Close
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
