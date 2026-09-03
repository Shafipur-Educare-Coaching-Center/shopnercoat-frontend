'use client';

import React from 'react';
import { Search } from 'lucide-react';

export type AdmitCardFilterStatus = 'ALL' | 'ACTIVE' | 'ARCHIVED';

interface AdmitCardFilterBarProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  selectedStatus: AdmitCardFilterStatus;
  setSelectedStatus: (val: AdmitCardFilterStatus) => void;
  totalResults: number;
}

export function AdmitCardFilterBar({
  searchQuery,
  setSearchQuery,
  selectedStatus,
  setSelectedStatus,
  totalResults,
}: AdmitCardFilterBarProps) {
  const tabs: { id: AdmitCardFilterStatus; label: string }[] = [
    { id: 'ALL', label: 'All Admit Passes' },
    { id: 'ACTIVE', label: 'Upcoming Live Tests' },
    { id: 'ARCHIVED', label: 'Past Sessions' },
  ];

  return (
    <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4">
      {/* Search Input */}
      <div className="relative w-full md:w-80">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Search className="size-4" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search admit pass by code or test..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200/80 rounded-2xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-hidden focus:ring-2 focus:ring-[#00796B]/25 focus:border-[#00796B] transition-all shadow-2xs"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-white border border-slate-200/80 rounded-2xl shadow-2xs overflow-x-auto w-full md:w-auto">
        {tabs.map((tab) => {
          const isActive = selectedStatus === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedStatus(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-[#00796B] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default AdmitCardFilterBar;
