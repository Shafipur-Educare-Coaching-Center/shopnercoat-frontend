'use client';

import React from 'react';
import { Search, RefreshCw, Megaphone, Plus, LayoutGrid, List } from 'lucide-react';

interface AnnouncementHeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  statusFilter: string;
  onStatusChange: (status: string) => void;
  viewMode: 'GRID' | 'TABLE';
  onViewModeChange: (mode: 'GRID' | 'TABLE') => void;
  onOpenCreate: () => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export function AnnouncementHeader({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  viewMode,
  onViewModeChange,
  onOpenCreate,
  onRefresh,
  isRefreshing,
}: AnnouncementHeaderProps) {
  const statusTabs = [
    { key: 'ALL', label: 'All Notices' },
    { key: 'PUBLISHED', label: 'Live Published' },
    { key: 'DRAFT', label: 'Drafts' },
    { key: 'ARCHIVED', label: 'Archived' },
  ];

  return (
    <div className="w-full flex flex-col gap-4 mb-6 select-none">
      
      {/* 1. Page Title & Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="size-9 rounded-2xl bg-indigo-50 border border-indigo-200/80 flex items-center justify-center text-indigo-600 shrink-0">
              <Megaphone className="size-5" />
            </div>
            <h1 className="font-heading font-black text-2xl tracking-tight text-slate-900">
              Announcements &amp; Public Noticeboard
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1 pl-11">
            Publish examination schedules, routine updates, seat plan releases, and academic guidelines to candidates.
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

          <button
            type="button"
            onClick={onOpenCreate}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <Plus className="size-3.5" />
            <span>Post New Announcement</span>
          </button>

        </div>
      </div>

      {/* 2. Filter Tabs, Search & View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
        
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          {statusTabs.map((tab) => {
            const isActive = statusFilter === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => onStatusChange(tab.key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Search & View Switcher */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          
          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 size-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search notices, headlines..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Grid / Table Toggle */}
          <div className="flex items-center p-0.5 bg-slate-100 rounded-xl border border-slate-200 shrink-0">
            <button
              type="button"
              onClick={() => onViewModeChange('GRID')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'GRID' ? 'bg-white shadow-xs text-indigo-600' : 'text-slate-400 hover:text-slate-600'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange('TABLE')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'TABLE' ? 'bg-white shadow-xs text-indigo-600' : 'text-slate-400 hover:text-slate-600'
              }`}
              title="Table View"
            >
              <List className="size-4" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
