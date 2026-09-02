'use server';

import { revalidatePath } from 'next/cache';
import { getAccessToken, getUserRole } from '@/lib/server/getTokens';
import { adminPublishExamResults } from '@/server/result.service';

export async function publishRankingSnapshotAction(examId: string) {
  try {
    const token = await getAccessToken();
    const role = await getUserRole();

    if (!token || role !== 'ADMIN') {
      return { success: false, error: 'Unauthorized: Admin privileges required.' };
    }

    if (!examId) {
      return { success: false, error: 'Model Test Exam ID is required.' };
    }

    const res = await adminPublishExamResults(token, examId);

    revalidatePath('/dashboard/admin/rankings');
    revalidatePath('/dashboard/admin/results');
    revalidatePath('/dashboard/admin/exams');
    revalidatePath('/ranking');

    return {
      success: true,
      message: 'Top-10 Ranking Snapshot published to public leaderboard!',
      data: res,
    };
  } catch (err: unknown) {
    let errorMsg = 'Failed to publish ranking snapshot';
    if (err instanceof Error) {
      errorMsg = err.message;
    } else if (typeof err === 'string') {
      errorMsg = err;
    }
    return { success: false, error: errorMsg };
  }
}
