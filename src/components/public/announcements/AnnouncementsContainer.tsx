'use client';

import React, { useState, useMemo } from 'react';
import { Search, X, Megaphone } from 'lucide-react';
import { Announcement } from '@/types/announcement.types';
import {
  AnnouncementCategory,
  categorizeAnnouncement,
} from '@/data/announcementsData';
import { UrgentAnnouncementBanner } from './UrgentAnnouncementBanner';
import { AnnouncementCard } from './AnnouncementCard';
import { AnnouncementsSidebar } from './AnnouncementsSidebar';
import { AnnouncementDetailModal } from './AnnouncementDetailModal';

const CATEGORIES: AnnouncementCategory[] = [
  'All Updates',
  'Exams',
  'Results',
  'Admissions',
  'Academics',
  'General',
];

interface AnnouncementsContainerProps {
  announcements: Announcement[];
}

export function AnnouncementsContainer({ announcements }: AnnouncementsContainerProps) {
  const [activeCategory, setActiveCategory] = useState<AnnouncementCategory>('All Updates');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedModalAnnouncement, setSelectedModalAnnouncement] = useState<Announcement | null>(null);
  const [visibleCount, setVisibleCount] = useState(6);

  // The latest announcement is ALWAYS the first item in the sorted array
  const latestAnnouncement = announcements.length > 0 ? announcements[0] : null;

  // Filter announcements by category, search query, or selected tag
  const filteredAnnouncements = useMemo(() => {
    return announcements.filter((ann) => {
      const cat = categorizeAnnouncement(ann);

      // Category filter
      if (activeCategory !== 'All Updates' && cat !== activeCategory) {
        return false;
      }

      // Tag filter
      if (selectedTag) {
        const tagClean = selectedTag.replace('#', '').toLowerCase();
        const text = `${ann.title} ${ann.content}`.toLowerCase();
        if (!text.includes(tagClean)) return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const text = `${ann.title} ${ann.content}`.toLowerCase();
        if (!text.includes(q)) return false;
      }

      return true;
    });
  }, [announcements, activeCategory, selectedTag, searchQuery]);

  const displayedAnnouncements = filteredAnnouncements.slice(0, visibleCount);
  const hasMore = visibleCount < filteredAnnouncements.length;

  const handleSelectTag = (tag: string) => {
    if (selectedTag === tag) {
      setSelectedTag(null);
    } else {
      setSelectedTag(tag);
      setActiveCategory('All Updates');
    }
  };

  const handleCategorySelect = (cat: AnnouncementCategory) => {
    setActiveCategory(cat);
    setSelectedTag(null);
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 3);
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        
        {/* Left / Main Content Column (Takes 8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6 sm:gap-7">
          
          {/* 1. Latest Announcement Hero Banner (Always shown if an announcement exists) */}
          {latestAnnouncement && (
            <UrgentAnnouncementBanner
              announcement={latestAnnouncement}
              onViewDetail={setSelectedModalAnnouncement}
            />
          )}

          {/* 2. Category Filter Tabs + Search Bar */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pt-2">
            
            {/* Category Pills */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
              {CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat && !selectedTag;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => handleCategorySelect(cat)}
                    className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all select-none cursor-pointer ${
                      isActive
                        ? 'bg-teal-50 border border-teal-600 text-teal-800 shadow-2xs'
                        : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Live Search Input */}
            <div className="relative w-full md:w-56 shrink-0">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notices..."
                className="w-full bg-white border border-slate-200 rounded-full pl-9 pr-8 py-1.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all shadow-2xs"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Active Tag Filter Indicator */}
          {selectedTag && (
            <div className="flex items-center gap-2 text-xs text-slate-600 bg-teal-50 border border-teal-200 px-3 py-1.5 rounded-lg w-fit">
              <span>Filtering by topic: <strong className="text-primary">{selectedTag}</strong></span>
              <button
                type="button"
                onClick={() => setSelectedTag(null)}
                className="text-slate-400 hover:text-slate-700 ml-1 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* 3. Announcements List */}
          <div className="flex flex-col gap-4">
            {displayedAnnouncements.length > 0 ? (
              displayedAnnouncements.map((ann) => (
                <AnnouncementCard
                  key={ann.id}
                  announcement={ann}
                  onClick={setSelectedModalAnnouncement}
                />
              ))
            ) : (
              <div className="p-8 text-center bg-white rounded-2xl border border-slate-200/90 text-slate-500 text-sm flex flex-col items-center gap-2">
                <Megaphone className="w-6 h-6 text-slate-400" />
                <span>No announcements found in this category.</span>
              </div>
            )}
          </div>

          {/* 4. Load More Button */}
          {hasMore && (
            <div className="flex justify-center pt-2">
              <button
                type="button"
                onClick={handleLoadMore}
                className="px-6 py-2.5 rounded-xl bg-teal-50/90 border border-teal-200/80 text-primary font-semibold text-xs sm:text-sm hover:bg-teal-100/90 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xs cursor-pointer"
              >
                Load More Announcements
              </button>
            </div>
          )}

        </div>

        {/* Right Sidebar Column (Takes 4 cols) */}
        <div className="lg:col-span-4 sticky top-28">
          <AnnouncementsSidebar
            selectedTag={selectedTag}
            onSelectTag={handleSelectTag}
          />
        </div>

      </div>

      {/* Full Announcement Detail Modal */}
      <AnnouncementDetailModal
        announcement={selectedModalAnnouncement}
        onClose={() => setSelectedModalAnnouncement(null)}
      />
    </div>
  );
}
