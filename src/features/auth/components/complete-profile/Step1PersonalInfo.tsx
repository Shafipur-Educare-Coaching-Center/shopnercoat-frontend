'use client';

import React from 'react';
import { User, Calendar, Building2 } from 'lucide-react';

interface Step1PersonalInfoProps {
  fullName: string;
  setFullName: (val: string) => void;
  dateOfBirth: string;
  setDateOfBirth: (val: string) => void;
  collegeName: string;
  setCollegeName: (val: string) => void;
}

export function Step1PersonalInfo({
  fullName,
  setFullName,
  dateOfBirth,
  setDateOfBirth,
  collegeName,
  setCollegeName,
}: Step1PersonalInfoProps) {
  return (
    <div className="space-y-4 animate-in fade-in-50 duration-200">
      
      {/* Full Name */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-slate-800">
          Full Name (As per SSC/HSC Certificate) *
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <User className="size-4.5" />
          </div>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="e.g. Rahim Uddin"
            className="w-full pl-10 pr-3.5 py-3 bg-slate-50/70 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-hidden focus:ring-2 focus:ring-[#00796B]/25 focus:border-[#00796B] focus:bg-white transition-all font-medium"
          />
        </div>
      </div>

      {/* Date of Birth & College Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Date of Birth */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-800">
            Date of Birth *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Calendar className="size-4.5" />
            </div>
            <input
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              className="w-full pl-10 pr-3.5 py-3 bg-slate-50/70 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-hidden focus:ring-2 focus:ring-[#00796B]/25 focus:border-[#00796B] focus:bg-white transition-all font-medium"
            />
          </div>
        </div>

        {/* College Name */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-slate-800">
              HSC College / Institution
            </label>
            <span className="text-[10px] text-slate-400 font-medium">Optional</span>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Building2 className="size-4.5" />
            </div>
            <input
              type="text"
              value={collegeName}
              onChange={(e) => setCollegeName(e.target.value)}
              placeholder="e.g. Dhaka College"
              className="w-full pl-10 pr-3.5 py-3 bg-slate-50/70 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-hidden focus:ring-2 focus:ring-[#00796B]/25 focus:border-[#00796B] focus:bg-white transition-all font-medium"
            />
          </div>
        </div>
      </div>

    </div>
  );
}

export default Step1PersonalInfo;
