'use client';

import React, { useState, useTransition } from 'react';
import { X, Loader2, FileSpreadsheet, Save, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { Exam } from '@/types/exam.types';
import { Student } from '@/types/student.types';
import { BulkResultEntryItem } from '@/types/result.types';
import { bulkRecordResultsAction } from '@/features/admin/results/actions/bulkRecordResultsAction';

interface ResultBulkEntryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  exam: Exam;
  students: Student[];
  onSuccess?: () => void;
}

export function ResultBulkEntryDialog({
  isOpen,
  onClose,
  exam,
  students,
  onSuccess,
}: ResultBulkEntryDialogProps) {
  const [isPending, startTransition] = useTransition();
  const maxTotal = exam.totalMarks || 100;

  // Initialize rows for each student with 0.25 negative marks pre-calculated
  const [rows, setRows] = useState<BulkResultEntryItem[]>(() => {
    return students.map((st) => ({
      studentId: st.id,
      studentName: st.fullName,
      rollNumber: st.rollNumber,
      totalAnswered: 90,
      skipped: maxTotal - 90,
      correctAnswered: 80,
      wrongAnswered: 10,
      deductMark: Number((10 * 0.25).toFixed(2)),
    }));
  });

  if (!isOpen) return null;

  const handleRowChange = (index: number, field: keyof BulkResultEntryItem, val: number) => {
    setRows((prev) =>
      prev.map((row, i) => {
        if (i !== index) return row;

        const updated = { ...row };

        if (field === 'totalAnswered') {
          const total = Math.max(0, Math.min(maxTotal, val));
          updated.totalAnswered = total;
          updated.skipped = Math.max(0, maxTotal - total);
          const wrong = Math.max(0, total - updated.correctAnswered);
          updated.wrongAnswered = wrong;
          updated.deductMark = Number((wrong * 0.25).toFixed(2));
        } else if (field === 'correctAnswered') {
          const correct = Math.max(0, Math.min(updated.totalAnswered, val));
          updated.correctAnswered = correct;
          const wrong = Math.max(0, updated.totalAnswered - correct);
          updated.wrongAnswered = wrong;
          updated.deductMark = Number((wrong * 0.25).toFixed(2));
        } else if (field === 'wrongAnswered') {
          const wrong = Math.max(0, Math.min(updated.totalAnswered, val));
          updated.wrongAnswered = wrong;
          updated.deductMark = Number((wrong * 0.25).toFixed(2));
          updated.correctAnswered = Math.max(0, updated.totalAnswered - wrong);
        } else if (field === 'skipped') {
          const skippedCount = Math.max(0, Math.min(maxTotal, val));
          updated.skipped = skippedCount;
          const total = Math.max(0, maxTotal - skippedCount);
          updated.totalAnswered = total;
          const wrong = Math.max(0, total - updated.correctAnswered);
          updated.wrongAnswered = wrong;
          updated.deductMark = Number((wrong * 0.25).toFixed(2));
        } else if (field === 'deductMark') {
          updated.deductMark = Math.max(0, val);
        }

        return updated;
      })
    );
  };

  const handleSaveBulk = () => {
    if (rows.length === 0) {
      toast.error('No Examinees', { description: 'No candidates available for bulk mark entry.' });
      return;
    }

    startTransition(async () => {
      const res = await bulkRecordResultsAction({
        examId: exam.id,
        results: rows,
      });

      if (res.success) {
        toast.success('Bulk Marks Recorded', { description: res.message });
        onSuccess?.();
        onClose();
      } else {
        toast.error('Bulk Entry Failed', { description: res.error });
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in-0 duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl bg-white shadow-2xl border border-slate-100 p-6 flex flex-col gap-4 select-none">
        
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
          <div className="size-11 rounded-2xl bg-teal-50 border border-teal-200/80 flex items-center justify-center text-teal-600 shrink-0">
            <FileSpreadsheet className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-heading font-black text-lg text-slate-900">
                Bulk Spreadsheet Mark Entry
              </h3>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200/80">
                <Sparkles className="size-2.5 text-teal-600" />
                Auto-Deductions (0.25 / wrong)
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Batch score tabulation for <strong>[{exam.code}] {exam.title}</strong> ({rows.length} examinees)
            </p>
          </div>
        </div>

        {/* Spreadsheet Table Container */}
        <div className="flex-1 overflow-y-auto border border-slate-200 rounded-2xl">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase sticky top-0 z-10">
              <tr>
                <th scope="col" className="py-2.5 px-3">Candidate</th>
                <th scope="col" className="py-2.5 px-2 text-center">Attempted</th>
                <th scope="col" className="py-2.5 px-2 text-center">Skipped</th>
                <th scope="col" className="py-2.5 px-2 text-center">Correct (+)</th>
                <th scope="col" className="py-2.5 px-2 text-center">Wrong (-)</th>
                <th scope="col" className="py-2.5 px-2 text-center">Deduct (0.25)</th>
                <th scope="col" className="py-2.5 px-3 text-center">Net Marks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((row, idx) => {
                const netScore = Math.max(0, row.correctAnswered - row.deductMark).toFixed(2);

                return (
                  <tr key={row.studentId} className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-3">
                      <p className="font-bold text-slate-900">{row.studentName || 'Student'}</p>
                      <p className="text-[10px] text-slate-500 font-mono">Roll #{row.rollNumber || 'N/A'}</p>
                    </td>

                    {/* Attempted */}
                    <td className="py-2 px-2 text-center">
                      <input
                        type="number"
                        min={0}
                        max={maxTotal}
                        value={row.totalAnswered}
                        onChange={(e) => handleRowChange(idx, 'totalAnswered', Number(e.target.value))}
                        className="w-16 px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-center font-mono font-bold text-xs outline-hidden focus:ring-1 focus:ring-teal-500"
                      />
                    </td>

                    {/* Skipped */}
                    <td className="py-2 px-2 text-center">
                      <input
                        type="number"
                        min={0}
                        max={maxTotal}
                        value={row.skipped}
                        onChange={(e) => handleRowChange(idx, 'skipped', Number(e.target.value))}
                        className="w-16 px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-center font-mono text-xs outline-hidden focus:ring-1 focus:ring-teal-500"
                      />
                    </td>

                    {/* Correct */}
                    <td className="py-2 px-2 text-center">
                      <input
                        type="number"
                        min={0}
                        max={row.totalAnswered}
                        value={row.correctAnswered}
                        onChange={(e) => handleRowChange(idx, 'correctAnswered', Number(e.target.value))}
                        className="w-16 px-2 py-1 bg-teal-50 border border-teal-200 rounded-lg text-center font-mono font-bold text-teal-800 text-xs outline-hidden focus:ring-1 focus:ring-teal-500"
                      />
                    </td>

                    {/* Wrong */}
                    <td className="py-2 px-2 text-center">
                      <input
                        type="number"
                        min={0}
                        max={row.totalAnswered}
                        value={row.wrongAnswered}
                        onChange={(e) => handleRowChange(idx, 'wrongAnswered', Number(e.target.value))}
                        className="w-16 px-2 py-1 bg-rose-50 border border-rose-200 rounded-lg text-center font-mono font-bold text-rose-800 text-xs outline-hidden focus:ring-1 focus:ring-rose-500"
                      />
                    </td>

                    {/* Deduct (Auto 0.25 per wrong) */}
                    <td className="py-2 px-2 text-center">
                      <input
                        type="number"
                        step="0.25"
                        min={0}
                        value={row.deductMark}
                        onChange={(e) => handleRowChange(idx, 'deductMark', Number(e.target.value))}
                        className="w-16 px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-center font-mono font-bold text-xs outline-hidden focus:ring-1 focus:ring-teal-500 text-rose-700"
                      />
                    </td>

                    {/* Calculated Net Score */}
                    <td className="py-2 px-3 text-center font-mono font-black text-sm text-indigo-900">
                      {netScore}
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer Actions */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <p className="text-[11px] text-slate-500">
            Total {rows.length} student entries ready for batch submission.
          </p>

          <div className="flex items-center gap-2.5">
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
              onClick={handleSaveBulk}
              disabled={isPending}
              className="inline-flex items-center gap-1.5 px-6 py-2 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md transition-all active:scale-95 disabled:opacity-60 cursor-pointer"
            >
              {isPending ? (
                <>
                  <Loader2 className="size-3.5 animate-spin text-white" />
                  <span>Submitting Bulk Records...</span>
                </>
              ) : (
                <>
                  <Save className="size-3.5 text-white" />
                  <span>Save All Results</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
