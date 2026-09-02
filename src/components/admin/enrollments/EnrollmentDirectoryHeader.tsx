'use client';

import React from 'react';
import { Plus, Search, LayoutGrid, Table as TableIcon, RotateCw, Send } from 'lucide-react';
import { Exam } from '@/types/exam.types';

interface EnrollmentDirectoryHeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  statusFilter: string;
  onStatusChange: (status: string) => void;
  examFilter: string;
  onExamFilterChange: (examId: string) => void;
  exams: Exam[];
  viewMode: 'GRID' | 'TABLE';
  onViewModeChange: (mode: 'GRID' | 'TABLE') => void;
  onOpenCreate: () => void;
  onRefresh: () => void;
  onTriggerAdmitCards?: () => void;
  isRefreshing: boolean;
}

export function EnrollmentDirectoryHeader({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  examFilter,
  onExamFilterChange,
  exams,
  viewMode,
  onViewModeChange,
  onOpenCreate,
  onRefresh,
  onTriggerAdmitCards,
  isRefreshing,
}: EnrollmentDirectoryHeaderProps) {
  const statusTabs = [
    { id: 'ALL', label: 'All Candidates' },
    { id: 'ENROLLED', label: 'Enrolled' },
    { id: 'PENDING_APPROVAL', label: 'Pending Approval' },
    { id: 'COMPLETED', label: 'Completed' },
    { id: 'CANCELLED', label: 'Cancelled / Revoked' },
  ];

  return (
    <div className="w-full flex flex-col gap-4 mb-6 select-none">

      {/* 1. Top Controls Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">

        {/* Left: Title & Live Count Badge */}
        <div>
          <h2 className="font-heading font-black text-xl sm:text-2xl text-slate-900 tracking-tight flex items-center gap-2">
            <span>Candidate Enrollments</span>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-[#37447E] border border-indigo-200/70">
              Live Directory
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage model test registrations, seat plan assignments, and admit card dispatches.
          </p>
        </div>

        {/* Right: Search + Exam Filter + Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">

          {/* Search Box */}
          <div className="relative flex-1 sm:w-64 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search candidate, roll, reg, college..."
              className="w-full pl-9 pr-3 py-2 rounded-2xl bg-white border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 outline-hidden focus:ring-2 focus:ring-teal-500 shadow-xs"
            />
          </div>

          {/* Model Test Dropdown Filter */}
          <select
            value={examFilter}
            onChange={(e) => onExamFilterChange(e.target.value)}
            className="px-3 py-2 rounded-2xl bg-white border border-slate-200 text-xs font-semibold text-slate-800 outline-hidden focus:ring-2 focus:ring-teal-500 shadow-xs cursor-pointer"
          >
            <option value="ALL">All Model Tests</option>
            {exams.map((ex) => (
              <option key={ex.id} value={ex.id}>
                [{ex.code}] {ex.title.length > 24 ? ex.title.substring(0, 24) + '...' : ex.title}
              </option>
            ))}
          </select>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200/80">
            <button
              type="button"
              onClick={() => onViewModeChange('GRID')}
              className={`p-1.5 rounded-xl transition-all cursor-pointer ${viewMode === 'GRID'
                  ? 'bg-white text-teal-700 shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-800'
                }`}
              title="Grid Cards View"
            >
              <LayoutGrid className="size-4" />
            </button>

            <button
              type="button"
              onClick={() => onViewModeChange('TABLE')}
              className={`p-1.5 rounded-xl transition-all cursor-pointer ${viewMode === 'TABLE'
                  ? 'bg-white text-teal-700 shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-800'
                }`}
              title="Table View"
            >
              <TableIcon className="size-4" />
            </button>
          </div>

          {/* Refresh Button */}
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="size-9 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 transition-all cursor-pointer shadow-xs"
            title="Refresh list"
          >
            <RotateCw className={`size-4 ${isRefreshing ? 'animate-spin text-teal-600' : ''}`} />
          </button>

          {/* Batch Admit Card Trigger */}
          {onTriggerAdmitCards && (
            <button
              type="button"
              onClick={onTriggerAdmitCards}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold text-xs border border-sky-200 transition-all cursor-pointer shrink-0"
              title="Dispatch Admit Cards to enrolled candidates"
            >
              <Send className="size-3.5 text-sky-600" />
              <span className="hidden sm:inline">Dispatch Admit Cards</span>
            </button>
          )}

          {/* Primary Action: Manual Enrollment */}
          <button
            type="button"
            onClick={onOpenCreate}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer shrink-0"
          >
            <Plus className="size-4 text-white" />
            <span>Manual Enroll</span>
          </button>

        </div>

      </div>

      {/* 2. Status Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {statusTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onStatusChange(tab.id)}
            className={`px-3.5 py-1.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${statusFilter === tab.id
                ? 'bg-[#37447E] text-white shadow-xs'
                : 'bg-white/80 hover:bg-white text-slate-600 border border-slate-200/70'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

    </div>
  );
}
