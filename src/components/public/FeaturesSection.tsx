'use client';

import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  ShieldCheck, 
  CreditCard, 
  FileText, 
  Trophy 
} from 'lucide-react';
import { FadeIn } from '@/components/animations/FadeIn';
import { StaggerChildren } from '@/components/animations/StaggerChildren';

const CHECKLIST_ITEMS = [
  "Identity verified by one-time password before enrolment",
  "Photograph and signature stored for admit card printing",
  "Every result change recorded against the examination record"
];

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "Verified registration",
    description: "Mobile OTP verification and mandatory profile completion before any enrolment is accepted."
  },
  {
    icon: CreditCard,
    title: "Automatic admit cards",
    description: "Cards are generated when the registration window closes and emailed to your verified address."
  },
  {
    icon: FileText,
    title: "Transparent results",
    description: "Full mark breakdown, grade and merit position published to your dashboard."
  },
  {
    icon: Trophy,
    title: "Published merit ranking",
    description: "Top performers for each examination are published openly for public verification."
  }
];

export function FeaturesSection() {
  return (
    <section className="relative w-full py-20 lg:py-28 overflow-hidden bg-gradient-to-b from-[#E8F8F5]/80 via-white to-[#FAF8FF] border-b border-border/50">
      
      {/* Subtle ambient clinical glows to sync with hero */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-teal-400/5 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
      
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          
          {/* Left Column: Heading, Description & Checklist */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <StaggerChildren className="flex flex-col gap-6">
              
              <FadeIn direction="up">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/15 text-primary text-xs font-semibold tracking-wide uppercase w-fit">
                  Integrity & Security
                </div>
              </FadeIn>

              <FadeIn direction="up">
                <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 leading-tight">
                  One clinical record of every candidate
                </h2>
              </FadeIn>

              <FadeIn direction="up">
                <p className="text-base text-slate-600 leading-relaxed font-normal">
                  Every candidate file is treated like a patient chart: identity verified once, kept accurate, and never edited silently. Roll numbers, registration numbers and marks are issued by the board and are immutable from the candidate side.
                </p>
              </FadeIn>

              {/* Checklist */}
              <FadeIn direction="up">
                <ul className="flex flex-col gap-3.5 pt-1">
                  {CHECKLIST_ITEMS.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm font-medium text-slate-700 leading-snug">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </FadeIn>

            </StaggerChildren>
          </div>

          {/* Right Column: 2x2 Feature Cards Grid */}
          <div className="lg:col-span-7">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.12
                  }
                }
              }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6"
            >
              {FEATURES.map((feat, idx) => {
                const Icon = feat.icon;
                return (
                  <motion.div
                    key={idx}
                    variants={{
                      hidden: { opacity: 0, y: 24 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] } }
                    }}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    className="p-6 rounded-2xl bg-white/90 backdrop-blur-sm border border-border/80 shadow-xs hover:shadow-clinical hover:border-primary/40 transition-all flex flex-col gap-3.5 group cursor-default"
                  >
                    {/* Icon Box */}
                    <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-primary group-hover:scale-105 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                      <Icon className="w-5 h-5" />
                    </div>

                    {/* Title */}
                    <h3 className="font-heading font-semibold text-slate-900 text-base md:text-lg group-hover:text-primary transition-colors">
                      {feat.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs md:text-sm text-slate-500 leading-relaxed font-normal">
                      {feat.description}
                    </p>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
