'use client';

import React, { useTransition } from 'react';
import { AlertTriangle, Loader2, X, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { deleteEnrollmentAction } from '@/features/admin/enrollments/actions/deleteEnrollmentAction';
import { ExamEnrollmentAdmin } from '@/types/exam.types';

interface EnrollmentDeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  enrollment: ExamEnrollmentAdmin | null;
  onSuccess?: (deletedEnrollmentId: string) => void;
}

export function EnrollmentDeleteDialog({
  isOpen,
  onClose,
  enrollment,
  onSuccess,
}: EnrollmentDeleteDialogProps) {
  const [isPending, startTransition] = useTransition();

  if (!isOpen || !enrollment) return null;

  const handleDelete = () => {
    startTransition(async () => {
      const targetId = enrollment.id;
      const res = await deleteEnrollmentAction(targetId);
      if (res.success) {
        toast.success('Registration Revoked', { description: res.message });
        onSuccess?.(targetId);
        onClose();
      } else {
        toast.error('Revocation Failed', { description: res.error });
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
          <div className="size-11 rounded-2xl bg-rose-50 border border-rose-200/80 flex items-center justify-center text-rose-600 shrink-0">
            <AlertTriangle className="size-5" />
          </div>
          <div>
            <h3 className="font-heading font-black text-lg text-slate-900">
              Revoke Candidate Registration
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Roll: <strong>{enrollment.student?.rollNumber}</strong> — {enrollment.student?.fullName}
            </p>
          </div>
        </div>

        {/* Warning Body */}
        <div className="p-3.5 rounded-2xl bg-rose-50/50 border border-rose-100 text-xs text-rose-900 space-y-1.5">
          <p>
            Are you sure you want to revoke <strong>{enrollment.student?.fullName}</strong>&apos;s registration from <strong>[{enrollment.exam?.code}]</strong>?
          </p>
          <p className="text-[11px] text-rose-700">
            This will cancel any assigned seats and invalidate the candidate&apos;s Admit Card for this model test.
          </p>
        </div>

        {/* Action Controls */}
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
            onClick={handleDelete}
            disabled={isPending}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition-all active:scale-95 disabled:opacity-60 cursor-pointer"
          >
            {isPending ? (
              <>
                <Loader2 className="size-3.5 animate-spin text-white" />
                <span>Revoking...</span>
              </>
            ) : (
              <>
                <Trash2 className="size-3.5 text-white" />
                <span>Confirm Revocation</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
