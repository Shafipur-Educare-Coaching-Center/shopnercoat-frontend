'use server';

import { cookies } from 'next/headers';
import { API_BASE_URL } from '@/constants';
import {
  completeProfileSchema,
  CompleteProfileFormValues,
} from '@/schemas/student.schema';
import { normalizeMobileNumber } from '@/lib/utils';

export async function completeProfileAction(values: CompleteProfileFormValues) {
  const parsed = completeProfileSchema.safeParse(values);
  if (!parsed.success) {
    const errorMsg = parsed.error.issues.map((i) => i.message).join(', ');
    return { success: false, error: errorMsg || 'Please correct all profile fields' };
  }

  const cookieStore = await cookies();
  const token =
    cookieStore.get('verifiedToken')?.value ||
    cookieStore.get('accessToken')?.value;

  if (!token) {
    return { success: false, error: 'Verification session expired. Please verify your phone number again.' };
  }

  const payload = {
    fullName: parsed.data.fullName.trim(),
    dateOfBirth: parsed.data.dateOfBirth,
    fatherName: parsed.data.fatherName.trim(),
    motherName: parsed.data.motherName.trim(),
    parentMobileNumber: normalizeMobileNumber(parsed.data.parentMobileNumber),
    ...(parsed.data.guardianMobileNumber?.trim()
      ? { guardianMobileNumber: normalizeMobileNumber(parsed.data.guardianMobileNumber) }
      : {}),
    presentAddress: parsed.data.presentAddress.trim(),
    permanentAddress: parsed.data.permanentAddress.trim(),
    photoUrl: parsed.data.photoUrl,
    signatureUrl: parsed.data.signatureUrl,
    ...(parsed.data.collegeName?.trim() ? { collegeName: parsed.data.collegeName.trim() } : {}),
  };

  const res = await fetch(`${API_BASE_URL}/students/complete-profile`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    if (res.status === 409) {
      return { success: false, error: 'Student profile has already been completed.' };
    }
    if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
      return {
        success: false,
        error: data.errors
          .map((e: { field?: string; message: string }) => e.message || `${e.field}: error`)
          .join(', ')
      };
    }
    return { success: false, error: data.message || 'Failed to complete student profile.' };
  }

  const studentData = data?.data;
  if (!studentData) {
    return { success: false, error: 'Profile was saved but student registration details were not returned' };
  }

  // Clear the single-use verifiedToken
  cookieStore.delete('verifiedToken');

  return {
    success: true,
    data: {
      id: studentData.id,
      fullName: studentData.fullName,
      rollNumber: studentData.rollNumber,
      registrationNumber: studentData.registrationNumber,
      registrationStatus: studentData.registrationStatus,
    },
  };
}
