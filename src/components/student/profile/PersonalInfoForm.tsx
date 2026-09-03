'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Student } from '@/types/student.types';
import { updateStudentProfileAction } from '@/features/student/actions/profileActions';
import {
  User,
  Building2,
  Calendar,
  Phone,
  MapPin,
  Camera,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';

interface PersonalInfoFormProps {
  student: Student | null;
}

export function PersonalInfoForm({ student }: PersonalInfoFormProps) {
  const [fullName, setFullName] = useState(student?.fullName || '');
  const [collegeName, setCollegeName] = useState(student?.collegeName || '');
  const [dateOfBirth, setDateOfBirth] = useState(
    student?.dateOfBirth ? student.dateOfBirth.split('T')[0] : '2006-05-14'
  );
  const [fatherName, setFatherName] = useState(student?.fatherName || '');
  const [motherName, setMotherName] = useState(student?.motherName || '');
  const [parentMobileNumber, setParentMobileNumber] = useState(student?.parentMobileNumber || '');
  const [guardianMobileNumber, setGuardianMobileNumber] = useState(student?.guardianMobileNumber || '');
  const [presentAddress, setPresentAddress] = useState(student?.presentAddress || '');
  const [permanentAddress, setPermanentAddress] = useState(student?.permanentAddress || '');
  const [photoUrl, setPhotoUrl] = useState(student?.photoUrl || '');

  const [isPending, setIsPending] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    setStatusMessage(null);

    try {
      const res = await updateStudentProfileAction({
        fullName: fullName.trim(),
        collegeName: collegeName.trim(),
        dateOfBirth: new Date(dateOfBirth).toISOString(),
        fatherName: fatherName.trim(),
        motherName: motherName.trim(),
        parentMobileNumber: parentMobileNumber.trim(),
        guardianMobileNumber: guardianMobileNumber.trim() || undefined,
        presentAddress: presentAddress.trim(),
        permanentAddress: permanentAddress.trim(),
        photoUrl: photoUrl.trim() || undefined,
      });

      if (res.success) {
        setStatusMessage({ type: 'success', text: res.message });
      } else {
        setStatusMessage({ type: 'error', text: res.message });
      }
    } catch {
      setStatusMessage({ type: 'error', text: 'An unexpected error occurred while saving.' });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6">
      
      {/* Alert Status Banner */}
      {statusMessage ? (
        <div
          className={`p-4 rounded-2xl border text-xs font-bold flex items-center gap-2.5 animate-in fade-in-50 duration-200 ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
              : 'bg-rose-50 text-rose-900 border-rose-200'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="size-4 text-rose-600 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      ) : null}

      {/* Avatar Photo Section */}
      <div className="p-5 rounded-[24px] bg-white border border-slate-200/80 shadow-2xs space-y-4">
        <h3 className="font-heading font-black text-sm text-slate-900 flex items-center gap-2">
          <Camera className="size-4 text-[#00796B]" />
          <span>Candidate Photo &amp; Avatar</span>
        </h3>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="size-20 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center shrink-0 overflow-hidden shadow-2xs">
            {photoUrl ? (
              <Image
                src={photoUrl}
                alt="Avatar"
                width={80}
                height={80}
                className="size-full object-cover"
              />
            ) : (
              <div className="size-full rounded-2xl bg-[#00594D] text-white flex items-center justify-center font-bold text-xl">
                {fullName ? fullName.charAt(0).toUpperCase() : 'S'}
              </div>
            )}
          </div>

          <div className="flex-1 w-full space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Photo Image URL</label>
            <input
              type="url"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              placeholder="https://example.com/avatar.jpg"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-hidden focus:ring-2 focus:ring-[#00796B]/25 focus:border-[#00796B] transition-all"
            />
            <p className="text-[11px] text-slate-400">
              Provide a direct URL to a standard passport-sized candidate photograph.
            </p>
          </div>
        </div>
      </div>

      {/* Personal Identity Grid */}
      <div className="p-6 rounded-[24px] bg-white border border-slate-200/80 shadow-2xs space-y-4">
        <h3 className="font-heading font-black text-sm text-slate-900 flex items-center gap-2">
          <User className="size-4 text-[#00796B]" />
          <span>Personal Information</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">Candidate Full Name *</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs sm:text-sm text-slate-900 outline-hidden focus:ring-2 focus:ring-[#00796B]/25 focus:border-[#00796B] transition-all"
            />
          </div>

          {/* College Name */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">College / Institution *</label>
            <input
              type="text"
              required
              value={collegeName}
              onChange={(e) => setCollegeName(e.target.value)}
              placeholder="e.g. Notre Dame College, Dhaka"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs sm:text-sm text-slate-900 outline-hidden focus:ring-2 focus:ring-[#00796B]/25 focus:border-[#00796B] transition-all"
            />
          </div>

          {/* Date of Birth */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">Date of Birth *</label>
            <input
              type="date"
              required
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs sm:text-sm text-slate-900 outline-hidden focus:ring-2 focus:ring-[#00796B]/25 focus:border-[#00796B] transition-all"
            />
          </div>

          {/* Father's Name */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">Father&apos;s Name *</label>
            <input
              type="text"
              required
              value={fatherName}
              onChange={(e) => setFatherName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs sm:text-sm text-slate-900 outline-hidden focus:ring-2 focus:ring-[#00796B]/25 focus:border-[#00796B] transition-all"
            />
          </div>

          {/* Mother's Name */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">Mother&apos;s Name *</label>
            <input
              type="text"
              required
              value={motherName}
              onChange={(e) => setMotherName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs sm:text-sm text-slate-900 outline-hidden focus:ring-2 focus:ring-[#00796B]/25 focus:border-[#00796B] transition-all"
            />
          </div>

          {/* Parent Mobile */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">Parent Mobile Number *</label>
            <input
              type="tel"
              required
              value={parentMobileNumber}
              onChange={(e) => setParentMobileNumber(e.target.value)}
              placeholder="01XXXXXXXXX"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs sm:text-sm text-slate-900 outline-hidden focus:ring-2 focus:ring-[#00796B]/25 focus:border-[#00796B] transition-all"
            />
          </div>
        </div>
      </div>

      {/* Address Details */}
      <div className="p-6 rounded-[24px] bg-white border border-slate-200/80 shadow-2xs space-y-4">
        <h3 className="font-heading font-black text-sm text-slate-900 flex items-center gap-2">
          <MapPin className="size-4 text-[#00796B]" />
          <span>Address Details</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">Present Address *</label>
            <textarea
              rows={2}
              required
              value={presentAddress}
              onChange={(e) => setPresentAddress(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs sm:text-sm text-slate-900 outline-hidden focus:ring-2 focus:ring-[#00796B]/25 focus:border-[#00796B] transition-all resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">Permanent Address *</label>
            <textarea
              rows={2}
              required
              value={permanentAddress}
              onChange={(e) => setPermanentAddress(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs sm:text-sm text-slate-900 outline-hidden focus:ring-2 focus:ring-[#00796B]/25 focus:border-[#00796B] transition-all resize-none"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="px-6 py-3 rounded-2xl bg-[#00796B] hover:bg-[#00594D] text-white font-bold text-xs sm:text-sm shadow-xs transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              <span>Saving Changes...</span>
            </>
          ) : (
            <>
              <Save className="size-4" />
              <span>Save Profile Details</span>
            </>
          )}
        </button>
      </div>

    </form>
  );
}

export default PersonalInfoForm;
