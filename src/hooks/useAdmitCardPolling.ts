'use client';
import { useEffect } from 'react';
import { AdmitCard } from '@/types/admit-card.types';
import { useBffFetch } from './useBffFetch';

export function useAdmitCardPolling(initialCards: AdmitCard[]) {
  const needsPolling = initialCards.some(card => card.status === 'REGENERATING' || card.status === 'GENERATED' /* some logic depending on backend spec for processing */);
  // Actually, wait, backend returns GENERATED for success. If it's regenerating, it might be PROCESSING.
  // The backend spec says AdmitCardStatus: 'GENERATED' | 'REVOKED' | 'REGENERATING'.
  
  const isPolling = initialCards.some(c => c.status === 'REGENERATING');
  
  const { data, refetch } = useBffFetch<AdmitCard[]>(isPolling ? '/api/bff/admit-cards/me' : null);

  useEffect(() => {
    if (!isPolling) return;
    const interval = setInterval(() => {
      refetch();
    }, 5000);
    return () => clearInterval(interval);
  }, [isPolling, refetch]);

  return data || initialCards;
}
