'use client';

import React from 'react';
import { User, GraduationCap, Shield } from 'lucide-react';

export type ProfileTabType = 'PERSONAL' | 'ACADEMIC' | 'SECURITY';

interface ProfileNavigationTabsProps {
  activeTab: ProfileTabType;
  onTabChange: (tab: ProfileTabType) => void;
}

export function ProfileNavigationTabs({
  activeTab,
  onTabChange,
}: ProfileNavigationTabsProps) {
  const tabs: { id: ProfileTabType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'PERSONAL', label: 'Personal & Contact Details', icon: User },
    { id: 'ACADEMIC', label: 'Medical Aspirant Credentials', icon: GraduationCap },
    { id: 'SECURITY', label: 'Security & Change Password', icon: Shield },
  ];

  return (
    <div className="w-full flex items-center gap-2 p-1.5 bg-white border border-slate-200/80 rounded-2xl shadow-2xs overflow-x-auto">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 min-w-[200px] py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              isActive
                ? 'bg-[#00796B] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Icon className="size-4" />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export default ProfileNavigationTabs;
