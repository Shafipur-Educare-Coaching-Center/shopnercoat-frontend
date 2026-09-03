export interface TopRanker {
  position: number;
  studentId: string;
  fullName: string;
  rollNumber?: number | string;
  collegeName?: string;
  photoUrl?: string | null;
  obtainedMarks: number;
  percentage: number;
  correctCount?: number;
  wrongCount?: number;
  remarks?: string;
  tags?: string[];
}

export interface ExamLeaderboardData {
  exam?: {
    id: string;
    title: string;
    code: string;
    examDate?: string;
    totalMarks?: number;
    passMarks?: number;
    totalExaminees?: number;
    averageScore?: number;
    topScore?: number;
  };
  topRankers: TopRanker[];
  rankings?: TopRanker[];
}

export interface PublishedRanking {
  id?: string;
  examId: string;
  published?: boolean;
  publishedAt?: string;
  metadata?: {
    topRankers: TopRanker[];
  } | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface RankerDisplayItem {
  id: string;
  position: number;
  fullName: string;
  rollNumber?: number | string;
  photoUrl?: string | null;
  obtainedMarks?: number;
  percentage: number;
  remarks: string;
  tags: string[];
  initials?: string;
}
