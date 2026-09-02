'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import { RankerDisplayItem } from '@/types/ranking.types';
import { RankerCard } from './RankerCard';

interface SingleExamRankingListProps {
  rankers: RankerDisplayItem[];
  isLoading?: boolean;
}

export function SingleExamRankingList({
  rankers,
  isLoading = false,
}: SingleExamRankingListProps) {
  return (
    <div className="w-full mt-10 sm:mt-12 flex flex-col items-center">
      
      {/* Section Title matching design */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center mb-6 sm:mb-8"
      >
        <h2 className="font-heading text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
          Single-exam ranking
        </h2>
      </motion.div>

      {/* Leaderboard Cards Container */}
      <div className="w-full flex flex-col gap-3 sm:gap-4">
        {isLoading ? (
          // Skeleton Loading
          Array.from({ length: 5 }).map((_, idx) => (
            <div
              key={idx}
              className="w-full h-24 rounded-2xl bg-white border border-slate-200/80 p-5 flex items-center justify-between animate-pulse"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="w-8 h-8 rounded-lg bg-slate-200" />
                <div className="w-14 h-14 rounded-2xl bg-slate-200" />
                <div className="flex-1 flex flex-col gap-2">
                  <div className="w-40 h-4 rounded bg-slate-200" />
                  <div className="w-72 h-3 rounded bg-slate-200" />
                  <div className="w-24 h-4 rounded bg-slate-200" />
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-200" />
            </div>
          ))
        ) : rankers && rankers.length > 0 ? (
          rankers.map((ranker, index) => (
            <RankerCard
              key={ranker.id || `rank-${ranker.position}`}
              ranker={ranker}
              index={index}
            />
          ))
        ) : (
          <div className="w-full p-10 bg-white rounded-2xl border border-slate-200 text-center flex flex-col items-center gap-3">
            <Trophy className="w-10 h-10 text-slate-300" />
            <p className="text-slate-600 font-medium text-sm">
              No published rankings available for this exam yet.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
