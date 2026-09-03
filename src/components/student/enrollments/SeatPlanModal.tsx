'use client';

import React from 'react';
import { ExamEnrollmentAdmin } from '@/types/exam.types';
import { AdmitCard } from '@/types/admit-card.types';
import {
  X,
  MapPin,
  CheckCircle2,
  ShieldAlert,
} from 'lucide-react';

interface SeatPlanModalProps {
  enrollment: ExamEnrollmentAdmin | null;
  admitCard?: AdmitCard | null;
  onClose: () => void;
}

export function SeatPlanModal({
  enrollment,
  admitCard,
  onClose,
}: SeatPlanModalProps) {
  if (!enrollment) return null;

  const exam = enrollment.exam;
  const examTitle = exam?.title || 'National Medical Mock Test';
  const examCode = exam?.code || 'NMT';

  const roomDisplay = admitCard?.locationSnapshot?.roomNumber || enrollment.centre?.roomNumber || 'Room #04';
  const seatDisplay = admitCard?.locationSnapshot?.seatNumber || enrollment.centre?.seatNumber || 'Seat Allocated';
  const venueDisplay = admitCard?.locationSnapshot?.centreName || enrollment.centre?.name || 'Shafipur Central Examination Hall';
  const floorDisplay = enrollment.centre?.floor || admitCard?.locationSnapshot?.venue || 'Central Campus';

  // Dynamic layout display
  const benches = [
    { row: 'Row A', seats: ['S-101', 'S-102', 'S-103', 'S-104'] },
    { row: 'Row B', seats: ['S-121', 'S-122', 'S-123', 'S-124'] },
    { row: 'Row C', seats: ['S-141', seatDisplay.includes('S-') ? seatDisplay : 'S-142', 'S-143', 'S-144'], isCandidateRow: true },
    { row: 'Row D', seats: ['S-161', 'S-162', 'S-163', 'S-164'] },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in-50 duration-200">
      
      {/* Modal Card */}
      <div className="w-full max-w-lg bg-white rounded-[28px] sm:rounded-[32px] border border-slate-200 p-6 sm:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-teal-50 text-[#00695C] border border-teal-200">
                {examCode}
              </span>
              <span className="text-[11px] font-bold text-slate-400">
                Central Hall Seat Plan Map
              </span>
            </div>
            <h2 className="font-heading font-black text-lg sm:text-xl text-slate-900">
              {examTitle}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Venue & Assigned Location Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-[#00594D] to-[#00796B] text-white space-y-2 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-teal-200">
              {venueDisplay}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/15 text-white font-bold font-mono">
              {floorDisplay}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="p-2.5 rounded-xl bg-white/10">
              <p className="text-[10px] text-teal-200 uppercase font-semibold">Hall Room</p>
              <p className="font-heading font-black text-base sm:text-lg text-white mt-0.5">
                {roomDisplay}
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-white/10">
              <p className="text-[10px] text-teal-200 uppercase font-semibold">Assigned Seat</p>
              <p className="font-heading font-black text-base sm:text-lg text-amber-300 font-mono mt-0.5">
                {seatDisplay}
              </p>
            </div>
          </div>
        </div>

        {/* Visual Room Grid */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Hall Room Visual Layout
            </p>
            <span className="text-[10px] text-slate-400 font-medium">
              Front Podium (Teacher Desk) ↑
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
            {benches.map((bench, idx) => (
              <div key={idx} className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold text-slate-400 w-12">
                  {bench.row}
                </span>

                <div className="flex-1 grid grid-cols-4 gap-1.5">
                  {bench.seats.map((seat) => {
                    const isCandidate = seat === seatDisplay || (seatDisplay.includes(seat));
                    return (
                      <div
                        key={seat}
                        className={`py-1.5 px-1 rounded-lg text-center font-mono text-[10px] font-bold transition-all ${
                          isCandidate
                            ? 'bg-[#00796B] text-white ring-2 ring-[#00796B]/30 shadow-xs'
                            : 'bg-white border border-slate-200/80 text-slate-500'
                        }`}
                      >
                        {seat}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Entry Regulations */}
        <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-200/80 text-xs text-rose-900 space-y-1">
          <div className="flex items-center gap-1.5 font-bold">
            <ShieldAlert className="size-4 text-rose-600 shrink-0" />
            <span>Hall Entry &amp; Biometric Scan Protocol:</span>
          </div>
          <p className="text-[11px] leading-relaxed text-rose-800/90 pl-1">
            Exam gates close exactly 15 minutes before the test begins. Mobile phones, smartwatches, and programmable calculators are strictly prohibited inside the hall.
          </p>
        </div>

        {/* Close Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
          >
            Close Seat Plan Map
          </button>
        </div>

      </div>

    </div>
  );
}

export default SeatPlanModal;
