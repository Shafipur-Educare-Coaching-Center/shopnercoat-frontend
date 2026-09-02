'use client';

import React, { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { SettingsTab, CenterProfileSettings, ExamRuleSettings } from '@/types/settings.types';
import { SettingsHeader } from './SettingsHeader';
import { SettingsTabNavigation } from './SettingsTabNavigation';
import { GeneralSettingsTab } from './GeneralSettingsTab';
import { ExamRulesSettingsTab } from './ExamRulesSettingsTab';
import { GatewaysStatusTab } from './GatewaysStatusTab';
import { SecuritySettingsTab } from './SecuritySettingsTab';
import { CacheManagementTab } from './CacheManagementTab';

const DEFAULT_PROFILE: CenterProfileSettings = {
  centerName: 'Shafipur Educare Coaching Center',
  tagline: 'Premier Medical & Dental Admission Examination Platform',
  helplineMobile: '+880 1700-000000',
  supportEmail: 'support@shopnercoat.xyz',
  campusAddress: 'Shafipur Bazar, Kaliakair, Gazipur, Dhaka, Bangladesh',
  timezone: 'Asia/Dhaka (UTC+6)',
};

const DEFAULT_EXAM_RULES: ExamRuleSettings = {
  defaultNegativeMark: 0.25,
  defaultPassPercentage: 40,
  rollNumberLength: 7,
  autoGeneratePodium: true,
  tiebreakerStrategy: 'DENSE_4_LEVEL',
};

export function SettingsDirectoryContainer() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('GENERAL');
  const [isPending, startTransition] = useTransition();

  const [profile, setProfile] = useState<CenterProfileSettings>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('shopnercoat_center_profile');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // fallback
        }
      }
    }
    return DEFAULT_PROFILE;
  });

  const [examRules, setExamRules] = useState<ExamRuleSettings>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('shopnercoat_exam_rules');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // fallback
        }
      }
    }
    return DEFAULT_EXAM_RULES;
  });

  const handleProfileChange = (field: keyof CenterProfileSettings, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleExamRulesChange = (
    field: keyof ExamRuleSettings,
    value: number | boolean | string
  ) => {
    setExamRules((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveAll = () => {
    startTransition(async () => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('shopnercoat_center_profile', JSON.stringify(profile));
        localStorage.setItem('shopnercoat_exam_rules', JSON.stringify(examRules));
      }
      await new Promise((resolve) => setTimeout(resolve, 500));
      toast.success('System Settings Saved', {
        description: 'Organization parameters and exam rules have been successfully updated.',
      });
    });
  };

  const handleResetDefaults = () => {
    setProfile(DEFAULT_PROFILE);
    setExamRules(DEFAULT_EXAM_RULES);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('shopnercoat_center_profile');
      localStorage.removeItem('shopnercoat_exam_rules');
    }
    toast.info('Settings Reset to System Defaults');
  };

  return (
    <div className="w-full flex flex-col select-none">
      
      {/* 1. Header with Actions */}
      <SettingsHeader
        onSaveAll={handleSaveAll}
        onReset={handleResetDefaults}
        isSaving={isPending}
      />

      {/* 2. Tab Navigation Switcher */}
      <SettingsTabNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* 3. Active Tab Content View */}
      <div className="w-full">
        {activeTab === 'GENERAL' && (
          <GeneralSettingsTab
            profile={profile}
            onChange={handleProfileChange}
          />
        )}

        {activeTab === 'EXAM_RULES' && (
          <ExamRulesSettingsTab
            examRules={examRules}
            onChange={handleExamRulesChange}
          />
        )}

        {activeTab === 'GATEWAYS' && <GatewaysStatusTab />}

        {activeTab === 'SECURITY' && <SecuritySettingsTab />}

        {activeTab === 'CACHE' && <CacheManagementTab />}
      </div>

    </div>
  );
}
