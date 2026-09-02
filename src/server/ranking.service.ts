import 'server-only';
import { serverFetch } from '@/lib/server/apiClient';
import { PublishedRanking } from '@/types/ranking.types';

export async function getPublicRanking(examId: string): Promise<PublishedRanking> {
  const res = await serverFetch<PublishedRanking>(`/rankings/public/${examId}`, {
    next: { tags: ['rankings'], revalidate: 3600 }
  });
  return res.data;
}
