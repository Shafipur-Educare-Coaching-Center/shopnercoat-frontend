import React from 'react';
import { Metadata } from 'next';
import { getAccessToken } from '@/lib/server/getTokens';
import { getAdminAdmitCards } from '@/server/admit-card.service';
import { getExams } from '@/server/exam.service';
import { AdmitCardDirectoryContainer } from '@/components/admin/admit-cards';

export const metadata: Metadata = {
  title: 'Admit Card Management | ShopnerCoat Admin',
  description:
    'Batch admit card PDF generation, email dispatches, seat plan snapshots, and QR gate verification logs.',
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface AdmitCardsPageProps {
  searchParams: Promise<{
    search?: string;
    examId?: string;
    status?: string;
  }>;
}

export default async function AdminAdmitCardsPage({ searchParams }: AdmitCardsPageProps) {
  const token = await getAccessToken();
  const params = await searchParams;

  const [admitCardsRes, examsRes] = await Promise.all([
    getAdminAdmitCards(token || '', {
      search: params.search,
      examId: params.examId,
      status: params.status,
    }),
    getExams(),
  ]);

  const admitCards = admitCardsRes.data || [];
  const exams = examsRes.data || [];

  return (
    <div className="w-full">
      <AdmitCardDirectoryContainer
        initialAdmitCards={admitCards}
        exams={exams}
      />
    </div>
  );
}
