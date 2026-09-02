import 'server-only';
import { serverFetch } from '@/lib/server/apiClient';
import { Result } from '@/types/result.types';

export async function getMyResults(token: string): Promise<Result[]> {
  const res = await serverFetch<Result[]>('/results/me', { token, cache: 'no-store' });
  return res.data;
}

export async function getAdminExamResults(token: string, examId: string) {
  return serverFetch<Result[]>(`/results/admin/exam/${examId}`, { token, cache: 'no-store' });
}
