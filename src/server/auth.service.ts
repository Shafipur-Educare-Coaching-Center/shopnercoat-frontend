import 'server-only';
import { serverFetch } from '@/lib/server/apiClient';
import { User } from '@/types/auth.types';

export async function getAuthenticatedUser(token: string): Promise<User> {
  const res = await serverFetch<User>('/auth/me', { token, cache: 'no-store' });
  return res.data;
}
