'use client';

import React, { useState, useTransition } from 'react';
import { X, Loader2, Award, Save, Calculator, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { Exam } from '@/types/exam.types';
import { Student } from '@/types/student.types';
import { Result, ResultRecordFormData } from '@/types/result.types';
import { recordStudentResultAction } from '@/features/admin/results/actions/recordStudentResultAction';

interface ResultEntryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  exam: Exam;
  students: Student[];
  editResult?: Result | null;
  onSuccess?: (newResult: Result) => void;
}

export function ResultEntryDialog({
  isOpen,
  onClose,
  exam,
  students,
  editResult,
  onSuccess,
}: ResultEntryDialogProps) {
  const [isPending, startTransition] = useTransition();

  const maxTotal = exam.totalMarks || 100;

  const [studentId, setStudentId] = useState<string>(() => editResult?.studentId || students[0]?.id || '');
  const [totalAnswered, setTotalAnswered] = useState<number>(() => editResult?.totalAnswered ?? 90);
  const [skipped, setSkipped] = useState<number>(() => editResult?.skipped ?? (maxTotal - (editResult?.totalAnswered ?? 90)));
  const [correctAnswered, setCorrectAnswered] = useState<number>(() => editResult?.correctAnswered ?? 80);
  const [wrongAnswered, setWrongAnswered] = useState<number>(() => editResult?.wrongAnswered ?? 10);
  const [deductMark, setDeductMark] = useState<number>(() => editResult?.deductMark ?? Number((10 * 0.25).toFixed(2)));

  if (!isOpen) return null;

  // Handler for changing Total Answered
  const handleTotalChange = (val: number) => {
    const total = Math.max(0, Math.min(maxTotal, val));
    setTotalAnswered(total);
    setSkipped(Math.max(0, maxTotal - total));
    
    // Auto sync wrong answers & deductions
    const wrong = Math.max(0, total - correctAnswered);
    setWrongAnswered(wrong);
    setDeductMark(Number((wrong * 0.25).toFixed(2)));
  };

  // Handler for changing Correct Answers
  const handleCorrectChange = (val: number) => {
    const correct = Math.max(0, Math.min(totalAnswered, val));
    setCorrectAnswered(correct);
    
    // Auto calculate wrong answers & 0.25 negative marks
    const wrong = Math.max(0, totalAnswered - correct);
    setWrongAnswered(wrong);
    setDeductMark(Number((wrong * 0.25).toFixed(2)));
  };

  // Handler for changing Wrong Answers
  const handleWrongChange = (val: number) => {
    const wrong = Math.max(0, Math.min(totalAnswered, val));
    setWrongAnswered(wrong);
    // Auto calculate 0.25 deduction per wrong answer
    setDeductMark(Number((wrong * 0.25).toFixed(2)));
    
    // Auto adjust correct answers to match total
    setCorrectAnswered(Math.max(0, totalAnswered - wrong));
  };

  // Live estimated net score
  const estimatedMarks = Math.max(0, correctAnswered - deductMark).toFixed(2);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!studentId) {
      toast.error('Select Candidate', { description: 'Please select a candidate student to record marks.' });
      return;
    }

    const payload: ResultRecordFormData = {
      examId: exam.id,
      studentId,
      totalAnswered: Number(totalAnswered) || 0,
      skipped: Number(skipped) || 0,
      correctAnswered: Number(correctAnswered) || 0,
      wrongAnswered: Number(wrongAnswered) || 0,
      deductMark: Number(deductMark) || 0,
    };

    startTransition(async () => {
      const res = await recordStudentResultAction(payload);
      if (res.success && res.result) {
        toast.success('Marks Recorded', { description: res.message });
        onSuccess?.(res.result);
        onClose();
      } else {
        toast.error('Record Failed', { description: res.error });
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in-0 duration-200">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl border border-slate-100 p-6 flex flex-col gap-4 select-none">
        
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
          <div className="size-11 rounded-2xl bg-indigo-50 border border-indigo-200/80 flex items-center justify-center text-indigo-600 shrink-0">
            <Award className="size-5" />
          </div>
          <div>
            <h3 className="font-heading font-black text-lg text-slate-900">
              {editResult ? 'Edit Candidate Marks' : 'Record Student Mark Entry'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Target Test: <strong>[{exam.code}] {exam.title}</strong>
            </p>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs pt-2">
          
          {/* Candidate Student Selection */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Select Candidate Student *
            </label>
            {students.length > 0 ? (
              <select
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                disabled={Boolean(editResult)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-hidden focus:ring-2 focus:ring-indigo-500 font-mono disabled:opacity-60"
              >
                {students.map((st) => (
                  <option key={st.id} value={st.id}>
                    [Roll #{st.rollNumber}] {st.fullName} ({st.collegeName || 'Student'})
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="Student UUID (e.g. 376a8850-fef7-404c-80e0-5af31fab4515)"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            )}
          </div>

          {/* Grid inputs for breakdown */}
          <div className="grid grid-cols-2 gap-3">
            
            {/* Total Answered */}
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Total Answered (Attempted) *
              </label>
              <input
                type="number"
                min={0}
                max={maxTotal}
                value={totalAnswered}
                onChange={(e) => handleTotalChange(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 outline-hidden focus:ring-2 focus:ring-indigo-500 font-bold"
                required
              />
            </div>

            {/* Skipped */}
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Skipped (Unanswered) *
              </label>
              <input
                type="number"
                min={0}
                max={maxTotal}
                value={skipped}
                onChange={(e) => setSkipped(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 outline-hidden focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            {/* Correct Answers */}
            <div>
              <label className="font-semibold text-slate-700 block mb-1 text-teal-700">
                Correct Answered (+) *
              </label>
              <input
                type="number"
                min={0}
                max={totalAnswered}
                value={correctAnswered}
                onChange={(e) => handleCorrectChange(Number(e.target.value))}
                className="w-full px-3 py-2 bg-teal-50/50 border border-teal-200 rounded-xl text-xs font-mono text-teal-900 font-bold outline-hidden focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>

            {/* Wrong Answers */}
            <div>
              <label className="font-semibold text-slate-700 block mb-1 text-rose-700">
                Wrong Answered (-) *
              </label>
              <input
                type="number"
                min={0}
                max={totalAnswered}
                value={wrongAnswered}
                onChange={(e) => handleWrongChange(Number(e.target.value))}
                className="w-full px-3 py-2 bg-rose-50/50 border border-rose-200 rounded-xl text-xs font-mono text-rose-900 font-bold outline-hidden focus:ring-2 focus:ring-rose-500"
                required
              />
            </div>

          </div>

          {/* Mark Deductions with 0.25 Auto Calculation Indicator */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-semibold text-slate-700">
                Negative Mark Deductions *
              </label>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200/60">
                <Sparkles className="size-2.5" />
                Auto: {wrongAnswered} wrong × 0.25 = {deductMark}
              </span>
            </div>
            <input
              type="number"
              step="0.25"
              min={0}
              value={deductMark}
              onChange={(e) => setDeductMark(Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 font-bold outline-hidden focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Live Estimated Net Score Indicator */}
          <div className="p-3 rounded-2xl bg-indigo-50/80 border border-indigo-200/80 flex items-center justify-between">
            <div className="flex items-center gap-2 text-indigo-800">
              <Calculator className="size-4 text-indigo-600" />
              <span className="font-bold text-xs">Estimated Obtained Marks:</span>
            </div>
            <div className="flex items-baseline gap-1 font-mono">
              <span className="font-heading font-black text-lg text-indigo-950">{estimatedMarks}</span>
              <span className="text-[11px] text-indigo-600 font-semibold">/ {maxTotal}</span>
            </div>
          </div>

          {/* Footer Actions */}
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
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all active:scale-95 disabled:opacity-60 cursor-pointer"
            >
              {isPending ? (
                <>
                  <Loader2 className="size-3.5 animate-spin text-white" />
                  <span>Saving Marks...</span>
                </>
              ) : (
                <>
                  <Save className="size-3.5 text-white" />
                  <span>Record Results</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
