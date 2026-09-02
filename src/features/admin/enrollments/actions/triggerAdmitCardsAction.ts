'use server';

import { revalidatePath } from 'next/cache';
import { getAccessToken, getUserRole } from '@/lib/server/getTokens';
import { adminTriggerBatchAdmitCards } from '@/server/enrollment.service';

export async function triggerAdmitCardsAction(examId: string) {
  try {
    const token = await getAccessToken();
    const role = await getUserRole();

    if (!token || role !== 'ADMIN') {
      return { success: false, error: 'Unauthorized: Admin privileges required.' };
    }

    const res = await adminTriggerBatchAdmitCards(token, examId);

    revalidatePath('/dashboard/admin/enrollments');
    revalidatePath('/dashboard/admin/exams');

    return {
      success: true,
      message: res.message,
      data: res,
    };
  } catch (err: unknown) {
    let errorMsg = 'Failed to trigger Admit Card generation';

    if (err instanceof Error) {
      errorMsg = err.message;
    } else if (typeof err === 'string') {
      errorMsg = err;
    } else if (err && typeof err === 'object') {
      const anyErr = err as Record<string, unknown>;
      if (typeof anyErr.message === 'string') {
        errorMsg = anyErr.message;
      } else if (Array.isArray(anyErr.message)) {
        errorMsg = anyErr.message.join('. ');
      } else if (Array.isArray(anyErr.errors)) {
        errorMsg = anyErr.errors.join('. ');
      } else {
        errorMsg = JSON.stringify(err);
      }
    }

    return { success: false, error: String(errorMsg) };
  }
}
