import 'server-only';
import { serverFetch } from '@/lib/server/apiClient';
import { getAccessToken } from '@/lib/server/getTokens';
import { Exam } from '@/types/exam.types';
import { ExamLeaderboardData, TopRanker } from '@/types/ranking.types';

/**
 * GET /rankings/public/:examId - Returns top rankers and leaderboard
 */
export async function getPublicRanking(examId: string): Promise<unknown> {
  const token = await getAccessToken();

  // 1. Try primary public endpoint GET /rankings/public/:examId
  try {
    const res = await serverFetch<Record<string, unknown>>(`/rankings/public/${examId}`, {
      token: token || undefined,
      cache: 'no-store',
    });

    if (res && res.data) {
      return res.data;
    }
  } catch (err) {
    console.warn(`GET /rankings/public/${examId} returned empty or failed:`, err);
  }

  // 2. Fallback: If token exists, try /results/admin/exam/:examId
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

/**
 * GET /rankings/exam/:examId/me - Returns student's individual standing
 */
export async function getStudentExamStanding(token: string, examId: string): Promise<TopRanker | null> {
  try {
    const res = await serverFetch<TopRanker>(`/rankings/exam/${examId}/me`, {
      token,
      cache: 'no-store',
    });
    return res.data || null;
  } catch (err) {
    console.warn(`GET /rankings/exam/${examId}/me failed:`, err);
    return null;
  }
}

/**
 * GET /exams - Lists all available exams
 */
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
