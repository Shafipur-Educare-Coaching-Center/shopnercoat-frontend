import { Exam } from './exam.types';
import { AdmitCard } from './admit-card.types';
import { Result } from './result.types';

export type EnrollmentStatus = 'ENROLLED' | 'CANCELLED' | 'DISQUALIFIED';

export interface ExamEnrollment {
  id: string;
  examId: string;
  studentId: string;
  status: EnrollmentStatus;
  createdAt: string;
  updatedAt: string;
  exam?: Exam;
  admitCard?: AdmitCard;
  result?: Result;
}
