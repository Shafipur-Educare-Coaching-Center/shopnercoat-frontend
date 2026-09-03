import React from 'react';
import { Metadata } from 'next';
import { getAccessToken } from '@/lib/server/getTokens';
import { getStudentMe } from '@/server/student.service';
import { MyProfileView } from '@/components/student/profile';

export const metadata: Metadata = {
  title: 'My Profile & Account Settings | Shopner Coat Student Portal',
  description:
    'Manage your medical candidate profile details, college credentials, parent contact numbers, and security settings.',
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function StudentProfilePage() {
  const token = await getAccessToken();
  const student = await getStudentMe(token!).catch(() => null);

  return <MyProfileView student={student} />;
}
