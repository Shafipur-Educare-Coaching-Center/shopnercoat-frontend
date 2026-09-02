export type ResultStatus = 'PASSED' | 'FAILED';

export interface ResultStudent {
  id: string;
  fullName: string;
  rollNumber: number | string;
  registrationNumber?: number | string;
  collegeName?: string;
  photoUrl?: string;
  user?: {
    email?: string;
    mobileNumber?: string;
  };
}

export interface ResultExam {
  id: string;
  title: string;
  code: string;
  examDate?: string;
  totalMarks?: number;
  passMarks?: number;
  status?: string;
}

export interface Result {
  id: string;
  examId: string;
  studentId: string;
  enrollmentId?: string;
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
  updatedAt?: string;
  student?: ResultStudent;
  exam?: ResultExam;
}

export interface ResultRecordFormData {
  examId: string;
  studentId: string;
  totalAnswered: number;
  skipped: number;
  correctAnswered: number;
  wrongAnswered: number;
  deductMark: number;
}

export interface BulkResultEntryItem {
  studentId: string;
  studentName?: string;
  rollNumber?: number | string;
  totalAnswered: number;
  skipped: number;
  correctAnswered: number;
  wrongAnswered: number;
  deductMark: number;
}

export interface BulkResultFormData {
  examId: string;
  results: BulkResultEntryItem[];
}

export interface ResultSummaryStats {
  totalEvaluated: number;
  passedCount: number;
  failedCount: number;
  passRate: number;
  topScore: number;
  averageScore: number;
}
