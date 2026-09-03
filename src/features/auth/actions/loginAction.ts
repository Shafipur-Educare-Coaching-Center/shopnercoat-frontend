'use server';

import { cookies } from 'next/headers';
import { API_BASE_URL } from '@/constants';
import { loginSchema, LoginFormValues } from '@/schemas/auth.schema';
import { normalizeMobileNumber } from '@/lib/utils';

export async function loginAction(values: LoginFormValues) {
  const parsed = loginSchema.safeParse(values);
  if (!parsed.success) {
    const errorMsg = parsed.error.issues.map((i) => i.message).join(', ');
    return { success: false, error: errorMsg || 'Please provide your login credentials' };
  }

  const rawIdentifier = parsed.data.identifier.trim();
  // If it matches a phone number pattern, normalize it
  const isPhone = /^(?:\+88|88)?(01[3-9]\d{8})$/.test(rawIdentifier);
  const identifier = isPhone ? normalizeMobileNumber(rawIdentifier) : rawIdentifier;

  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mobileNumber: identifier,
        password: parsed.data.password,
      }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      if (res.status === 401) {
        return { success: false, error: 'Invalid mobile number/email or password.' };
      }
      if (res.status === 403) {
        return { success: false, error: 'Your account is currently suspended. Please contact center support.' };
      }
      if (res.status === 404) {
        return { success: false, error: 'No account found with this identifier. Please register first.' };
      }
      if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
        return {
          success: false,
          error: data.errors
            .map((e: { field?: string; message: string }) => e.message || `${e.field}: error`)
            .join(', '),
        };
      }
      return { success: false, error: data.message || 'Login failed. Please verify your credentials.' };
    }

    const accessToken = data?.data?.accessToken;
    const refreshToken = data?.data?.refreshToken;
    const user = data?.data?.user;

    if (!accessToken || !user) {
      return { success: false, error: 'Invalid authentication response from server.' };
    }

    const cookieStore = await cookies();
    cookieStore.set('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 1 day
    });

    if (refreshToken) {
      cookieStore.set('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
    }

    cookieStore.set('userRole', user.role, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24,
    });

    let needsProfileCompletion = false;

    if (user.role === 'STUDENT') {
      // Check if student profile is already completed
      try {
        const profileRes = await fetch(`${API_BASE_URL}/students/me`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          cache: 'no-store',
        });

        if (profileRes.ok) {
          const profileData = await profileRes.json();
          const status = profileData?.data?.registrationStatus;
          if (status !== 'COMPLETED') {
            needsProfileCompletion = true;
          }
        } else {
          // Profile not found or not completed yet
          needsProfileCompletion = true;
        }
      } catch {
        // In case of error checking profile, proceed to dashboard
        needsProfileCompletion = false;
      }
    }

    return {
      success: true,
      role: user.role as 'ADMIN' | 'STUDENT',
      needsProfileCompletion,
      user,
    };
  } catch (error) {
    return { success: false, error: 'Login failed due to a network error. Please try again.' };
  }
}
