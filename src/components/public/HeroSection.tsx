import { ShieldCheck, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { ROUTES } from '@/constants/routes';
import { HeroVisual } from '../three/HeroVisual';
import { InteractiveHeartbeat } from '../animations/InteractiveHeartbeat';
import { CountUp } from '../animations/CountUp';
import { FadeIn } from '../animations/FadeIn';
import { StaggerChildren } from '../animations/StaggerChildren';

export function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden bg-[#E8F8F5] bg-[linear-gradient(to_right,#0D948818_1px,transparent_1px),linear-gradient(to_bottom,#0D948818_1px,transparent_1px)] bg-[size:24px_24px]">
      
      {/* Hero content container */}
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12 md:pt-36 md:pb-16 lg:pt-36 lg:pb-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
          
          {/* Left Column: Content (Takes 7 cols for generous 2-line headline layout) */}
          <div className="lg:col-span-7 flex flex-col">
            <StaggerChildren className="flex flex-col gap-6 md:gap-7">
              {/* Badge */}
              <FadeIn direction="up">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/70 backdrop-blur-sm px-3.5 py-1.5 text-xs md:text-sm font-medium text-primary shadow-xs w-fit">
                  <ShieldCheck className="h-4 w-4" />
                  Session 2026 now open
                </div>
              </FadeIn>

              {/* Headline strictly structured into 2 clean lines on desktop */}
              <FadeIn direction="up">
                <h1 className="font-heading text-4xl sm:text-5xl md:text-[50px] lg:text-[52px] xl:text-[58px] font-bold tracking-tight text-slate-900 leading-[1.12]">
                  <span className="block">Medical examinations,</span>
                  <span className="block text-primary mt-1">registered and resulted with care.</span>
                </h1>
              </FadeIn>

              {/* Subheadline */}
              <FadeIn direction="up">
                <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed font-normal">
                  The National Medical Examination Board runs the full candidate journey — verified registration, examination enrolment, admit card delivery and published results — for medicine, nursing, pharmacy and allied health disciplines.
                </p>
              </FadeIn>

              {/* Actions */}
              <FadeIn direction="up" className="flex flex-col sm:flex-row items-center gap-4 pt-1">
                <Link 
                  href={ROUTES.REGISTER}
                  className="w-full sm:w-auto inline-flex items-center justify-center rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  Start registration
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link 
                  href="#how-it-works"
                  className="w-full sm:w-auto inline-flex items-center justify-center rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-slate-700 shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  See how it works
                </Link>
              </FadeIn>

              {/* Stats Grid */}
              <FadeIn direction="up" className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-4 pt-8 border-t border-primary/15 mt-2">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Registered Candidates</span>
                  <div className="text-2xl md:text-3xl font-bold text-slate-900 flex items-center font-heading">
                    <CountUp to={48210} duration={2} separator="," />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Examinations Conducted</span>
                  <div className="text-2xl md:text-3xl font-bold text-slate-900 flex items-center font-heading">
                    <CountUp to={126} duration={2} />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Examination Centres</span>
                  <div className="text-2xl md:text-3xl font-bold text-slate-900 flex items-center font-heading">
                    <CountUp to={42} duration={2} />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Results Published On Time</span>
                  <div className="text-2xl md:text-3xl font-bold text-slate-900 flex items-center font-heading">
                    <CountUp to={99.4} decimals={1} duration={2} />%
                  </div>
                </div>
              </FadeIn>
            </StaggerChildren>
          </div>

          {/* Right Column: 3D Helix Visual & Floating Codons (Takes 5 cols, taller vertical height) */}
          <div className="lg:col-span-5 flex items-center justify-center lg:justify-end mt-4 lg:mt-0 relative">
            <FadeIn direction="none" delay={0.2} className="w-full flex justify-center">
              <HeroVisual />
            </FadeIn>
          </div>

        </div>
      </div>

      {/* Clean Interactive ECG Heartbeat Wave directly on the continuous hero grid */}
      <div className="w-full relative z-10 pb-1">
        <InteractiveHeartbeat height={80} />
      </div>
    </section>
  );
}
