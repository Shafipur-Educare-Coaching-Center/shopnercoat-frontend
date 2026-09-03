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
  Calendar,
  Target,
  ShieldCheck,
} from 'lucide-react';
import { formatExamDate, formatExamTime, formatExamRegWindow, formatExamDuration } from '@/lib/dateUtils';

interface ExamSyllabusModalProps {
  exam: Exam | null;
  onClose: () => void;
}

export function ExamSyllabusModal({ exam, onClose }: ExamSyllabusModalProps) {
  if (!exam) return null;

  const examFormattedDate = formatExamDate(exam.examDate, true);
  const examTimeSlot = exam.startTime && exam.endTime ? `${exam.startTime} – ${exam.endTime}` : '10:00 AM – 11:15 AM';
  const durationStr = formatExamDuration(exam.startTime, exam.endTime);
  const regWindowStr = formatExamRegWindow(exam.registrationStartAt, exam.registrationEndAt);

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
                Medical Admission Test Syllabus &amp; Guidelines
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

        {/* Exam Schedule & Registration Summary Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-2.5">
            <Calendar className="size-4 text-[#00796B] shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 font-bold block uppercase">Test Schedule</span>
              <span className="font-bold text-slate-800">{examFormattedDate}</span>
              <span className="text-[11px] text-slate-500 block">{examTimeSlot} ({durationStr})</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-amber-50/60 border border-amber-100 flex items-center gap-2.5">
            <Clock className="size-4 text-amber-600 shrink-0" />
            <div>
              <span className="text-[10px] text-amber-800 font-bold block uppercase">Registration Window</span>
              <span className="font-bold text-amber-900 text-[11px]">{regWindowStr}</span>
            </div>
          </div>
        </div>

        {/* Official Syllabus & Chapter Coverage (Dynamic from Exam Description) */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5">
            <BookOpen className="size-4 text-[#00796B]" />
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Syllabus &amp; Chapter Coverage
            </h3>
          </div>

          <div className="p-4 rounded-2xl border border-teal-100 bg-teal-50/30 text-xs text-slate-800 leading-relaxed font-medium">
            {exam.description || 'Full-length centralized medical admission mock test with dense national rank calibration.'}
          </div>
        </div>

        {/* Score & Marks Calibration */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="font-mono font-black text-sm text-slate-900 block">
              {exam.totalMarks || 100}
            </span>
            <span className="text-[10px] text-slate-400 font-bold uppercase">Total Marks</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="font-mono font-black text-sm text-teal-700 block">
              {exam.passMarks || 40}
            </span>
            <span className="text-[10px] text-slate-400 font-bold uppercase">Pass Marks</span>
          </div>

          <div className="p-3 rounded-2xl bg-rose-50/60 border border-rose-100">
            <span className="font-mono font-black text-sm text-rose-600 block">
              -0.25
            </span>
            <span className="text-[10px] text-rose-500 font-bold uppercase">Wrong Penalty</span>
          </div>
        </div>

        {/* Official Instructions & Negative Marking Rules */}
        <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900 space-y-2">
          <div className="flex items-center gap-1.5 font-bold">
            <AlertTriangle className="size-4 text-amber-600 shrink-0" />
            <span>OMR Evaluation &amp; Candidate Rules:</span>
          </div>
          <div className="whitespace-pre-line pl-1 text-[11px] leading-relaxed text-amber-900/90 font-medium">
            {exam.instructions || '1. Bring original Admit Card & HSC Registration Card.\n2. Negative marking 0.25 mark per incorrect answer.\n3. Mobile phones and smartwatches are strictly prohibited.'}
          </div>
        </div>

        {/* Venue Guidelines */}
        <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-200/80 text-xs text-[#00594D] space-y-1">
          <p className="font-bold flex items-center gap-1.5">
            <ShieldCheck className="size-4 text-teal-600" />
            <span>Candidate Examination Hall Protocol:</span>
          </p>
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
