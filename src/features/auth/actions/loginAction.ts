'use server';
import { cookies } from 'next/headers';
import { API_BASE_URL } from '@/constants';
import { LoginFormValues } from '@/schemas/auth.schema';

export async function loginAction(values: LoginFormValues) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      mobileNumber: values.identifier, // API handles mobile/email/roll here
      password: values.password
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Login failed');
  
  const cookieStore = await cookies();
  cookieStore.set('accessToken', data.data.accessToken, { httpOnly: true, secure: true, path: '/' });
  cookieStore.set('refreshToken', data.data.refreshToken, { httpOnly: true, secure: true, path: '/' });
  cookieStore.set('userRole', data.data.user.role, { httpOnly: true, secure: true, path: '/' });
  
  return { role: data.data.user.role };
}
