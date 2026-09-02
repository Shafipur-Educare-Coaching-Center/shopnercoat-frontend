'use server';

import { getAccessToken } from '@/lib/server/getTokens';
import { getAdminAdmitCards } from '@/server/admit-card.service';

export async function getAdminAdmitCardsAction(examId?: string) {
  try {
    const token = await getAccessToken();
    const res = await getAdminAdmitCards(token || '', { examId: examId !== 'ALL' ? examId : undefined });
    return { success: true, admitCards: res.data || [] };
  } catch {
    return { success: false, admitCards: [] };
  }
}
