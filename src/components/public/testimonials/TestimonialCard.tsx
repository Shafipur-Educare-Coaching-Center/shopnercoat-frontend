'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Testimonial } from '@/data/testimonialsData';
import { TestimonialAvatar } from './TestimonialAvatar';
import { TestimonialRating } from './TestimonialRating';
import { cn } from '@/lib/utils';

interface TestimonialCardProps {
  testimonial: Testimonial;
  delay?: number;
  isWide?: boolean;
  className?: string;
}

export function TestimonialCard({
  testimonial,
  delay = 0,
  isWide = false,
  className,
}: TestimonialCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.45, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={cn(
        'rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-7 flex flex-col justify-between shadow-xs hover:shadow-clinical hover:border-primary/40 transition-all duration-300 group cursor-default',
        className
      )}
    >
      {/* Top: Avatar & Rating */}
      <div className="flex items-center justify-between">
        <TestimonialAvatar
          src={testimonial.avatar}
          alt={testimonial.name}
          initials={testimonial.initials}
          size="md"
        />
        <TestimonialRating rating={testimonial.rating} />
      </div>

      {/* Quote */}
      <div className="my-6">
        <p
          className={cn(
            'text-sm sm:text-base leading-relaxed',
            isWide ? 'text-slate-700 font-semibold' : 'text-slate-600 font-normal'
          )}
        >
          {testimonial.quote}
        </p>
      </div>

      {/* Author */}
      <div className="pt-4 border-t border-slate-100">
        <h4 className="font-heading font-semibold text-slate-900 text-sm sm:text-base">
          {testimonial.name}
        </h4>
        <p className="text-xs sm:text-sm text-slate-500 font-normal mt-0.5">
          {testimonial.role}
        </p>
      </div>
    </motion.div>
  );
}
