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

export async function adminPublishExamResults(token: string, examId: string) {
  // 1. Publish marks & calculate dense rankings
  const res = await serverFetch<Record<string, unknown>>(`/results/admin/exam/${examId}/publish`, {
    token,
    method: 'POST',
    cache: 'no-store',
  });

  // 2. Also trigger public ranking snapshot generation: POST /rankings/admin/exam/:examId/publish
  try {
    await serverFetch<Record<string, unknown>>(`/rankings/admin/exam/${examId}/publish`, {
      token,
      method: 'POST',
      cache: 'no-store',
    });
  } catch (err) {
    console.warn(`POST /rankings/admin/exam/${examId}/publish failed:`, err);
  }

  return res.data;
}
