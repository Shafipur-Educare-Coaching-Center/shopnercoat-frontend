'use server';

import { getAccessToken } from '@/lib/server/getTokens';
import { getAdminAnnouncements } from '@/server/announcement.service';
import { AnnouncementFilterParams } from '@/types/announcement.types';

export async function getAdminAnnouncementsAction(params?: AnnouncementFilterParams) {
  try {
    const token = await getAccessToken();
    const res = await getAdminAnnouncements(token || '', params);
    return { success: true, announcements: res.data || [] };
  } catch {
    return { success: false, announcements: [] };
  }
}
