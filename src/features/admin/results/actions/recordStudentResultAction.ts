'use server';

import { revalidatePath } from 'next/cache';
import { getAccessToken, getUserRole } from '@/lib/server/getTokens';
import { adminRecordStudentResult } from '@/server/result.service';
import { ResultRecordFormData } from '@/types/result.types';

export async function recordStudentResultAction(formData: ResultRecordFormData) {
  try {
    const token = await getAccessToken();
    const role = await getUserRole();

    if (!token || role !== 'ADMIN') {
      return { success: false, error: 'Unauthorized: Admin privileges required.' };
    }

    if (!formData.examId || !formData.studentId) {
      return { success: false, error: 'Model Test Exam ID and Candidate Student ID are required.' };
    }

    const payload: ResultRecordFormData = {
      examId: formData.examId.trim(),
      studentId: formData.studentId.trim(),
      totalAnswered: Number(formData.totalAnswered) || 0,
      skipped: Number(formData.skipped) || 0,
      correctAnswered: Number(formData.correctAnswered) || 0,
      wrongAnswered: Number(formData.wrongAnswered) || 0,
      deductMark: Number(formData.deductMark) || 0,
    };

    const newResult = await adminRecordStudentResult(token, payload);

    revalidatePath('/dashboard/admin/results');
    revalidatePath('/dashboard/admin/exams');
    revalidatePath('/ranking');

    return {
      success: true,
      message: 'Student marks recorded successfully!',
      result: newResult,
    };
  } catch (err: unknown) {
    let errorMsg = 'Failed to record student marks';
    if (err instanceof Error) {
      errorMsg = err.message;
    } else if (typeof err === 'string') {
      errorMsg = err;
    }
    return { success: false, error: errorMsg };
  }
}
