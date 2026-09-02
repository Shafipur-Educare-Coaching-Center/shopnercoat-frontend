'use server';

import { revalidatePath } from 'next/cache';
import { getAccessToken, getUserRole } from '@/lib/server/getTokens';
import { adminUpdateEnrollmentStatus } from '@/server/enrollment.service';
import { EnrollmentStatus } from '@/types/exam.types';

export async function updateEnrollmentAction(
  enrollmentId: string,
  status: EnrollmentStatus
) {
  try {
    const token = await getAccessToken();
    const role = await getUserRole();

    if (!token || role !== 'ADMIN') {
      return { success: false, error: 'Unauthorized: Admin privileges required.' };
    }

    const updated = await adminUpdateEnrollmentStatus(token, enrollmentId, status);

    revalidatePath('/dashboard/admin/enrollments');
    revalidatePath('/dashboard/admin/exams');
    revalidatePath('/dashboard/admin');

    return {
      success: true,
      message: `Enrollment status updated to ${status.replace('_', ' ')}!`,
      enrollment: updated,
    };
  } catch (err: unknown) {
    let errorMsg = 'Failed to update enrollment status';

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
