import { RankerDisplayItem } from '@/types/ranking.types';

export interface PublishedExamOption {
  id: string;
  title: string;
  code: string;
  category: string;
  scope: string; // e.g. 'National', 'Central', etc.
  examDate: string;
  tags: string[];
  isMock?: boolean;
}

// Fallback Mock Exam for Standalone Testing
export const MOCK_EXAM: PublishedExamOption = {
  id: 'mock-mbbs-may-2024',
  title: 'MBBS Mock Test - May 2024 (Sample)',
  code: 'MBBS-MOCK-2024',
  category: 'MBBS',
  scope: 'National',
  examDate: '2024-05-15',
  tags: ['MBBS', 'National'],
  isMock: true,
};

export const MOCK_RANKERS: RankerDisplayItem[] = [
  {
    id: 'ranker-1',
    position: 1,
    fullName: 'Dr. A. Khan',
    rollNumber: 4528641,
    photoUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=256&q=80',
    obtainedMarks: 98.2,
    percentage: 98.2,
    remarks: 'Outstanding performance in Clinical Anatomy and General Medicine.',
    tags: ['Anatomy', 'Medicine'],
    initials: 'AK',
  },
  {
    id: 'ranker-2',
    position: 2,
    fullName: 'S. Rahman',
    rollNumber: 4528642,
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
    obtainedMarks: 94.5,
    percentage: 94.5,
    remarks: 'Exceptional aptitude in Pathology and Pharmacology.',
    tags: ['Pathology'],
    initials: 'SR',
  },
  {
    id: 'ranker-3',
    position: 3,
    fullName: 'M. Hossain',
    rollNumber: 4528643,
    photoUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=256&q=80',
    obtainedMarks: 92.1,
    percentage: 92.1,
    remarks: 'Consistent high performer in Mock Exams nationwide.',
    tags: ['Mock Exams'],
    initials: 'MH',
  },
];

export const FALLBACK_EXAMS: PublishedExamOption[] = [MOCK_EXAM];

/**
 * Helper: Normalize incoming backend rankers from GET /rankings/public/:examId
 * Handles flat structure AND nested student objects ({ student: { fullName, photoUrl, rollNumber, collegeName } })
 */
export function normalizeRankers(
  rawList?: unknown[] | null,
  isMockExam = false
): RankerDisplayItem[] {
  if (isMockExam) {
    return MOCK_RANKERS;
  }

  if (rawList && Array.isArray(rawList) && rawList.length > 0) {
    return rawList.map((rawItem: unknown, index: number) => {
      const item = (rawItem && typeof rawItem === 'object' ? rawItem : {}) as Record<string, unknown>;
      const student = (item.student && typeof item.student === 'object' ? item.student : {}) as Record<string, unknown>;
      const fullName = (item.fullName as string) || (student.fullName as string) || 'Candidate';
      const rollNumber = (item.rollNumber as number) || (student.rollNumber as number) || 'N/A';
      const photoUrl = (item.photoUrl as string) || (student.photoUrl as string) || null;
      const collegeName = (student.collegeName as string) || (item.collegeName as string) || '';
      const pos = (item.position as number) || index + 1;
      const obtainedMarks = (item.obtainedMarks as number) ?? 0;
      const pct = item.percentage ? Number(Number(item.percentage).toFixed(1)) : 0;

      const initials = fullName
        ? fullName
            .split(' ')
            .filter(Boolean)
            .map((p: string) => p[0])
            .slice(0, 2)
            .join('')
            .toUpperCase()
        : 'ST';

      const defaultRemarks = collegeName
        ? `Excellence from ${collegeName}`
        : pos === 1
        ? 'Outstanding performance in Medical Admission Model Test.'
        : pos === 2
        ? 'Exceptional aptitude in core subjects.'
        : pos === 3
        ? 'High performer in national qualifier examination.'
        : 'Top score candidate.';

      const defaultTags = collegeName ? [collegeName] : ['Top Ranker'];

      return {
        id: (item.id as string) || (item.studentId as string) || `ranker-${pos}`,
        position: pos,
        fullName,
        rollNumber,
        photoUrl,
        obtainedMarks,
        percentage: pct,
        remarks: (item.remarks as string) || defaultRemarks,
        tags: Array.isArray(item.tags) && item.tags.length > 0 ? (item.tags as string[]) : defaultTags,
        initials,
      };
    });
  }

  return [];
}
