import React from 'react';
import { Metadata } from 'next';
import { getAccessToken } from '@/lib/server/getTokens';
import { getMyAdmitCards } from '@/server/admit-card.service';
import { getStudentMe } from '@/server/student.service';
import { MyAdmitCardsView } from '@/components/student/admit-cards';

export const metadata: Metadata = {
  title: 'My Admit Cards | Shopner Coat Student Portal',
  description:
    'Download and print your official digital Admit Cards for upcoming medical admission model tests with QR verification stamps.',
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function StudentAdmitCardsPage() {
  const token = await getAccessToken();

  const [admitCards, student] = await Promise.all([
    getMyAdmitCards(token!).catch(() => []),
    getStudentMe(token!).catch(() => null),
  ]);

  return <MyAdmitCardsView admitCards={admitCards} student={student} />;
}
