'use client';

import React from 'react';
import Image from 'next/image';
import {
  X,
  ShieldCheck,
  School,
  Phone,
  Mail,
  Calendar,
  MapPin,
  User,
  Edit2,
  Copy,
  Check,
} from 'lucide-react';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Student } from '@/types/student.types';

interface StudentDetailDrawerProps {
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (student: Student) => void;
}

// Helper function to format DOB into normalized standard date and age
function formatDOB(dateStr?: string | null): string {
  if (!dateStr) return 'N/A';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr.split('T')[0];

    const formatted = d.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });

    const diffMs = Date.now() - d.getTime();
    const age = Math.floor(diffMs / (365.25 * 24 * 60 * 60 * 1000));
    if (age > 0 && age < 100) {
      return `${formatted} (${age} yrs)`;
    }
    return formatted;
  } catch {
    return dateStr.split('T')[0];
  }
}

export function StudentDetailDrawer({
  student,
  isOpen,
  onClose,
  onEdit,
}: StudentDetailDrawerProps) {
  const [copiedField, setCopiedField] = React.useState<string | null>(null);

  if (!isOpen || !student) return null;

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    toast.success(`Copied ${label}`, { description: text });
    setTimeout(() => setCopiedField(null), 2000);
  };

  const initials = student.fullName
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'SC';

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

        {/* 1. Header Profile Banner */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 pt-2">
          <Avatar className="size-20 rounded-3xl border-4 border-white shadow-md shrink-0">
            {student.photoUrl && <AvatarImage src={student.photoUrl} alt={student.fullName} />}
            <AvatarFallback className="rounded-3xl bg-teal-50 text-teal-700 font-black text-xl">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 text-center sm:text-left min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-heading font-black text-xl text-slate-900">
                  {student.fullName}
                </h3>
                <p className="text-xs text-slate-500 flex items-center justify-center sm:justify-start gap-1 mt-0.5">
                  <School className="size-3.5 text-teal-600" />
                  <span>{student.collegeName || 'HSC College Not Set'}</span>
                </p>
              </div>

              <Badge variant={student.registrationStatus === 'COMPLETED' ? 'calmEmerald' : 'calmAmber'}>
                {student.registrationStatus === 'COMPLETED' ? 'Verified Candidate' : 'Pending Review'}
              </Badge>
            </div>

            {/* Roll & Reg Number Credentials Box */}
            <div className="flex items-center justify-center sm:justify-start flex-wrap gap-2.5 mt-3">
              <button
                type="button"
                onClick={() => handleCopy(String(student.rollNumber), 'Roll Number')}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-indigo-50 border border-indigo-200/80 text-[#37447E] font-mono text-xs font-bold hover:bg-indigo-100 transition-colors cursor-pointer"
              >
                <ShieldCheck className="size-3.5 text-indigo-600" />
                <span>Roll #{student.rollNumber}</span>
                {copiedField === 'Roll Number' ? <Check className="size-3 text-emerald-600" /> : <Copy className="size-3 text-indigo-400" />}
              </button>

              <button
                type="button"
                onClick={() => handleCopy(String(student.registrationNumber), 'Registration Number')}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 font-mono text-xs font-semibold hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <span>Reg #{student.registrationNumber}</span>
                {copiedField === 'Registration Number' ? <Check className="size-3 text-emerald-600" /> : <Copy className="size-3 text-slate-400" />}
              </button>
            </div>

          </div>
        </div>

        {/* 2. Information Grid Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Section A: Contact & Personal */}
          <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100 flex flex-col gap-2.5 text-xs">
            <h4 className="font-heading font-bold text-slate-900 uppercase text-[11px] tracking-wider text-teal-700 flex items-center gap-1.5">
              <User className="size-3.5" />
              <span>Personal & Contact</span>
            </h4>

            <div className="flex items-center gap-2 text-slate-700">
              <Calendar className="size-3.5 text-slate-400 shrink-0" />
              <span>DOB: <strong>{formatDOB(student.dateOfBirth)}</strong></span>
            </div>

            <div className="flex items-center gap-2 text-slate-700">
              <Phone className="size-3.5 text-slate-400 shrink-0" />
              <span>Candidate Mobile: <strong>{student.user?.mobileNumber || 'N/A'}</strong></span>
            </div>

            <div className="flex items-center gap-2 text-slate-700">
              <Mail className="size-3.5 text-slate-400 shrink-0" />
              <span className="truncate">Email: <strong>{student.user?.email || 'N/A'}</strong></span>
            </div>
          </div>

          {/* Section B: Parents & Guardians */}
          <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100 flex flex-col gap-2.5 text-xs">
            <h4 className="font-heading font-bold text-slate-900 uppercase text-[11px] tracking-wider text-indigo-700 flex items-center gap-1.5">
              <Phone className="size-3.5" />
              <span>Guardians & Emergency</span>
            </h4>

            <div className="text-slate-700">
              <span>Father: <strong>{student.fatherName}</strong></span>
            </div>

            <div className="text-slate-700">
              <span>Mother: <strong>{student.motherName}</strong></span>
            </div>

            <div className="text-slate-700">
              <span>Parent Mobile: <strong className="font-mono">{student.parentMobileNumber}</strong></span>
            </div>

            {student.guardianMobileNumber && (
              <div className="text-slate-700">
                <span>Guardian Mobile: <strong className="font-mono">{student.guardianMobileNumber}</strong></span>
              </div>
            )}
          </div>

          {/* Section C: Addresses */}
          <div className="md:col-span-2 p-4 rounded-2xl bg-slate-50/70 border border-slate-100 flex flex-col gap-2 text-xs">
            <h4 className="font-heading font-bold text-slate-900 uppercase text-[11px] tracking-wider text-slate-600 flex items-center gap-1.5">
              <MapPin className="size-3.5" />
              <span>Residential Addresses</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-700 mt-1">
              <div>
                <span className="text-slate-400 font-medium block text-[11px]">Present Address</span>
                <span className="font-medium">{student.presentAddress}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block text-[11px]">Permanent Address</span>
                <span className="font-medium">{student.permanentAddress}</span>
              </div>
            </div>
          </div>

          {/* Section D: Digital Signature Preview */}
          {student.signatureUrl && (
            <div className="md:col-span-2 p-4 rounded-2xl bg-slate-50/70 border border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Official Digital Signature
                </span>
                <span className="text-xs text-slate-500">
                  Attached to admit cards and grade transcripts.
                </span>
              </div>
              <div className="h-12 w-32 rounded-xl bg-white border border-slate-200 p-1 flex items-center justify-center overflow-hidden">
                <Image
                  src={student.signatureUrl}
                  alt="Candidate Signature"
                  width={120}
                  height={40}
                  className="max-h-full w-auto object-contain"
                />
              </div>
            </div>
          )}

        </div>

        {/* 3. Footer Action Controls */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
          >
            Close
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onEdit(student);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <Edit2 className="size-3.5" />
            <span>Edit Candidate Info</span>
          </button>
        </div>

      </div>
    </div>
  );
}
