import 'server-only';
import { cookies } from 'next/headers';

export async function getAccessToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get('accessToken')?.value;
}

export async function getRefreshToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get('refreshToken')?.value;
}

export async function getUserRole(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get('userRole')?.value;
}

export async function getVerifiedToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get('verifiedToken')?.value;
}

export async function clearAuthCookies(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete('accessToken');
  cookieStore.delete('refreshToken');
  cookieStore.delete('userRole');
  cookieStore.delete('verifiedToken');
}

