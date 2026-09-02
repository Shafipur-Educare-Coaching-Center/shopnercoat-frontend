'use server';

import { revalidatePath } from 'next/cache';
import { getAccessToken, getUserRole } from '@/lib/server/getTokens';
import { adminResendAdmitCardEmail } from '@/server/admit-card.service';

export async function resendAdmitCardEmailAction(admitCardId: string) {
  try {
    const token = await getAccessToken();
    const role = await getUserRole();

    if (!token || role !== 'ADMIN') {
      return { success: false, error: 'Unauthorized: Admin privileges required.' };
    }

    if (!admitCardId) {
      return { success: false, error: 'Admit Card ID is required.' };
    }

    const res = await adminResendAdmitCardEmail(token, admitCardId);

    revalidatePath('/dashboard/admin/admit-cards');

    return {
      success: true,
      message: res.message,
    };
  } catch (err: unknown) {
    let errorMsg = 'Failed to resend admit card email';
    if (err instanceof Error) {
      errorMsg = err.message;
    } else if (typeof err === 'string') {
      errorMsg = err;
    }
    return { success: false, error: errorMsg };
  }
}
