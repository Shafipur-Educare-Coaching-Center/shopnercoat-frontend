'use server';

import { revalidatePath } from 'next/cache';
import { getAccessToken, getUserRole } from '@/lib/server/getTokens';
import { adminDeleteExam } from '@/server/exam.service';

export async function deleteExamAction(examId: string) {
  try {
    const token = await getAccessToken();
    const role = await getUserRole();

    if (!token || role !== 'ADMIN') {
      return { success: false, error: 'Unauthorized: Admin privileges required.' };
    }

    const res = await adminDeleteExam(token, examId);

    revalidatePath('/dashboard/admin/exams');
    revalidatePath('/dashboard/admin');

    return {
      success: true,
      message: res.message || 'Model test removed successfully',
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to delete exam';
    return { success: false, error: errorMsg };
  }
}
