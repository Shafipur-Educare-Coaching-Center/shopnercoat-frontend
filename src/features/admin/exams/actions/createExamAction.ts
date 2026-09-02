'use server';

import { revalidatePath } from 'next/cache';
import { getAccessToken, getUserRole } from '@/lib/server/getTokens';
import { adminCreateExam } from '@/server/exam.service';
import { examAdminFormSchema, ExamAdminFormValues } from '../schemas/exam-admin.schema';

export async function createExamAction(formData: ExamAdminFormValues) {
  try {
    const token = await getAccessToken();
    const role = await getUserRole();

    if (!token || role !== 'ADMIN') {
      return { success: false, error: 'Unauthorized: Admin privileges required.' };
    }

    const validated = examAdminFormSchema.parse(formData);
    const newExam = await adminCreateExam(token, validated);

    revalidatePath('/dashboard/admin/exams');
    revalidatePath('/dashboard/admin');

    return {
      success: true,
      message: `Model test "${newExam.title}" (${newExam.code}) created successfully!`,
      exam: newExam,
    };
  } catch (err: unknown) {
    let errorMsg = 'Failed to create exam';

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
