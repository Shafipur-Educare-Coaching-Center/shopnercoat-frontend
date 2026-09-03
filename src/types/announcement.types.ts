export type AnnouncementStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
export type AnnouncementPriority = 'URGENT' | 'IMPORTANT' | 'GENERAL';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category?: string;
  priority?: AnnouncementPriority;
  pinned?: boolean;
  status: AnnouncementStatus;
  publishedAt: string | null;
  expiresAt: string | null;
  attachmentUrl: string | null;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AnnouncementFormData {
  title: string;
  content: string;
  category?: string;
  priority?: AnnouncementPriority;
  pinned?: boolean;
  status?: AnnouncementStatus;
  publishedAt?: string | null;
  expiresAt?: string | null;
  attachmentUrl?: string | null;
}

export interface AnnouncementFilterParams {
  search?: string;
  category?: string;
  status?: string;
  page?: number;
  limit?: number;
}
