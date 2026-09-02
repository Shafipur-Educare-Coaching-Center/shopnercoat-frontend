'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Megaphone, X, ChevronRight, ChevronLeft, ArrowRight, Sparkles } from 'lucide-react';
import { Announcement } from '@/types/announcement.types';

interface AnnouncementBarProps {
  announcements?: Announcement[];
  id?: string;
  message?: string;
}

export function AnnouncementBar({
  announcements = [],
  id = 'default-urgent',
  message = 'Registration for MBBS & Medical Model Test 2026 session is now open! Limited seats available.',
}: AnnouncementBarProps) {
  const [dismissedIds, setDismissedIds] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const keys = Object.keys(sessionStorage).filter((k) => k.startsWith('announcement_dismissed_'));
      return keys.map((k) => k.replace('announcement_dismissed_', ''));
    } catch {
      return [];
    }
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Filter valid published & non-expired announcements
  const activeList = useMemo(() => {
    if (!announcements || announcements.length === 0) {
      return [
        {
          id,
          title: message,
          content: message,
          status: 'PUBLISHED' as const,
          publishedAt: new Date().toISOString(),
          expiresAt: null,
          attachmentUrl: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
    }

    const now = new Date();
    const filtered = announcements.filter((a) => {
      if (a.status !== 'PUBLISHED') return false;
      if (a.expiresAt && new Date(a.expiresAt) < now) return false;
      return true;
    });

    return filtered.length > 0
      ? filtered
      : [
          {
            id,
            title: message,
            content: message,
            status: 'PUBLISHED' as const,
            publishedAt: new Date().toISOString(),
            expiresAt: null,
            attachmentUrl: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ];
  }, [announcements, id, message]);

  // Filter out any dismissed announcements
  const nonDismissedList = useMemo(() => {
    return activeList.filter((a) => !dismissedIds.includes(a.id));
  }, [activeList, dismissedIds]);

  const currentAnnouncement = nonDismissedList[currentIndex % (nonDismissedList.length || 1)];

  // Auto-rotate if multiple active announcements exist (every 6 seconds)
  useEffect(() => {
    if (nonDismissedList.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % nonDismissedList.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [nonDismissedList.length, isPaused]);

  const handleDismiss = () => {
    if (currentAnnouncement) {
      try {
        sessionStorage.setItem(`announcement_dismissed_${currentAnnouncement.id}`, 'true');
      } catch {
        // Safe fallback
      }
      setDismissedIds((prev) => [...prev, currentAnnouncement.id]);
    }
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % nonDismissedList.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + nonDismissedList.length) % nonDismissedList.length);
  };

  if (!currentAnnouncement || nonDismissedList.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="announcement-banner"
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="relative bg-gradient-to-r from-[#E6F7F5] via-[#EDF9F8] to-[#F3F4FE] border-b border-teal-200/80 shadow-2xs overflow-hidden z-40"
      >
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-3 sm:gap-4">
          
          {/* Left Badge & Pagination Controls */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-teal-600 text-white font-black text-[10px] sm:text-[11px] uppercase tracking-wider shadow-2xs">
              <Sparkles className="size-2.5 sm:size-3 text-yellow-300" />
              <span>Notice</span>
            </span>

            {nonDismissedList.length > 1 && (
              <div className="hidden sm:flex items-center gap-0.5 bg-white/70 px-1 py-0.5 rounded-lg border border-teal-200/60 text-[10px] font-mono text-teal-800 font-bold">
                <span>{(currentIndex % nonDismissedList.length) + 1}</span>
                <span className="text-teal-400">/</span>
                <span>{nonDismissedList.length}</span>
              </div>
            )}
          </div>

          {/* Middle Animated Headline Text & Action Link */}
          <div className="flex-1 min-w-0 flex items-center justify-center gap-2 text-slate-800">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentAnnouncement.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.25 }}
                className="flex items-center gap-2 truncate text-center"
              >
                <Megaphone className="size-3.5 text-teal-700 shrink-0 hidden md:block" />
                
                <p className="text-xs sm:text-[13px] font-semibold text-slate-800 truncate">
                  {currentAnnouncement.title}
                </p>

                <Link
                  href="/announcements"
                  className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-bold text-teal-800 hover:text-teal-950 underline decoration-teal-400 underline-offset-2 hover:decoration-teal-800 transition-colors shrink-0 ml-1"
                >
                  <span>Read Notice</span>
                  <ArrowRight className="size-3" />
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Controls: Rotation Chevrons & Dismiss Button */}
          <div className="flex items-center gap-1 shrink-0">
            
            {nonDismissedList.length > 1 && (
              <div className="flex items-center gap-0.5">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="p-1 rounded-full text-teal-700 hover:bg-teal-200/50 transition-colors cursor-pointer"
                  aria-label="Previous announcement"
                >
                  <ChevronLeft className="size-3.5" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="p-1 rounded-full text-teal-700 hover:bg-teal-200/50 transition-colors cursor-pointer"
                  aria-label="Next announcement"
                >
                  <ChevronRight className="size-3.5" />
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={handleDismiss}
              className="p-1 rounded-full text-slate-500 hover:text-slate-800 hover:bg-teal-200/50 transition-colors cursor-pointer"
              aria-label="Dismiss announcement"
            >
              <X className="size-3.5" />
            </button>

          </div>

        </div>
      </motion.div>
    </AnimatePresence>
  );
}
