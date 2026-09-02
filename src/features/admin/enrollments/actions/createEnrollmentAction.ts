'use server';

import { revalidatePath } from 'next/cache';
import { getAccessToken, getUserRole } from '@/lib/server/getTokens';
import { adminCreateEnrollment } from '@/server/enrollment.service';
import {
  enrollmentAdminFormSchema,
  EnrollmentAdminFormValues,
} from '../schemas/enrollment-admin.schema';

export async function createEnrollmentAction(formData: EnrollmentAdminFormValues) {
  try {
    const token = await getAccessToken();
    const role = await getUserRole();

    if (!token || role !== 'ADMIN') {
      return { success: false, error: 'Unauthorized: Admin privileges required.' };
    }

    const validated = enrollmentAdminFormSchema.parse(formData);
    const newEnrollment = await adminCreateEnrollment(token, validated);

    revalidatePath('/dashboard/admin/enrollments');
    revalidatePath('/dashboard/admin/exams');
    revalidatePath('/dashboard/admin');

    return {
      success: true,
      message: 'Candidate enrolled in model test successfully!',
      enrollment: newEnrollment,
    };
  } catch (err: unknown) {
    let errorMsg = 'Failed to enroll candidate';

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
