'use client';

import React from 'react';
import Image from 'next/image';
import {
  X,
  Calendar,
  Clock,
  Building2,
  RefreshCw,
  Trash2,
  Download,
  Phone,
  Mail,
  GraduationCap,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ExamEnrollmentAdmin } from '@/types/exam.types';

interface EnrollmentDetailDrawerProps {
  enrollment: ExamEnrollmentAdmin | null;
  isOpen: boolean;
  onClose: () => void;
  onChangeStatus: (enrollment: ExamEnrollmentAdmin) => void;
  onDelete: (enrollment: ExamEnrollmentAdmin) => void;
}

export function EnrollmentDetailDrawer({
  enrollment,
  isOpen,
  onClose,
  onChangeStatus,
  onDelete,
}: EnrollmentDetailDrawerProps) {
  if (!isOpen || !enrollment) return null;

  const student = enrollment.student;
  const exam = enrollment.exam;
  const seat = enrollment.seatPlan;
  const admit = enrollment.admitCard;

  const formatDate = (isoStr?: string) => {
    if (!isoStr) return 'N/A';
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return isoStr.split('T')[0];
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in-0 duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-[0_20px_60px_rgba(15,23,42,0.2)] border border-slate-100 p-6 flex flex-col gap-6 select-none">
        
        {/* Top Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 size-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors cursor-pointer"
        >
          <X className="size-4" />
        </button>

        {/* 1. Candidate Dossier Header */}
        <div className="flex items-start gap-4 pt-2">
          <div className="relative size-16 sm:size-20 rounded-3xl overflow-hidden bg-slate-100 border-2 border-slate-200/80 shrink-0 shadow-sm">
            <Image
              src={student?.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
              alt={student?.fullName || 'Candidate'}
              fill
              className="object-cover"
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge
                variant={
                  enrollment.status === 'ENROLLED'
                    ? 'calmTeal'
                    : enrollment.status === 'CANCELLED'
                    ? 'calmRose'
                    : 'calmAmber'
                }
              >
                {enrollment.status.replace('_', ' ')}
              </Badge>
              <span className="font-mono text-xs font-bold text-[#37447E] bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-200/80">
                Roll: {student?.rollNumber}
              </span>
            </div>

            <h3 className="font-heading font-black text-xl text-slate-900 mt-1 truncate">
              {student?.fullName}
            </h3>
            <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
              <GraduationCap className="size-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{student?.collegeName}</span>
            </p>
          </div>
        </div>

        {/* 2. Contact Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
          <div className="flex items-center gap-2 text-slate-700">
            <Phone className="size-3.5 text-teal-600 shrink-0" />
            <span>Mobile: <strong>{student?.user?.mobileNumber || 'N/A'}</strong></span>
          </div>

          <div className="flex items-center gap-2 text-slate-700">
            <Mail className="size-3.5 text-sky-600 shrink-0" />
            <span className="truncate">Email: <strong>{student?.user?.email || 'N/A'}</strong></span>
          </div>
        </div>

        {/* 3. Enrolled Model Test Details */}
        <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 flex flex-col gap-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-mono font-bold text-indigo-700 bg-indigo-100 px-2.5 py-0.5 rounded-lg text-xs">
              {exam?.code}
            </span>
            <span className="text-slate-500 font-semibold">{exam?.totalMarks} Marks (Pass: {exam?.passMarks})</span>
          </div>

          <h4 className="font-heading font-bold text-slate-900 text-sm">
            {exam?.title}
          </h4>

          <div className="flex items-center gap-4 text-slate-600 pt-1">
            <span className="flex items-center gap-1">
              <Calendar className="size-3.5 text-indigo-500" />
              <span>Exam Date: <strong>{formatDate(exam?.examDate)}</strong></span>
            </span>

            <span className="flex items-center gap-1">
              <Clock className="size-3.5 text-indigo-500" />
              <span>Slot: <strong>{exam?.startTime} – {exam?.endTime}</strong></span>
            </span>
          </div>
        </div>

        {/* 4. Seat Allocation Snapshot */}
        <div className="p-4 rounded-2xl bg-teal-50/50 border border-teal-100 flex flex-col gap-2 text-xs">
          <h4 className="font-heading font-bold text-teal-900 uppercase text-[11px] tracking-wider flex items-center gap-1.5">
            <Building2 className="size-3.5 text-teal-600" />
            <span>Assigned Examination Hall & Seat</span>
          </h4>

          {seat ? (
            <div className="space-y-1">
              <p className="text-slate-900 font-bold text-sm">{seat.centreName}</p>
              <div className="flex items-center gap-2 pt-0.5">
                <span className="px-2.5 py-1 rounded-lg bg-teal-100 text-teal-900 font-mono font-bold">
                  {seat.roomNumber}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-teal-600 text-white font-mono font-bold">
                  {seat.seatNumber}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-slate-500 italic">No seat allocation assigned yet. Run &quot;Auto Assign Seats&quot; from Exam Management.</p>
          )}
        </div>

        {/* 5. Admit Card Status */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3 text-xs">
          <div>
            <span className="font-bold text-slate-800 block text-xs">
              Admit Card Document
            </span>
            <span className="text-slate-500 text-[11px]">
              {admit?.admitCardNumber || 'Generation pending batch dispatch'}
            </span>
          </div>

          {admit?.pdfUrl ? (
            <a
              href={admit.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-xs transition-colors"
            >
              <Download className="size-3.5" />
              <span>Download PDF</span>
            </a>
          ) : (
            <span className="px-2.5 py-1 rounded-xl bg-slate-200 text-slate-600 font-semibold text-[11px]">
              Not Generated
            </span>
          )}
        </div>

        {/* 6. Action Controls */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
          >
            Close
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onChangeStatus(enrollment);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold text-xs transition-all cursor-pointer"
            >
              <RefreshCw className="size-3.5" />
              <span>Change Status</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                onDelete(enrollment);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs transition-all cursor-pointer"
            >
              <Trash2 className="size-3.5" />
              <span>Revoke Registration</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
