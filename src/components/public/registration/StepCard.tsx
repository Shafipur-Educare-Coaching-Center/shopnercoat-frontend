'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Check } from 'lucide-react';
import { RegistrationStep } from '@/data/registrationStepsData';
import { cn } from '@/lib/utils';

interface StepCardProps {
  step: RegistrationStep;
  isActive: boolean;
  isPassed: boolean;
}

export function StepCard({ step, isActive, isPassed }: StepCardProps) {
  const Icon = step.icon;
  const isLeft = step.side === 'left';

  return (
    <div
      className={cn(
        'relative w-full flex items-center',
        isLeft ? 'lg:justify-end' : 'lg:justify-start'
      )}
    >
      {/* Step Card Box */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        whileHover={{ y: -3, transition: { duration: 0.2 } }}
        className={cn(
          'relative w-full max-w-md p-6 sm:p-7 rounded-2xl transition-all duration-300 select-none group',
          isActive
            ? 'bg-white border-2 border-teal-500 shadow-xl shadow-teal-500/15 ring-4 ring-teal-50'
            : isPassed
            ? 'bg-white border border-teal-200/90 shadow-xs'
            : 'bg-white/95 border border-slate-200/90 shadow-2xs hover:border-slate-300'
        )}
      >
        {/* Step Number Badge */}
        <div
          className={cn(
            'absolute -top-3.5 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-heading transition-all shadow-xs z-10',
            isLeft ? 'left-6' : 'left-6 lg:left-auto lg:right-6',
            isActive
              ? 'bg-teal-600 text-white ring-4 ring-teal-100 scale-110'
              : isPassed
              ? 'bg-teal-700 text-white'
              : 'bg-slate-800 text-white'
          )}
        >
          {isPassed ? <Check className="w-4 h-4 stroke-[3]" /> : step.stepNumber}
        </div>

        {/* Top Header Row: Icon + Estimated Time */}
        <div className="flex items-center justify-between pt-1 mb-4">
          <div
            className={cn(
              'w-12 h-12 rounded-xl border flex items-center justify-center transition-colors',
              isActive
                ? 'bg-teal-50 border-teal-300 text-teal-700'
                : isPassed
                ? 'bg-teal-50/70 border-teal-200 text-teal-600'
                : 'bg-slate-50 border-slate-200 text-slate-600 group-hover:bg-teal-50/50 group-hover:text-teal-700'
            )}
          >
            <Icon className="w-6 h-6" />
          </div>

          <span
            className={cn(
              'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium',
              isActive
                ? 'bg-teal-50 text-teal-700 border border-teal-200'
                : 'bg-slate-100/80 text-slate-500'
            )}
          >
            <Clock className="w-3 h-3" />
            {step.estimatedTime}
          </span>
        </div>

        {/* Step Title */}
        <h3
          className={cn(
            'font-heading text-lg sm:text-xl font-bold transition-colors mb-2',
            isActive ? 'text-teal-950' : 'text-slate-900 group-hover:text-primary'
          )}
        >
          {step.title}
        </h3>

        {/* Step Description */}
        <p className="text-sm text-slate-600 leading-relaxed font-normal">
          {step.description}
        </p>

        {/* Card Active Indicator */}
        {isActive && (
          <div className="mt-4 pt-3 border-t border-teal-100 flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-ping" />
              Active Checkpoint
            </span>
            <span className="text-[11px] text-teal-600 font-medium">Candidate at this step</span>
          </div>
        )}
      </motion.div>

      {/* Desktop Horizontal Connector Arm reaching straight to the Central Timeline Road */}
      <div
        className={cn(
          'hidden lg:block absolute top-1/2 h-0.5 pointer-events-none transition-all duration-300',
          isLeft
            ? '-right-14 w-14 origin-left'
            : '-left-14 w-14 origin-right',
          isActive
            ? 'bg-teal-500 shadow-sm shadow-teal-500/80'
            : isPassed
            ? 'bg-teal-300'
            : 'bg-slate-200'
        )}
      >
        {/* Branch Signal Pulse */}
        {isActive && (
          <div
            className={cn(
              'absolute -top-1 w-2.5 h-2.5 rounded-full bg-teal-400 animate-ping',
              isLeft ? 'right-0' : 'left-0'
            )}
          />
        )}
      </div>
    </div>
  );
}
