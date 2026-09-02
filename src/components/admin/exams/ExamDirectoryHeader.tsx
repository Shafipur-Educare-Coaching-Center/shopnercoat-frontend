'use client';

import React from 'react';
import { Plus, Search, LayoutGrid, Table as TableIcon, RotateCw, Sparkles } from 'lucide-react';

interface ExamDirectoryHeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  statusFilter: string;
  onStatusChange: (st: string) => void;
  viewMode: 'GRID' | 'TABLE';
  onViewModeChange: (mode: 'GRID' | 'TABLE') => void;
  onOpenCreate: () => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export function ExamDirectoryHeader({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  viewMode,
  onViewModeChange,
  onOpenCreate,
  onRefresh,
  isRefreshing,
}: ExamDirectoryHeaderProps) {
  const tabs: { label: string; value: string }[] = [
    { label: 'All Exams', value: 'ALL' },
    { label: 'Open for Registration', value: 'REGISTRATION_OPEN' },
    { label: 'Upcoming', value: 'UPCOMING' },
    { label: 'Completed / Published', value: 'COMPLETED' },
    { label: 'Drafts', value: 'DRAFT' },
  ];

  return (
    <div className="w-full flex flex-col gap-4 mb-6 select-none">
      
      {/* Top Line: Title & Action Controls */}
      <div className="w-full flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-slate-900 tracking-tight">
              Model Tests & Exam Operations
            </h2>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-teal-50 border border-teal-200/80 text-teal-700 text-[11px] font-semibold">
              <Sparkles className="size-3 text-teal-500 animate-pulse" />
              <span>Medical Admission</span>
            </span>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Schedule mock tests, allocate examination halls, monitor candidate registrations, and publish results.
          </p>
        </div>

        {/* Right Action Group */}
        <div className="w-full lg:w-auto flex items-center flex-wrap gap-2.5">
          {/* Search Input */}
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by title, code (MED-MT)..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white/95 border border-white/90 shadow-[0_4px_16px_rgba(20,40,90,0.04)] rounded-2xl text-xs text-slate-900 placeholder:text-slate-400 outline-hidden focus:ring-2 focus:ring-teal-500 transition-all backdrop-blur-md"
            />
          </div>

          {/* View Mode Toggle (Grid vs Table) */}
          <div className="flex items-center p-1 rounded-2xl bg-white/90 border border-white/90 shadow-[0_4px_16px_rgba(20,40,90,0.04)]">
            <button
              type="button"
              onClick={() => onViewModeChange('GRID')}
              className={`p-1.5 rounded-xl transition-all cursor-pointer ${
                viewMode === 'GRID'
                  ? 'bg-[#37447E] text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange('TABLE')}
              className={`p-1.5 rounded-xl transition-all cursor-pointer ${
                viewMode === 'TABLE'
                  ? 'bg-[#37447E] text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Table View"
            >
              <TableIcon className="size-3.5" />
            </button>
          </div>

          {/* Refresh Button */}
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            title="Refresh Directory"
            className="size-9 rounded-2xl bg-white/90 hover:bg-white text-slate-700 hover:text-teal-700 border border-white/90 shadow-[0_4px_16px_rgba(20,40,90,0.04)] flex items-center justify-center text-xs font-semibold backdrop-blur-md transition-all active:scale-95 disabled:opacity-60 cursor-pointer"
          >
            <RotateCw className={`size-3.5 ${isRefreshing ? 'animate-spin text-teal-600' : 'text-slate-500'}`} />
          </button>

          {/* Create Model Test Trigger */}
          <button
            type="button"
            onClick={onOpenCreate}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-[0_4px_16px_rgba(13,148,136,0.25)] transition-all active:scale-95 cursor-pointer"
          >
            <Plus className="size-3.5 text-white" />
            <span>Create Model Test</span>
          </button>
        </div>
      </div>

      {/* Bottom Line: Status Filter Tabs */}
      <div className="w-full flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar border-b border-slate-200/60">
        {tabs.map((t) => {
          const isActive = statusFilter === t.value;
          return (
            <button
              key={t.value}
              type="button"
              onClick={() => onStatusChange(t.value)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-[#37447E] text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-white/60'
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>

    </div>
  );
}
