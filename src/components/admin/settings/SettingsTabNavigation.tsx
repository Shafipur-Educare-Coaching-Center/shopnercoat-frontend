'use client';

import React from 'react';
import { LucideIcon, Building2, BookOpen, Server, ShieldCheck, Zap } from 'lucide-react';
import { SettingsTab } from '@/types/settings.types';

interface SettingsTabNavigationProps {
  activeTab: SettingsTab;
  onTabChange: (tab: SettingsTab) => void;
}

export function SettingsTabNavigation({
  activeTab,
  onTabChange,
}: SettingsTabNavigationProps) {
  const tabs: { id: SettingsTab; label: string; icon: LucideIcon }[] = [
    { id: 'GENERAL', label: 'Center Profile', icon: Building2 },
    { id: 'EXAM_RULES', label: 'Exam Rules & Grading', icon: BookOpen },
    { id: 'GATEWAYS', label: 'Gateway Diagnostics', icon: Server },
    { id: 'SECURITY', label: 'Admin Security', icon: ShieldCheck },
    { id: 'CACHE', label: 'Cache & Sync', icon: Zap },
  ];

  return (
    <div className="flex items-center gap-1.5 p-1.5 bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-x-auto mb-6 select-none">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              isActive
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Icon className={`size-3.5 ${isActive ? 'text-teal-400' : 'text-slate-400'}`} />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
