'use client';

import React, { useState } from 'react';
import { Announcement } from '@/types/announcement.types';
import { NoticeHeader } from './NoticeHeader';
import { NoticeFilterBar, NoticeCategoryFilter } from './NoticeFilterBar';
import { NoticeCard } from './NoticeCard';
import { NoticeDetailModal } from './NoticeDetailModal';
import {
  Megaphone,
  Inbox,
} from 'lucide-react';

interface OfficialNoticesViewProps {
  announcements: Announcement[];
}

export function OfficialNoticesView({
  announcements,
}: OfficialNoticesViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<NoticeCategoryFilter>('ALL');
  const [selectedNotice, setSelectedNotice] = useState<Announcement | null>(null);

  // Count urgent notices
  const urgentCount = announcements.filter(
    (a) =>
      a.title.toLowerCase().includes('urgent') ||
      a.title.toLowerCase().includes('guideline') ||
      a.title.toLowerCase().includes('instruction')
  ).length;

  // Filter announcements
  const filteredNotices = announcements.filter((notice) => {
    // Search query filter
    const matchesSearch =
      (notice.title && notice.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (notice.content && notice.content.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    // Category filter
    const titleLower = notice.title.toLowerCase();
    const contentLower = notice.content.toLowerCase();

    if (selectedCategory === 'EXAM_GUIDELINES') {
      return (
        titleLower.includes('guideline') ||
        titleLower.includes('instruction') ||
        titleLower.includes('omr') ||
        contentLower.includes('guideline')
      );
    }
    if (selectedCategory === 'SCHEDULES') {
      return (
        titleLower.includes('schedule') ||
        titleLower.includes('time') ||
        titleLower.includes('hall') ||
        titleLower.includes('venue') ||
        contentLower.includes('schedule')
      );
    }
    if (selectedCategory === 'RESULTS') {
      return (
        titleLower.includes('result') ||
        titleLower.includes('cutoff') ||
        titleLower.includes('merit') ||
        titleLower.includes('rank') ||
        contentLower.includes('merit')
      );
    }

    return true;
  });

  return (
    <div className="w-full flex flex-col gap-6 sm:gap-7 pb-10">
      
      {/* 1. Header with 3D Radio Beacon Visualizer */}
      <NoticeHeader
        totalNotices={announcements.length}
        urgentCount={urgentCount}
      />

      {/* 2. Search & Category Filter Bar */}
      <NoticeFilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        totalFiltered={filteredNotices.length}
      />

      {/* 3. Notices Grid */}
      {filteredNotices.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 items-stretch">
          {filteredNotices.map((notice) => (
            <NoticeCard
              key={notice.id}
              announcement={notice}
              onOpenDetail={(anc) => setSelectedNotice(anc)}
            />
          ))}
        </div>
      ) : (
        <div className="w-full rounded-[28px] bg-white border border-slate-200/80 p-12 text-center flex flex-col items-center justify-center space-y-3 shadow-2xs">
          <div className="size-16 rounded-2xl bg-teal-50 text-[#00796B] flex items-center justify-center">
            <Inbox className="size-8" />
          </div>
          <h3 className="font-heading font-black text-lg text-slate-900">
            No Bulletins Found
          </h3>
          <p className="text-xs text-slate-500 max-w-sm">
            There are no official board circulars matching this category. Please check back later for updates from the examination authority.
          </p>
        </div>
      )}

      {/* 4. Full Content Notice Modal */}
      <NoticeDetailModal
        announcement={selectedNotice}
        onClose={() => setSelectedNotice(null)}
      />

    </div>
  );
}

export default OfficialNoticesView;
