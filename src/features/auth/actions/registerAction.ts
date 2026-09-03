'use server';

import { cookies } from 'next/headers';
import { API_BASE_URL } from '@/constants';
import {
  registerSchema,
  verifyOtpSchema,
  RegisterFormValues,
  VerifyOtpFormValues,
} from '@/schemas/auth.schema';
import { normalizeMobileNumber } from '@/lib/utils';

export async function registerAction(values: RegisterFormValues) {
  const parsed = registerSchema.safeParse(values);
  if (!parsed.success) {
    const errorMsg = parsed.error.issues.map((i) => i.message).join(', ');
    return { success: false, error: errorMsg || 'Invalid registration data' };
  }

  const normalizedMobile = normalizeMobileNumber(parsed.data.mobileNumber);

  const payload = {
    fullName: parsed.data.fullName.trim(),
    dateOfBirth: parsed.data.dateOfBirth,
    mobileNumber: normalizedMobile,
    password: parsed.data.password,
    ...(parsed.data.email?.trim() ? { email: parsed.data.email.trim().toLowerCase() } : {}),
  };

  try {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      if (res.status === 409) {
        return {
          success: false,
          error: data.message || 'Mobile number or email is already registered. Please login instead.',
        };
      }
      if (res.status === 429) {
        return {
          success: false,
          error: data.message || 'OTP cooldown active. Please wait 60 seconds before trying again.',
        };
      }
      if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
        return {
          success: false,
          error: data.errors
            .map((e: { field?: string; message: string }) => e.message || `${e.field}: error`)
            .join(', '),
        };
      }
      return { success: false, error: data.message || 'Registration failed. Please verify your details.' };
    }

    // Store normalized mobile in cookie for OTP page
    const cookieStore = await cookies();
    cookieStore.set('pendingMobile', normalizedMobile, {
      maxAge: 600, // 10 minutes
      path: '/',
      httpOnly: false, // readable client-side for displaying masked number
      sameSite: 'lax',
    });

    return {
      success: true,
      message: data.message || 'Verification code sent via SMS',
      mobileNumber: normalizedMobile,
    };
  } catch (error) {
    return { success: false, error: 'Registration failed due to a network error. Please try again.' };
  }
}

export async function verifyOtpAction(values: VerifyOtpFormValues) {
  const parsed = verifyOtpSchema.safeParse(values);
  if (!parsed.success) {
    const errorMsg = parsed.error.issues.map((i) => i.message).join(', ');
    throw new Error(errorMsg || 'Invalid OTP');
  }

  const normalizedMobile = normalizeMobileNumber(parsed.data.mobileNumber);

  const res = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      mobileNumber: normalizedMobile,
      otp: parsed.data.otp.trim(),
    }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
      throw new Error(
        data.errors
          .map((e: { field?: string; message: string }) => e.message || `${e.field}: error`)
          .join(', ')
      );
    }
    throw new Error(data.message || 'Invalid or expired OTP code');
  }

  const verifiedToken = data?.data?.verifiedToken;
  if (!verifiedToken) {
    throw new Error('Verification token missing in server response');
  }

  const cookieStore = await cookies();
  cookieStore.set('verifiedToken', verifiedToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 3600, // 1 hour to complete profile
  });
  cookieStore.delete('pendingMobile');

  return {
    success: true,
    message: data.message || 'Mobile number verified successfully',
    verifiedToken,
  };
}

export async function resendOtpAction(mobileNumber: string) {
  const normalizedMobile = normalizeMobileNumber(mobileNumber);

  const res = await fetch(`${API_BASE_URL}/auth/resend-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mobileNumber: normalizedMobile }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    if (res.status === 429) {
      throw new Error('Please wait 60 seconds before requesting another OTP.');
    }
    throw new Error(data.message || 'Failed to resend OTP code');
  }

  return {
    success: true,
    message: data.message || 'New OTP sent to your phone number.',
  };
}
