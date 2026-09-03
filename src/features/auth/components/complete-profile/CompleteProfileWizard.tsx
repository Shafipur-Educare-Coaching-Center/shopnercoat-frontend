'use client';

import React, { useState, useTransition } from 'react';
import { uploadAction } from '@/features/auth/actions/uploadAction';
import { completeProfileAction } from '@/features/auth/actions/completeProfileAction';
import { Step1PersonalInfo } from './Step1PersonalInfo';
import { Step2GuardianInfo } from './Step2GuardianInfo';
import { Step3AddressInfo } from './Step3AddressInfo';
import { Step4UploadsInfo } from './Step4UploadsInfo';
import { ProfileSuccessCard } from './ProfileSuccessCard';
import {
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Loader2,
  AlertCircle,
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

export function CompleteProfileWizard() {
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
    if (currentStep === 1 && validateStep1()) {
      setStepErrors([]);
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      setStepErrors([]);
      setCurrentStep(3);
    } else if (currentStep === 3 && validateStep3()) {
      setStepErrors([]);
      setCurrentStep(4);
    }
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
      } else if (!res.success && res.error) {
        toast.error(res.error);
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
      } else if (!res.success && res.error) {
        toast.error(res.error);
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
        } else if (!res.success && res.error) {
          toast.error('Submission Error', { description: res.error });
          setStepErrors([res.error]);
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to complete profile';
        toast.error('Submission Error', { description: msg });
        setStepErrors([msg]);
      }
    });
  };

  if (completedStudent) {
    return <ProfileSuccessCard completedStudent={completedStudent} />;
  }

  const steps = [
    { step: 1, title: 'Personal' },
    { step: 2, title: 'Guardian' },
    { step: 3, title: 'Address' },
    { step: 4, title: 'Uploads' },
  ];

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-[28px] sm:rounded-[32px] border border-slate-200/80 p-6 sm:p-8 lg:p-9 shadow-[0_20px_50px_rgba(15,118,110,0.06)]">
      
      {/* Top Header */}
      <div className="mb-7">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h1 className="font-heading font-black text-xl sm:text-2xl text-slate-900 tracking-tight">
              Complete Candidate Profile
            </h1>
            <p className="text-xs sm:text-[13px] text-slate-500 mt-0.5 font-medium">
              Enter verified student credentials to finalize roll allocation and digital admit slip generation.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            <span className="px-2.5 py-1 rounded-full bg-teal-50 text-[#00695C] border border-teal-200/70 text-xs font-bold">
              Step {currentStep} of 4
            </span>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-[11px] font-bold shadow-2xs">
              <ShieldCheck className="size-3.5 text-emerald-600" />
              <span>256-bit SSL</span>
            </div>
          </div>
        </div>

        {/* 4-Step Progress Line */}
        <div className="grid grid-cols-4 gap-2 pt-2">
          {steps.map((item) => {
            const isCompleted = currentStep > item.step;
            const isCurrent = currentStep === item.step;
            return (
              <div key={item.step} className="space-y-1.5">
                <div
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    isCompleted
                      ? 'bg-emerald-500'
                      : isCurrent
                        ? 'bg-[#00796B]'
                        : 'bg-slate-100'
                  }`}
                />
                <p
                  className={`text-[11px] font-bold text-center transition-colors ${
                    isCurrent
                      ? 'text-[#00796B]'
                      : isCompleted
                        ? 'text-emerald-700'
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

      {/* Step Content */}
      {currentStep === 1 && (
        <Step1PersonalInfo
          fullName={fullName}
          setFullName={setFullName}
          dateOfBirth={dateOfBirth}
          setDateOfBirth={setDateOfBirth}
          collegeName={collegeName}
          setCollegeName={setCollegeName}
        />
      )}

      {currentStep === 2 && (
        <Step2GuardianInfo
          fatherName={fatherName}
          setFatherName={setFatherName}
          motherName={motherName}
          setMotherName={setMotherName}
          parentMobileNumber={parentMobileNumber}
          setParentMobileNumber={setParentMobileNumber}
          guardianMobileNumber={guardianMobileNumber}
          setGuardianMobileNumber={setGuardianMobileNumber}
        />
      )}

      {currentStep === 3 && (
        <Step3AddressInfo
          presentAddress={presentAddress}
          setPresentAddress={setPresentAddress}
          permanentAddress={permanentAddress}
          setPermanentAddress={setPermanentAddress}
          sameAsPresent={sameAsPresent}
          setSameAsPresent={setSameAsPresent}
        />
      )}

      {currentStep === 4 && (
        <Step4UploadsInfo
          photoUrl={photoUrl}
          signatureUrl={signatureUrl}
          isUploadingPhoto={isUploadingPhoto}
          isUploadingSignature={isUploadingSignature}
          handlePhotoUpload={handlePhotoUpload}
          handleSignatureUpload={handleSignatureUpload}
        />
      )}

      {/* Footer Controls */}
      <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
        {currentStep > 1 ? (
          <button
            type="button"
            onClick={handlePrevStep}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
          >
            <ArrowLeft className="size-3.5" />
            <span>Previous Step</span>
          </button>
        ) : (
          <div />
        )}

        {currentStep < 4 ? (
          <button
            type="button"
            onClick={handleNextStep}
            className="inline-flex items-center gap-1.5 px-6 py-3 rounded-2xl bg-[#00695C] hover:bg-[#00594D] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg shadow-[#00695C]/15 transition-all active:scale-[0.99] cursor-pointer"
          >
            <span>Next Step</span>
            <ArrowRight className="size-3.5" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmitProfile}
            disabled={isPending || !photoUrl || !signatureUrl}
            className="inline-flex items-center gap-2 px-7 py-3 rounded-2xl bg-[#00695C] hover:bg-[#00594D] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg shadow-[#00695C]/20 transition-all active:scale-[0.99] disabled:opacity-50 cursor-pointer"
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

export default CompleteProfileWizard;
