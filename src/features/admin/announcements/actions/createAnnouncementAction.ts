'use server';

import { revalidatePath } from 'next/cache';
import { getAccessToken, getUserRole } from '@/lib/server/getTokens';
import { adminCreateAnnouncement } from '@/server/announcement.service';
import { AnnouncementFormData } from '@/types/announcement.types';

export async function createAnnouncementAction(formData: AnnouncementFormData) {
  try {
    const token = await getAccessToken();
    const role = await getUserRole();

    if (!token || role !== 'ADMIN') {
      return { success: false, error: 'Unauthorized: Admin privileges required.' };
    }

    if (!formData.title || !formData.content) {
      return { success: false, error: 'Notice title and content are required.' };
    }

    const newAnnouncement = await adminCreateAnnouncement(token, formData);

    revalidatePath('/dashboard/admin/announcements');
    revalidatePath('/announcements');
    revalidatePath('/');

    return {
      success: true,
      message: 'Announcement published successfully!',
      announcement: newAnnouncement,
    };
  } catch (err: unknown) {
    let errorMsg = 'Failed to create announcement';
    if (err instanceof Error) {
      errorMsg = err.message;
    } else if (typeof err === 'string') {
      errorMsg = err;
    }
    return { success: false, error: errorMsg };
  }
}
