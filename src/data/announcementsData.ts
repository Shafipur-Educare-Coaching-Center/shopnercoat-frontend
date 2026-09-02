import { Announcement } from '@/types/announcement.types';
import { formatDistanceToNow, parseISO, isValid } from 'date-fns';

export type AnnouncementCategory =
  | 'All Updates'
  | 'Exams'
  | 'Results'
  | 'Admissions'
  | 'Academics'
  | 'General';

export const FALLBACK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    title: 'MBBS Admission Results 2024 - Official Publication',
    content:
      'The Medical Admissions Board has officially released the merit list for the 2024 MBBS intake. Candidates are required to log in to their portals to verify their status and download necessary provisional documents. Verification counters at all affiliated medical colleges will remain operational from 9:00 AM to 5:00 PM.',
    status: 'PUBLISHED',
    publishedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 mins ago
    expiresAt: null,
    attachmentUrl: '/sample-circular-results-2024.pdf',
    createdBy: 'Medical Examination Board',
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
  {
    id: 'ann-2',
    title: 'Mock Test Schedule for May',
    content:
      'The comprehensive mock test series for clinical anatomy and physiology is now scheduled. Please review the updated timetable in your dashboard to allocate preparation time effectively. All registered candidates are eligible to sit for the automated CBT mock exams.',
    status: 'PUBLISHED',
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    expiresAt: null,
    attachmentUrl: null,
    createdBy: 'Academic Department',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: 'ann-3',
    title: 'New Pharmacy Module Released',
    content:
      'An updated module covering modern pharmacokinetics and drug interactions has been added to the second-year curriculum materials. Interactive case studies and clinical drug dosage calculation sheets are included in your student portal.',
    status: 'PUBLISHED',
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(), // Yesterday
    expiresAt: null,
    attachmentUrl: null,
    createdBy: 'Faculty of Pharmacy',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
  },
  {
    id: 'ann-4',
    title: 'Notice on Admit Card Download',
    content:
      'Admit cards for the upcoming preliminary screening examination will be available for download starting next Monday. Ensure your profile photo meets the specified biometric criteria (300x300 pixels, clear white background) prior to generating your admit card.',
    status: 'PUBLISHED',
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // 3 days ago
    expiresAt: null,
    attachmentUrl: '/sample-admit-card-instructions.pdf',
    createdBy: 'Controller of Examinations',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
  },
  {
    id: 'ann-5',
    title: 'BSc Nursing Enrolment Circular - Quota Guidelines',
    content:
      'Special circular regarding freedom fighter quota, tribal quota, and regional allocation for Armed Forces Medical College BSc Nursing admissions. Eligible candidates must upload endorsed supporting documents by the specified deadline.',
    status: 'PUBLISHED',
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(), // 5 days ago
    expiresAt: null,
    attachmentUrl: '/nursing-quota-guidelines.pdf',
    createdBy: 'Admission Committee',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(),
  },
  {
    id: 'ann-6',
    title: 'Dental Anatomy Clinical Lab Instructions',
    content:
      'Guidelines for candidate identification protocols during dental unit laboratory practical assessments. Candidates must bring their printed Admit Card and original National ID card.',
    status: 'PUBLISHED',
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 168).toISOString(), // 7 days ago
    expiresAt: null,
    attachmentUrl: null,
    createdBy: 'Dental Faculty Board',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 168).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 168).toISOString(),
  },
];

// Helper: Automatically classify announcement into categories based on title & content
export function categorizeAnnouncement(ann: Announcement): AnnouncementCategory {
  const text = `${ann.title} ${ann.content}`.toLowerCase();

  if (
    text.includes('result') ||
    text.includes('merit') ||
    text.includes('ranking') ||
    text.includes('score') ||
    text.includes('grade')
  ) {
    return 'Results';
  }

  if (
    text.includes('exam') ||
    text.includes('mock') ||
    text.includes('test') ||
    text.includes('schedule') ||
    text.includes('routine') ||
    text.includes('timetable')
  ) {
    return 'Exams';
  }

  if (
    text.includes('admission') ||
    text.includes('admit card') ||
    text.includes('registration') ||
    text.includes('enrol') ||
    text.includes('intake') ||
    text.includes('quota')
  ) {
    return 'Admissions';
  }

  if (
    text.includes('module') ||
    text.includes('curriculum') ||
    text.includes('syllabus') ||
    text.includes('pharmacy') ||
    text.includes('anatomy') ||
    text.includes('academic')
  ) {
    return 'Academics';
  }

  return 'General';
}

// Helper: Format author name (replaces raw UUIDs with Admin default)
export function formatAuthorName(author?: string | null): string {
  if (!author || author.trim() === '') return 'Admin';
  // Check if string matches UUID pattern (e.g. 02ec4a08-af8c-45d4-80fc-6b8c4bc09865)
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(author.trim());
  if (isUuid) return 'Admin';
  return author;
}

// Helper: Format relative or standard timestamp
export function formatAnnouncementDate(dateStr: string | null): string {
  if (!dateStr) return 'Recently';

  try {
    const date = typeof dateStr === 'string' ? parseISO(dateStr) : new Date(dateStr);
    if (!isValid(date)) return 'Recently';

    const diffHours = (Date.now() - date.getTime()) / (1000 * 60 * 60);

    if (diffHours < 24) {
      return formatDistanceToNow(date, { addSuffix: true });
    } else if (diffHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    }
  } catch {
    return 'Recently';
  }
}
