'use server';

import { revalidatePath } from 'next/cache';
import { getAccessToken, getUserRole } from '@/lib/server/getTokens';
import { adminUpdateStudent } from '@/server/student.service';
import { studentAdminFormSchema, StudentAdminFormValues } from '../schemas/student-admin.schema';

export async function updateStudentAction(
  studentId: string,
  formData: StudentAdminFormValues
) {
  try {
    const token = await getAccessToken();
    const role = await getUserRole();

    if (!token || role !== 'ADMIN') {
      return { success: false, error: 'Unauthorized: Admin privileges required.' };
    }

    const validated = studentAdminFormSchema.parse(formData);
    const updated = await adminUpdateStudent(token, studentId, validated);

    revalidatePath('/dashboard/admin/students');
    revalidatePath('/dashboard/admin');

    return {
      success: true,
      message: `Candidate ${updated.fullName} updated successfully!`,
      student: updated,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to update student';
    return { success: false, error: errorMsg };
  }
}
