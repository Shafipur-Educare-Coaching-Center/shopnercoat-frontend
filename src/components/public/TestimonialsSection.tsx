'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';
import { FadeIn } from '@/components/animations/FadeIn';
import {
  HERO_TESTIMONIAL,
  TOP_TESTIMONIALS,
  WIDE_TESTIMONIAL,
} from '@/data/testimonialsData';
import {
  HeroTestimonialCard,
  TestimonialCard,
} from './testimonials';

export function TestimonialsSection() {
  return (
    <section className="relative w-full py-20 lg:py-28 overflow-hidden bg-[#FAF8FF]/60 border-b border-border/50">
      {/* Ambient background glows */}
      <div
        className="absolute top-10 right-1/3 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-10 left-10 w-80 h-80 bg-teal-400/5 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col items-start max-w-3xl mb-12 sm:mb-16">
          <FadeIn direction="up">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-primary/10 border border-primary/15 text-primary text-xs font-semibold tracking-wide uppercase mb-3.5">
              <Sparkles className="w-3.5 h-3.5" />
              Candidate Verified Reviews
            </div>
          </FadeIn>

          <FadeIn direction="up" delay={0.08}>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
              Success Stories
            </h2>
          </FadeIn>

          <FadeIn direction="up" delay={0.16}>
            <p className="mt-3.5 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
              Join thousands of students who secured their medical college seats with ShopnerCoat.
            </p>
          </FadeIn>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Left Hero Card (Dark Navy) */}
          <HeroTestimonialCard testimonial={HERO_TESTIMONIAL} />

          {/* Right Cards Cluster */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* Top Row: 2 Split Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {TOP_TESTIMONIALS.map((item, idx) => (
                <TestimonialCard
                  key={item.id}
                  testimonial={item}
                  delay={idx * 0.1}
                />
              ))}
            </div>

            {/* Bottom Row: Wide Card */}
            <TestimonialCard
              testimonial={WIDE_TESTIMONIAL}
              delay={0.2}
              isWide
            />

          </div>

        </div>

      </div>
    </section>
  );
}
