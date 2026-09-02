export type AnnouncementStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface Announcement {
  id: string;
  title: string;
  content: string;
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
  status?: AnnouncementStatus;
  publishedAt?: string | null;
  expiresAt?: string | null;
  attachmentUrl?: string | null;
}

export interface AnnouncementFilterParams {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}
