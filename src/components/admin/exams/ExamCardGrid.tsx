'use client';

import React from 'react';
import {
  Calendar,
  Clock,
  Target,
  Users,
  Building2,
  MoreVertical,
  Eye,
  Edit2,
  RefreshCw,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Clock3,
  FileCheck,
  ShieldCheck,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Exam, ExamStatus } from '@/types/exam.types';

interface ExamCardGridProps {
  exams: Exam[];
  onViewExam: (exam: Exam) => void;
  onEditExam: (exam: Exam) => void;
  onManageCentres: (exam: Exam) => void;
  onChangeStatus: (exam: Exam) => void;
  onDeleteExam: (exam: Exam) => void;
}

export function ExamCardGrid({
  exams,
  onViewExam,
  onEditExam,
  onManageCentres,
  onChangeStatus,
  onDeleteExam,
}: ExamCardGridProps) {
  const getStatusBadge = (status: ExamStatus) => {
    switch (status) {
      case 'REGISTRATION_OPEN':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-[11px] font-bold">
            <span className="size-1.5 rounded-full bg-teal-500 animate-pulse" />
            <span>Registration Open</span>
          </span>
        );
      case 'UPCOMING':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-[11px] font-bold">
            <Clock3 className="size-3 text-sky-600" />
            <span>Upcoming Exam</span>
          </span>
        );
      case 'REGISTRATION_CLOSED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-semibold">
            <AlertCircle className="size-3 text-amber-600" />
            <span>Reg Closed</span>
          </span>
        );
      case 'COMPLETED':
      case 'RESULT_PUBLISHED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold">
            <CheckCircle2 className="size-3 text-emerald-600" />
            <span>{status === 'RESULT_PUBLISHED' ? 'Results Live' : 'Completed'}</span>
          </span>
        );
      case 'DRAFT':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-[11px] font-semibold">
            <span>Draft</span>
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-[11px] font-semibold">
            <span>Cancelled</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px]">
            <span>{status}</span>
          </span>
        );
    }
  };

  const formatDate = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return isoStr.split('T')[0];
    }
  };

  const formatRegWindow = (startIso?: string, endIso?: string) => {
    if (!endIso) return 'Open';
    try {
      const endD = new Date(endIso);
      const startD = startIso ? new Date(startIso) : null;
      const timeFmt = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
      const dateFmt = new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short' });

      if (startD && startD.toDateString() === endD.toDateString()) {
        return `${dateFmt.format(endD)}, ${timeFmt.format(startD)} – ${timeFmt.format(endD)}`;
      }
      return `${dateFmt.format(endD)}, ${timeFmt.format(endD)}`;
    } catch {
      return endIso.split('T')[0];
    }
  };

  if (exams.length === 0) {
    return (
      <div className="w-full rounded-3xl bg-white/95 border border-white/90 shadow-[0_8px_24px_rgba(20,40,90,0.06)] p-12 text-center select-none">
        <FileCheck className="size-10 mx-auto text-slate-300 mb-2" />
        <p className="font-heading font-bold text-slate-700 text-sm">No Model Tests Found</p>
        <p className="text-xs text-slate-400 mt-1">Try changing your search query or status filter.</p>
      </div>
    );
  }

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 select-none">
      {exams.map((exam) => {
        const totalRooms = exam.centres?.reduce((acc, c) => acc + (c.rooms?.length || 0), 0) || 0;
        const totalCapacity = exam.centres?.reduce((acc, c) => acc + (c.capacity || 0), 0) || 0;
        const enrolledCount = exam._count?.enrollments || 0;

        return (
          <div
            key={exam.id}
            className="group rounded-3xl bg-white/95 border border-white/90 shadow-[0_8px_24px_rgba(20,40,90,0.05)] hover:shadow-[0_16px_36px_rgba(20,40,90,0.09)] transition-all duration-200 p-5 flex flex-col justify-between backdrop-blur-xl"
          >
            {/* 1. Header: Status + Exam Code + Action Menu */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  {getStatusBadge(exam.status)}
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-indigo-50 border border-indigo-200/70 text-[#37447E] font-mono text-[11px] font-bold">
                    <ShieldCheck className="size-3 text-indigo-500" />
                    {exam.code}
                  </span>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger className="size-8 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 inline-flex items-center justify-center text-slate-600 transition-all cursor-pointer">
                    <MoreVertical className="size-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 p-1.5 rounded-2xl border-slate-200/90 shadow-xl">
                    <DropdownMenuItem
                      onClick={() => onViewExam(exam)}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <Eye className="size-4 text-slate-500" />
                      <span>View Test Dossier</span>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => onEditExam(exam)}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <Edit2 className="size-4 text-teal-600" />
                      <span>Edit Exam Info</span>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => onManageCentres(exam)}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <Building2 className="size-4 text-indigo-600" />
                      <span>Centres & Seat Plan</span>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => onChangeStatus(exam)}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <RefreshCw className="size-4 text-sky-600" />
                      <span>Transition Lifecycle</span>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                      onClick={() => onDeleteExam(exam)}
                      className="flex items-center gap-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 cursor-pointer"
                    >
                      <Trash2 className="size-4 text-rose-500" />
                      <span>Cancel / Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Title & Description */}
              <h3 className="font-heading font-black text-base text-slate-900 line-clamp-1 leading-snug">
                {exam.title}
              </h3>
              <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                {exam.description}
              </p>

              {/* Schedule Info Box */}
              <div className="mt-4 p-3 rounded-2xl bg-slate-50/70 border border-slate-100 flex flex-col gap-2 text-xs">
                <div className="flex items-center justify-between text-slate-700">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Calendar className="size-3.5 text-teal-600 shrink-0" />
                    <span>Test Date:</span>
                  </span>
                  <strong className="text-slate-900">{formatDate(exam.examDate)}</strong>
                </div>

                <div className="flex items-center justify-between text-slate-700">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Clock className="size-3.5 text-sky-600 shrink-0" />
                    <span>Time Slot:</span>
                  </span>
                  <span className="font-semibold text-slate-800">
                    {exam.startTime} – {exam.endTime}
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-700 border-t border-slate-200/50 pt-1.5">
                  <span className="flex items-center gap-1.5 font-medium text-slate-500">
                    <span>Reg. Window:</span>
                  </span>
                  <span className="text-[11px] font-semibold text-amber-700">
                    {formatRegWindow(exam.registrationStartAt, exam.registrationEndAt)}
                  </span>
                </div>
              </div>

              {/* Metrics & Capacity Chips */}
              <div className="mt-3.5 grid grid-cols-2 gap-2 text-xs">
                {/* Marks Box */}
                <div className="p-2.5 rounded-xl bg-indigo-50/50 border border-indigo-100 flex items-center gap-2">
                  <Target className="size-4 text-indigo-600 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Total / Pass</span>
                    <strong className="text-slate-900">{exam.totalMarks}</strong>
                    <span className="text-slate-500 text-[11px]"> (Pass: {exam.passMarks})</span>
                  </div>
                </div>

                {/* Enrolled Box */}
                <div className="p-2.5 rounded-xl bg-teal-50/50 border border-teal-100 flex items-center gap-2">
                  <Users className="size-4 text-teal-600 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Examinees</span>
                    <strong className="text-slate-900">{enrolledCount}</strong>
                    <span className="text-slate-500 text-[11px]"> Enrolled</span>
                  </div>
                </div>
              </div>

              {/* Centre Badge */}
              <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                <span className="flex items-center gap-1.5 truncate">
                  <Building2 className="size-3 text-slate-400 shrink-0" />
                  <span>{exam.centres && exam.centres.length > 0 ? exam.centres[0].name : 'No Centres Configured'}</span>
                </span>
                <span className="font-bold text-slate-700 shrink-0 pl-2">
                  {totalRooms} Rooms ({totalCapacity} Seats)
                </span>
              </div>
            </div>

            {/* 2. Bottom Quick Action Buttons */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
              <button
                type="button"
                onClick={() => onViewExam(exam)}
                className="flex-1 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs transition-colors cursor-pointer text-center"
              >
                View Dossier
              </button>
              <button
                type="button"
                onClick={() => onManageCentres(exam)}
                className="py-2 px-3 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-700 font-bold text-xs transition-colors cursor-pointer text-center flex items-center gap-1"
              >
                <Building2 className="size-3.5" />
                <span>Centres</span>
              </button>
            </div>

          </div>
        );
      })}
    </div>
  );
}
