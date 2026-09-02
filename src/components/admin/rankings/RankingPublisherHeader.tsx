'use client';

import React from 'react';
import { Trophy, RefreshCw, Layers, Send, ExternalLink, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { Exam } from '@/types/exam.types';

interface RankingPublisherHeaderProps {
  selectedExamId: string;
  onExamChange: (id: string) => void;
  exams: Exam[];
  onPublish: () => void;
  onRefresh: () => void;
  isPublishing?: boolean;
  isRefreshing?: boolean;
  isExamPublished?: boolean;
}

export function RankingPublisherHeader({
  selectedExamId,
  onExamChange,
  exams,
  onPublish,
  onRefresh,
  isPublishing,
  isRefreshing,
  isExamPublished,
}: RankingPublisherHeaderProps) {
  return (
    <div className="w-full flex flex-col gap-4 mb-6 select-none">
      
      {/* 1. Page Title & Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="size-9 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-600 shrink-0">
              <Trophy className="size-5" />
            </div>
            <h1 className="font-heading font-black text-2xl tracking-tight text-slate-900">
              Public Ranking &amp; Top-10 Leaderboard Publisher
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1 pl-11">
            Preview the Top-10 merit list and publish the public 3D podium snapshot to candidates and visitors at <code>/ranking</code>.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-60"
          >
            <RefreshCw className={`size-3.5 ${isRefreshing ? 'animate-spin text-indigo-600' : ''}`} />
            <span>Sync</span>
          </button>

          <Link
            href="/ranking"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
          >
            <span>View Public /ranking</span>
            <ExternalLink className="size-3 opacity-60" />
          </Link>

          <button
            type="button"
            onClick={onPublish}
            disabled={isPublishing}
            className={`inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-black shadow-md transition-all active:scale-95 cursor-pointer ${
              isExamPublished
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white'
                : 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950'
            }`}
          >
            {isExamPublished ? (
              <>
                <CheckCircle2 className="size-3.5 text-white" />
                <span>Update Public Top-10 Snapshot</span>
              </>
            ) : (
              <>
                <Send className="size-3.5 text-slate-950" />
                <span>Publish Top-10 Snapshot</span>
              </>
            )}
          </button>

        </div>
      </div>

      {/* 2. Exam Switcher Selector */}
      <div className="flex items-center gap-2 p-3 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
        <Layers className="size-4 text-slate-400 shrink-0" />
        <span className="text-xs font-semibold text-slate-500">Target Model Test:</span>
        <select
          value={selectedExamId}
          onChange={(e) => onExamChange(e.target.value)}
          className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-hidden focus:ring-2 focus:ring-amber-500 cursor-pointer"
        >
          {exams.map((ex) => (
            <option key={ex.id} value={ex.id}>
              [{ex.code}] {ex.title} {ex.status === 'RESULT_PUBLISHED' ? '• (Published Live)' : ''}
            </option>
          ))}
        </select>
      </div>

    </div>
  );
}
