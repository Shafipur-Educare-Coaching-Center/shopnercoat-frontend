'use server';

import { cookies } from 'next/headers';
import { API_BASE_URL } from '@/constants';
import { adminLoginSchema, AdminLoginFormValues } from '@/schemas/auth.schema';

export async function adminLoginAction(values: AdminLoginFormValues) {
  // 1. Validate payload with Zod
  const parsed = adminLoginSchema.safeParse(values);
  if (!parsed.success) {
    const errorMsg = parsed.error.issues.map((i) => i.message).join(', ');
    return { success: false, error: errorMsg || 'Invalid form credentials' };
  }

  const { mobileNumber, password, rememberMe } = parsed.data;

  try {
    // 2. Call backend POST /auth/login with mobileNumber (accepts email, mobile, or roll number)
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mobileNumber,
        password,
      }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
        return {
          success: false,
          error: data.errors
            .map((e: { field?: string; message: string }) => e.message || `${e.field}: error`)
            .join(', '),
        };
      }
      return { success: false, error: data.message || 'Authentication failed. Please check your credentials.' };
    }

    const user = data?.data?.user;
    const accessToken = data?.data?.accessToken;
    const refreshToken = data?.data?.refreshToken;

    if (!user || !accessToken) {
      return { success: false, error: 'Invalid response structure received from authentication server.' };
    }

    // 3. Enforce Administrator role
    if (user.role !== 'ADMIN') {
      return { success: false, error: 'Access denied: Administrator privileges required to access this portal.' };
    }

    // 4. Store secure HTTP-Only cookies
    const cookieStore = await cookies();
    const maxAge = rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24; // 30 days vs 1 day

    cookieStore.set('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge,
    });

    if (refreshToken) {
      cookieStore.set('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });
    }

    cookieStore.set('userRole', 'ADMIN', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge,
    });

    return {
      success: true,
      user,
    };
  } catch (error) {
    return { success: false, error: 'Authentication failed due to a network error. Please try again.' };
  }
}
