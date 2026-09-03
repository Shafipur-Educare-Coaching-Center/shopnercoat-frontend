'use client';

import React, { useState } from 'react';
import { Student } from '@/types/student.types';
import { ProfileHeader } from './ProfileHeader';
import { ProfileNavigationTabs, ProfileTabType } from './ProfileNavigationTabs';
import { PersonalInfoForm } from './PersonalInfoForm';
import { AcademicProfileCard } from './AcademicProfileCard';
import { AccountSecurityForm } from './AccountSecurityForm';

interface MyProfileViewProps {
  student: Student | null;
}

export function MyProfileView({ student }: MyProfileViewProps) {
  const [activeTab, setActiveTab] = useState<ProfileTabType>('PERSONAL');

  return (
    <div className="w-full flex flex-col gap-6 sm:gap-7 pb-10">
      
      {/* 1. Header with 3D Holographic Medical Aspirant Visualizer */}
      <ProfileHeader student={student} />

      {/* 2. Sub-Section Navigation Tabs */}
      <ProfileNavigationTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* 3. Sub-Section View Panels */}
      {activeTab === 'PERSONAL' ? (
        <PersonalInfoForm student={student} />
      ) : activeTab === 'ACADEMIC' ? (
        <AcademicProfileCard student={student} />
      ) : (
        <AccountSecurityForm student={student} />
      )}

    </div>
  );
}

export default MyProfileView;
