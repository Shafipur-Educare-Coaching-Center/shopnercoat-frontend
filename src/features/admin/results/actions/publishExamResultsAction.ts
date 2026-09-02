'use server';

import { revalidatePath } from 'next/cache';
import { getAccessToken, getUserRole } from '@/lib/server/getTokens';
import { adminPublishExamResults } from '@/server/result.service';

export async function publishExamResultsAction(examId: string) {
  try {
    const token = await getAccessToken();
    const role = await getUserRole();

    if (!token || role !== 'ADMIN') {
      return { success: false, error: 'Unauthorized: Admin privileges required.' };
    }

    if (!examId) {
      return { success: false, error: 'Model Test Exam ID is required.' };
    }

    const data = await adminPublishExamResults(token, examId);

    revalidatePath('/dashboard/admin/results');
    revalidatePath('/dashboard/admin/exams');
    revalidatePath('/ranking');

    return {
      success: true,
      message: 'Exam results and dense merit rankings published successfully!',
      data,
    };
  } catch (err: unknown) {
    let errorMsg = 'Failed to publish exam results';
    if (err instanceof Error) {
      errorMsg = err.message;
    } else if (typeof err === 'string') {
      errorMsg = err;
    }
    return { success: false, error: errorMsg };
  }
}
