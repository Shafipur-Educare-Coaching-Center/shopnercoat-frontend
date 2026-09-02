import 'server-only';
import { serverFetch } from '@/lib/server/apiClient';
import { getAccessToken } from '@/lib/server/getTokens';
import { Exam } from '@/types/exam.types';

export async function getPublicRanking(examId: string): Promise<unknown> {
  const token = await getAccessToken();

  // 1. Try primary public endpoint GET /rankings/public/:examId
  try {
    const res = await serverFetch<Record<string, unknown>>(`/rankings/public/${examId}`, {
      token: token || undefined,
      cache: 'no-store',
    });

    if (res && res.data) {
      const dataObj = res.data as Record<string, unknown>;
      const metadataObj = dataObj?.metadata as Record<string, unknown> | undefined;
      const list = Array.isArray(res.data)
        ? res.data
        : Array.isArray(metadataObj?.topRankers)
        ? metadataObj.topRankers
        : dataObj?.topRankers;

      if (list && Array.isArray(list) && list.length > 0) {
        return res.data;
      }
    }
  } catch (err) {
    console.warn(`GET /rankings/public/${examId} returned empty or failed:`, err);
  }

  // 2. Fallback: If token exists (e.g. logged in Admin / Student), fetch /results/admin/exam/:examId
  if (token) {
    try {
      const res = await serverFetch<Record<string, unknown>>(`/results/admin/exam/${examId}`, {
        token,
        cache: 'no-store',
      });

      if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
        return res.data;
      }
    } catch (err) {
      console.warn(`Fallback GET /results/admin/exam/${examId} failed:`, err);
    }
  }

  return [];
}

export async function getPublicExamsForRanking(): Promise<Exam[]> {
  try {
    const res = await serverFetch<Exam[]>('/exams', {
      params: { limit: 20 },
      cache: 'no-store',
    });
    return res.data || [];
  } catch {
    return [];
  }
}
