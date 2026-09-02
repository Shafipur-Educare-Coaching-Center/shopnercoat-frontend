import React from 'react';
import { Metadata } from 'next';
import { verifyAdmitCardToken } from '@/server/admit-card.service';
import { CheckCircle2, XCircle, ShieldCheck, Calendar, Building2, User } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Admit Card Verification | Gate Entrance Check',
  description: 'Public QR Code Admit Card Verification for Exam Hall Invigilators.',
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface VerifyPageProps {
  params: Promise<{ token: string }>;
}

export default async function AdmitCardVerifyPage({ params }: VerifyPageProps) {
  const { token } = await params;
  const verification = await verifyAdmitCardToken(token);

  const isValid = verification?.valid ?? false;

  return (
    <div className="min-h-screen w-full bg-slate-950 flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center relative overflow-hidden">
        
        {/* Top Status Header */}
        <div className="w-full flex items-center justify-between pb-4 border-b border-slate-800/80 mb-6">
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-5 text-indigo-400" />
            <span className="font-heading font-black text-sm text-slate-200 uppercase tracking-wider">
              Gate Entrance Verification
            </span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-[10px] font-mono text-slate-400 border border-slate-700">
            {token.slice(0, 10)}...
          </span>
        </div>

        {/* Big Pass / Fail Visual Indicator */}
        <div className="mb-6 flex flex-col items-center">
          {isValid ? (
            <div className="size-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500 flex items-center justify-center text-emerald-400 mb-3 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
              <CheckCircle2 className="size-12" />
            </div>
          ) : (
            <div className="size-20 rounded-full bg-rose-500/10 border-2 border-rose-500 flex items-center justify-center text-rose-400 mb-3 shadow-[0_0_30px_rgba(244,63,94,0.3)]">
              <XCircle className="size-12" />
            </div>
          )}

          <h2 className={`font-heading font-black text-2xl ${isValid ? 'text-emerald-400' : 'text-rose-400'}`}>
            {isValid ? 'VALID ADMIT CARD' : 'INVALID ADMIT CARD'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {isValid
              ? 'Candidate is verified & cleared for hall entry.'
              : verification.message || 'Verification token is invalid, revoked, or expired.'}
          </p>
        </div>

        {/* Candidate & Exam Dossier */}
        {isValid && (
          <div className="w-full bg-slate-850 border border-slate-800 rounded-2xl p-4 flex flex-col gap-3 text-left">
            
            {/* Candidate Photo & Name */}
            <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
              {verification.photoUrl ? (
                <img
                  src={verification.photoUrl}
                  alt={verification.studentName}
                  className="size-14 rounded-2xl object-cover border-2 border-emerald-500/50 shrink-0"
                />
              ) : (
                <div className="size-14 rounded-2xl bg-indigo-950 border border-indigo-700 text-indigo-300 font-black text-lg flex items-center justify-center shrink-0">
                  <User className="size-6" />
                </div>
              )}
              <div>
                <h3 className="font-heading font-black text-base text-white leading-snug">
                  {verification.studentName}
                </h3>
                <p className="text-xs font-mono text-emerald-400 font-bold mt-0.5">
                  Roll #{verification.rollNumber}
                </p>
              </div>
            </div>

            {/* Exam Session Meta */}
            <div className="grid grid-cols-2 gap-2 pt-1 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Building2 className="size-4 text-indigo-400 shrink-0" />
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Model Test</p>
                  <p className="font-bold text-white truncate">{verification.examCode || 'HSC-MT'}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="size-4 text-indigo-400 shrink-0" />
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Test Date</p>
                  <p className="font-bold text-white">
                    {verification.examDate ? new Date(verification.examDate).toLocaleDateString() : 'Active'}
                  </p>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Footer */}
        <p className="text-[10px] text-slate-400 mt-6 font-mono">
          ShopnerCoat Gate Entrance Verifier • Invigilator Inspection Suite
        </p>

      </div>
    </div>
  );
}
