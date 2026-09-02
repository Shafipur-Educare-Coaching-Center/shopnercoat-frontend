'use client';

import React from 'react';
import { UserPlus, Download, Search, Sparkles, Filter, RotateCw } from 'lucide-react';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface StudentDirectoryHeaderProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  statusFilter: string;
  onStatusChange: (status: string) => void;
  onOpenAdd: () => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export function StudentDirectoryHeader({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  onOpenAdd,
  onRefresh,
  isRefreshing,
}: StudentDirectoryHeaderProps) {
  const handleExport = () => {
    toast.success('Exporting Candidate Directory', {
      description: 'Generating comprehensive CSV file with roll numbers & parent contacts...',
    });
  };

  return (
    <div className="w-full flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6 select-none">
      
      {/* 1. Title & Subtitle */}
      <div>
        <div className="flex items-center gap-2.5">
          <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-slate-900 tracking-tight">
            Candidate Directory
          </h2>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-teal-50 border border-teal-200/80 text-teal-700 text-[11px] font-semibold">
            <Sparkles className="size-3 text-teal-500 animate-pulse" />
            <span>HSC Examinees</span>
          </span>
        </div>
        <p className="text-slate-500 text-xs sm:text-sm mt-1">
          Review candidate profiles, verify HSC institutions, issue roll numbers, and manage admissions.
        </p>
      </div>

      {/* 2. Controls Group (Search, Status Filter, Add Student, Export) */}
      <div className="w-full lg:w-auto flex items-center flex-wrap gap-2.5">
        
        {/* Search Input */}
        <div className="relative flex-1 sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search name, roll #, college, mobile..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white/95 border border-white/90 shadow-[0_4px_16px_rgba(20,40,90,0.04)] rounded-2xl text-xs text-slate-900 placeholder:text-slate-400 outline-hidden focus:ring-2 focus:ring-teal-500 transition-all backdrop-blur-md"
          />
        </div>

        {/* Status Filter Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white/90 hover:bg-white text-slate-700 border border-white/90 shadow-[0_4px_16px_rgba(20,40,90,0.04)] text-xs font-semibold backdrop-blur-md transition-all cursor-pointer">
            <Filter className="size-3 text-slate-500" />
            <span>
              {statusFilter === 'ALL'
                ? 'All Statuses'
                : statusFilter === 'COMPLETED'
                ? 'Verified'
                : statusFilter}
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40 p-1.5 rounded-2xl border-slate-200/90 shadow-xl">
            <DropdownMenuItem onClick={() => onStatusChange('ALL')}>
              All Statuses
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onStatusChange('COMPLETED')}>
              Verified (Completed)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onStatusChange('PENDING')}>
              Pending Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onStatusChange('REJECTED')}>
              Rejected / On Hold
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

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

        {/* Export CSV Button */}
        <button
          type="button"
          onClick={handleExport}
          title="Export CSV candidate list"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white/90 hover:bg-white text-slate-700 hover:text-slate-900 border border-white/90 shadow-[0_4px_16px_rgba(20,40,90,0.04)] text-xs font-semibold backdrop-blur-md transition-all active:scale-95 cursor-pointer"
        >
          <Download className="size-3.5 text-slate-500" />
          <span className="hidden sm:inline">Export</span>
        </button>

        {/* Primary Action: Add Candidate Button */}
        <button
          type="button"
          onClick={onOpenAdd}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-[0_4px_16px_rgba(13,148,136,0.25)] transition-all active:scale-95 cursor-pointer"
        >
          <UserPlus className="size-3.5 text-white" />
          <span>Add Candidate</span>
        </button>

      </div>

    </div>
  );
}
