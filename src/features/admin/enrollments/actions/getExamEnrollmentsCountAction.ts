'use server';

import { getAccessToken } from '@/lib/server/getTokens';
import { getAdminEnrollments } from '@/server/enrollment.service';

export async function getExamEnrollmentsCountAction(examId: string) {
  try {
    const token = await getAccessToken();
    const res = await getAdminEnrollments(token || '', { examId });
    const count = res?.meta?.total ?? (Array.isArray(res?.data) ? res.data.length : 0);
    return { success: true, count };
  } catch {
    return { success: false, count: 0 };
  }
}
