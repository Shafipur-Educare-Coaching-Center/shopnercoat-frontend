'use client';

import React from 'react';
import { MapPin } from 'lucide-react';

interface Step3AddressInfoProps {
  presentAddress: string;
  setPresentAddress: (val: string) => void;
  permanentAddress: string;
  setPermanentAddress: (val: string) => void;
  sameAsPresent: boolean;
  setSameAsPresent: (val: boolean) => void;
}

export function Step3AddressInfo({
  presentAddress,
  setPresentAddress,
  permanentAddress,
  setPermanentAddress,
  sameAsPresent,
  setSameAsPresent,
}: Step3AddressInfoProps) {
  const handleSameAddressToggle = (checked: boolean) => {
    setSameAsPresent(checked);
    if (checked) {
      setPermanentAddress(presentAddress);
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in-50 duration-200">
      
      {/* Present Address */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-slate-800">
          Present Address *
        </label>
        <div className="relative">
          <div className="absolute top-3.5 left-3.5 pointer-events-none text-slate-400">
            <MapPin className="size-4.5" />
          </div>
          <textarea
            rows={3}
            value={presentAddress}
            onChange={(e) => {
              setPresentAddress(e.target.value);
              if (sameAsPresent) setPermanentAddress(e.target.value);
            }}
            placeholder="Village/Road, Post Office, Upazila, District"
            className="w-full pl-10 pr-3.5 py-3 bg-slate-50/70 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-hidden focus:ring-2 focus:ring-[#00796B]/25 focus:border-[#00796B] focus:bg-white transition-all font-medium resize-none"
          />
        </div>
      </div>

      {/* Same as Present Checkbox */}
      <div className="flex items-center gap-2 py-0.5">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            id="sameAddress"
            checked={sameAsPresent}
            onChange={(e) => handleSameAddressToggle(e.target.checked)}
            className="size-4 rounded-md border-slate-300 text-[#00796B] focus:ring-[#00796B] accent-[#00796B] cursor-pointer"
          />
          <span className="text-xs text-slate-700 font-semibold cursor-pointer">
            Permanent address is same as present address
          </span>
        </label>
      </div>

      {/* Permanent Address */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-slate-800">
          Permanent Address *
        </label>
        <div className="relative">
          <div className="absolute top-3.5 left-3.5 pointer-events-none text-slate-400">
            <MapPin className="size-4.5" />
          </div>
          <textarea
            rows={3}
            value={permanentAddress}
            onChange={(e) => setPermanentAddress(e.target.value)}
            disabled={sameAsPresent}
            placeholder="Village/Road, Post Office, Upazila, District"
            className="w-full pl-10 pr-3.5 py-3 bg-slate-50/70 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-hidden focus:ring-2 focus:ring-[#00796B]/25 focus:border-[#00796B] focus:bg-white transition-all font-medium resize-none disabled:opacity-60"
          />
        </div>
      </div>

    </div>
  );
}

export default Step3AddressInfo;
