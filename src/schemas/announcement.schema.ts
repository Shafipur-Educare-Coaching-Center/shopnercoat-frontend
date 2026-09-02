import { z } from 'zod';

export const announcementSchema = z.object({
  title: z.string().min(5),
  content: z.string().min(10),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
  publishedAt: z.string().optional().nullable(),
  expiresAt: z.string().optional().nullable(),
  attachmentUrl: z.string().url().optional().nullable().or(z.literal('')),
});

export type AnnouncementFormValues = z.infer<typeof announcementSchema>;
