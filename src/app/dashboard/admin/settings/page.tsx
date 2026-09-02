import React from 'react';
import { Metadata } from 'next';
import { SettingsDirectoryContainer } from '@/components/admin/settings';

export const metadata: Metadata = {
  title: 'System Settings | ShopnerCoat Admin',
  description: 'Manage center profile, examination grading rules, gateway diagnostics, security, and cache controls.',
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function AdminSettingsPage() {
  return (
    <div className="w-full">
      <SettingsDirectoryContainer />
    </div>
  );
}
