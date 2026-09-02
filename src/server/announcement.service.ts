import 'server-only';
import { serverFetch } from '@/lib/server/apiClient';
import { Announcement } from '@/types/announcement.types';

export async function getPublicAnnouncements(): Promise<Announcement[]> {
  const res = await serverFetch<Announcement[]>('/announcements/public', {
    next: { tags: ['announcements'], revalidate: 3600 }
  });
  return res.data;
}

export async function getAdminAnnouncements(token: string): Promise<Announcement[]> {
  const res = await serverFetch<Announcement[]>('/announcements/admin/list', { token, cache: 'no-store' });
  return res.data;
}
