import React from 'react';
import { Metadata } from 'next';
import { getAccessToken } from '@/lib/server/getTokens';
import { getAdminAnnouncements } from '@/server/announcement.service';
import { AnnouncementDirectoryContainer } from '@/components/admin/announcements';

export const metadata: Metadata = {
  title: 'Announcements & Noticeboard | ShopnerCoat Admin',
  description: 'Manage public notices, exam routines, seat plan releases, and guidelines for examinees.',
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface AnnouncementsPageProps {
  searchParams: Promise<{
    search?: string;
    status?: string;
  }>;
}

export default async function AdminAnnouncementsPage({ searchParams }: AnnouncementsPageProps) {
  const token = await getAccessToken();
  const params = await searchParams;

  const announcementsRes = await getAdminAnnouncements(token || '', {
    search: params.search,
    status: params.status,
  });

  const announcements = announcementsRes.data || [];

  return (
    <div className="w-full">
      <AnnouncementDirectoryContainer initialAnnouncements={announcements} />
    </div>
  );
}
