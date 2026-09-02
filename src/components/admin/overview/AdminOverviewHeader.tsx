'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { RotateCw, Download, Calendar, Check, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface AdminOverviewHeaderProps {
  lastUpdated: string;
}

export function AdminOverviewHeader({ lastUpdated }: AdminOverviewHeaderProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectedRange, setSelectedRange] = useState('Last 30 Days');

  const ranges = [
    'Today',
    'Last 7 Days',
    'Last 30 Days',
    'Current Quarter (Q4)',
    'All Time (2025-2026)',
  ];

  const handleRefresh = () => {
    startTransition(() => {
      router.refresh();
      toast.success('Analytics Refreshed', {
        description: 'Dashboard metrics synchronized with live database.',
      });
    });
  };

  const handleExport = () => {
    toast.success('Exporting Report', {
      description: 'Generating PDF / CSV platform analytics summary...',
    });
  };

  return (
    <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 sm:mb-8 select-none">
      {/* Title & Subtitle */}
      <div>
        <div className="flex items-center gap-2.5">
          <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-slate-900 tracking-tight">
            Medical Admission Analytics
          </h2>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-teal-50 border border-teal-200/80 text-teal-700 text-[11px] font-semibold">
            <Sparkles className="size-3 text-teal-500 animate-pulse" />
            <span>HSC Batch 2025-26</span>
          </span>
        </div>
        <p className="text-slate-500 text-xs sm:text-sm mt-1">
          Real-time candidate demographics, HSC institution breakdown, and administrative audit logs.
        </p>
        <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">
          Last synced: {lastUpdated ? new Date(lastUpdated).toLocaleTimeString() : 'Live'}
        </span>
      </div>

      {/* Action Controls (Range Dropdown, Refresh, Export) */}
      <div className="flex items-center flex-wrap gap-2.5">
        
        {/* Date Range Selector Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/90 hover:bg-white text-slate-700 hover:text-slate-900 border border-white/90 shadow-[0_4px_16px_rgba(20,40,90,0.05)] text-xs font-semibold backdrop-blur-md transition-all cursor-pointer outline-hidden focus-visible:ring-2 focus-visible:ring-teal-500">
            <Calendar className="size-3.5 text-teal-600" />
            <span>{selectedRange}</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 p-1.5 rounded-2xl border-slate-200/90 shadow-xl">
            {ranges.map((range) => (
              <DropdownMenuItem
                key={range}
                onClick={() => setSelectedRange(range)}
                className="flex items-center justify-between cursor-pointer"
              >
                <span>{range}</span>
                {selectedRange === range && <Check className="size-3.5 text-teal-600 font-bold" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Refresh Data Button */}
        <button
          type="button"
          onClick={handleRefresh}
          disabled={isPending}
          title="Refresh Live Data"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white/90 hover:bg-white text-slate-700 hover:text-teal-700 border border-white/90 shadow-[0_4px_16px_rgba(20,40,90,0.05)] text-xs font-semibold backdrop-blur-md transition-all active:scale-95 disabled:opacity-60 cursor-pointer"
        >
          <RotateCw className={`size-3.5 text-slate-500 ${isPending ? 'animate-spin text-teal-600' : ''}`} />
          <span className="hidden sm:inline">Refresh</span>
        </button>

        {/* Export Report Button */}
        <button
          type="button"
          onClick={handleExport}
          title="Export CSV/PDF Summary"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs shadow-[0_4px_16px_rgba(13,148,136,0.25)] transition-all active:scale-95 cursor-pointer"
        >
          <Download className="size-3.5 text-white" />
          <span>Export Summary</span>
        </button>

      </div>
    </div>
  );
}
