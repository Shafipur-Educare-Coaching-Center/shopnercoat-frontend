import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { AuthHeroCard, RegisterForm, AuthSupportCards } from '@/features/auth/components';
import { Loader2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Candidate Registration | Shopner Coat Medical Exam Board',
  description:
    'Register as a new candidate for nationwide medical admission model tests, automated SMS roll allocation, and AI percentile ranking.',
};

export default function RegisterPage() {
  return (
    <div className="w-full space-y-4 sm:space-y-5">
      {/* Top 2-Column Hero & Form Grid */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-stretch">
        {/* Left Column: Hero Branding Card */}
        <div className="lg:col-span-5 flex">
          <AuthHeroCard variant="register" />
        </div>

        {/* Right Column: Registration Form Card */}
        <div className="lg:col-span-7 flex">
          <Suspense
            fallback={
              <div className="w-full rounded-[28px] sm:rounded-[32px] bg-white border border-slate-200/80 p-8 flex items-center justify-center min-h-[450px]">
                <Loader2 className="size-8 animate-spin text-[#00796B]" />
              </div>
            }
          >
            <RegisterForm />
          </Suspense>
        </div>
      </div>

      {/* Bottom 3 Information & Support Cards */}
      <AuthSupportCards />
    </div>
  );
}
