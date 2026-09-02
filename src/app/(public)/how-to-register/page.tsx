import React from 'react';
import Link from 'next/link';
import { ArrowRight, Compass, Sparkles } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { RegistrationPathway } from '@/components/public/registration';
import { FadeIn } from '@/components/animations/FadeIn';

export const metadata = {
  title: 'How to Register | ShopnerCoat Medical Examination Board',
  description:
    'Simplified 4-step medical admission registration guide with verified profile onboarding, OTP security, and instant dashboard access.',
};

export default function HowToRegisterPage() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-[#E8F8F5]/60 via-white to-[#FAF8FF] pt-24 sm:pt-28 pb-20">
      
      {/* Ambient Medical Decorative Glows & Grid */}
      <div
        className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-primary/8 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute top-1/3 left-10 w-[420px] h-[420px] bg-teal-300/10 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-20 right-10 w-[460px] h-[460px] bg-cyan-400/8 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Page Header matching mockup */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto pt-6 sm:pt-10 mb-10 sm:mb-14">
          <FadeIn direction="up">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold tracking-wide uppercase mb-4 shadow-2xs">
              <Compass className="w-3.5 h-3.5" />
              Candidate Enrolment Guide
            </div>
          </FadeIn>

          <FadeIn direction="up" delay={0.08}>
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-bold tracking-tight text-slate-900 leading-[1.14]">
              Your Journey to Excellence Starts Here
            </h1>
          </FadeIn>

          <FadeIn direction="up" delay={0.16}>
            <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-normal max-w-2xl">
              Join the most trusted medical admission platform in Bangladesh. Our simplified 4-step
              registration process ensures you spend less time signing up and more time preparing.
            </p>
          </FadeIn>
        </div>

        {/* 3D Interactive Milestone Pathway */}
        <RegistrationPathway />

        {/* Bottom CTA Card matching mockup */}
        <div className="max-w-2xl mx-auto mt-16 sm:mt-24">
          <FadeIn direction="up">
            <div className="rounded-3xl bg-white/95 backdrop-blur-md border border-slate-200/90 p-8 sm:p-10 text-center shadow-clinical flex flex-col items-center">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200/80 flex items-center justify-center text-primary mb-4 shadow-2xs">
                <Sparkles className="w-6 h-6" />
              </div>

              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
                Ready to Begin?
              </h2>

              <p className="text-sm sm:text-base text-slate-600 font-normal mb-7 max-w-md">
                Join thousands of successful candidates and start your verified registration today.
              </p>

              <Link
                href={ROUTES.REGISTER}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm sm:text-base font-semibold text-white shadow-md shadow-primary/20 hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Start Registration
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </FadeIn>
        </div>

      </div>
    </div>
  );
}
