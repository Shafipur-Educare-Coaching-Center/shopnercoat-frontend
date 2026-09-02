'use client';

import React, { useTransition } from 'react';
import { useForm, Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Loader2, UserPlus, Save } from 'lucide-react';
import { toast } from 'sonner';
import {
  enrollmentAdminFormSchema,
  EnrollmentAdminFormValues,
} from '@/features/admin/enrollments/schemas/enrollment-admin.schema';
import { createEnrollmentAction } from '@/features/admin/enrollments/actions/createEnrollmentAction';
import { Exam, ExamEnrollmentAdmin } from '@/types/exam.types';

interface EnrollmentFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  exams: Exam[];
  onSuccess?: (newEnrollment?: ExamEnrollmentAdmin) => void;
}

export function EnrollmentFormDialog({
  isOpen,
  onClose,
  exams,
  onSuccess,
}: EnrollmentFormDialogProps) {
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EnrollmentAdminFormValues>({
    resolver: zodResolver(enrollmentAdminFormSchema) as Resolver<EnrollmentAdminFormValues>,
    defaultValues: {
      studentId: '',
      examId: exams[0]?.id || '',
      status: 'ENROLLED',
    },
  });

  if (!isOpen) return null;

  const onSubmit = (values: EnrollmentAdminFormValues) => {
    startTransition(async () => {
      const res = await createEnrollmentAction(values);
      if (res.success) {
        toast.success('Candidate Enrolled', { description: res.message });
        reset();
        onSuccess?.(res.enrollment);
        onClose();
      } else {
        toast.error('Enrollment Failed', { description: res.error });
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

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="size-11 rounded-2xl bg-teal-50 border border-teal-200/80 flex items-center justify-center text-teal-600 shrink-0">
            <UserPlus className="size-5" />
          </div>
          <div>
            <h3 className="font-heading font-black text-lg text-slate-900">
              Manual Candidate Enrollment
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Register walk-in or offline candidates into a model test.
            </p>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-xs pt-2">
          
          {/* Target Model Test */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Select Model Test *
            </label>
            <select
              {...register('examId')}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-hidden focus:ring-2 focus:ring-teal-500"
            >
              {exams.map((ex) => (
                <option key={ex.id} value={ex.id}>
                  [{ex.code}] {ex.title}
                </option>
              ))}
            </select>
            {errors.examId && (
              <p className="text-rose-500 text-[11px] mt-1">{errors.examId.message}</p>
            )}
          </div>

          {/* Student ID / Roll Number */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Candidate Student ID / Roll Number *
            </label>
            <input
              type="text"
              placeholder="e.g. std-uuid-001 or 4528647"
              {...register('studentId')}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 outline-hidden focus:ring-2 focus:ring-teal-500"
            />
            {errors.studentId && (
              <p className="text-rose-500 text-[11px] mt-1">{errors.studentId.message}</p>
            )}
          </div>

          {/* Initial Status */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Initial Registration Status
            </label>
            <select
              {...register('status')}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-hidden focus:ring-2 focus:ring-teal-500"
            >
              <option value="ENROLLED">ENROLLED (Confirmed & Active)</option>
              <option value="PENDING_APPROVAL">PENDING_APPROVAL (Verification Pending)</option>
            </select>
          </div>

          {/* Actions Footer */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="px-4 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md transition-all active:scale-95 disabled:opacity-60 cursor-pointer"
            >
              {isPending ? (
                <>
                  <Loader2 className="size-3.5 animate-spin text-white" />
                  <span>Enrolling...</span>
                </>
              ) : (
                <>
                  <Save className="size-3.5 text-white" />
                  <span>Confirm Enrollment</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
