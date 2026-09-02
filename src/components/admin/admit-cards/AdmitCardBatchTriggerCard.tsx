'use client';

import React, { useTransition } from 'react';
import { Sparkles, FileSpreadsheet, Loader2, Send } from 'lucide-react';
import { toast } from 'sonner';
import { Exam } from '@/types/exam.types';
import { triggerBatchAdmitCardsAction } from '@/features/admin/admit-cards/actions/triggerBatchAdmitCardsAction';

interface AdmitCardBatchTriggerCardProps {
  exams: Exam[];
  selectedExamId: string;
  onSuccess?: () => void;
}

export function AdmitCardBatchTriggerCard({
  exams,
  selectedExamId,
  onSuccess,
}: AdmitCardBatchTriggerCardProps) {
  const [isPending, startTransition] = useTransition();

  const selectedExam = exams.find((e) => e.id === selectedExamId) || exams[0];

  const handleTriggerBatch = () => {
    if (!selectedExam) {
      toast.error('Select Exam', { description: 'Please select a model test exam to generate Admit Cards.' });
      return;
    }

    startTransition(async () => {
      const res = await triggerBatchAdmitCardsAction(selectedExam.id);
      if (res.success) {
        toast.success('Batch PDF Dispatches Triggered', {
          description: `Batch ID ${res.batchId?.slice(0, 8)}... queued for ${res.totalStudents || 'enrolled'} examinees.`,
        });
        onSuccess?.();
      } else {
        toast.error('Dispatch Failed', { description: res.error });
      }
    });
  };

  return (
    <div className="w-full p-5 rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 text-white shadow-lg mb-6 flex flex-col md:flex-row md:items-center justify-between gap-5 select-none relative overflow-hidden">
      
      {/* Background Watermark Icon */}
      <FileSpreadsheet className="absolute -right-6 -bottom-6 size-40 text-white/5 pointer-events-none" />

      {/* Left Info Column */}
      <div className="flex items-start gap-4 z-10">
        <div className="size-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-teal-300 shrink-0">
          <Sparkles className="size-6" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-heading font-black text-lg text-white">
              Batch Admit Card PDF Generator
            </h3>
            <span className="px-2 py-0.5 rounded-md bg-teal-500/20 border border-teal-400/30 text-[10px] font-bold text-teal-300 uppercase">
              BullMQ Background Worker
            </span>
          </div>
          <p className="text-xs text-indigo-200 mt-1 max-w-xl">
            Generates high-resolution PDF admit cards with QR security tokens and dispatches Bengali notification emails with direct download links.
          </p>

          {/* Selected Exam Meta */}
          {selectedExam && (
            <div className="flex items-center gap-3 mt-3 text-[11px] text-teal-200 font-mono">
              <span>Target: <strong>[{selectedExam.code}] {selectedExam.title}</strong></span>
              <span>•</span>
              <span>Enrolled Examinees: <strong>{selectedExam._count?.enrollments || 0}</strong></span>
            </div>
          )}
        </div>
      </div>

      {/* Right Action Controls */}
      <div className="flex items-center gap-3 shrink-0 z-10">
        <button
          type="button"
          onClick={handleTriggerBatch}
          disabled={isPending || !selectedExam}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-teal-400 to-emerald-500 hover:from-teal-300 hover:to-emerald-400 text-slate-950 font-black text-xs shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
        >
          {isPending ? (
            <>
              <Loader2 className="size-4 animate-spin text-slate-950" />
              <span>Queuing Batch Jobs...</span>
            </>
          ) : (
            <>
              <Send className="size-4 text-slate-950" />
              <span>Dispatch Batch PDFs & Emails</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
}
