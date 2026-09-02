import 'server-only';
import { serverFetch } from '@/lib/server/apiClient';
import { PublishedRanking } from '@/types/ranking.types';
import { Exam } from '@/types/exam.types';

export async function getPublicRanking(examId: string): Promise<PublishedRanking> {
  const res = await serverFetch<PublishedRanking>(`/rankings/public/${examId}`, {
    next: { tags: ['rankings'], revalidate: 60 }
  });
  return res.data;
}

export async function getPublicExamsForRanking(): Promise<Exam[]> {
  try {
    const res = await serverFetch<Exam[]>('/exams', {
      params: { limit: 20 },
      next: { tags: ['exams'], revalidate: 60 }
    });
    return res.data || [];
  } catch {
    return [];
  }
}

