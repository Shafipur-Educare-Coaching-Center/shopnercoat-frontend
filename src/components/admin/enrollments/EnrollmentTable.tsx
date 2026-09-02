'use client';

import React from 'react';
import Image from 'next/image';
import { Eye, RefreshCw, Trash2, GraduationCap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ExamEnrollmentAdmin } from '@/types/exam.types';

interface EnrollmentTableProps {
  enrollments: ExamEnrollmentAdmin[];
  onView: (enrollment: ExamEnrollmentAdmin) => void;
  onChangeStatus: (enrollment: ExamEnrollmentAdmin) => void;
  onDelete: (enrollment: ExamEnrollmentAdmin) => void;
}

export function EnrollmentTable({
  enrollments,
  onView,
  onChangeStatus,
  onDelete,
}: EnrollmentTableProps) {
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
    <div className="w-full overflow-hidden rounded-3xl bg-white border border-slate-200/80 shadow-[0_4px_20px_rgba(20,40,90,0.04)] select-none">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          
          {/* Table Header */}
          <thead className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
            <tr>
              <th className="py-3.5 px-4">Candidate & Roll</th>
              <th className="py-3.5 px-4">Model Test</th>
              <th className="py-3.5 px-4">College</th>
              <th className="py-3.5 px-4">Seat Allocation</th>
              <th className="py-3.5 px-4">Admit Card</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
            {enrollments.map((item) => {
              const student = item.student;
              const exam = item.exam;
              const seat = item.seatPlan;

              return (
                <tr key={item.id} className="hover:bg-slate-50/60 transition-colors group">
                  
                  {/* Candidate Profile */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="relative size-9 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                        <Image
                          src={student?.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                          alt={student?.fullName || 'Candidate'}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <strong className="font-bold text-slate-900 block line-clamp-1 group-hover:text-teal-700 transition-colors">
                          {student?.fullName}
                        </strong>
                        <span className="font-mono text-[11px] font-semibold text-[#37447E]">
                          Roll: {student?.rollNumber}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Model Test */}
                  <td className="py-3.5 px-4">
                    <span className="font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-lg border border-teal-200/60 text-[11px] inline-block mb-0.5">
                      {exam?.code}
                    </span>
                    <span className="text-[11px] text-slate-500 block truncate max-w-[180px]">
                      {exam?.title}
                    </span>
                  </td>

                  {/* College */}
                  <td className="py-3.5 px-4">
                    <span className="text-slate-700 text-xs truncate max-w-[160px] block">
                      {student?.collegeName || 'N/A'}
                    </span>
                  </td>

                  {/* Seat Allocation */}
                  <td className="py-3.5 px-4">
                    {seat ? (
                      <div>
                        <span className="font-semibold text-slate-800 block text-[11px]">
                          {seat.roomNumber} ({seat.seatNumber})
                        </span>
                        <span className="text-[10px] text-slate-400 block truncate max-w-[150px]">
                          {seat.centreName}
                        </span>
                      </div>
                    ) : (
                      <span className="text-slate-400 italic text-[11px]">Unassigned</span>
                    )}
                  </td>

                  {/* Admit Card Status */}
                  <td className="py-3.5 px-4">
                    {item.admitCard?.status === 'GENERATED' ? (
                      <span className="px-2 py-0.5 rounded-md bg-sky-50 text-sky-700 border border-sky-200 text-[10px] font-mono font-bold">
                        Issued
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 text-[10px] font-mono">
                        Not Issued
                      </span>
                    )}
                  </td>

                  {/* Enrollment Status Badge */}
                  <td className="py-3.5 px-4">
                    <Badge
                      variant={
                        item.status === 'ENROLLED'
                          ? 'calmTeal'
                          : item.status === 'CANCELLED'
                          ? 'calmRose'
                          : 'calmAmber'
                      }
                      className="text-[10px]"
                    >
                      {item.status.replace('_', ' ')}
                    </Badge>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => onView(item)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                        title="View Dossier"
                      >
                        <Eye className="size-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onChangeStatus(item)}
                        className="p-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 transition-colors cursor-pointer"
                        title="Change Status"
                      >
                        <RefreshCw className="size-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onDelete(item)}
                        className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                        title="Revoke Registration"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </td>

                </tr>
              );
            })}
          </tbody>

        </table>
      </div>
    </div>
  );
}
