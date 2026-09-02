'use client';

import React from 'react';
import { Search, RefreshCw, Layers, IdCard } from 'lucide-react';
import { Exam } from '@/types/exam.types';

interface AdmitCardHeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedExamId: string;
  onExamChange: (id: string) => void;
  exams: Exam[];
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export function AdmitCardHeader({
  searchQuery,
  onSearchChange,
  selectedExamId,
  onExamChange,
  exams,
  onRefresh,
  isRefreshing,
}: AdmitCardHeaderProps) {
  return (
    <div className="w-full flex flex-col gap-4 mb-6 select-none">
      {/* 1. Page Title & Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="size-9 rounded-2xl bg-indigo-50 border border-indigo-200/80 flex items-center justify-center text-indigo-600 shrink-0">
              <IdCard className="size-5" />
            </div>
            <h1 className="font-heading font-black text-2xl tracking-tight text-slate-900">
              Admit Card Management & Dispatches
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1 pl-11">
            Batch PDF generation, email dispatches, seat plan snapshots, and QR gate verification logs.
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
            className="w-full sm:w-64 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-hidden focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="ALL">All Model Tests</option>
            {exams.map((ex) => (
              <option key={ex.id} value={ex.id}>
                [{ex.code}] {ex.title}
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
            placeholder="Search candidate name, roll #, admit card #..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 outline-hidden focus:ring-2 focus:ring-indigo-500"
          />
        </div>

      </div>
    </div>
  );
}
