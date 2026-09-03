import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { CompleteProfileWizard, AuthSupportCards } from '@/features/auth/components';
import { Loader2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Complete Candidate Profile | Shopner Coat Medical Exam Board',
  description:
    'Finalize your official medical admission candidate details, upload biometric portrait and signature, and receive your 7-digit roll number.',
};

export default function CompleteProfilePage() {
  return (
    <div className="w-full space-y-5 sm:space-y-6">
      
      {/* Wizard Card */}
      <Suspense
        fallback={
          <div className="max-w-3xl mx-auto rounded-[28px] sm:rounded-[32px] bg-white border border-slate-200/80 p-8 flex items-center justify-center min-h-[450px]">
            <Loader2 className="size-8 animate-spin text-[#00796B]" />
          </div>
        }
      >
        <CompleteProfileWizard />
      </Suspense>

      {/* Bottom Support Cards */}
      <AuthSupportCards />

    </div>
  );
}
