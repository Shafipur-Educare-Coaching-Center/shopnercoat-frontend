'use client';

import React from 'react';
import { AdmitCard } from '@/types/admit-card.types';
import {
  X,
  Printer,
  Download,
  QrCode,
  ShieldCheck,
  Building2,
  Calendar,
  Clock,
  MapPin,
} from 'lucide-react';

interface AdmitCardPrintModalProps {
  admitCard: AdmitCard | null;
  studentName: string;
  rollNumber: number | string;
  onClose: () => void;
}

export function AdmitCardPrintModal({
  admitCard,
  studentName,
  rollNumber,
  onClose,
}: AdmitCardPrintModalProps) {
  if (!admitCard) return null;

  const exam = admitCard.exam;
  const examTitle = exam?.title || 'National Medical Mock Test';
  const examCode = exam?.code || 'NMT';

  const formattedDate = exam?.examDate
    ? new Date(exam.examDate).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Friday, Session 2026';

  const timeDisplay = exam?.startTime && exam?.endTime
    ? `${exam.startTime} - ${exam.endTime}`
    : '10:00 AM - 11:00 AM';

  const roomDisplay = admitCard.locationSnapshot?.roomNumber || 'Room #04';
  const seatDisplay = admitCard.locationSnapshot?.seatNumber || 'Seat S-142';
  const venueDisplay = admitCard.locationSnapshot?.centreName || 'Shafipur Central Examination Hall';
  const tokenDisplay = admitCard.verificationToken || admitCard.admitCardNumber || `ADM-${rollNumber}-${examCode}`;
  const rollFormatted = rollNumber ? String(rollNumber).padStart(7, '0') : '9242808';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in-50 duration-200">
      
      {/* Modal Container */}
      <div className="w-full max-w-2xl bg-white rounded-[28px] sm:rounded-[32px] border border-slate-200 p-6 sm:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        
        {/* Controls Row */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-teal-50 text-[#00695C] border border-teal-200">
              {examCode}
            </span>
            <span className="text-xs font-bold text-slate-700">Printable Admission Pass</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-xl bg-[#00796B] hover:bg-[#00594D] text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Printer className="size-3.5" />
              <span>Print Document</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Paper Card */}
        <div className="p-6 sm:p-8 rounded-2xl border-2 border-slate-900 bg-[#FCFDFD] space-y-6 text-slate-900 shadow-inner">
          
          {/* Paper Header */}
          <div className="text-center space-y-1 pb-4 border-b-2 border-slate-900">
            <h2 className="font-heading font-black text-lg sm:text-xl tracking-tight uppercase">
              Central Medical Examination Board
            </h2>
            <p className="text-xs font-bold text-slate-600 uppercase tracking-widest">
              Shafipur Educare Coaching Center • Official Admit Pass
            </p>
            <div className="pt-2 flex items-center justify-center gap-2">
              <span className="px-3 py-0.5 rounded-full bg-slate-900 text-white text-[11px] font-mono font-bold tracking-wider">
                {tokenDisplay}
              </span>
            </div>
          </div>

          {/* Exam Title Banner */}
          <div className="p-3 rounded-xl bg-slate-100 border border-slate-200 text-center">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Examination</p>
            <h3 className="font-heading font-black text-sm sm:text-base text-slate-900 mt-0.5">
              {examTitle}
            </h3>
          </div>

          {/* Candidate & Venue Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-2 p-3.5 rounded-xl bg-white border border-slate-200">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Candidate Information</p>
              <div>
                <p className="text-slate-500 text-[11px]">Full Name:</p>
                <p className="font-bold text-slate-900">{studentName}</p>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-500 text-[11px]">Roll Number:</p>
                  <p className="font-mono font-bold text-slate-900">{rollFormatted}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-[11px]">Academic Track:</p>
                  <p className="font-bold text-slate-900">Medical Aspirant</p>
                </div>
              </div>
            </div>

            <div className="space-y-2 p-3.5 rounded-xl bg-white border border-slate-200">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Hall &amp; Seat Allocation</p>
              <div>
                <p className="text-slate-500 text-[11px]">Venue:</p>
                <p className="font-bold text-slate-900">{venueDisplay}</p>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-500 text-[11px]">Hall Room:</p>
                  <p className="font-bold text-[#00796B]">{roomDisplay}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-[11px]">Assigned Seat:</p>
                  <p className="font-mono font-bold text-[#00796B]">{seatDisplay}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Schedule Strip */}
          <div className="p-3.5 rounded-xl bg-teal-50/60 border border-teal-200 flex items-center justify-between text-xs text-[#00594D]">
            <div className="flex items-center gap-2">
              <Calendar className="size-4 text-[#00796B]" />
              <span className="font-bold">{formattedDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="size-4 text-[#00796B]" />
              <span className="font-bold">{timeDisplay}</span>
            </div>
          </div>

          {/* Signatures & QR Code */}
          <div className="pt-4 border-t-2 border-slate-900 flex items-end justify-between gap-4">
            <div className="text-center w-36">
              <div className="h-10 border-b border-dashed border-slate-400" />
              <p className="text-[10px] font-bold text-slate-600 mt-1">Candidate Signature</p>
            </div>

            <div className="size-16 rounded-xl bg-white border border-slate-200 p-1 flex items-center justify-center">
              <QrCode className="size-full text-slate-900" />
            </div>

            <div className="text-center w-36">
              <div className="h-10 border-b border-dashed border-slate-400" />
              <p className="text-[10px] font-bold text-slate-600 mt-1">Authorized Controller</p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

export default AdmitCardPrintModal;
