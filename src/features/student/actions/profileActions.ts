'use server';

import { revalidatePath } from 'next/cache';
import { getAccessToken } from '@/lib/server/getTokens';
import { updateStudentMe } from '@/server/student.service';
import { serverFetch } from '@/lib/server/apiClient';
import { StudentAdminFormData, Student } from '@/types/student.types';

export interface UpdateProfileResult {
  success: boolean;
  message: string;
  data?: Student | null;
}

/**
 * Server Action: Update student profile details
 */
export async function updateStudentProfileAction(
  data: Partial<StudentAdminFormData>
): Promise<UpdateProfileResult> {
  const token = await getAccessToken();
  if (!token) {
    return { success: false, message: 'Authentication required. Please log in again.' };
  }

  try {
    const updated = await updateStudentMe(token, data);

    revalidatePath('/dashboard/student/profile');
    revalidatePath('/dashboard/student/profile', 'page');
    revalidatePath('/dashboard/student');
    revalidatePath('/dashboard/student', 'layout');

    return {
      success: true,
      message: 'Profile details updated successfully!',
      data: updated,
    };
  } catch (err: any) {
    console.error('updateStudentProfileAction error:', err);
    return {
      success: false,
      message: err?.message || 'Failed to update profile details.',
    };
  }
}

/**
 * Server Action: Change candidate account password
 */
export async function changePasswordAction(payload: {
  currentPassword: string;
  newPassword: string;
}): Promise<UpdateProfileResult> {
  const token = await getAccessToken();
  if (!token) {
    return { success: false, message: 'Authentication required. Please log in again.' };
  }

  try {
    const res = await serverFetch<Record<string, unknown>>('/auth/change-password', {
      token,
      method: 'POST',
      body: JSON.stringify(payload),
      cache: 'no-store',
    });

    return {
      success: true,
      message: (res?.message as string) || 'Password updated successfully!',
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || 'Failed to update account password.',
    };
  }
}
