import { ReactNode } from 'react';
import { getAccessToken, getUserRole } from '@/lib/server/getTokens';
import { getAuthenticatedUser } from '@/server/auth.service';
import { redirect } from 'next/navigation';
import { ROUTES } from '@/constants/routes';
import { DashboardLayoutShell, DashboardUserSummary } from '@/components/layouts/dashboard';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const token = await getAccessToken();
  const role = await getUserRole();

  if (!token || role !== 'ADMIN') {
    redirect(ROUTES.ADMIN_LOGIN);
  }

  let adminUser: DashboardUserSummary = {
    name: 'System Administrator',
    role: 'ADMIN',
  };

  try {
    const user = await getAuthenticatedUser(token);
    if (user) {
      adminUser = {
        name: user.email ? user.email.split('@')[0] : 'System Admin',
        email: user.email,
        mobileNumber: user.mobileNumber,
        role: 'ADMIN',
        status: user.status,
      };
    }
  } catch (err) {
    console.warn('Could not fetch admin user details:', err);
  }

  return (
    <DashboardLayoutShell role="ADMIN" user={adminUser}>
      {children}
    </DashboardLayoutShell>
  );
}
