'use client';

import React from 'react';
import { Exam } from '@/types/exam.types';
import {
  X,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  FileText,
  MapPin,
  Clock,
  Award,
} from 'lucide-react';

interface ExamSyllabusModalProps {
  exam: Exam | null;
  onClose: () => void;
}

export function ExamSyllabusModal({ exam, onClose }: ExamSyllabusModalProps) {
  if (!exam) return null;

  const subjectBreakdown = [
    { subject: 'Biology (Botany & Zoology)', marks: 30, questions: 30, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
    { subject: 'Chemistry (Organic & Inorganic)', marks: 25, questions: 25, color: 'text-cyan-700 bg-cyan-50 border-cyan-200' },
    { subject: 'Physics (Paper 1 & Paper 2)', marks: 20, questions: 20, color: 'text-amber-700 bg-amber-50 border-amber-200' },
    { subject: 'English (Grammar & Vocabulary)', marks: 15, questions: 15, color: 'text-indigo-700 bg-indigo-50 border-indigo-200' },
    { subject: 'General Knowledge & Bangladesh Affairs', marks: 10, questions: 10, color: 'text-rose-700 bg-rose-50 border-rose-200' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in-50 duration-200">
      
      {/* Modal Card */}
      <div className="w-full max-w-lg bg-white rounded-[28px] sm:rounded-[32px] border border-slate-200 p-6 sm:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-teal-50 text-[#00695C] border border-teal-200">
                {exam.code}
              </span>
              <span className="text-[11px] font-bold text-slate-400">
                Medical Admission Test Syllabus
              </span>
            </div>
            <h2 className="font-heading font-black text-lg sm:text-xl text-slate-900">
              {exam.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Subject Marks Breakdown */}
        <div className="space-y-3">
          <p className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Subject Marks &amp; Question Distribution
          </p>

          <div className="space-y-2">
            {subjectBreakdown.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-2xl border border-slate-100 bg-slate-50/50 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-[#00796B]" />
                  <span className="font-bold text-slate-800">{item.subject}</span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-mono font-bold text-slate-900">
                    {item.marks} Marks
                  </span>
                  <span className="text-[10px] text-slate-400">
                    ({item.questions} MCQs)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Evaluation Rules */}
        <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900 space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold">
            <AlertTriangle className="size-4 text-amber-600 shrink-0" />
            <span>OMR Evaluation &amp; Negative Marking Rules:</span>
          </div>
          <ul className="list-disc list-inside pl-1 text-[11px] space-y-1 text-amber-800/90">
            <li><strong>+1.00 Marks</strong> for every correct OMR answer.</li>
            <li><strong>-0.25 Marks Deduction</strong> for every incorrect answer.</li>
            <li><strong>0.00 Marks</strong> for unattempted/skipped questions.</li>
            <li>Passing Threshold: <strong>{exam.passMarks || 40.0} Marks</strong> out of {exam.totalMarks || 100}.</li>
          </ul>
        </div>

        {/* Venue Guidelines */}
        <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-200/80 text-xs text-[#00594D] space-y-1">
          <p className="font-bold">📋 Candidate Examination Hall Protocol:</p>
          <p className="text-[11px] leading-relaxed text-teal-900/90">
            Report to Shafipur Central Examination Hall at least 30 minutes before exam start time. Candidates must bring their printed Digital Admit Card and standard black ballpoint pen.
          </p>
        </div>

        {/* Close CTA */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
          >
            Close Syllabus Breakdown
          </button>
        </div>

      </div>

    </div>
  );
}

export default ExamSyllabusModal;
