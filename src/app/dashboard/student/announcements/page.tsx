import React from 'react';
import { Metadata } from 'next';
import { getPublicAnnouncements } from '@/server/announcement.service';
import { OfficialNoticesView } from '@/components/student/announcements';

export const metadata: Metadata = {
  title: 'Official Notices & Circulars | Shopner Coat Student Portal',
  description:
    'Stay updated with official examination guidelines, center notices, and medical admission bulletins.',
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function StudentAnnouncementsPage() {
  const announcements = await getPublicAnnouncements().catch(() => []);

  return <OfficialNoticesView announcements={announcements} />;
}
