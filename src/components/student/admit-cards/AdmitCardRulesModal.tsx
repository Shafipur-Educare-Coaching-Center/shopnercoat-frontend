'use client';

import React from 'react';
import {
  X,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Clock,
  PenTool,
  Smartphone,
} from 'lucide-react';

interface AdmitCardRulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdmitCardRulesModal({ isOpen, onClose }: AdmitCardRulesModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in-50 duration-200">
      
      {/* Modal Card */}
      <div className="w-full max-w-lg bg-white rounded-[28px] sm:rounded-[32px] border border-slate-200 p-6 sm:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <ShieldAlert className="size-5" />
            </div>
            <div>
              <h2 className="font-heading font-black text-lg text-slate-900">
                Examination Hall Protocol
              </h2>
              <p className="text-xs text-slate-500">
                Official Central Board Conduct &amp; Entry Rules
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Rules List */}
        <div className="space-y-3 text-xs text-slate-700">
          {/* Rule 1 */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
            <Clock className="size-4 text-[#00796B] shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-slate-900">Reporting &amp; Gate Closure</p>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                Candidates must report at least 30 minutes before exam start time. Examination gates will strictly close 15 minutes before the session begins.
              </p>
            </div>
          </div>

          {/* Rule 2 */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
            <PenTool className="size-4 text-[#00796B] shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-slate-900">Mandatory Stationery</p>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                Bring standard Black Ballpoint Pens and 2B/HB pencils for OMR bubble filling. Gel pens and correction fluids are strictly prohibited.
              </p>
            </div>
          </div>

          {/* Rule 3 */}
          <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-200/80 flex items-start gap-3 text-rose-900">
            <Smartphone className="size-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Prohibited Electronic Devices</p>
              <p className="text-[11px] text-rose-800/90 mt-0.5 leading-relaxed">
                Mobile phones, smartwatches, Bluetooth devices, and programmable scientific calculators are strictly banned from the examination hall.
              </p>
            </div>
          </div>

          {/* Rule 4 */}
          <div className="p-3.5 rounded-2xl bg-teal-50/60 border border-teal-200/80 flex items-start gap-3 text-[#00594D]">
            <CheckCircle2 className="size-4 text-[#00796B] shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Admit Card &amp; QR Verification</p>
              <p className="text-[11px] text-teal-900/90 mt-0.5 leading-relaxed">
                Present your printed digital Admit Card with the clear QR token at the security checkpoint for invigilator biometric verification.
              </p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
          >
            I Understand the Protocol
          </button>
        </div>

      </div>

    </div>
  );
}

export default AdmitCardRulesModal;
