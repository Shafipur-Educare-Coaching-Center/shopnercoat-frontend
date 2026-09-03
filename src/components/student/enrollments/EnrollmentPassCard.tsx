'use client';

import React from 'react';
import Link from 'next/link';
import { ExamEnrollmentAdmin } from '@/types/exam.types';
import { AdmitCard } from '@/types/admit-card.types';
import { ROUTES } from '@/constants/routes';
import {
  Download,
  Calendar,
  Clock,
  MapPin,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Layers,
  Clock3,
} from 'lucide-react';
import { formatExamDate } from '@/lib/dateUtils';

interface EnrollmentPassCardProps {
  enrollment: ExamEnrollmentAdmin;
  admitCard?: AdmitCard | null;
  candidateName: string;
  candidateRoll: number | string;
  onOpenSeatPlan: (enrollment: ExamEnrollmentAdmin, admitCard?: AdmitCard | null) => void;
}

export function EnrollmentPassCard({
  enrollment,
  admitCard,
  candidateName,
  candidateRoll,
  onOpenSeatPlan,
}: EnrollmentPassCardProps) {
  const exam = enrollment.exam;
  const examTitle = exam?.title || 'National Medical Mock Test';
  const examCode = exam?.code || 'NMT';

  const formattedDate = exam?.examDate
    ? formatExamDate(exam.examDate, true)
    : 'Upcoming Test';

  const timeDisplay = exam?.startTime && exam?.endTime
    ? `${exam.startTime} – ${exam.endTime}`
    : '10:00 AM – 11:15 AM';

  const roomDisplay = admitCard?.locationSnapshot?.roomNumber || enrollment.centre?.roomNumber || 'Room Allocation Pending';
  const seatDisplay = admitCard?.locationSnapshot?.seatNumber || enrollment.centre?.seatNumber || 'Seat Pending';
  const venueDisplay = admitCard?.locationSnapshot?.centreName || enrollment.centre?.name || 'Shafipur Central Examination Hall';

  const isAdmitIssued = admitCard?.status === 'GENERATED';

  const tokenDisplay = admitCard?.verificationToken || admitCard?.admitCardNumber || `ADM-${candidateRoll}-${examCode}`;
  const downloadUrl = admitCard?.pdfUrl || (admitCard?.verificationToken
    ? `/api/bff/admit-cards/download/${admitCard.verificationToken}`
    : ROUTES.STUDENT_ADMIT_CARDS);

  const rollFormatted = candidateRoll ? String(candidateRoll).padStart(7, '0') : '---';

  return (
    <div className="w-full rounded-[28px] bg-white border border-slate-200/80 shadow-[0_10px_30px_rgba(15,118,110,0.04)] hover:shadow-[0_15px_35px_rgba(15,118,110,0.08)] transition-all overflow-hidden flex flex-col lg:flex-row items-stretch">
      
      {/* Left Main Section (Exam Logistics & Candidate Info) */}
      <div className="flex-1 p-6 sm:p-7 flex flex-col justify-between space-y-4">
        
        {/* Top Badges */}
        <div>
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <span className="font-mono text-xs font-black px-2.5 py-1 rounded-xl bg-teal-50 text-[#00695C] border border-teal-200/80 shadow-2xs">
              {examCode}
            </span>

            {isAdmitIssued ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-[11px] font-bold">
                <CheckCircle2 className="size-3 text-emerald-600" />
                Admit Pass Ready
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200/80 text-[11px] font-bold">
                <Clock3 className="size-3 text-amber-600" />
                Registration Confirmed (Admit Issuing Soon)
              </span>
            )}
          </div>

          <h3 className="font-heading font-black text-base sm:text-lg text-slate-900 leading-snug">
            {examTitle}
          </h3>

          {/* Schedule & Center */}
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <Calendar className="size-4 text-[#00796B] shrink-0" />
              <span className="font-semibold text-slate-800">{formattedDate}</span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-500">{timeDisplay}</span>
            </div>

            <div className="flex items-center gap-2">
              <MapPin className="size-4 text-[#00796B] shrink-0" />
              <span className="truncate">{venueDisplay}</span>
            </div>
          </div>
        </div>

        {/* Candidate & Location Snapshot Grid */}
        <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100 grid grid-cols-3 gap-2 text-center text-xs">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Candidate Roll
            </p>
            <p className="font-mono font-bold text-xs sm:text-sm text-slate-900 mt-0.5">
              {rollFormatted}
            </p>
          </div>

          <div className="border-x border-slate-200/60">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Hall Room
            </p>
            <p className={`font-bold text-xs sm:text-sm mt-0.5 ${isAdmitIssued ? 'text-[#00796B]' : 'text-slate-500'}`}>
              {roomDisplay}
            </p>
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Assigned Seat
            </p>
            <p className={`font-mono font-bold text-xs sm:text-sm mt-0.5 ${isAdmitIssued ? 'text-slate-900' : 'text-slate-500'}`}>
              {seatDisplay}
            </p>
          </div>
        </div>

      </div>

      {/* Perforated Divider (Dashed border with notch styling) */}
      <div className="relative flex lg:flex-col items-center justify-center">
        <div className="hidden lg:block w-px h-full border-r-2 border-dashed border-slate-200" />
        <div className="lg:hidden w-full h-px border-b-2 border-dashed border-slate-200" />
      </div>

      {/* Right Stub Section (QR Verification & Action Buttons) */}
      <div className="w-full lg:w-[280px] bg-gradient-to-br from-[#00594D] to-[#00695C] text-white p-6 sm:p-7 flex flex-col justify-between space-y-4 shrink-0">
        
        {/* Top QR Identification */}
        <div>
          <div className="flex items-center justify-between pb-2 border-b border-white/15">
            <span className="text-[10px] uppercase font-bold text-teal-200 flex items-center gap-1">
              <ShieldCheck className="size-3 text-teal-300" />
              Digital Hall Pass
            </span>
            <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full ${isAdmitIssued ? 'bg-emerald-500/30 text-emerald-200 border border-emerald-400/40' : 'bg-amber-400/20 text-amber-200 border border-amber-400/30'}`}>
              {isAdmitIssued ? 'ISSUED' : 'PENDING'}
            </span>
          </div>

          <div className="mt-3 flex items-center gap-3">
            <div className="size-14 rounded-xl bg-white p-1.5 flex items-center justify-center shadow-xs shrink-0">
              <QrCode className="size-full text-slate-900" />
            </div>

            <div className="min-w-0">
              <p className="text-[10px] uppercase font-bold text-teal-200">
                Admit Pass Token
              </p>
              <p className="font-mono font-bold text-xs text-amber-300 truncate mt-0.5">
                {tokenDisplay}
              </p>
              <p className="text-[10px] text-teal-100 truncate mt-0.5">
                {candidateName}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          {isAdmitIssued ? (
            <Link
              href={downloadUrl}
              className="w-full py-2.5 px-4 rounded-xl bg-white text-[#00594D] hover:bg-teal-50 font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Download className="size-3.5" />
              <span>Download Admit PDF</span>
            </Link>
          ) : (
            <button
              type="button"
              disabled
              className="w-full py-2.5 px-4 rounded-xl bg-white/20 text-white/80 font-bold text-xs border border-white/20 flex items-center justify-center gap-1.5 cursor-not-allowed opacity-80"
              title="Admit Card will be available for download once issued by the authority"
            >
              <Clock3 className="size-3.5 text-amber-300" />
              <span>Admit Card Issuing Soon</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => onOpenSeatPlan(enrollment, admitCard)}
            className="w-full py-2 px-4 rounded-xl bg-white/15 hover:bg-white/20 text-white font-bold text-xs border border-white/15 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Layers className="size-3.5" />
            <span>View Room Seat Map</span>
          </button>
        </div>

      </div>

    </div>
  );
}

export default EnrollmentPassCard;
