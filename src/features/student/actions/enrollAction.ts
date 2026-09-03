'use server';

import { getAccessToken } from '@/lib/server/getTokens';
import { studentEnrollInExam } from '@/server/enrollment.service';
import { revalidatePath } from 'next/cache';

export async function enrollStudentAction(examId: string) {
  try {
    const token = await getAccessToken();
    if (!token) {
      return { success: false, message: 'Authentication required. Please login.' };
    }

    const enrollment = await studentEnrollInExam(token, examId);
    revalidatePath('/dashboard/student/exams');
    revalidatePath('/dashboard/student/enrollments');
    revalidatePath('/dashboard/student');

    return {
      success: true,
      message: 'Successfully enrolled into model test!',
      data: enrollment,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Enrollment failed. Please try again.';
    return { success: false, message };
  }
}
