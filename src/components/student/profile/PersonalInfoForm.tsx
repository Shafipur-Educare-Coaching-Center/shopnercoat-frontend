'use client';

import React, { useState, useEffect } from 'react';
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
  Lock,
  ShieldAlert,
} from 'lucide-react';

interface PersonalInfoFormProps {
  student: Student | null;
}

export function PersonalInfoForm({ student }: PersonalInfoFormProps) {
  const [collegeName, setCollegeName] = useState(student?.collegeName || '');
  const [fatherName, setFatherName] = useState(student?.fatherName || '');
  const [motherName, setMotherName] = useState(student?.motherName || '');
  const [presentAddress, setPresentAddress] = useState(student?.presentAddress || '');
  const [permanentAddress, setPermanentAddress] = useState(student?.permanentAddress || '');
  const [photoUrl, setPhotoUrl] = useState(student?.photoUrl || '');

  const fullName = student?.fullName || 'Candidate Aspirant';
  const dateOfBirth = student?.dateOfBirth ? student.dateOfBirth.split('T')[0] : '2006-05-14';
  const parentMobileNumber = student?.parentMobileNumber || student?.user?.mobileNumber || '---';
  const rollDisplay = student?.rollNumber ? String(student.rollNumber).padStart(7, '0') : '---';

  const [isPending, setIsPending] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  useEffect(() => {
    if (student) {
      if (student.collegeName) setCollegeName(student.collegeName);
      if (student.fatherName) setFatherName(student.fatherName);
      if (student.motherName) setMotherName(student.motherName);
      if (student.presentAddress) setPresentAddress(student.presentAddress);
      if (student.permanentAddress) setPermanentAddress(student.permanentAddress);
      if (student.photoUrl) setPhotoUrl(student.photoUrl);
    }
  }, [student]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    setStatusMessage(null);

    try {
      const payload: Record<string, string> = {
        collegeName: collegeName.trim(),
        fatherName: fatherName.trim(),
        motherName: motherName.trim(),
        presentAddress: presentAddress.trim(),
        permanentAddress: permanentAddress.trim(),
      };

      if (photoUrl && photoUrl.trim().startsWith('http')) {
        payload.photoUrl = photoUrl.trim();
      }

      const res = await updateStudentProfileAction(payload);

      if (res.success) {
        setStatusMessage({ type: 'success', text: res.message });
        if (res.data) {
          if (res.data.collegeName) setCollegeName(res.data.collegeName);
          if (res.data.fatherName) setFatherName(res.data.fatherName);
          if (res.data.motherName) setMotherName(res.data.motherName);
          if (res.data.presentAddress) setPresentAddress(res.data.presentAddress);
          if (res.data.permanentAddress) setPermanentAddress(res.data.permanentAddress);
          if (res.data.photoUrl) setPhotoUrl(res.data.photoUrl);
        }
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
              Direct URL to your passport-sized photo for verified admit card pass generation.
            </p>
          </div>
        </div>
      </div>

      {/* Fixed Identity Banner */}
      <div className="p-5 rounded-[24px] bg-amber-50/70 border border-amber-200/80 text-xs space-y-3">
        <div className="flex items-center gap-2 text-amber-900 font-bold">
          <ShieldAlert className="size-4 text-amber-600 shrink-0" />
          <span>Immutable Central Board Credentials</span>
        </div>
        <p className="text-[11px] text-amber-800">
          Official Candidate Name, Date of Birth, and Registered Roll Number are locked once registration is verified. For corrections, please contact the central examination board.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div className="p-3 bg-white/80 rounded-xl border border-amber-200/50">
            <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
              <Lock className="size-2.5 text-slate-400" /> Candidate Name
            </span>
            <p className="font-bold text-xs text-slate-900 truncate mt-0.5">{fullName}</p>
          </div>

          <div className="p-3 bg-white/80 rounded-xl border border-amber-200/50">
            <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
              <Lock className="size-2.5 text-slate-400" /> Date of Birth
            </span>
            <p className="font-mono font-bold text-xs text-slate-900 mt-0.5">{dateOfBirth}</p>
          </div>

          <div className="p-3 bg-white/80 rounded-xl border border-amber-200/50">
            <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
              <Lock className="size-2.5 text-slate-400" /> Registered Mobile
            </span>
            <p className="font-mono font-bold text-xs text-slate-900 mt-0.5">{parentMobileNumber}</p>
          </div>
        </div>
      </div>

      {/* Editable Information Grid */}
      <div className="p-6 rounded-[24px] bg-white border border-slate-200/80 shadow-2xs space-y-4">
        <h3 className="font-heading font-black text-sm text-slate-900 flex items-center gap-2">
          <User className="size-4 text-[#00796B]" />
          <span>Editable Profile Details</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {/* College Name */}
          <div className="space-y-1.5 sm:col-span-2">
            <label className="font-bold text-slate-700">College / Academic Institution *</label>
            <input
              type="text"
              required
              value={collegeName}
              onChange={(e) => setCollegeName(e.target.value)}
              placeholder="e.g. Notre Dame College, Dhaka"
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
