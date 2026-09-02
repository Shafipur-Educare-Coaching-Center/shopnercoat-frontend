import 'server-only';
import { serverFetch } from '@/lib/server/apiClient';
import { Exam } from '@/types/exam.types';

export async function getExams(params?: { status?: string; page?: number; limit?: number }) {
  const res = await serverFetch<Exam[]>('/exams', { params, next: { revalidate: 60 } });
  return res;
}

export async function getExamDetail(id: string): Promise<Exam> {
  const res = await serverFetch<Exam>(`/exams/${id}`, { next: { revalidate: 60 } });
  return res.data;
}
