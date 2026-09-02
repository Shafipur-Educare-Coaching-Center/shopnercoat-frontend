'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Testimonial } from '@/data/testimonialsData';
import { TestimonialAvatar } from './TestimonialAvatar';
import { TestimonialRating } from './TestimonialRating';

interface HeroTestimonialCardProps {
  testimonial: Testimonial;
}

export function HeroTestimonialCard({ testimonial }: HeroTestimonialCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="lg:col-span-4 rounded-3xl bg-[#101828] text-white p-7 sm:p-8 flex flex-col justify-between relative overflow-hidden border border-slate-800 shadow-xl group cursor-default"
    >
      {/* Ambient inner glow */}
      <div
        className="absolute top-0 right-0 w-56 h-56 bg-primary/15 rounded-full blur-3xl pointer-events-none group-hover:bg-primary/25 transition-all duration-500"
        aria-hidden="true"
      />

      {/* Top Row: Avatar & Rating Badge */}
      <div className="flex items-center justify-between relative z-10">
        <TestimonialAvatar
          src={testimonial.avatar}
          alt={testimonial.name}
          initials={testimonial.initials}
          size="lg"
          isHero
        />
        <TestimonialRating rating={testimonial.rating} isHero />
      </div>

      {/* Main Quote */}
      <div className="my-8 sm:my-10 relative z-10">
        <p className="font-heading font-semibold text-lg sm:text-xl text-white leading-relaxed">
          {testimonial.quote}
        </p>
      </div>

      {/* Author Footer */}
      <div className="pt-5 border-t border-slate-800/80 relative z-10">
        <h4 className="font-heading font-bold text-white text-base">
          {testimonial.name}
        </h4>
        <p className="text-xs sm:text-sm text-slate-400 font-normal mt-0.5">
          {testimonial.role}
        </p>
      </div>
    </motion.div>
  );
}
