'use server';

import { revalidatePath } from 'next/cache';
import { getAccessToken, getUserRole } from '@/lib/server/getTokens';
import { adminTriggerBatchAdmitCards } from '@/server/admit-card.service';

export async function triggerBatchAdmitCardsAction(examId: string) {
  try {
    const token = await getAccessToken();
    const role = await getUserRole();

    if (!token || role !== 'ADMIN') {
      return { success: false, error: 'Unauthorized: Admin privileges required.' };
    }

    if (!examId) {
      return { success: false, error: 'Model Test Exam ID is required.' };
    }

    const res = await adminTriggerBatchAdmitCards(token, examId);

    revalidatePath('/dashboard/admin/admit-cards');
    revalidatePath('/dashboard/admin/enrollments');
    revalidatePath('/dashboard/admin/exams');

    return {
      success: true,
      batchId: res.batchId,
      totalStudents: res.totalStudents,
      message: res.message,
    };
  } catch (err: unknown) {
    let errorMsg = 'Failed to trigger batch Admit Card generation';
    if (err instanceof Error) {
      errorMsg = err.message;
    } else if (typeof err === 'string') {
      errorMsg = err;
    }
    return { success: false, error: errorMsg };
  }
}
