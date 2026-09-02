'use client';

import React from 'react';
import Image from 'next/image';
import {
  Eye,
  RefreshCw,
  Trash2,
  Building2,
  Phone,
  GraduationCap,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ExamEnrollmentAdmin } from '@/types/exam.types';

interface EnrollmentCardGridProps {
  enrollments: ExamEnrollmentAdmin[];
  onView: (enrollment: ExamEnrollmentAdmin) => void;
  onChangeStatus: (enrollment: ExamEnrollmentAdmin) => void;
  onDelete: (enrollment: ExamEnrollmentAdmin) => void;
}

export function EnrollmentCardGrid({
  enrollments,
  onView,
  onChangeStatus,
  onDelete,
}: EnrollmentCardGridProps) {
  if (enrollments.length === 0) {
    return (
      <div className="w-full p-12 text-center bg-white rounded-3xl border border-dashed border-slate-200 text-slate-400 select-none">
        <GraduationCap className="size-10 mx-auto text-slate-300 mb-2" />
        <h3 className="font-heading font-bold text-slate-700 text-sm">No Candidate Registrations Found</h3>
        <p className="text-xs text-slate-400 mt-1">Try clearing filters or search queries.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 select-none">
      {enrollments.map((item) => {
        const student = item.student;
        const exam = item.exam;
        const seat = item.seatPlan;

        return (
          <div
            key={item.id}
            className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-[0_4px_20px_rgba(20,40,90,0.04)] hover:shadow-md transition-all flex flex-col justify-between gap-4 group"
          >
            {/* Top Row: Student Avatar + Roll + Status Badge */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="relative size-12 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/80 shrink-0">
                  <Image
                    src={student?.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                    alt={student?.fullName || 'Candidate'}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-heading font-black text-sm text-slate-900 line-clamp-1 group-hover:text-teal-700 transition-colors">
                    {student?.fullName || 'Candidate Name'}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="font-mono text-xs font-bold text-[#37447E]">
                      Roll: {student?.rollNumber || 'N/A'}
                    </span>
                    <span className="text-[10px] text-slate-400">• Reg: {student?.registrationNumber}</span>
                  </div>
                </div>
              </div>

              <Badge
                variant={
                  item.status === 'ENROLLED'
                    ? 'calmTeal'
                    : item.status === 'CANCELLED'
                    ? 'calmRose'
                    : 'calmAmber'
                }
                className="shrink-0 text-[10px]"
              >
                {item.status.replace('_', ' ')}
              </Badge>
            </div>

            {/* Middle Section: Exam Code, College & Seat Assignment */}
            <div className="p-3 rounded-2xl bg-slate-50/70 border border-slate-100 flex flex-col gap-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-lg border border-teal-200/60 text-[11px]">
                  {exam?.code || 'EXAM'}
                </span>
                <span className="text-slate-500 text-[11px] line-clamp-1">{student?.collegeName}</span>
              </div>

              {seat ? (
                <div className="flex items-center gap-1.5 text-slate-700 text-[11px] mt-0.5">
                  <Building2 className="size-3.5 text-indigo-600 shrink-0" />
                  <span className="font-medium truncate">
                    {seat.centreName} — <strong>{seat.roomNumber}</strong> ({seat.seatNumber})
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-slate-400 text-[11px] italic">
                  <Building2 className="size-3.5 text-slate-300 shrink-0" />
                  <span>Seat plan pending allocation</span>
                </div>
              )}
            </div>

            {/* Footer Action Buttons */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Phone className="size-3 text-slate-400" />
                <span>{student?.user?.mobileNumber || 'N/A'}</span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => onView(item)}
                  className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
                  title="View Candidate Dossier"
                >
                  <Eye className="size-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => onChangeStatus(item)}
                  className="px-2.5 py-1 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 font-semibold text-xs transition-colors cursor-pointer"
                  title="Update Status"
                >
                  <RefreshCw className="size-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => onDelete(item)}
                  className="px-2.5 py-1 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-semibold text-xs transition-colors cursor-pointer"
                  title="Revoke Registration"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>

          </div>
        );
      })}
    </div>
  );
}
