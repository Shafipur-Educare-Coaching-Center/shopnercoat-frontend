import 'server-only';
import { cookies } from 'next/headers';

export async function getAccessToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get('accessToken')?.value;
}

export async function getVerifiedToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get('verifiedToken')?.value;
}
