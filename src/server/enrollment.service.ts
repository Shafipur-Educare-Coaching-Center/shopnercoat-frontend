import 'server-only';
import { serverFetch } from '@/lib/server/apiClient';
import { ExamEnrollment } from '@/types/enrollment.types';

export async function getMyEnrollments(token: string): Promise<ExamEnrollment[]> {
  const res = await serverFetch<ExamEnrollment[]>('/enrollments/me', { token, cache: 'no-store' });
  return res.data;
}

export async function getExamEnrollments(token: string, examId: string, page = 1, limit = 10) {
  return serverFetch<ExamEnrollment[]>(`/enrollments/admin/exam/${examId}`, {
    token,
    params: { page, limit },
    cache: 'no-store',
  });
}
