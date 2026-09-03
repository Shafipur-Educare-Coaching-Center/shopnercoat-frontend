'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Calendar,
  Clock,
  Building2,
  FileText,
  Edit2,
  RefreshCw,
  ShieldCheck,
  Loader2,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Exam, ExamCentre } from '@/types/exam.types';
import { getExamCentresAction } from '@/features/admin/exams/actions/examCentreActions';

interface ExamDetailDrawerProps {
  exam: Exam | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (exam: Exam) => void;
  onManageCentres: (exam: Exam) => void;
  onChangeStatus: (exam: Exam) => void;
}

export function ExamDetailDrawer({
  exam,
  isOpen,
  onClose,
  onEdit,
  onManageCentres,
  onChangeStatus,
}: ExamDetailDrawerProps) {
  const [centres, setCentres] = useState<ExamCentre[]>(exam?.centres || []);
  const [isLoadingCentres, setIsLoadingCentres] = useState(false);

  useEffect(() => {
    let active = true;
    if (isOpen && exam?.id) {
      getExamCentresAction(exam.id)
        .then((res) => {
          if (active && res.success && res.centres) {
            setCentres(res.centres);
          }
        })
        .finally(() => {
          if (active) setIsLoadingCentres(false);
        });
    }
    return () => {
      active = false;
    };
  }, [isOpen, exam?.id]);

  if (!isOpen || !exam) return null;

  const displayCentres = centres.length > 0 ? centres : exam.centres || [];

  const formatDate = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return isoStr.split('T')[0];
    }
  };

  const formatDateTime = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      const dateStr = d.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
      const timeStr = d.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
      return `${dateStr}, ${timeStr}`;
    } catch {
      return isoStr;
    }
  };

  const totalRooms = displayCentres?.reduce((acc, c) => acc + (c.rooms?.length || 0), 0) || 0;
  const totalCapacity = displayCentres?.reduce((acc, c) => acc + (c.capacity || 0), 0) || 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in-0 duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-[0_20px_60px_rgba(15,23,42,0.2)] border border-slate-100 p-6 flex flex-col gap-6 select-none">
        
        {/* Top Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 size-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors cursor-pointer"
        >
          <X className="size-4" />
        </button>

        {/* 1. Header Banner */}
        <div className="flex flex-col gap-2 pt-2">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="inline-flex items-center gap-1 font-mono font-bold text-[#37447E] bg-indigo-50 px-2.5 py-1 rounded-xl border border-indigo-200/80 text-xs">
              <ShieldCheck className="size-3.5 text-indigo-600" />
              {exam.code}
            </span>
            <Badge variant={exam.status === 'REGISTRATION_OPEN' ? 'calmTeal' : exam.status === 'COMPLETED' ? 'calmEmerald' : 'calmAmber'}>
              {exam.status.replace('_', ' ')}
            </Badge>
          </div>

          <h3 className="font-heading font-black text-xl text-slate-900 mt-1">
            {exam.title}
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            {exam.description}
          </p>
        </div>

        {/* 2. Key Metrics & Academic Standard */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-2xl bg-indigo-50/60 border border-indigo-100">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Total Marks</span>
            <strong className="font-heading font-black text-lg text-slate-900">{exam.totalMarks}</strong>
          </div>

          <div className="p-3 rounded-2xl bg-teal-50/60 border border-teal-100">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Pass Marks</span>
            <strong className="font-heading font-black text-lg text-teal-800">{exam.passMarks}</strong>
          </div>

          <div className="p-3 rounded-2xl bg-sky-50/60 border border-sky-100">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Enrolled</span>
            <strong className="font-heading font-black text-lg text-sky-900">{exam._count?.enrollments || 0}</strong>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Total Capacity</span>
            <strong className="font-heading font-black text-lg text-slate-700">{totalCapacity}</strong>
          </div>
        </div>

        {/* 3. Schedule & Registration Timing */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100 flex flex-col gap-2.5 text-xs">
            <h4 className="font-heading font-bold text-slate-900 uppercase text-[11px] tracking-wider text-teal-700 flex items-center gap-1.5">
              <Calendar className="size-3.5" />
              <span>Examination Session</span>
            </h4>
            <p className="text-slate-700">
              Exam Date: <strong>{formatDate(exam.examDate)}</strong>
            </p>
            <p className="text-slate-700 flex items-center gap-1">
              <Clock className="size-3 text-slate-400" />
              <span>Time Slot: <strong>{exam.startTime} – {exam.endTime}</strong></span>
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100 flex flex-col gap-2.5 text-xs">
            <h4 className="font-heading font-bold text-slate-900 uppercase text-[11px] tracking-wider text-amber-700 flex items-center gap-1.5">
              <Clock className="size-3.5" />
              <span>Registration Window</span>
            </h4>
            <p className="text-slate-700">
              Opens: <strong>{formatDateTime(exam.registrationStartAt)}</strong>
            </p>
            <p className="text-slate-700">
              Closes: <strong className="text-amber-700">{formatDateTime(exam.registrationEndAt)}</strong>
            </p>
          </div>
        </div>

        {/* 4. Examination Instructions & OMR Rules */}
        <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100 flex flex-col gap-2 text-xs">
          <h4 className="font-heading font-bold text-slate-900 uppercase text-[11px] tracking-wider text-slate-700 flex items-center gap-1.5">
            <FileText className="size-3.5 text-slate-500" />
            <span>Instructions & Candidate Rules</span>
          </h4>
          <div className="whitespace-pre-line text-slate-600 font-normal leading-relaxed pl-1">
            {exam.instructions}
          </div>
        </div>

        {/* 5. Configured Centres & Rooms */}
        <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100 flex flex-col gap-3 text-xs">
          <div className="flex items-center justify-between">
            <h4 className="font-heading font-bold text-slate-900 uppercase text-[11px] tracking-wider text-indigo-700 flex items-center gap-1.5">
              <Building2 className="size-3.5" />
              <span>Centres & Halls ({displayCentres?.length || 0} Centres, {totalRooms} Rooms)</span>
            </h4>
            <button
              type="button"
              onClick={() => {
                onClose();
                onManageCentres(exam);
              }}
              className="text-teal-600 font-bold hover:underline cursor-pointer"
            >
              + Manage Centres
            </button>
          </div>

          {isLoadingCentres && displayCentres.length === 0 ? (
            <div className="p-4 text-center text-slate-400 flex items-center justify-center gap-2">
              <Loader2 className="size-4 animate-spin text-teal-600" />
              <span>Loading centres & halls...</span>
            </div>
          ) : displayCentres && displayCentres.length > 0 ? (
            <div className="space-y-2">
              {displayCentres.map((c) => (
                <div key={c.id} className="p-3 rounded-xl bg-white border border-slate-200/80 flex flex-col gap-1">
                  <div className="flex items-center justify-between font-bold text-slate-900">
                    <span>{c.name}</span>
                    <span className="text-[11px] font-semibold text-slate-500">{c.capacity} Seats Capacity</span>
                  </div>
                  <p className="text-[11px] text-slate-500">{c.address} ({c.venue})</p>
                  {c.rooms && c.rooms.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap mt-1">
                      {c.rooms.map((r) => (
                        <span key={r.id} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-mono font-semibold">
                          {r.roomNumber} ({r.capacity} seats)
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-400 italic">No examination halls or centres configured yet.</p>
          )}
        </div>

        {/* 6. Footer Action Controls */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
          >
            Close
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onChangeStatus(exam);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold text-xs transition-all cursor-pointer"
            >
              <RefreshCw className="size-3.5" />
              <span>Change Status</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                onEdit(exam);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <Edit2 className="size-3.5" />
              <span>Edit Model Test</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
