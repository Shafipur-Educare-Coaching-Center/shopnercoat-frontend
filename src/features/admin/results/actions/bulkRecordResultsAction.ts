'use server';

import { revalidatePath } from 'next/cache';
import { getAccessToken, getUserRole } from '@/lib/server/getTokens';
import { adminBulkRecordResults } from '@/server/result.service';
import { BulkResultFormData } from '@/types/result.types';

export async function bulkRecordResultsAction(formData: BulkResultFormData) {
  try {
    const token = await getAccessToken();
    const role = await getUserRole();

    if (!token || role !== 'ADMIN') {
      return { success: false, error: 'Unauthorized: Admin privileges required.' };
    }

    if (!formData.examId) {
      return { success: false, error: 'Model Test Exam ID is required.' };
    }

    if (!formData.results || formData.results.length === 0) {
      return { success: false, error: 'No student mark entries provided.' };
    }

    const cleanedResults = formData.results.map((r) => ({
      studentId: r.studentId.trim(),
      totalAnswered: Number(r.totalAnswered) || 0,
      skipped: Number(r.skipped) || 0,
      correctAnswered: Number(r.correctAnswered) || 0,
      wrongAnswered: Number(r.wrongAnswered) || 0,
      deductMark: Number(r.deductMark) || 0,
    }));

    const res = await adminBulkRecordResults(token, {
      examId: formData.examId.trim(),
      results: cleanedResults,
    });

    revalidatePath('/dashboard/admin/results');
    revalidatePath('/dashboard/admin/exams');
    revalidatePath('/ranking');

    return {
      success: true,
      message: res.message,
      count: res.count,
    };
  } catch (err: unknown) {
    let errorMsg = 'Failed to record bulk student marks';
    if (err instanceof Error) {
      errorMsg = err.message;
    } else if (typeof err === 'string') {
      errorMsg = err;
    }
    return { success: false, error: errorMsg };
  }
}
