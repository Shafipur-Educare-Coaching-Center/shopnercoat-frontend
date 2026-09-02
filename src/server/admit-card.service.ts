import 'server-only';
import { serverFetch } from '@/lib/server/apiClient';
import { AdmitCard } from '@/types/admit-card.types';

export async function getMyAdmitCards(token: string): Promise<AdmitCard[]> {
  const res = await serverFetch<AdmitCard[]>('/admit-cards/me', { token, cache: 'no-store' });
  return res.data;
}

export async function verifyAdmitCard(verificationToken: string): Promise<any> {
  const res = await serverFetch<any>(`/admit-cards/verify/${verificationToken}`, { cache: 'no-store' });
  return res.data;
}
