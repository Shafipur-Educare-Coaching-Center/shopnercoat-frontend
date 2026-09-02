'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { useForm, Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Loader2, FileText, Calendar, ShieldCheck, Save, Target } from 'lucide-react';
import { toast } from 'sonner';
import {
  examAdminFormSchema,
  ExamAdminFormValues,
} from '@/features/admin/exams/schemas/exam-admin.schema';
import { createExamAction } from '@/features/admin/exams/actions/createExamAction';
import { updateExamAction } from '@/features/admin/exams/actions/updateExamAction';
import { Exam } from '@/types/exam.types';

interface ExamFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  exam?: Exam | null; // If provided, edit mode
  onSuccess?: (savedExam?: Exam, isEdit?: boolean) => void;
}

export function ExamFormDialog({
  isOpen,
  onClose,
  exam,
  onSuccess,
}: ExamFormDialogProps) {
  const [activeTab, setActiveTab] = useState<'DETAILS' | 'SCHEDULE' | 'RULES'>('DETAILS');
  const [isPending, startTransition] = useTransition();
  const isEditMode = Boolean(exam);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ExamAdminFormValues>({
    resolver: zodResolver(examAdminFormSchema) as Resolver<ExamAdminFormValues>,
    defaultValues: {
      title: '',
      code: '',
      description: '',
      totalMarks: 100,
      passMarks: 40,
      examDate: '',
      startTime: '10:00 AM',
      endTime: '11:15 AM',
      registrationStartAt: '',
      registrationEndAt: '',
      instructions:
        '1. Bring original Admit Card & HSC Registration Card.\n2. Negative marking 0.25 mark per incorrect answer.\n3. Mobile phones and smartwatches are strictly prohibited.',
      status: 'DRAFT',
    },
  });

  useEffect(() => {
    if (exam) {
      reset({
        title: exam.title || '',
        code: exam.code || '',
        description: exam.description || '',
        totalMarks: exam.totalMarks || 100,
        passMarks: exam.passMarks || 40,
        examDate: exam.examDate ? exam.examDate.split('T')[0] : '',
        startTime: exam.startTime || '10:00 AM',
        endTime: exam.endTime || '11:15 AM',
        registrationStartAt: exam.registrationStartAt ? exam.registrationStartAt.split('T')[0] : '',
        registrationEndAt: exam.registrationEndAt ? exam.registrationEndAt.split('T')[0] : '',
        instructions: exam.instructions || '',
        status: exam.status || 'DRAFT',
      });
    } else {
      reset({
        title: '',
        code: '',
        description: '',
        totalMarks: 100,
        passMarks: 40,
        examDate: '',
        startTime: '10:00 AM',
        endTime: '11:15 AM',
        registrationStartAt: '',
        registrationEndAt: '',
        instructions:
          '1. Bring original Admit Card & HSC Registration Card.\n2. Negative marking 0.25 mark per incorrect answer.\n3. Mobile phones and smartwatches are strictly prohibited.',
        status: 'DRAFT',
      });
    }
  }, [exam, reset]);

  if (!isOpen) return null;

  const onSubmit = (values: ExamAdminFormValues) => {
    startTransition(async () => {
      if (isEditMode && exam) {
        const res = await updateExamAction(exam.id, values);
        if (res.success) {
          toast.success('Model Test Updated', { description: res.message });
          onSuccess?.(res.exam, true);
          onClose();
        } else {
          toast.error('Update Failed', {
            description: typeof res.error === 'string' ? res.error : JSON.stringify(res.error),
          });
        }
      } else {
        const res = await createExamAction(values);
        if (res.success) {
          toast.success('Model Test Created', { description: res.message });
          onSuccess?.(res.exam, false);
          onClose();
        } else {
          toast.error('Creation Failed', {
            description: typeof res.error === 'string' ? res.error : JSON.stringify(res.error),
          });
        }
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in-0 duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-3xl bg-white shadow-[0_20px_60px_rgba(15,23,42,0.2)] border border-slate-100 flex flex-col select-none">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div>
            <h3 className="font-heading font-black text-lg text-slate-900">
              {isEditMode ? 'Edit Model Test' : 'Create New Model Test'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {isEditMode
                ? `Updating exam schedule, pass marks, and instructions for [${exam?.code}]`
                : 'Configure exam parameters, marks distribution, registration windows, and test instructions.'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="size-8 rounded-full bg-slate-200/60 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-100 px-6 bg-slate-50/40 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('DETAILS')}
            className={`py-3 px-4 flex items-center gap-1.5 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'DETAILS'
                ? 'border-teal-600 text-teal-700 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <Target className="size-3.5" />
            <span>1. Test Details & Marks</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('SCHEDULE')}
            className={`py-3 px-4 flex items-center gap-1.5 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'SCHEDULE'
                ? 'border-teal-600 text-teal-700 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <Calendar className="size-3.5" />
            <span>2. Schedule & Window</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('RULES')}
            className={`py-3 px-4 flex items-center gap-1.5 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'RULES'
                ? 'border-teal-600 text-teal-700 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <FileText className="size-3.5" />
            <span>3. Instructions & Status</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
          
          {/* TAB 1: Details & Marks */}
          {activeTab === 'DETAILS' && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Title */}
                <div className="sm:col-span-2">
                  <label className="font-semibold text-slate-700 block mb-1">
                    Exam Title *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Medical Admission Grand Model Test - 01"
                    {...register('title')}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-hidden focus:ring-2 focus:ring-teal-500"
                  />
                  {errors.title && (
                    <p className="text-rose-500 text-[11px] mt-1">{errors.title.message}</p>
                  )}
                </div>

                {/* Unique Code */}
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Exam Code *
                  </label>
                  <input
                    type="text"
                    placeholder="MED-GMT-2026-01"
                    {...register('code')}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono uppercase text-slate-900 outline-hidden focus:ring-2 focus:ring-teal-500"
                  />
                  {errors.code && (
                    <p className="text-rose-500 text-[11px] mt-1">{errors.code.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Total Marks */}
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Total Marks *
                  </label>
                  <input
                    type="number"
                    placeholder="100"
                    {...register('totalMarks')}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-hidden focus:ring-2 focus:ring-teal-500"
                  />
                  {errors.totalMarks && (
                    <p className="text-rose-500 text-[11px] mt-1">{errors.totalMarks.message}</p>
                  )}
                </div>

                {/* Pass Marks */}
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Pass Marks *
                  </label>
                  <input
                    type="number"
                    placeholder="40"
                    {...register('passMarks')}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-hidden focus:ring-2 focus:ring-teal-500"
                  />
                  {errors.passMarks && (
                    <p className="text-rose-500 text-[11px] mt-1">{errors.passMarks.message}</p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Exam Description / Subject Syllabus *
                </label>
                <textarea
                  rows={3}
                  placeholder="Full syllabus 100-mark mock test covering Biology, Chemistry, Physics, English, and GK..."
                  {...register('description')}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-hidden focus:ring-2 focus:ring-teal-500"
                />
                {errors.description && (
                  <p className="text-rose-500 text-[11px] mt-1">{errors.description.message}</p>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: Schedule & Registration */}
          {activeTab === 'SCHEDULE' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-teal-50/40 border border-teal-100 space-y-3">
                <h4 className="font-heading font-bold text-teal-800 uppercase text-[11px] tracking-wider flex items-center gap-1.5">
                  <Calendar className="size-3.5 text-teal-600" />
                  <span>Exam Session Date & Time</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Exam Date *</label>
                    <input
                      type="date"
                      {...register('examDate')}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 outline-hidden focus:ring-2 focus:ring-teal-500"
                    />
                    {errors.examDate && (
                      <p className="text-rose-500 text-[11px] mt-1">{errors.examDate.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Start Time *</label>
                    <input
                      type="text"
                      placeholder="10:00 AM"
                      {...register('startTime')}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 outline-hidden focus:ring-2 focus:ring-teal-500"
                    />
                    {errors.startTime && (
                      <p className="text-rose-500 text-[11px] mt-1">{errors.startTime.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">End Time *</label>
                    <input
                      type="text"
                      placeholder="11:15 AM"
                      {...register('endTime')}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 outline-hidden focus:ring-2 focus:ring-teal-500"
                    />
                    {errors.endTime && (
                      <p className="text-rose-500 text-[11px] mt-1">{errors.endTime.message}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/40 border border-amber-100 space-y-3">
                <h4 className="font-heading font-bold text-amber-800 uppercase text-[11px] tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="size-3.5 text-amber-600" />
                  <span>Candidate Registration Window</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Registration Opens *</label>
                    <input
                      type="date"
                      {...register('registrationStartAt')}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 outline-hidden focus:ring-2 focus:ring-teal-500"
                    />
                    {errors.registrationStartAt && (
                      <p className="text-rose-500 text-[11px] mt-1">{errors.registrationStartAt.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Registration Deadline *</label>
                    <input
                      type="date"
                      {...register('registrationEndAt')}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 outline-hidden focus:ring-2 focus:ring-teal-500"
                    />
                    {errors.registrationEndAt && (
                      <p className="text-rose-500 text-[11px] mt-1">{errors.registrationEndAt.message}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Instructions & Status */}
          {activeTab === 'RULES' && (
            <div className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Examination Instructions & Negative Marking Rules *
                </label>
                <textarea
                  rows={4}
                  placeholder="1. Bring Admit Card... 2. Negative marking 0.25 applies..."
                  {...register('instructions')}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-hidden focus:ring-2 focus:ring-teal-500"
                />
                {errors.instructions && (
                  <p className="text-rose-500 text-[11px] mt-1">{errors.instructions.message}</p>
                )}
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Lifecycle Status
                </label>
                <select
                  {...register('status')}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-hidden focus:ring-2 focus:ring-teal-500"
                >
                  <option value="DRAFT">DRAFT (Hidden from candidates)</option>
                  <option value="REGISTRATION_OPEN">REGISTRATION_OPEN (Accepting applicants)</option>
                  {isEditMode && (
                    <>
                      <option value="REGISTRATION_CLOSED">REGISTRATION_CLOSED (Awaiting seat allocation)</option>
                      <option value="UPCOMING">UPCOMING (Admit cards ready)</option>
                      <option value="ONGOING">ONGOING (Test underway)</option>
                      <option value="COMPLETED">COMPLETED (Evaluation)</option>
                      <option value="RESULT_PUBLISHED">RESULT_PUBLISHED (Scores live)</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </>
                  )}
                </select>
              </div>
            </div>
          )}

          {/* Form Actions Footer */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <div className="flex items-center gap-2">
              {activeTab === 'DETAILS' && (
                <button
                  type="button"
                  onClick={() => setActiveTab('SCHEDULE')}
                  className="px-4 py-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs cursor-pointer"
                >
                  Next: Schedule &rarr;
                </button>
              )}
              {activeTab === 'SCHEDULE' && (
                <button
                  type="button"
                  onClick={() => setActiveTab('RULES')}
                  className="px-4 py-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs cursor-pointer"
                >
                  Next: Instructions &rarr;
                </button>
              )}
              <button
                type="submit"
                disabled={isPending}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md transition-all active:scale-95 disabled:opacity-60 cursor-pointer"
              >
                {isPending ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin text-white" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="size-3.5 text-white" />
                    <span>{isEditMode ? 'Save Changes' : 'Create Model Test'}</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
}
