import React from 'react';
import { Metadata } from 'next';
import { getExams } from '@/server/exam.service';
import { ExamDirectoryContainer } from '@/components/admin/exams';

export const metadata: Metadata = {
  title: 'Model Tests & Exam Management | ShopnerCoat Admin',
  description:
    'Administrative management of medical admission model tests, exam halls, seat allocation, and registration windows.',
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface ExamsPageProps {
  searchParams: Promise<{
    search?: string;
    status?: string;
  }>;
}

export default async function AdminExamsPage({ searchParams }: ExamsPageProps) {
  const params = await searchParams;
  const res = await getExams({
    search: params.search,
    status: params.status,
  });

  const exams = res.data || [];

  return (
    <div className="w-full">
      <ExamDirectoryContainer initialExams={exams} />
    </div>
  );
}
