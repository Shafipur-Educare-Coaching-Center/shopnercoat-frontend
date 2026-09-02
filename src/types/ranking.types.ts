export interface TopRanker {
  position: number;
  studentId: string;
  fullName: string;
  rollNumber?: number | string;
  photoUrl?: string | null;
  obtainedMarks: number;
  percentage: number;
  remarks?: string;
  tags?: string[];
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

