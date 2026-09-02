import React from 'react';
import { Metadata } from 'next';
import { getAccessToken } from '@/lib/server/getTokens';
import { getAdminStudentList } from '@/server/student.service';
import { StudentDirectoryContainer } from '@/components/admin/students';

export const metadata: Metadata = {
  title: 'Candidate Directory | ShopnerCoat Admin',
  description:
    'Administrative management of medical admission candidates, HSC college verification, and roll number credentials.',
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface StudentsPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    status?: string;
  }>;
}

export default async function AdminStudentsPage({ searchParams }: StudentsPageProps) {
  const token = await getAccessToken();
  const params = await searchParams;

  const page = Number(params.page) || 1;
  const search = params.search || undefined;
  const status = params.status || undefined;

  const res = await getAdminStudentList(token || '', page, 20, search, status);
  const students = res.data || [];
  const total = res.meta?.total || students.length;

  return (
    <div className="w-full">
      <StudentDirectoryContainer
        initialStudents={students}
        totalCount={total}
        initialPage={page}
        initialLimit={20}
      />
    </div>
  );
}
