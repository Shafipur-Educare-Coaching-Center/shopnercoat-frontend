'use server';

import { revalidatePath } from 'next/cache';
import { getAccessToken, getUserRole } from '@/lib/server/getTokens';
import { adminDeleteAnnouncement } from '@/server/announcement.service';

export async function deleteAnnouncementAction(id: string) {
  try {
    const token = await getAccessToken();
    const role = await getUserRole();

    if (!token || role !== 'ADMIN') {
      return { success: false, error: 'Unauthorized: Admin privileges required.' };
    }

    if (!id) {
      return { success: false, error: 'Announcement ID is required.' };
    }

    const res = await adminDeleteAnnouncement(token, id);

    revalidatePath('/dashboard/admin/announcements');
    revalidatePath('/announcements');
    revalidatePath('/');

    return {
      success: true,
      message: res.message,
    };
  } catch (err: unknown) {
    let errorMsg = 'Failed to delete announcement';
    if (err instanceof Error) {
      errorMsg = err.message;
    } else if (typeof err === 'string') {
      errorMsg = err;
    }
    return { success: false, error: errorMsg };
  }
}
