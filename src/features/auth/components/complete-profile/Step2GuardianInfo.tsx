'use client';

import React from 'react';
import { Users, Phone } from 'lucide-react';

interface Step2GuardianInfoProps {
  fatherName: string;
  setFatherName: (val: string) => void;
  motherName: string;
  setMotherName: (val: string) => void;
  parentMobileNumber: string;
  setParentMobileNumber: (val: string) => void;
  guardianMobileNumber: string;
  setGuardianMobileNumber: (val: string) => void;
}

export function Step2GuardianInfo({
  fatherName,
  setFatherName,
  motherName,
  setMotherName,
  parentMobileNumber,
  setParentMobileNumber,
  guardianMobileNumber,
  setGuardianMobileNumber,
}: Step2GuardianInfoProps) {
  return (
    <div className="space-y-4 animate-in fade-in-50 duration-200">
      
      {/* Father & Mother Names Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Father's Name */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-800">
            Father&apos;s Full Name *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Users className="size-4.5" />
            </div>
            <input
              type="text"
              value={fatherName}
              onChange={(e) => setFatherName(e.target.value)}
              placeholder="Father's full name"
              className="w-full pl-10 pr-3.5 py-3 bg-slate-50/70 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-hidden focus:ring-2 focus:ring-[#00796B]/25 focus:border-[#00796B] focus:bg-white transition-all font-medium"
            />
          </div>
        </div>

        {/* Mother's Name */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-800">
            Mother&apos;s Full Name *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Users className="size-4.5" />
            </div>
            <input
              type="text"
              value={motherName}
              onChange={(e) => setMotherName(e.target.value)}
              placeholder="Mother's full name"
              className="w-full pl-10 pr-3.5 py-3 bg-slate-50/70 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-hidden focus:ring-2 focus:ring-[#00796B]/25 focus:border-[#00796B] focus:bg-white transition-all font-medium"
            />
          </div>
        </div>
      </div>

      {/* Parent & Guardian Mobile Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Parent's Mobile */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-slate-800">
              Parent&apos;s Mobile Number *
            </label>
            <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
              11-Digit
            </span>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Phone className="size-4.5" />
            </div>
            <input
              type="tel"
              value={parentMobileNumber}
              onChange={(e) => setParentMobileNumber(e.target.value)}
              placeholder="017XXXXXXXX"
              maxLength={14}
              className="w-full pl-10 pr-3.5 py-3 bg-slate-50/70 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-hidden focus:ring-2 focus:ring-[#00796B]/25 focus:border-[#00796B] focus:bg-white transition-all font-mono font-medium"
            />
          </div>
        </div>

        {/* Guardian Alternate Mobile */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-slate-800">
              Guardian Mobile Number
            </label>
            <span className="text-[10px] text-slate-400 font-medium">Optional</span>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Phone className="size-4.5" />
            </div>
            <input
              type="tel"
              value={guardianMobileNumber}
              onChange={(e) => setGuardianMobileNumber(e.target.value)}
              placeholder="Alternate emergency mobile"
              maxLength={14}
              className="w-full pl-10 pr-3.5 py-3 bg-slate-50/70 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-hidden focus:ring-2 focus:ring-[#00796B]/25 focus:border-[#00796B] focus:bg-white transition-all font-mono font-medium"
            />
          </div>
        </div>
      </div>

    </div>
  );
}

export default Step2GuardianInfo;
