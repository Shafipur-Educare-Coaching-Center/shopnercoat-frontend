import { RankerDisplayItem, TopRanker } from '@/types/ranking.types';

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

// Exactly 1 Mock Exam for Demo / Standalone Testing when results have not been published
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
  {
    id: 'ranker-4',
    position: 4,
    fullName: 'T. Ahmed',
    rollNumber: 4528644,
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
    obtainedMarks: 89.4,
    percentage: 89.4,
    remarks: 'Strong results in Biology and Chemistry core modules.',
    tags: ['Biology', 'Chemistry'],
    initials: 'TA',
  },
  {
    id: 'ranker-5',
    position: 5,
    fullName: 'F. Akter',
    rollNumber: 4528645,
    photoUrl: null, // Fallback initials square matching mockup "FA"
    obtainedMarks: 88.7,
    percentage: 88.7,
    remarks: 'Top 5% in National Pre-Med Qualifier examinations.',
    tags: ['Qualifier'],
    initials: 'FA',
  },
];

export const FALLBACK_EXAMS: PublishedExamOption[] = [MOCK_EXAM];

// Helper: Normalize incoming backend rankers from /ranking/public/:examId
export function normalizeRankers(
  backendRankers?: TopRanker[] | null,
  isMockExam = false
): RankerDisplayItem[] {
  if (isMockExam) {
    return MOCK_RANKERS;
  }

  if (backendRankers && backendRankers.length > 0) {
    return backendRankers.map((r, index) => {
      const pos = r.position || index + 1;
      const initials = r.fullName
        ? r.fullName
            .split(' ')
            .filter(Boolean)
            .map((p) => p[0])
            .slice(0, 2)
            .join('')
            .toUpperCase()
        : 'ST';

      const defaultRemarks =
        pos === 1
          ? 'Outstanding performance in Clinical Anatomy and General Medicine.'
          : pos === 2
          ? 'Exceptional aptitude in Pathology and Pharmacology.'
          : pos === 3
          ? 'Consistent high performer in Mock Exams nationwide.'
          : pos === 4
          ? 'Strong results in core medical examination modules.'
          : 'Top tiered score in National Qualifier examinations.';

      const defaultTags =
        pos === 1
          ? ['Anatomy', 'Medicine']
          : pos === 2
          ? ['Pathology']
          : pos === 3
          ? ['Mock Exams']
          : pos === 4
          ? ['Biology', 'Chemistry']
          : ['Qualifier'];

      return {
        id: r.studentId || `ranker-${pos}`,
        position: pos,
        fullName: r.fullName,
        rollNumber: r.rollNumber,
        photoUrl: r.photoUrl || null,
        obtainedMarks: r.obtainedMarks,
        percentage: Number(r.percentage.toFixed(1)),
        remarks: r.remarks || defaultRemarks,
        tags: r.tags && r.tags.length > 0 ? r.tags : defaultTags,
        initials,
      };
    });
  }

  return [];
}
