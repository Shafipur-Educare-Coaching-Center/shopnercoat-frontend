'use client';

import React from 'react';
import { IdCard, CheckCircle2, Clock, MailCheck } from 'lucide-react';
import { AdmitCard } from '@/types/admit-card.types';

interface AdmitCardStatsBannerProps {
  admitCards: AdmitCard[];
}

export function AdmitCardStatsBanner({ admitCards }: AdmitCardStatsBannerProps) {
  const generatedCount = admitCards.filter((a) => a.status === 'GENERATED').length;
  const pendingCount = admitCards.filter((a) => a.status === 'PROCESSING' || a.status === 'PENDING').length;
  const emailedCount = admitCards.filter((a) => a.emailStatus === 'SENT').length;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 select-none">
      
      {/* 1. Total Issued */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-3">
        <div className="size-10 rounded-xl bg-indigo-50 border border-indigo-200/80 flex items-center justify-center text-indigo-600 shrink-0">
          <IdCard className="size-5" />
        </div>
        <div>
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Issued</p>
          <p className="font-heading font-black text-xl text-slate-900 mt-0.5">{admitCards.length}</p>
        </div>
      </div>

      {/* 2. PDFs Ready */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-3">
        <div className="size-10 rounded-xl bg-teal-50 border border-teal-200/80 flex items-center justify-center text-teal-600 shrink-0">
          <CheckCircle2 className="size-5" />
        </div>
        <div>
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">PDFs Ready</p>
          <p className="font-heading font-black text-xl text-teal-700 mt-0.5">{generatedCount}</p>
        </div>
      </div>

      {/* 3. Emails Delivered */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-3">
        <div className="size-10 rounded-xl bg-sky-50 border border-sky-200/80 flex items-center justify-center text-sky-600 shrink-0">
          <MailCheck className="size-5" />
        </div>
        <div>
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Emails Dispatched</p>
          <p className="font-heading font-black text-xl text-sky-700 mt-0.5">{emailedCount}</p>
        </div>
      </div>

      {/* 4. Pending / In Queue */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-3">
        <div className="size-10 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-600 shrink-0">
          <Clock className="size-5" />
        </div>
        <div>
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Pending Batch</p>
          <p className="font-heading font-black text-xl text-amber-700 mt-0.5">{pendingCount}</p>
        </div>
      </div>

    </div>
  );
}
