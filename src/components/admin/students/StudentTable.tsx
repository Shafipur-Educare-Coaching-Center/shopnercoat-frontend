'use client';

import React from 'react';
import {
  MoreVertical,
  Eye,
  Edit2,
  Trash2,
  Phone,
  School,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileCheck,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Student } from '@/types/student.types';

interface StudentTableProps {
  students: Student[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  onViewStudent: (student: Student) => void;
  onEditStudent: (student: Student) => void;
  onDeleteStudent: (student: Student) => void;
}

export function StudentTable({
  students,
  currentPage,
  totalPages,
  totalCount,
  onPageChange,
  onViewStudent,
  onEditStudent,
  onDeleteStudent,
}: StudentTableProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-semibold">
            <CheckCircle2 className="size-3 text-emerald-600" />
            <span>Verified</span>
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-semibold">
            <AlertTriangle className="size-3 text-amber-600" />
            <span>Pending Profile</span>
          </span>
        );
      case 'REJECTED':
      case 'SUSPENDED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-[11px] font-semibold">
            <XCircle className="size-3 text-rose-600" />
            <span>Suspended</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-semibold">
            <span>{status}</span>
          </span>
        );
    }
  };

  return (
    <div className="w-full rounded-3xl bg-white/95 border border-white/90 shadow-[0_8px_24px_rgba(20,40,90,0.06)] p-4 sm:p-6 backdrop-blur-xl select-none">
      
      {/* Desktop & Tablet Table */}
      <div className="w-full overflow-x-auto rounded-2xl border border-slate-100 bg-white/50">
        <table className="w-full text-left text-xs text-slate-700 border-collapse min-w-[850px]">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
              <th className="py-3 px-4">Candidate Profile</th>
              <th className="py-3 px-4">Roll & Registration</th>
              <th className="py-3 px-4">HSC College</th>
              <th className="py-3 px-4">Parent / Guardian Contact</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100/80">
            {students.length > 0 ? (
              students.map((student) => {
                const initials = student.fullName
                  .split(' ')
                  .filter(Boolean)
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join('')
                  .toUpperCase() || 'SC';

                return (
                  <tr
                    key={student.id}
                    className="hover:bg-slate-50/60 transition-colors group cursor-default"
                  >
                    {/* Candidate Details */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="size-10 rounded-2xl border-2 border-white shadow-2xs shrink-0">
                          {student.photoUrl && <AvatarImage src={student.photoUrl} alt={student.fullName} />}
                          <AvatarFallback className="rounded-2xl bg-teal-50 text-teal-700 font-bold text-xs">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col min-w-0">
                          <span className="font-bold text-slate-900 truncate">
                            {student.fullName}
                          </span>
                          <span className="text-[11px] text-slate-400 truncate">
                            {student.user?.email || student.user?.mobileNumber || 'No email registered'}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Roll & Reg No */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col gap-1">
                        <span className="inline-flex items-center gap-1 font-mono font-bold text-[#37447E] bg-indigo-50/80 px-2.5 py-0.5 rounded-lg border border-indigo-200/60 text-xs w-fit">
                          <ShieldCheck className="size-3 text-indigo-500" />
                          Roll #{student.rollNumber}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400 pl-1">
                          Reg #{student.registrationNumber}
                        </span>
                      </div>
                    </td>

                    {/* HSC College */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <School className="size-3.5 text-teal-600 shrink-0" />
                        <span className="font-semibold text-slate-800 truncate max-w-[200px]">
                          {student.collegeName || 'Not Assigned'}
                        </span>
                      </div>
                    </td>

                    {/* Parent Mobile & Guardian */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1 text-slate-700 font-mono text-xs font-semibold">
                          <Phone className="size-3 text-slate-400" />
                          <span>{student.parentMobileNumber}</span>
                        </div>
                        <span className="text-[11px] text-slate-400 truncate">
                          F: {student.fatherName}
                        </span>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4">
                      {getStatusBadge(student.registrationStatus)}
                    </td>

                    {/* Actions Menu */}
                    <td className="py-3.5 px-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="size-8 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 inline-flex items-center justify-center text-slate-600 transition-all cursor-pointer">
                          <MoreVertical className="size-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 p-1.5 rounded-2xl border-slate-200/90 shadow-xl">
                          <DropdownMenuItem
                            onClick={() => onViewStudent(student)}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <Eye className="size-4 text-slate-500" />
                            <span>View Full Profile</span>
                          </DropdownMenuItem>
                          
                          <DropdownMenuItem
                            onClick={() => onEditStudent(student)}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <Edit2 className="size-4 text-teal-600" />
                            <span>Edit Candidate</span>
                          </DropdownMenuItem>

                          <DropdownMenuSeparator />

                          <DropdownMenuItem
                            onClick={() => onDeleteStudent(student)}
                            className="flex items-center gap-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 cursor-pointer"
                          >
                            <Trash2 className="size-4 text-rose-500" />
                            <span>Suspend / Remove</span>
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
                  No medical admission candidates found matching your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span>
          Showing <strong className="text-slate-800">{students.length}</strong> of{' '}
          <strong className="text-slate-800">{totalCount}</strong> candidates
        </span>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
            className="size-8 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 flex items-center justify-center text-slate-600 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer"
          >
            <ChevronLeft className="size-4" />
          </button>

          <span className="text-xs font-semibold text-slate-700 px-2">
            Page {currentPage} of {totalPages}
          </span>

          <button
            type="button"
            onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="size-8 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 flex items-center justify-center text-slate-600 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

    </div>
  );
}
