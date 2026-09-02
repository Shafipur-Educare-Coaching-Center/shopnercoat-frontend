'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants/routes';
import { uploadAction } from '@/features/auth/actions/uploadAction';
import { completeProfileAction } from '@/features/auth/actions/completeProfileAction';
import {
  User,
  Calendar,
  Building2,
  Users,
  Phone,
  MapPin,
  Camera,
  PenTool,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Trophy,
  Copy,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';

type WizardStep = 1 | 2 | 3 | 4;

interface CompletedStudentData {
  id: string;
  fullName: string;
  rollNumber: number;
  registrationNumber: number;
  registrationStatus: string;
}

export default function CompleteProfilePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<WizardStep>(1);
  const [isPending, startTransition] = useTransition();
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isUploadingSignature, setIsUploadingSignature] = useState(false);

  // Form State
  const [fullName, setFullName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [collegeName, setCollegeName] = useState('');

  const [fatherName, setFatherName] = useState('');
  const [motherName, setMotherName] = useState('');
  const [parentMobileNumber, setParentMobileNumber] = useState('');
  const [guardianMobileNumber, setGuardianMobileNumber] = useState('');

  const [presentAddress, setPresentAddress] = useState('');
  const [permanentAddress, setPermanentAddress] = useState('');
  const [sameAsPresent, setSameAsPresent] = useState(false);

  const [photoUrl, setPhotoUrl] = useState('');
  const [signatureUrl, setSignatureUrl] = useState('');

  const [stepErrors, setStepErrors] = useState<string[]>([]);
  const [completedStudent, setCompletedStudent] = useState<CompletedStudentData | null>(null);

  // Synchronize permanent address if checkbox checked
  const handleSameAddressToggle = (checked: boolean) => {
    setSameAsPresent(checked);
    if (checked) {
      setPermanentAddress(presentAddress);
    }
  };

  // Step 1 Validation
  const validateStep1 = () => {
    const errs: string[] = [];
    if (!fullName.trim() || fullName.trim().length < 3) {
      errs.push('Full Name must be at least 3 characters');
    }
    if (!dateOfBirth) {
      errs.push('Date of Birth is required');
    }
    setStepErrors(errs);
    return errs.length === 0;
  };

  // Step 2 Validation
  const validateStep2 = () => {
    const errs: string[] = [];
    if (!fatherName.trim() || fatherName.trim().length < 3) {
      errs.push("Father's Name must be at least 3 characters");
    }
    if (!motherName.trim() || motherName.trim().length < 3) {
      errs.push("Mother's Name must be at least 3 characters");
    }
    const cleanParentMobile = parentMobileNumber.replace(/\D/g, '');
    if (!cleanParentMobile || cleanParentMobile.length < 11) {
      errs.push("Parent's Mobile Number must be a valid 11-digit number");
    }
    setStepErrors(errs);
    return errs.length === 0;
  };

  // Step 3 Validation
  const validateStep3 = () => {
    const errs: string[] = [];
    if (!presentAddress.trim() || presentAddress.trim().length < 10) {
      errs.push('Present Address must be at least 10 characters');
    }
    if (!permanentAddress.trim() || permanentAddress.trim().length < 10) {
      errs.push('Permanent Address must be at least 10 characters');
    }
    setStepErrors(errs);
    return errs.length === 0;
  };

  // Step 4 Validation
  const validateStep4 = () => {
    const errs: string[] = [];
    if (!photoUrl) {
      errs.push('Candidate photo upload is required');
    }
    if (!signatureUrl) {
      errs.push('Candidate signature upload is required');
    }
    setStepErrors(errs);
    return errs.length === 0;
  };

  const handleNextStep = () => {
    if (currentStep === 1 && validateStep1()) setCurrentStep(2);
    else if (currentStep === 2 && validateStep2()) setCurrentStep(3);
    else if (currentStep === 3 && validateStep3()) setCurrentStep(4);
  };

  const handlePrevStep = () => {
    setStepErrors([]);
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as WizardStep);
    }
  };

  // File Upload Handlers
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingPhoto(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('subfolder', 'students/photos');

      const res = await uploadAction(formData);
      if (res.success && res.url) {
        setPhotoUrl(res.url);
        toast.success('Candidate Photo Uploaded');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Photo upload failed';
      toast.error(msg);
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleSignatureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingSignature(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('subfolder', 'students/signatures');

      const res = await uploadAction(formData);
      if (res.success && res.url) {
        setSignatureUrl(res.url);
        toast.success('Candidate Signature Uploaded');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Signature upload failed';
      toast.error(msg);
    } finally {
      setIsUploadingSignature(false);
    }
  };

  // Final Form Submission
  const handleSubmitProfile = () => {
    if (!validateStep4()) return;

    startTransition(async () => {
      try {
        const res = await completeProfileAction({
          fullName,
          dateOfBirth,
          collegeName,
          fatherName,
          motherName,
          parentMobileNumber,
          guardianMobileNumber,
          presentAddress,
          permanentAddress,
          photoUrl,
          signatureUrl,
        });

        if (res.success && res.data) {
          setCompletedStudent(res.data);
          toast.success('Profile Completed!', {
            description: `Roll Number ${res.data.rollNumber} assigned.`,
          });
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to complete profile';
        toast.error('Submission Error', { description: msg });
        setStepErrors([msg]);
      }
    });
  };

  // Success Celebration View
  if (completedStudent) {
    return (
      <div className="max-w-xl mx-auto bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-2xl text-center space-y-6 animate-in zoom-in-95 duration-300">
        <div className="size-20 rounded-3xl bg-gradient-to-tr from-teal-500 to-emerald-400 text-white flex items-center justify-center mx-auto shadow-lg shadow-teal-500/30">
          <Trophy className="size-10" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
            <Sparkles className="size-3.5" />
            <span>Admission Profile Verified</span>
          </div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-slate-900">
            Welcome, {completedStudent.fullName}!
          </h1>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Your registration is finalized. You have been granted an official candidate roll &amp; registration number for Shafipur Educare model tests.
          </p>
        </div>

        {/* Credentials Badge */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl text-left space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <span className="text-xs text-indigo-300 font-bold uppercase tracking-wider">Candidate Identification</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
              ACTIVE
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Roll Number</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="font-mono font-black text-2xl text-amber-400">{completedStudent.rollNumber}</span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(String(completedStudent.rollNumber));
                    toast.success('Roll Number copied!');
                  }}
                  className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer"
                  title="Copy Roll Number"
                >
                  <Copy className="size-3.5" />
                </button>
              </div>
            </div>

            <div>
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Registration No.</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="font-mono font-black text-2xl text-teal-300">{completedStudent.registrationNumber}</span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(String(completedStudent.registrationNumber));
                    toast.success('Registration Number copied!');
                  }}
                  className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer"
                  title="Copy Registration Number"
                >
                  <Copy className="size-3.5" />
                </button>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 pt-2 border-t border-white/10">
            💡 You can now log in using either your mobile number or this 7-digit Roll Number.
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => router.push(ROUTES.STUDENT_DASHBOARD)}
            className="w-full py-3.5 px-6 rounded-2xl bg-[#37447E] hover:bg-[#2C3765] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Proceed to Student Dashboard</span>
            <ArrowRight className="size-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-xl">
      
      {/* Top Wizard Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h1 className="font-heading font-black text-xl sm:text-2xl text-slate-900">
              Complete Candidate Profile
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Please enter your full details to receive your official exam Admit Card and Roll Number.
            </p>
          </div>
          <span className="self-start sm:self-auto text-xs font-bold px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
            Step {currentStep} of 4
          </span>
        </div>

        {/* 4-Step Progress Line */}
        <div className="grid grid-cols-4 gap-2 pt-2">
          {[
            { step: 1, title: 'Personal' },
            { step: 2, title: 'Guardian' },
            { step: 3, title: 'Address' },
            { step: 4, title: 'Uploads' },
          ].map((item) => {
            const isCompleted = currentStep > item.step;
            const isCurrent = currentStep === item.step;
            return (
              <div key={item.step} className="space-y-1">
                <div
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    isCompleted
                      ? 'bg-emerald-500'
                      : isCurrent
                      ? 'bg-indigo-600'
                      : 'bg-slate-100'
                  }`}
                />
                <p
                  className={`text-[10px] font-bold text-center ${
                    isCurrent
                      ? 'text-indigo-600'
                      : isCompleted
                      ? 'text-emerald-600'
                      : 'text-slate-400'
                  }`}
                >
                  {item.title}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Error Banner */}
      {stepErrors.length > 0 && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs space-y-1">
          <div className="flex items-center gap-1.5 font-bold">
            <AlertCircle className="size-4 shrink-0" />
            <span>Please complete the required fields:</span>
          </div>
          <ul className="list-disc list-inside pl-1 text-[11px] space-y-0.5">
            {stepErrors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Step 1: Personal Information */}
      {currentStep === 1 && (
        <div className="space-y-4 animate-in fade-in-50 duration-200">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Full Name (As per SSC Certificate) *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="size-4" />
              </div>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Rahim Uddin"
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Date of Birth *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Calendar className="size-4" />
                </div>
                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                College / Institution Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Building2 className="size-4" />
                </div>
                <input
                  type="text"
                  value={collegeName}
                  onChange={(e) => setCollegeName(e.target.value)}
                  placeholder="e.g. Dhaka College"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-medium"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Guardian Information */}
      {currentStep === 2 && (
        <div className="space-y-4 animate-in fade-in-50 duration-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Father&apos;s Name *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Users className="size-4" />
                </div>
                <input
                  type="text"
                  value={fatherName}
                  onChange={(e) => setFatherName(e.target.value)}
                  placeholder="Father's full name"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Mother&apos;s Name *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Users className="size-4" />
                </div>
                <input
                  type="text"
                  value={motherName}
                  onChange={(e) => setMotherName(e.target.value)}
                  placeholder="Mother's full name"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-medium"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Parent&apos;s Mobile Number *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Phone className="size-4" />
                </div>
                <input
                  type="tel"
                  value={parentMobileNumber}
                  onChange={(e) => setParentMobileNumber(e.target.value)}
                  placeholder="017XXXXXXXX"
                  maxLength={14}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-mono font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Guardian Mobile Number (Optional)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Phone className="size-4" />
                </div>
                <input
                  type="tel"
                  value={guardianMobileNumber}
                  onChange={(e) => setGuardianMobileNumber(e.target.value)}
                  placeholder="Optional alternate mobile"
                  maxLength={14}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-mono font-medium"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Addresses */}
      {currentStep === 3 && (
        <div className="space-y-4 animate-in fade-in-50 duration-200">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Present Address *
            </label>
            <div className="relative">
              <div className="absolute top-3 left-3.5 pointer-events-none text-slate-400">
                <MapPin className="size-4" />
              </div>
              <textarea
                rows={3}
                value={presentAddress}
                onChange={(e) => {
                  setPresentAddress(e.target.value);
                  if (sameAsPresent) setPermanentAddress(e.target.value);
                }}
                placeholder="Village/Road, Post Office, Upazila, District"
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-medium resize-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 py-1">
            <input
              type="checkbox"
              id="sameAddress"
              checked={sameAsPresent}
              onChange={(e) => handleSameAddressToggle(e.target.checked)}
              className="size-4 rounded-md border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
            />
            <label htmlFor="sameAddress" className="text-xs text-slate-700 font-medium cursor-pointer">
              Permanent address is same as present address
            </label>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Permanent Address *
            </label>
            <div className="relative">
              <div className="absolute top-3 left-3.5 pointer-events-none text-slate-400">
                <MapPin className="size-4" />
              </div>
              <textarea
                rows={3}
                value={permanentAddress}
                onChange={(e) => setPermanentAddress(e.target.value)}
                disabled={sameAsPresent}
                placeholder="Village/Road, Post Office, Upazila, District"
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-medium resize-none disabled:opacity-60"
              />
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Photo and Signature Upload */}
      {currentStep === 4 && (
        <div className="space-y-6 animate-in fade-in-50 duration-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Photo Upload Card */}
            <div className="p-5 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center text-center space-y-3">
              <div className="size-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Camera className="size-6" />
              </div>
              <div>
                <p className="font-bold text-xs text-slate-900">Candidate Photo *</p>
                <p className="text-[11px] text-slate-500">Formal portrait (JPEG/PNG/WEBP, Max 5MB)</p>
              </div>

              {photoUrl ? (
                <div className="relative group">
                  <img
                    src={photoUrl}
                    alt="Candidate Preview"
                    className="size-24 rounded-xl object-cover border-2 border-emerald-500 shadow-sm"
                  />
                  <div className="absolute top-1 right-1 bg-emerald-500 text-white rounded-full p-0.5">
                    <CheckCircle2 className="size-3.5" />
                  </div>
                </div>
              ) : null}

              <label className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-semibold shadow-2xs transition-all active:scale-95">
                {isUploadingPhoto ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin text-indigo-600" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <span>{photoUrl ? 'Change Photo' : 'Select Photo'}</span>
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
            <div className="p-5 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center text-center space-y-3">
              <div className="size-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center">
                <PenTool className="size-6" />
              </div>
              <div>
                <p className="font-bold text-xs text-slate-900">Candidate Signature *</p>
                <p className="text-[11px] text-slate-500">Signature on plain white paper (Max 5MB)</p>
              </div>

              {signatureUrl ? (
                <div className="relative group">
                  <img
                    src={signatureUrl}
                    alt="Signature Preview"
                    className="h-16 w-32 rounded-xl object-contain bg-white border-2 border-emerald-500 p-1 shadow-sm"
                  />
                  <div className="absolute top-1 right-1 bg-emerald-500 text-white rounded-full p-0.5">
                    <CheckCircle2 className="size-3.5" />
                  </div>
                </div>
              ) : null}

              <label className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-semibold shadow-2xs transition-all active:scale-95">
                {isUploadingSignature ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin text-teal-600" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <span>{signatureUrl ? 'Change Signature' : 'Select Signature'}</span>
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

          <div className="p-3.5 rounded-xl bg-indigo-50/60 border border-indigo-100 text-[11px] text-indigo-900 flex items-start gap-2">
            <Sparkles className="size-4 shrink-0 text-indigo-600 mt-0.5" />
            <p>
              Both photo and signature will be permanently encoded onto your official examination Admit Card and Verification QR snapshot.
            </p>
          </div>
        </div>
      )}

      {/* Wizard Footer Controls */}
      <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
        {currentStep > 1 ? (
          <button
            type="button"
            onClick={handlePrevStep}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
          >
            <ArrowLeft className="size-3.5" />
            <span>Previous Step</span>
          </button>
        ) : <div />}

        {currentStep < 4 ? (
          <button
            type="button"
            onClick={handleNextStep}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#37447E] hover:bg-[#2C3765] text-white text-xs font-bold shadow-sm hover:shadow transition-all active:scale-95 cursor-pointer"
          >
            <span>Next Step</span>
            <ArrowRight className="size-3.5" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmitProfile}
            disabled={isPending || !photoUrl || !signatureUrl}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            {isPending ? (
              <>
                <Loader2 className="size-4 animate-spin text-white" />
                <span>Finalizing Registration...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="size-4" />
                <span>Complete Profile &amp; Generate Roll</span>
              </>
            )}
          </button>
        )}
      </div>

    </div>
  );
}
