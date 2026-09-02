'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ROUTES } from '@/constants/routes';

export async function logoutAction() {
  const cookieStore = await cookies();
  const role = cookieStore.get('userRole')?.value;

  cookieStore.delete('accessToken');
  cookieStore.delete('refreshToken');
  cookieStore.delete('userRole');
  cookieStore.delete('verifiedToken');

  if (role === 'ADMIN') {
    redirect(ROUTES.ADMIN_LOGIN);
  }

  redirect(ROUTES.LOGIN);
}
