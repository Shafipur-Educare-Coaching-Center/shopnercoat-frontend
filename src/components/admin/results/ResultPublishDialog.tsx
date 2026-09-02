'use client';

import React, { useTransition } from 'react';
import { X, Loader2, Send, Trophy, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { Exam } from '@/types/exam.types';
import { publishExamResultsAction } from '@/features/admin/results/actions/publishExamResultsAction';

interface ResultPublishDialogProps {
  isOpen: boolean;
  onClose: () => void;
  exam: Exam;
  totalEvaluated: number;
  onSuccess?: () => void;
}

export function ResultPublishDialog({
  isOpen,
  onClose,
  exam,
  totalEvaluated,
  onSuccess,
}: ResultPublishDialogProps) {
  const [isPending, startTransition] = useTransition();

  if (!isOpen) return null;

  const handlePublish = () => {
    startTransition(async () => {
      const res = await publishExamResultsAction(exam.id);
      if (res.success) {
        toast.success('Results & Merit List Published', {
          description: 'Dense rankings assigned & public leaderboard snapshot updated!',
        });
        onSuccess?.();
        onClose();
      } else {
        toast.error('Publish Failed', { description: res.error });
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in-0 duration-200">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl border border-slate-100 p-6 flex flex-col gap-4 select-none">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 size-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors cursor-pointer"
        >
          <X className="size-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="size-11 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-600 shrink-0">
            <Trophy className="size-5" />
          </div>
          <div>
            <h3 className="font-heading font-black text-lg text-slate-900">
              Publish Exam Results & Merit List
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Target Test: <strong>[{exam.code}] {exam.title}</strong>
            </p>
          </div>
        </div>

        {/* Description & Tiebreaker Logic Banner */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5 text-xs text-slate-600">
          <p className="font-semibold text-slate-800">
            You are about to publish results for <strong>{totalEvaluated} examinees</strong>.
          </p>

          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Automated 4-Level Dense Tiebreaker:
            </p>
            <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono text-slate-700 bg-white p-2.5 rounded-xl border border-slate-200">
              <span className="font-bold text-indigo-700">Marks (DESC)</span>
              <ArrowRight className="size-3 text-slate-400" />
              <span className="font-bold text-teal-700">Correct (DESC)</span>
              <ArrowRight className="size-3 text-slate-400" />
              <span className="font-bold text-amber-700">Wrong (ASC)</span>
              <ArrowRight className="size-3 text-slate-400" />
              <span className="font-bold text-slate-700">Total (DESC)</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 leading-relaxed">
            • Exam status will transition to <strong>RESULT_PUBLISHED</strong>.<br />
            • Enrolled students will immediately see scores in their Student Portal.<br />
            • The Public 3D Leaderboard at <code>/ranking</code> will automatically receive the Top-3 podium snapshot.
          </p>
        </div>

        {/* Footer Actions */}
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
            onClick={handlePublish}
            disabled={isPending || totalEvaluated === 0}
            className="inline-flex items-center gap-1.5 px-6 py-2 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            {isPending ? (
              <>
                <Loader2 className="size-3.5 animate-spin text-slate-950" />
                <span>Computing Rankings...</span>
              </>
            ) : (
              <>
                <Send className="size-3.5 text-slate-950" />
                <span>Confirm &amp; Publish</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
