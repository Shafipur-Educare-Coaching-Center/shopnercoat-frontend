'use client';
import React from 'react';
import { Toaster } from 'sonner';
import { DreamPortalLoader } from '@/components/common/DreamPortalLoader';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <DreamPortalLoader>
      {children}
      <Toaster richColors position="top-right" />
    </DreamPortalLoader>
  );
}
