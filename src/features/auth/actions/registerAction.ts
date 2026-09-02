'use server';
import { cookies } from 'next/headers';
import { API_BASE_URL } from '@/constants';
import { RegisterFormValues, VerifyOtpFormValues } from '@/schemas/auth.schema';

export async function registerAction(values: RegisterFormValues) {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(values),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Registration failed');
  
  // Store mobile in a cookie to prepopulate verify-otp page
  const cookieStore = await cookies();
  cookieStore.set('pendingMobile', values.mobileNumber, { maxAge: 300, path: '/' });
  return data;
}

export async function verifyOtpAction(values: VerifyOtpFormValues) {
  const res = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(values),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'OTP Verification failed');
  
  const cookieStore = await cookies();
  cookieStore.set('verifiedToken', data.data.verifiedToken, { httpOnly: true, secure: true, path: '/' });
  cookieStore.delete('pendingMobile');
  return data;
}

export async function resendOtpAction(mobileNumber: string) {
  const res = await fetch(`${API_BASE_URL}/auth/resend-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mobileNumber }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to resend OTP');
  return data;
}
