'use server';

import { revalidatePath } from 'next/cache';
import { getAccessToken, getUserRole } from '@/lib/server/getTokens';
import { adminUpdateAnnouncement } from '@/server/announcement.service';
import { AnnouncementFormData } from '@/types/announcement.types';

export async function updateAnnouncementAction(
  id: string,
  formData: Partial<AnnouncementFormData>
) {
  try {
    const token = await getAccessToken();
    const role = await getUserRole();

    if (!token || role !== 'ADMIN') {
      return { success: false, error: 'Unauthorized: Admin privileges required.' };
    }

    if (!id) {
      return { success: false, error: 'Announcement ID is required.' };
    }

    const updated = await adminUpdateAnnouncement(token, id, formData);

    revalidatePath('/dashboard/admin/announcements');
    revalidatePath('/announcements');
    revalidatePath('/');

    return {
      success: true,
      message: 'Announcement updated successfully!',
      announcement: updated,
    };
  } catch (err: unknown) {
    let errorMsg = 'Failed to update announcement';
    if (err instanceof Error) {
      errorMsg = err.message;
    } else if (typeof err === 'string') {
      errorMsg = err;
    }
    return { success: false, error: errorMsg };
  }
}
