'use client';

import React, { useEffect, useTransition } from 'react';
import { useForm, Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  X,
  BookOpen,
  Calendar,
  Clock,
  Target,
  FileText,
  ShieldCheck,
  Sparkles,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  examAdminFormSchema,
  ExamAdminFormValues,
} from '@/features/admin/exams/schemas/exam-admin.schema';
import { createExamAction } from '@/features/admin/exams/actions/createExamAction';
import { updateExamAction } from '@/features/admin/exams/actions/updateExamAction';
import { Exam, ExamStatus } from '@/types/exam.types';
import { toDateTimeLocalInput, toDateInput } from '@/lib/dateUtils';

interface ExamFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  exam?: Exam | null;
  onSuccess?: (exam: Exam, isEdit: boolean) => void;
}

export function ExamFormDialog({
  isOpen,
  onClose,
  exam,
  onSuccess,
}: ExamFormDialogProps) {
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = React.useState<'BASIC' | 'SCHEDULE' | 'RULES'>('BASIC');

  const isEditMode = Boolean(exam);

  const {
    register,
    handleSubmit,
    setValue,
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
        examDate: toDateInput(exam.examDate),
        startTime: exam.startTime || '10:00 AM',
        endTime: exam.endTime || '11:15 AM',
        registrationStartAt: toDateTimeLocalInput(exam.registrationStartAt),
        registrationEndAt: toDateTimeLocalInput(exam.registrationEndAt),
        instructions: exam.instructions || '',
        status: exam.status || 'DRAFT',
      });
    } else {
      const now = new Date();
      const pad = (n: number) => String(n).padStart(2, '0');
      const todayStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;

      reset({
        title: '',
        code: '',
        description: '',
        totalMarks: 100,
        passMarks: 40,
        examDate: '',
        startTime: '10:00 AM',
        endTime: '11:15 AM',
        registrationStartAt: `${todayStr}T12:00`,
        registrationEndAt: `${todayStr}T20:00`,
        instructions:
          '1. Bring original Admit Card & HSC Registration Card.\n2. Negative marking 0.25 mark per incorrect answer.\n3. Mobile phones and smartwatches are strictly prohibited.',
        status: 'DRAFT',
      });
    }
  }, [exam, reset]);

  if (!isOpen) return null;

  const setSameDayWindowPreset = () => {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const todayStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
    setValue('registrationStartAt', `${todayStr}T12:00`);
    setValue('registrationEndAt', `${todayStr}T20:00`);
  };

  const onSubmit = (values: ExamAdminFormValues) => {
    startTransition(async () => {
      if (isEditMode && exam) {
        const res = await updateExamAction(exam.id, values);
        if (res.success) {
          toast.success('Model Test Updated', { description: res.message });
          if (res.exam) onSuccess?.(res.exam, true);
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
          if (res.exam) onSuccess?.(res.exam, false);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in-50 duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="size-10 rounded-2xl bg-teal-50 border border-teal-200/80 flex items-center justify-center text-teal-700">
              <BookOpen className="size-5" />
            </div>
            <div>
              <h3 className="font-heading font-black text-lg text-slate-900">
                {isEditMode ? 'Edit Medical Model Test' : 'Create New Model Test'}
              </h3>
              <p className="text-xs text-slate-500">
                Configure test parameters, same-day registration windows, syllabus &amp; negative marking.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center border-b border-slate-100 px-6 pt-2 bg-white gap-2 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('BASIC')}
            className={`pb-2.5 px-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'BASIC'
                ? 'border-teal-600 text-teal-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            1. Basic Specs &amp; Code
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('SCHEDULE')}
            className={`pb-2.5 px-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'SCHEDULE'
                ? 'border-teal-600 text-teal-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            2. Schedule &amp; Reg. Window
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('RULES')}
            className={`pb-2.5 px-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'RULES'
                ? 'border-teal-600 text-teal-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            3. Instructions &amp; Status
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* TAB 1: Basic Specs */}
          {activeTab === 'BASIC' && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="font-semibold text-slate-700 block mb-1">Exam Title *</label>
                  <input
                    type="text"
                    placeholder="e.g., National Medical Mock Test 06"
                    {...register('title')}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-hidden focus:ring-2 focus:ring-teal-500"
                  />
                  {errors.title && <p className="text-rose-500 text-[11px] mt-1">{errors.title.message}</p>}
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Exam Code *</label>
                  <input
                    type="text"
                    placeholder="NMT-06"
                    {...register('code')}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 uppercase outline-hidden focus:ring-2 focus:ring-teal-500"
                  />
                  {errors.code && <p className="text-rose-500 text-[11px] mt-1">{errors.code.message}</p>}
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Description &amp; Syllabus Coverage *</label>
                <textarea
                  rows={3}
                  placeholder="Full-length medical admission mock test covering Botany, Zoology, Chemistry, Physics, English & General Knowledge."
                  {...register('description')}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-hidden focus:ring-2 focus:ring-teal-500"
                />
                {errors.description && (
                  <p className="text-rose-500 text-[11px] mt-1">{errors.description.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-teal-50/50 border border-teal-100">
                <div>
                  <label className="font-semibold text-teal-900 block mb-1">Total Marks *</label>
                  <input
                    type="number"
                    min={1}
                    max={1000}
                    {...register('totalMarks')}
                    className="w-full px-3 py-2 bg-white border border-teal-200 rounded-xl text-xs font-mono font-bold text-slate-900 outline-hidden focus:ring-2 focus:ring-teal-500"
                  />
                  {errors.totalMarks && (
                    <p className="text-rose-500 text-[11px] mt-1">{errors.totalMarks.message}</p>
                  )}
                </div>

                <div>
                  <label className="font-semibold text-teal-900 block mb-1">Pass Marks Threshold *</label>
                  <input
                    type="number"
                    min={1}
                    {...register('passMarks')}
                    className="w-full px-3 py-2 bg-white border border-teal-200 rounded-xl text-xs font-mono font-bold text-slate-900 outline-hidden focus:ring-2 focus:ring-teal-500"
                  />
                  {errors.passMarks && (
                    <p className="text-rose-500 text-[11px] mt-1">{errors.passMarks.message}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Schedule & Registration Window */}
          {activeTab === 'SCHEDULE' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <h4 className="font-heading font-bold text-slate-800 uppercase text-[11px] tracking-wider flex items-center gap-1.5">
                  <Calendar className="size-3.5 text-teal-600" />
                  <span>Exam Execution Date &amp; Time Slot</span>
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

              {/* Registration Window (Allows same-day hour-level registration) */}
              <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-heading font-bold text-amber-900 uppercase text-[11px] tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="size-3.5 text-amber-600" />
                    <span>Candidate Registration Window</span>
                  </h4>

                  <button
                    type="button"
                    onClick={setSameDayWindowPreset}
                    className="text-[11px] font-bold text-amber-800 bg-amber-100/80 hover:bg-amber-200/80 px-2.5 py-0.5 rounded-lg transition-colors cursor-pointer"
                  >
                    Set Today 12 PM – 8 PM
                  </button>
                </div>

                <p className="text-[11px] text-amber-800">
                  Allows same-day or multi-day registration for specific hours (e.g. registration available today from 12:00 PM to 08:00 PM for tomorrow&apos;s mock test).
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Registration Opens (Date &amp; Time) *</label>
                    <input
                      type="datetime-local"
                      {...register('registrationStartAt')}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 outline-hidden focus:ring-2 focus:ring-teal-500"
                    />
                    {errors.registrationStartAt && (
                      <p className="text-rose-500 text-[11px] mt-1">{errors.registrationStartAt.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Registration Deadline (Date &amp; Time) *</label>
                    <input
                      type="datetime-local"
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
                  Examination Instructions &amp; Negative Marking Rules *
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
                <label className="font-semibold text-slate-700 block mb-1">Initial Status</label>
                <select
                  {...register('status')}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-hidden focus:ring-2 focus:ring-teal-500"
                >
                  <option value="DRAFT">DRAFT (Testing &amp; Question Paper Preparation)</option>
                  <option value="REGISTRATION_OPEN">REGISTRATION_OPEN (Live Candidate Registration)</option>
                  <option value="REGISTRATION_CLOSED">REGISTRATION_CLOSED (Registration Ended)</option>
                  <option value="UPCOMING">UPCOMING (Admit Cards Issued &amp; Seats Allocated)</option>
                  <option value="ONGOING">ONGOING (Test in Session)</option>
                  <option value="COMPLETED">COMPLETED (Pending Result Evaluation)</option>
                  <option value="RESULT_PUBLISHED">RESULT_PUBLISHED (Scorecards &amp; Merit Published)</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
                {errors.status && <p className="text-rose-500 text-[11px] mt-1">{errors.status.message}</p>}
              </div>
            </div>
          )}

          {/* Footer Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2">
              {activeTab !== 'BASIC' && (
                <button
                  type="button"
                  onClick={() => setActiveTab(activeTab === 'RULES' ? 'SCHEDULE' : 'BASIC')}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs transition-colors"
                >
                  Previous
                </button>
              )}
              {activeTab !== 'RULES' && (
                <button
                  type="button"
                  onClick={() => setActiveTab(activeTab === 'BASIC' ? 'SCHEDULE' : 'RULES')}
                  className="px-3.5 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-700 font-bold text-xs transition-colors"
                >
                  Next Step
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
              >
                {isPending ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="size-3.5" />
                    <span>{isEditMode ? 'Update Model Test' : 'Create Model Test'}</span>
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

export default ExamFormDialog;
