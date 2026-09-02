'use client';

import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TestimonialRatingProps {
  rating: string;
  isHero?: boolean;
  className?: string;
}

export function TestimonialRating({
  rating,
  isHero = false,
  className,
}: TestimonialRatingProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold select-none',
        isHero
          ? 'bg-white/10 backdrop-blur-md border border-white/10 text-white'
          : 'bg-slate-50 border border-slate-200/80 text-slate-700',
        className
      )}
    >
      <span>{rating}</span>
      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />
    </div>
  );
}
