export interface PublishedRanking {
  id: string;
  examId: string;
  published: boolean;
  publishedAt: string;
  metadata: {
    topRankers: Array<{
      position: number;
      studentId: string;
      fullName: string;
      rollNumber: number;
      photoUrl: string;
      obtainedMarks: number;
      percentage: number;
    }>
  } | null;
  createdAt: string;
  updatedAt: string;
}
