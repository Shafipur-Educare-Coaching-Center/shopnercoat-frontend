'use client';

import React from 'react';
import {
  MoreVertical,
  Eye,
  Edit2,
  Building2,
  RefreshCw,
  Trash2,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Clock3,
  ShieldCheck,
  FileCheck,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Exam, ExamStatus } from '@/types/exam.types';

interface ExamTableProps {
  exams: Exam[];
  onViewExam: (exam: Exam) => void;
  onEditExam: (exam: Exam) => void;
  onManageCentres: (exam: Exam) => void;
  onChangeStatus: (exam: Exam) => void;
  onDeleteExam: (exam: Exam) => void;
}

export function ExamTable({
  exams,
  onViewExam,
  onEditExam,
  onManageCentres,
  onChangeStatus,
  onDeleteExam,
}: ExamTableProps) {
  const getStatusBadge = (status: ExamStatus) => {
    switch (status) {
      case 'REGISTRATION_OPEN':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-[11px] font-bold">
            <span className="size-1.5 rounded-full bg-teal-500 animate-pulse" />
            <span>Open</span>
          </span>
        );
      case 'UPCOMING':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-[11px] font-bold">
            <Clock3 className="size-3 text-sky-600" />
            <span>Upcoming</span>
          </span>
        );
      case 'REGISTRATION_CLOSED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-semibold">
            <AlertCircle className="size-3 text-amber-600" />
            <span>Closed</span>
          </span>
        );
      case 'COMPLETED':
      case 'RESULT_PUBLISHED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold">
            <CheckCircle2 className="size-3 text-emerald-600" />
            <span>{status === 'RESULT_PUBLISHED' ? 'Published' : 'Done'}</span>
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

  return (
    <div className="w-full rounded-3xl bg-white/95 border border-white/90 shadow-[0_8px_24px_rgba(20,40,90,0.06)] p-4 sm:p-6 backdrop-blur-xl select-none">
      <div className="w-full overflow-x-auto rounded-2xl border border-slate-100 bg-white/50">
        <table className="w-full text-left text-xs text-slate-700 border-collapse min-w-[850px]">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
              <th className="py-3 px-4">Model Test & Code</th>
              <th className="py-3 px-4">Schedule & Time</th>
              <th className="py-3 px-4">Marks (Total/Pass)</th>
              <th className="py-3 px-4">Centres & Capacity</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100/80">
            {exams.length > 0 ? (
              exams.map((exam) => {
                const totalRooms = exam.centres?.reduce((acc, c) => acc + (c.rooms?.length || 0), 0) || 0;
                const totalCapacity = exam.centres?.reduce((acc, c) => acc + (c.capacity || 0), 0) || 0;

                return (
                  <tr
                    key={exam.id}
                    className="hover:bg-slate-50/60 transition-colors group cursor-default"
                  >
                    {/* Title & Code */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col gap-1 max-w-[280px]">
                        <span className="font-bold text-slate-900 truncate">
                          {exam.title}
                        </span>
                        <span className="inline-flex items-center gap-1 font-mono font-bold text-[#37447E] bg-indigo-50/80 px-2 py-0.5 rounded-lg border border-indigo-200/60 text-[11px] w-fit">
                          <ShieldCheck className="size-3 text-indigo-500" />
                          {exam.code}
                        </span>
                      </div>
                    </td>

                    {/* Schedule */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-800 flex items-center gap-1">
                          <Calendar className="size-3 text-teal-600" />
                          {formatDate(exam.examDate)}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {exam.startTime} – {exam.endTime}
                        </span>
                      </div>
                    </td>

                    {/* Marks */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col font-medium">
                        <span className="text-slate-900 font-bold">{exam.totalMarks} Marks</span>
                        <span className="text-[11px] text-slate-400">Pass Mark: {exam.passMarks}</span>
                      </div>
                    </td>

                    {/* Centres & Rooms */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-800 truncate max-w-[180px]">
                          {exam.centres && exam.centres.length > 0 ? exam.centres[0].name : 'No Centres'}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {totalRooms} Rooms ({totalCapacity} Seats)
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      {getStatusBadge(exam.status)}
                    </td>

                    {/* Actions Menu */}
                    <td className="py-3.5 px-4 text-right">
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
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-400 text-xs">
                  <FileCheck className="size-8 mx-auto text-slate-300 mb-2" />
                  No model tests found matching your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
