'use client';

import React, { useTransition } from 'react';
import { Exam } from '@/types/exam.types';
import { enrollStudentAction } from '@/features/student/actions/enrollAction';
import {
  X,
  Sparkles,
  Calendar,
  MapPin,
  CheckCircle2,
  Loader2,
  ShieldCheck,
} from 'lucide-react';
import { toast } from 'sonner';

interface EnrollConfirmDialogProps {
  exam: Exam | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function EnrollConfirmDialog({
  exam,
  onClose,
  onSuccess,
}: EnrollConfirmDialogProps) {
  const [isPending, startTransition] = useTransition();

  if (!exam) return null;

  const formattedDate = exam.examDate
    ? new Date(exam.examDate).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Upcoming Friday';

  const handleEnrollConfirm = () => {
    startTransition(async () => {
      const res = await enrollStudentAction(exam.id);
      if (res.success) {
        toast.success('Registration Confirmed!', {
          description: `You are enrolled in ${exam.title}. Admit Card generated.`,
        });
        onSuccess();
        onClose();
      } else {
        toast.error('Enrollment Failed', { description: res.message });
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in-50 duration-200">
      
      {/* Dialog Card */}
      <div className="w-full max-w-md bg-white rounded-[28px] sm:rounded-[32px] border border-slate-200 p-6 sm:p-8 shadow-2xl space-y-5">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="size-9 rounded-2xl bg-teal-50 text-[#00796B] flex items-center justify-center">
              <Sparkles className="size-5" />
            </div>
            <div>
              <h2 className="font-heading font-black text-lg text-slate-900 leading-tight">
                Confirm Enrollment
              </h2>
              <p className="text-xs text-slate-500">
                Central Medical Mock Test Series
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Exam Snapshot Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-[#00594D] to-[#00796B] text-white space-y-3 shadow-md">
          <div className="flex items-center justify-between pb-2 border-b border-white/15">
            <span className="font-mono text-xs font-bold text-teal-300">
              {exam.code}
            </span>
            <span className="text-[10px] uppercase font-bold text-teal-200 bg-white/10 px-2 py-0.5 rounded-full">
              Live Offline Mock
            </span>
          </div>

          <div>
            <h3 className="font-heading font-bold text-sm sm:text-base text-white leading-snug">
              {exam.title}
            </h3>
            <div className="mt-2 space-y-1 text-xs text-teal-100">
              <div className="flex items-center gap-1.5">
                <Calendar className="size-3.5 text-teal-300" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="size-3.5 text-teal-300" />
                <span>Shafipur Central Examination Hall</span>
              </div>
            </div>
          </div>
        </div>

        {/* Policy notice */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600 flex items-start gap-2">
          <ShieldCheck className="size-4 text-emerald-600 shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed">
            By confirming enrollment, a verified seat will be reserved and your digital Admit Card will be prepared with instant QR verification.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="flex-1 py-3 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleEnrollConfirm}
            disabled={isPending}
            className="flex-1 py-3 rounded-2xl bg-[#00695C] hover:bg-[#00594D] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {isPending ? (
              <>
                <Loader2 className="size-4 animate-spin text-white" />
                <span>Reserving Seat...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="size-4" />
                <span>Confirm &amp; Register</span>
              </>
            )}
          </button>
        </div>

      </div>

    </div>
  );
}

export default EnrollConfirmDialog;
