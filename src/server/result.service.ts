import 'server-only';
import { serverFetch } from '@/lib/server/apiClient';
import { Result, ResultRecordFormData, BulkResultFormData } from '@/types/result.types';
import { ApiResponse } from '@/types/api.types';

/**
 * GET /results/me - Returns the authenticated student's published results
 */
export async function getMyResults(token: string): Promise<Result[]> {
  try {
    const res = await serverFetch<Result[]>('/results/me', { token, cache: 'no-store' });
    return res.data || [];
  } catch (err) {
    console.warn('GET /results/me failed:', err);
    return [];
  }
}

/**
 * GET /results/admin/exam/:examId - Full mark sheet with all results and breakdowns
 */
export async function getAdminExamResults(token: string, examId: string): Promise<ApiResponse<Result[]>> {
  try {
    const res = await serverFetch<Result[]>(`/results/admin/exam/${examId}`, { token, cache: 'no-store' });
    if (res && res.data && Array.isArray(res.data)) {
      return res;
    }
  } catch (err) {
    console.warn(`GET /results/admin/exam/${examId} failed:`, err);
  }

  return {
    statusCode: 200,
    success: true,
    data: [],
    meta: { page: 1, limit: 100, total: 0, totalPages: 1 },
  };
}

/**
 * POST /results/admin/record - Records a single student's mark entry
 */
export async function adminRecordStudentResult(
  token: string,
  data: ResultRecordFormData
): Promise<Result> {
  const res = await serverFetch<Result>('/results/admin/record', {
    token,
    method: 'POST',
    body: JSON.stringify(data),
    cache: 'no-store',
  });
  return res.data;
}

/**
 * POST /results/admin/bulk - Bulk mark entry in a single request
 */
export async function adminBulkRecordResults(
  token: string,
  data: BulkResultFormData
): Promise<{ count: number; message: string }> {
  const res = await serverFetch<{ count: number; message?: string }>('/results/admin/bulk', {
    token,
    method: 'POST',
    body: JSON.stringify(data),
    cache: 'no-store',
  });
  return {
    count: res.data.count || data.results.length,
    message: res.data.message || `Successfully recorded marks for ${data.results.length} examinees.`,
  };
}

/**
 * POST /results/admin/exam/:examId/publish - Publishes all results for an exam with dense rankings
 */
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
