import { ReactNode } from 'react';
import { getAccessToken } from '@/lib/server/getTokens';
import { getStudentMe } from '@/server/student.service';
import { redirect } from 'next/navigation';
import { ROUTES } from '@/constants/routes';
import { DashboardLayoutShell, DashboardUserSummary } from '@/components/layouts/dashboard';

export default async function StudentLayout({ children }: { children: ReactNode }) {
  const token = await getAccessToken();
  if (!token) redirect(ROUTES.LOGIN);

  let studentUser: DashboardUserSummary = {
    name: 'Candidate Student',
    role: 'STUDENT',
  };

  try {
    const student = await getStudentMe(token);
    if (student) {
      studentUser = {
        name: student.fullName || 'Candidate Student',
        email: student.user?.email,
        mobileNumber: student.user?.mobileNumber,
        rollNumber: student.rollNumber,
        role: 'STUDENT',
        photoUrl: student.photoUrl,
        status: student.registrationStatus,
      };
    }
  } catch (err: unknown) {
    const statusCode = (err as { statusCode?: number })?.statusCode;
    if (statusCode === 401) redirect(ROUTES.LOGIN);
  }

  return (
    <DashboardLayoutShell role="STUDENT" user={studentUser}>
      {children}
    </DashboardLayoutShell>
  );
}
