export type ResultStatus = 'PASSED' | 'FAILED';

export interface Result {
  id: string;
  examId: string;
  studentId: string;
  enrollmentId: string;
  totalAnswered: number;
  skipped: number;
  correctAnswered: number;
  wrongAnswered: number;
  deductMark: number;
  obtainedMarks: number;
  percentage: number;
  position: number | null;
  resultStatus: ResultStatus;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}
