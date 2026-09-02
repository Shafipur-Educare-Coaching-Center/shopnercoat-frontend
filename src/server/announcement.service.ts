import 'server-only';
import { serverFetch } from '@/lib/server/apiClient';
import {
  Announcement,
  AnnouncementFormData,
  AnnouncementFilterParams,
} from '@/types/announcement.types';
import { ApiResponse } from '@/types/api.types';

/**
 * GET /announcements/public - Returns active published announcements
 */
export async function getPublicAnnouncements(): Promise<Announcement[]> {
  try {
    const res = await serverFetch<Announcement[]>('/announcements/public', {
      cache: 'no-store',
    });
    return res.data || [];
  } catch (err) {
    console.warn('GET /announcements/public failed:', err);
    return [];
  }
}

/**
 * GET /announcements/:id - Returns a single announcement
 */
export async function getAnnouncementById(id: string): Promise<Announcement | null> {
  try {
    const res = await serverFetch<Announcement>(`/announcements/${id}`, {
      cache: 'no-store',
    });
    return res.data || null;
  } catch (err) {
    console.warn(`GET /announcements/${id} failed:`, err);
    return null;
  }
}

/**
 * GET /announcements/admin/list - Returns all announcements (Admin Only)
 */
export async function getAdminAnnouncements(
  token: string,
  params?: AnnouncementFilterParams
): Promise<ApiResponse<Announcement[]>> {
  try {
    const res = await serverFetch<Announcement[]>('/announcements/admin/list', {
      token,
      params: {
        search: params?.search,
        status: params?.status !== 'ALL' ? params?.status : undefined,
        page: params?.page,
        limit: params?.limit,
      },
      cache: 'no-store',
    });

    if (res && res.data && Array.isArray(res.data)) {
      return res;
    }
  } catch (err) {
    console.warn('GET /announcements/admin/list failed:', err);
  }

  return {
    statusCode: 200,
    success: true,
    data: [],
    meta: {
      page: params?.page || 1,
      limit: params?.limit || 20,
      total: 0,
      totalPages: 1,
    },
  };
}

/**
 * POST /announcements/admin - Creates a new announcement (Admin Only)
 */
export async function adminCreateAnnouncement(
  token: string,
  data: AnnouncementFormData
): Promise<Announcement> {
  const payload = {
    title: data.title.trim(),
    content: data.content.trim(),
    status: data.status || 'PUBLISHED',
    publishedAt: data.publishedAt || new Date().toISOString(),
    expiresAt: data.expiresAt || null,
    attachmentUrl: data.attachmentUrl ? data.attachmentUrl.trim() : null,
  };

  const res = await serverFetch<Announcement>('/announcements/admin', {
    token,
    method: 'POST',
    body: JSON.stringify(payload),
    cache: 'no-store',
  });

  return res.data;
}

/**
 * PATCH /announcements/admin/:id - Updates an announcement or transitions status (Admin Only)
 */
export async function adminUpdateAnnouncement(
  token: string,
  id: string,
  data: Partial<AnnouncementFormData>
): Promise<Announcement> {
  const res = await serverFetch<Announcement>(`/announcements/admin/${id}`, {
    token,
    method: 'PATCH',
    body: JSON.stringify(data),
    cache: 'no-store',
  });

  return res.data;
}

/**
 * DELETE /announcements/admin/:id - Permanently deletes an announcement (Admin Only)
 */
export async function adminDeleteAnnouncement(
  token: string,
  id: string
): Promise<{ success: boolean; message: string }> {
  const res = await serverFetch<Record<string, unknown>>(`/announcements/admin/${id}`, {
    token,
    method: 'DELETE',
    cache: 'no-store',
  });

  const msg = (res?.message as string) || 'Announcement deleted successfully';
  return { success: true, message: msg };
}
