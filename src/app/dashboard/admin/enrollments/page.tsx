import React from 'react';
import { Metadata } from 'next';
import { getAccessToken } from '@/lib/server/getTokens';
import { getAdminEnrollments } from '@/server/enrollment.service';
import { getExams } from '@/server/exam.service';
import { EnrollmentDirectoryContainer } from '@/components/admin/enrollments';

export const metadata: Metadata = {
  title: 'Candidate Enrollments | ShopnerCoat Admin',
  description:
    'Administrative management of candidate model test registrations, manual enrollments, admit card dispatches, and status updates.',
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface EnrollmentsPageProps {
  searchParams: Promise<{
    search?: string;
    examId?: string;
    status?: string;
  }>;
}

export default async function AdminEnrollmentsPage({ searchParams }: EnrollmentsPageProps) {
  const token = await getAccessToken();
  const params = await searchParams;

  const [enrollmentsRes, examsRes] = await Promise.all([
    getAdminEnrollments(token || '', {
      search: params.search,
      examId: params.examId,
      status: params.status,
    }),
    getExams(),
  ]);

  const enrollments = enrollmentsRes.data || [];
  const exams = examsRes.data || [];

  return (
    <div className="w-full">
      <EnrollmentDirectoryContainer
        initialEnrollments={enrollments}
        exams={exams}
      />
    </div>
  );
}
