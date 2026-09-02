'use client';

import React from 'react';
import { Search, RefreshCw, Layers, Award, Plus, FileSpreadsheet, Send, CheckCircle2 } from 'lucide-react';
import { Exam } from '@/types/exam.types';

interface ResultHeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedExamId: string;
  onExamChange: (id: string) => void;
  exams: Exam[];
  onOpenSingleEntry: () => void;
  onOpenBulkEntry: () => void;
  onOpenPublish: () => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
  isExamPublished?: boolean;
}

export function ResultHeader({
  searchQuery,
  onSearchChange,
  selectedExamId,
  onExamChange,
  exams,
  onOpenSingleEntry,
  onOpenBulkEntry,
  onOpenPublish,
  onRefresh,
  isRefreshing,
  isExamPublished,
}: ResultHeaderProps) {
  return (
    <div className="w-full flex flex-col gap-4 mb-6 select-none">
      
      {/* 1. Page Title & Action Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="size-9 rounded-2xl bg-indigo-50 border border-indigo-200/80 flex items-center justify-center text-indigo-600 shrink-0">
              <Award className="size-5" />
            </div>
            <h1 className="font-heading font-black text-2xl tracking-tight text-slate-900">
              Result Management & Mark Sheet Tabulation
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1 pl-11">
            Record student marks, bulk spreadsheet entry, automated 4-level dense tiebreaker ranking, and public leaderboard publishing.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-60"
          >
            <RefreshCw className={`size-3.5 ${isRefreshing ? 'animate-spin text-indigo-600' : ''}`} />
            <span>Sync</span>
          </button>

          <button
            type="button"
            onClick={onOpenSingleEntry}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            <Plus className="size-3.5" />
            <span>Single Entry</span>
          </button>

          <button
            type="button"
            onClick={onOpenBulkEntry}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200/80 text-xs font-bold shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            <FileSpreadsheet className="size-3.5 text-teal-600" />
            <span>Bulk Entry</span>
          </button>

          <button
            type="button"
            onClick={onOpenPublish}
            disabled={isExamPublished}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black shadow-md transition-all active:scale-95 cursor-pointer ${
              isExamPublished
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default opacity-90'
                : 'bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white'
            }`}
          >
            {isExamPublished ? (
              <>
                <CheckCircle2 className="size-3.5 text-emerald-600" />
                <span>Results Live</span>
              </>
            ) : (
              <>
                <Send className="size-3.5 text-white" />
                <span>Publish Results &amp; Merit List</span>
              </>
            )}
          </button>

        </div>
      </div>

      {/* 2. Filter Controls & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
        
        {/* Exam Dropdown Selector */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Layers className="size-4 text-slate-400 shrink-0" />
          <select
            value={selectedExamId}
            onChange={(e) => onExamChange(e.target.value)}
            className="w-full sm:w-80 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-hidden focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            {exams.map((ex) => (
              <option key={ex.id} value={ex.id}>
                [{ex.code}] {ex.title} {ex.status === 'RESULT_PUBLISHED' ? '• (Published)' : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Candidate Search Box */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 size-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search candidate name, roll #, college..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 outline-hidden focus:ring-2 focus:ring-indigo-500"
          />
        </div>

      </div>

    </div>
  );
}
