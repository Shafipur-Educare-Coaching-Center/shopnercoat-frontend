'use client';

import React from 'react';
import Image from 'next/image';
import { Camera, PenTool, CheckCircle2, Loader2, Sparkles, Upload } from 'lucide-react';

interface Step4UploadsInfoProps {
  photoUrl: string;
  signatureUrl: string;
  isUploadingPhoto: boolean;
  isUploadingSignature: boolean;
  handlePhotoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSignatureUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function Step4UploadsInfo({
  photoUrl,
  signatureUrl,
  isUploadingPhoto,
  isUploadingSignature,
  handlePhotoUpload,
  handleSignatureUpload,
}: Step4UploadsInfoProps) {
  return (
    <div className="space-y-5 animate-in fade-in-50 duration-200">
      
      {/* Upload Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        
        {/* Photo Upload Card */}
        <div className="p-5 rounded-2xl border-2 border-dashed border-teal-200 bg-teal-50/30 flex flex-col items-center justify-center text-center space-y-3 hover:border-teal-400 transition-colors">
          <div className="size-12 rounded-2xl bg-teal-100/80 text-[#00796B] flex items-center justify-center shadow-2xs">
            <Camera className="size-6" />
          </div>
          <div>
            <p className="font-bold text-xs sm:text-sm text-slate-900">
              Candidate Photo *
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Formal color portrait (JPEG/PNG, Max 5MB)
            </p>
          </div>

          {photoUrl ? (
            <div className="relative group">
              <img
                src={photoUrl}
                alt="Candidate Preview"
                className="size-24 rounded-2xl object-cover border-2 border-emerald-500 shadow-sm"
              />
              <div className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-white rounded-full p-1 shadow-xs">
                <CheckCircle2 className="size-3.5" />
              </div>
            </div>
          ) : null}

          <label className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-teal-50 border border-teal-200 text-[#00695C] text-xs font-bold shadow-2xs transition-all active:scale-95">
            {isUploadingPhoto ? (
              <>
                <Loader2 className="size-3.5 animate-spin text-[#00695C]" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <Upload className="size-3.5" />
                <span>{photoUrl ? 'Change Photo' : 'Select Photo'}</span>
              </>
            )}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handlePhotoUpload}
              disabled={isUploadingPhoto}
              className="hidden"
            />
          </label>
        </div>

        {/* Signature Upload Card */}
        <div className="p-5 rounded-2xl border-2 border-dashed border-teal-200 bg-teal-50/30 flex flex-col items-center justify-center text-center space-y-3 hover:border-teal-400 transition-colors">
          <div className="size-12 rounded-2xl bg-teal-100/80 text-[#00796B] flex items-center justify-center shadow-2xs">
            <PenTool className="size-6" />
          </div>
          <div>
            <p className="font-bold text-xs sm:text-sm text-slate-900">
              Candidate Signature *
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Clear sign on white paper (JPEG/PNG, Max 5MB)
            </p>
          </div>

          {signatureUrl ? (
            <div className="relative group">
              <img
                src={signatureUrl}
                alt="Signature Preview"
                className="h-16 w-32 rounded-2xl object-contain bg-white border-2 border-emerald-500 p-1 shadow-sm"
              />
              <div className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-white rounded-full p-1 shadow-xs">
                <CheckCircle2 className="size-3.5" />
              </div>
            </div>
          ) : null}

          <label className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-teal-50 border border-teal-200 text-[#00695C] text-xs font-bold shadow-2xs transition-all active:scale-95">
            {isUploadingSignature ? (
              <>
                <Loader2 className="size-3.5 animate-spin text-[#00695C]" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <Upload className="size-3.5" />
                <span>{signatureUrl ? 'Change Signature' : 'Select Signature'}</span>
              </>
            )}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleSignatureUpload}
              disabled={isUploadingSignature}
              className="hidden"
            />
          </label>
        </div>

      </div>

      {/* Security Callout */}
      <div className="p-3.5 rounded-2xl bg-teal-50/70 border border-teal-200/80 text-[11px] text-[#00594D] flex items-start gap-2.5">
        <Sparkles className="size-4 shrink-0 text-[#00796B] mt-0.5" />
        <p className="leading-relaxed">
          Both biometric photo and signature will be permanently encoded onto your official examination Admit Card and instant QR verification slip.
        </p>
      </div>

    </div>
  );
}

export default Step4UploadsInfo;
