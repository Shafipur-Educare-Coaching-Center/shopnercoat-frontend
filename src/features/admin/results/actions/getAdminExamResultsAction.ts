'use server';

import { getAccessToken } from '@/lib/server/getTokens';
import { getAdminExamResults } from '@/server/result.service';

export async function getAdminExamResultsAction(examId: string) {
  try {
    const token = await getAccessToken();
    const res = await getAdminExamResults(token || '', examId);
    return { success: true, results: res.data || [] };
  } catch {
    return { success: false, results: [] };
  }
}
