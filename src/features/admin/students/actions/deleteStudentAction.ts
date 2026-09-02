'use server';

import { revalidatePath } from 'next/cache';
import { getAccessToken, getUserRole } from '@/lib/server/getTokens';
import { adminDeleteStudent } from '@/server/student.service';

export async function deleteStudentAction(studentId: string) {
  try {
    const token = await getAccessToken();
    const role = await getUserRole();

    if (!token || role !== 'ADMIN') {
      return { success: false, error: 'Unauthorized: Admin privileges required.' };
    }

    const res = await adminDeleteStudent(token, studentId);

    revalidatePath('/dashboard/admin/students');
    revalidatePath('/dashboard/admin');

    return {
      success: true,
      message: res.message || 'Candidate removed from directory',
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to delete student';
    return { success: false, error: errorMsg };
  }
}
