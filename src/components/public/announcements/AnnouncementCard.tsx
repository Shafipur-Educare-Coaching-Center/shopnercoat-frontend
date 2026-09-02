'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  FlaskConical,
  Download,
  Trophy,
  Megaphone,
  ChevronRight,
  Paperclip,
} from 'lucide-react';
import { Announcement } from '@/types/announcement.types';
import {
  categorizeAnnouncement,
  formatAnnouncementDate,
  AnnouncementCategory,
} from '@/data/announcementsData';
import { cn } from '@/lib/utils';

interface AnnouncementCardProps {
  announcement: Announcement;
  onClick: (ann: Announcement) => void;
}

export function AnnouncementCard({ announcement, onClick }: AnnouncementCardProps) {
  const category = categorizeAnnouncement(announcement);
  const relativeDate = formatAnnouncementDate(announcement.publishedAt || announcement.createdAt);

  const getCategoryIcon = (cat: AnnouncementCategory) => {
    switch (cat) {
      case 'Exams':
        return FileText;
      case 'Academics':
        return FlaskConical;
      case 'Admissions':
        return Download;
      case 'Results':
        return Trophy;
      default:
        return Megaphone;
    }
  };

  const Icon = getCategoryIcon(category);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -3, transition: { duration: 0.18 } }}
      onClick={() => onClick(announcement)}
      className="w-full rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-2xs hover:shadow-clinical hover:border-primary/40 transition-all flex items-start gap-4 sm:gap-5 cursor-pointer group select-none"
    >
      {/* Category Icon Box */}
      <div className="w-11 h-11 rounded-xl bg-teal-50 border border-teal-100/90 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white group-hover:scale-105 transition-all duration-200 shrink-0">
        <Icon className="w-5 h-5" />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0">
        {/* Category & Time Tag */}
        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
          <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-primary">
            {category}
          </span>
          <span className="text-slate-300">•</span>
          <span className="text-xs text-slate-500 font-normal">
            {relativeDate}
          </span>
          {announcement.attachmentUrl && (
            <span className="inline-flex items-center gap-1 text-[11px] text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200/60 font-medium ml-auto sm:ml-0">
              <Paperclip className="w-3 h-3" />
              PDF Attached
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-heading font-semibold text-slate-900 text-base sm:text-lg leading-snug group-hover:text-primary transition-colors">
          {announcement.title}
        </h3>

        {/* Description Excerpt */}
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal line-clamp-2 mt-1.5">
          {announcement.content}
        </p>
      </div>

      {/* Right Chevron Arrow */}
      <div className="shrink-0 pt-1 text-slate-400 group-hover:text-primary group-hover:translate-x-1 transition-all">
        <ChevronRight className="w-5 h-5" />
      </div>
    </motion.div>
  );
}
