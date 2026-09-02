'use client';

import React, { useTransition } from 'react';
import { Download, Mail, CheckCircle2, Clock, AlertTriangle, ExternalLink, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { AdmitCard } from '@/types/admit-card.types';
import { resendAdmitCardEmailAction } from '@/features/admin/admit-cards/actions/resendAdmitCardEmailAction';

interface AdmitCardTableProps {
  admitCards: AdmitCard[];
}

export function AdmitCardTable({ admitCards }: AdmitCardTableProps) {
  const [isPending, startTransition] = useTransition();

  const handleResendEmail = (admitCardId: string, candidateName?: string) => {
    startTransition(async () => {
      const res = await resendAdmitCardEmailAction(admitCardId);
      if (res.success) {
        toast.success('Email Dispatched', {
          description: `Dispatched Admit Card email to ${candidateName || 'candidate'}.`,
        });
      } else {
        toast.error('Resend Email Failed', { description: res.error });
      }
    });
  };

  if (admitCards.length === 0) {
    return (
      <div className="w-full p-12 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col items-center justify-center text-center select-none">
        <div className="size-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-500 mb-3">
          <Download className="size-8" />
        </div>
        <h3 className="font-heading font-black text-base text-slate-800">
          No Admit Cards Issued Yet
        </h3>
        <p className="text-xs text-slate-500 max-w-sm mt-1">
          Select a Model Test above and click <strong>&quot;Dispatch Batch PDFs &amp; Emails&quot;</strong> to generate candidate admit cards.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden rounded-3xl bg-white border border-slate-200/80 shadow-xs select-none">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-700">
          
          {/* Table Header */}
          <thead className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            <tr>
              <th scope="col" className="py-3.5 px-4">Examinee Candidate</th>
              <th scope="col" className="py-3.5 px-4">Admit Card #</th>
              <th scope="col" className="py-3.5 px-4">Hall & Seat Allocation</th>
              <th scope="col" className="py-3.5 px-4">PDF Document</th>
              <th scope="col" className="py-3.5 px-4">Email Status</th>
              <th scope="col" className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-slate-100">
            {admitCards.map((ac) => {
              const studentName = ac.student?.fullName || 'Examinee Candidate';
              const rollNumber = ac.student?.rollNumber || 'N/A';
              const photoUrl = ac.student?.photoUrl;
              const college = ac.student?.collegeName || 'Shafipur Educare';
              const loc = ac.locationSnapshot;

              return (
                <tr key={ac.id} className="hover:bg-slate-50/50 transition-colors">
                  
                  {/* Candidate Profile */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      {photoUrl ? (
                        <img
                          src={photoUrl}
                          alt={studentName}
                          className="size-9 rounded-xl object-cover border border-slate-200 shrink-0"
                        />
                      ) : (
                        <div className="size-9 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0">
                          {studentName.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="font-bold text-slate-900 leading-tight">{studentName}</p>
                        <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                          Roll #{rollNumber} • {college}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Admit Card Number & Verification Token */}
                  <td className="py-3.5 px-4 font-mono font-semibold text-slate-800">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-[11px]">
                      {ac.admitCardNumber || `AC-${ac.id.slice(0, 8)}`}
                    </span>
                  </td>

                  {/* Seat Plan Snapshot */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5 text-slate-700">
                      <MapPin className="size-3.5 text-indigo-500 shrink-0" />
                      <span className="font-medium">
                        {loc?.centreName || 'Central Hall'}
                        {loc?.roomNumber ? ` • Room ${loc.roomNumber}` : ''}
                        {loc?.seatNumber ? ` • Seat #${loc.seatNumber}` : ''}
                      </span>
                    </div>
                  </td>

                  {/* PDF Document Streaming Link */}
                  <td className="py-3.5 px-4">
                    {ac.pdfUrl || ac.verificationToken ? (
                      <a
                        href={ac.pdfUrl || `/api/bff/admit-cards/download/${ac.verificationToken || ac.id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-[11px] font-bold transition-colors"
                      >
                        <Download className="size-3" />
                        <span>Download PDF</span>
                        <ExternalLink className="size-2.5 ml-0.5 opacity-60" />
                      </a>
                    ) : (
                      <span className="text-[11px] text-slate-400 italic">Generating...</span>
                    )}
                  </td>

                  {/* Email Delivery Status */}
                  <td className="py-3.5 px-4">
                    {ac.emailStatus === 'SENT' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200 text-[10px] font-bold">
                        <CheckCircle2 className="size-3 text-teal-600" />
                        <span>Dispatched</span>
                      </span>
                    ) : ac.emailStatus === 'FAILED' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold">
                        <AlertTriangle className="size-3 text-rose-600" />
                        <span>Failed</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold">
                        <Clock className="size-3 text-amber-600" />
                        <span>Queued</span>
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => handleResendEmail(ac.id, studentName)}
                      disabled={isPending}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-semibold transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <Mail className="size-3 text-slate-500" />
                      <span>Resend Email</span>
                    </button>
                  </td>

                </tr>
              );
            })}
          </tbody>

        </table>
      </div>
    </div>
  );
}
