'use server';

import { revalidatePath } from 'next/cache';
import { getAccessToken, getUserRole } from '@/lib/server/getTokens';
import { adminCreateStudent } from '@/server/student.service';
import { studentAdminFormSchema, StudentAdminFormValues } from '../schemas/student-admin.schema';

export async function createStudentAction(formData: StudentAdminFormValues) {
  try {
    const token = await getAccessToken();
    const role = await getUserRole();

    if (!token || role !== 'ADMIN') {
      return { success: false, error: 'Unauthorized: Admin privileges required.' };
    }

    const validated = studentAdminFormSchema.parse(formData);
    const newStudent = await adminCreateStudent(token, validated);

    revalidatePath('/dashboard/admin/students');
    revalidatePath('/dashboard/admin');

    return {
      success: true,
      message: `Candidate ${newStudent.fullName} registered successfully! (Roll #${newStudent.rollNumber})`,
      student: newStudent,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to register student';
    return { success: false, error: errorMsg };
  }
}
