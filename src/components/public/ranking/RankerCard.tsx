'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Check, Award } from 'lucide-react';
import { RankerDisplayItem } from '@/types/ranking.types';

interface RankerCardProps {
  ranker: RankerDisplayItem;
  index: number;
}

export function RankerCard({ ranker, index }: RankerCardProps) {

  // Rank icon and badge styling
  const renderRankBadge = () => {
    switch (ranker.position) {
      case 1:
        return (
          <div className="flex items-center gap-1 text-amber-500 font-black text-lg sm:text-xl shrink-0 w-10 sm:w-12">
            <Award className="w-5 h-5 text-amber-500 fill-amber-500/20" />
            <span>1</span>
          </div>
        );
      case 2:
        return (
          <div className="flex items-center gap-1 text-slate-500 font-black text-lg sm:text-xl shrink-0 w-10 sm:w-12">
            <Award className="w-5 h-5 text-slate-500 fill-slate-400/20" />
            <span>2</span>
          </div>
        );
      case 3:
        return (
          <div className="flex items-center gap-1 text-amber-700 font-black text-lg sm:text-xl shrink-0 w-10 sm:w-12">
            <Award className="w-5 h-5 text-amber-700 fill-amber-700/20" />
            <span>3</span>
          </div>
        );
      default:
        return (
          <div className="text-slate-700 font-bold text-lg sm:text-xl shrink-0 w-10 sm:w-12 pl-1">
            {ranker.position}
          </div>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.35,
        delay: index * 0.06,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{ y: -2, transition: { duration: 0.16 } }}
      className={`w-full rounded-2xl border bg-white p-4 sm:p-5 shadow-2xs hover:shadow-clinical transition-all flex items-center justify-between gap-3 sm:gap-6 ${
        ranker.position === 1
          ? 'border-amber-200/90 bg-gradient-to-r from-amber-50/20 via-white to-white'
          : ranker.position === 2
          ? 'border-slate-200 bg-white'
          : ranker.position === 3
          ? 'border-orange-200/60 bg-white'
          : 'border-slate-200/80 bg-white'
      }`}
    >
      {/* Left Area: Rank Badge + Avatar + Student Details */}
      <div className="flex items-center gap-3 sm:gap-5 flex-1 min-w-0">
        
        {/* Rank Number / Medal Icon */}
        {renderRankBadge()}

        {/* Student Avatar */}
        <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/80 shrink-0 shadow-2xs flex items-center justify-center">
          {ranker.photoUrl ? (
            <Image
              src={ranker.photoUrl}
              alt={ranker.fullName}
              fill
              sizes="56px"
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-[#E2E8F0] text-slate-600 font-bold flex items-center justify-center text-sm sm:text-base tracking-wider">
              {ranker.initials || 'ST'}
            </div>
          )}
        </div>

        {/* Student Info */}
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <h3 className="font-heading font-bold text-slate-900 text-base sm:text-lg leading-snug truncate">
            {ranker.fullName}
          </h3>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal line-clamp-1 mt-0.5">
            {ranker.remarks}
          </p>

          {/* Subject Badges / Tags */}
          {ranker.tags && ranker.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 mt-2">
              {ranker.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-0.5 rounded-md bg-teal-50 border border-teal-200/70 text-teal-700 text-[11px] sm:text-xs font-semibold tracking-wide"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Area: Verification Checkmark & Score */}
      <div className="flex flex-col items-center justify-center shrink-0 pl-2">
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl border border-teal-300 bg-teal-50/80 flex items-center justify-center text-teal-700 shadow-2xs">
          <Check className="w-5 h-5 text-teal-700 stroke-[2.5]" />
        </div>
        <span className="font-heading font-bold text-slate-900 text-xs sm:text-sm mt-1">
          {ranker.percentage.toFixed(1)}%
        </span>
      </div>

    </motion.div>
  );
}
