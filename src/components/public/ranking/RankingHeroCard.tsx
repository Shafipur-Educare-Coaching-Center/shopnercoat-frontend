'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';
import { PublishedExamOption } from '@/data/rankingData';
import { RankerDisplayItem } from '@/types/ranking.types';
import { Ranking3DPodium } from './Ranking3DPodium';

interface RankingHeroCardProps {
  exams: PublishedExamOption[];
  selectedExam: PublishedExamOption;
  onSelectExam: (exam: PublishedExamOption) => void;
  topRankers: RankerDisplayItem[];
  popperTriggerKey: string | number;
}

export function RankingHeroCard({
  exams,
  selectedExam,
  onSelectExam,
  topRankers,
  popperTriggerKey,
}: RankingHeroCardProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleChooseExam = (exam: PublishedExamOption) => {
    onSelectExam(exam);
    setIsDropdownOpen(false);
  };

  return (
    <div className="w-full rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-8 lg:p-10 shadow-xs relative overflow-visible">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Column: Title, Exam Selector, Subtitle, Badges (Takes 6 cols) */}
        <div className="lg:col-span-6 flex flex-col justify-center">
          
          {/* Main Hero Title matching design */}
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-[40px] font-bold text-slate-900 tracking-tight leading-tight">
            The best students
          </h1>

          {/* Exam Selector Section */}
          <div className="mt-5 sm:mt-6 flex flex-col gap-1.5 relative" ref={dropdownRef}>
            <label className="text-xs font-semibold text-slate-600">
              Select Exam
            </label>

            {/* Custom Dropdown Trigger Button */}
            <button
              type="button"
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              className="w-full sm:max-w-md bg-white border border-slate-300 hover:border-teal-500 rounded-xl px-4 py-2.5 text-left text-sm sm:text-base font-medium text-slate-900 flex items-center justify-between shadow-2xs hover:shadow-sm transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            >
              <span className="truncate pr-2">{selectedExam.title}</span>
              <ChevronDown
                className={`w-4 h-4 text-slate-500 shrink-0 transition-transform duration-200 ${
                  isDropdownOpen ? 'rotate-180 text-teal-600' : ''
                }`}
              />
            </button>

            {/* Dropdown Menu Popover */}
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  transition={{ duration: 0.16 }}
                  className="absolute top-full left-0 mt-1.5 w-full sm:max-w-md bg-white rounded-2xl border border-slate-200 shadow-clinical z-50 py-2 max-h-64 overflow-y-auto"
                >
                  {exams.map((exam) => {
                    const isSelected = exam.id === selectedExam.id;
                    return (
                      <button
                        key={exam.id}
                        type="button"
                        onClick={() => handleChooseExam(exam)}
                        className={`w-full px-4 py-2.5 text-left text-sm flex items-center justify-between transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-teal-50/80 text-teal-900 font-semibold'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex flex-col min-w-0 pr-2">
                          <span className="truncate">{exam.title}</span>
                          <span className="text-[11px] text-slate-400 font-mono mt-0.5">
                            {exam.code}
                          </span>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-teal-600 shrink-0" />}
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Subtitle Tagline matching design */}
          <p className="mt-5 text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
            Track your academic standing among peers nationwide.
          </p>

          {/* Category / Scope Pills matching design */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {selectedExam.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full bg-teal-50 border border-teal-200/70 text-teal-800 text-xs font-semibold tracking-wide"
              >
                {tag}
              </span>
            ))}
          </div>

        </div>

        {/* Right Column: 3D Top-3 Podium Canvas with Poppers (Takes 6 cols) */}
        <div className="lg:col-span-6 w-full flex items-center justify-center">
          <Ranking3DPodium
            topRankers={topRankers}
            examTitle={selectedExam.title}
            triggerPopperKey={popperTriggerKey}
          />
        </div>

      </div>

    </div>
  );
}
