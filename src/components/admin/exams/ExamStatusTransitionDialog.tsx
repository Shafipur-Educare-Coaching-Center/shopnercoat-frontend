'use client';

import React, { useState, useTransition } from 'react';
import { RefreshCw, Loader2, X } from 'lucide-react';
import { toast } from 'sonner';
import { updateExamAction } from '@/features/admin/exams/actions/updateExamAction';
import { Exam, ExamStatus } from '@/types/exam.types';

interface ExamStatusTransitionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  exam: Exam | null;
  onSuccess?: (updatedExam?: Exam) => void;
}

export function ExamStatusTransitionDialog({
  isOpen,
  onClose,
  exam,
  onSuccess,
}: ExamStatusTransitionDialogProps) {
  const [isPending, startTransition] = useTransition();
  const [targetStatus, setTargetStatus] = useState<ExamStatus>(exam?.status || 'REGISTRATION_OPEN');

  if (!isOpen || !exam) return null;

  const statuses: { value: ExamStatus; label: string; desc: string }[] = [
    { value: 'DRAFT', label: 'Draft', desc: 'Hidden from public & students' },
    { value: 'REGISTRATION_OPEN', label: 'Registration Open', desc: 'Accepting candidate applications' },
    { value: 'REGISTRATION_CLOSED', label: 'Registration Closed', desc: 'Deadline passed, ready for seat plan' },
    { value: 'UPCOMING', label: 'Upcoming', desc: 'Admit cards ready for candidates' },
    { value: 'ONGOING', label: 'Ongoing Live', desc: 'Exam session in progress' },
    { value: 'COMPLETED', label: 'Completed', desc: 'Awaiting mark evaluation' },
    { value: 'RESULT_PUBLISHED', label: 'Result Published', desc: 'Merit rankings visible to students' },
    { value: 'CANCELLED', label: 'Cancelled', desc: 'Session officially cancelled' },
  ];

  const handleTransition = () => {
    startTransition(async () => {
      const res = await updateExamAction(exam.id, { status: targetStatus });
      if (res.success) {
        toast.success('Exam Lifecycle Updated', {
          description: `Status changed to ${targetStatus.replace('_', ' ')}`,
        });
        onSuccess?.(res.exam);
        onClose();
      } else {
        toast.error('Status Update Failed', { description: res.error });
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in-0 duration-200">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-[0_20px_60px_rgba(15,23,42,0.2)] border border-slate-100 p-6 flex flex-col gap-4 select-none">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 size-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors cursor-pointer"
        >
          <X className="size-4" />
        </button>

        {/* Header Icon + Title */}
        <div className="flex items-center gap-3">
          <div className="size-11 rounded-2xl bg-sky-50 border border-sky-200/80 flex items-center justify-center text-sky-600 shrink-0">
            <RefreshCw className="size-5" />
          </div>
          <div>
            <h3 className="font-heading font-black text-lg text-slate-900">
              Change Lifecycle Status
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Current: <strong className="text-slate-800 font-mono">{exam.status}</strong>
            </p>
          </div>
        </div>

        {/* Status Selection Radios */}
        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
          {statuses.map((st) => (
            <label
              key={st.value}
              className={`p-3 rounded-2xl border flex items-start gap-3 cursor-pointer transition-all ${
                targetStatus === st.value
                  ? 'bg-teal-50/70 border-teal-300 shadow-xs'
                  : 'bg-slate-50/50 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <input
                type="radio"
                name="targetStatus"
                value={st.value}
                checked={targetStatus === st.value}
                onChange={() => setTargetStatus(st.value)}
                className="mt-0.5 text-teal-600 focus:ring-teal-500"
              />
              <div className="text-xs">
                <span className="font-bold text-slate-900 block">{st.label}</span>
                <span className="text-[11px] text-slate-500">{st.desc}</span>
              </div>
            </label>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="px-4 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleTransition}
            disabled={isPending || targetStatus === exam.status}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md transition-all active:scale-95 disabled:opacity-60 cursor-pointer"
          >
            {isPending ? (
              <>
                <Loader2 className="size-3.5 animate-spin text-white" />
                <span>Updating...</span>
              </>
            ) : (
              <span>Confirm Transition</span>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
