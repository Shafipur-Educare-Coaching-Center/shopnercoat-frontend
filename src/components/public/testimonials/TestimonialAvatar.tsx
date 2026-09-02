'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface TestimonialAvatarProps {
  src: string;
  alt: string;
  initials: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  isHero?: boolean;
}

export function TestimonialAvatar({
  src,
  alt,
  initials,
  className,
  size = 'md',
  isHero = false,
}: TestimonialAvatarProps) {
  const [hasError, setHasError] = useState(false);

  const sizeClasses = {
    sm: 'w-9 h-9 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-11 h-11 text-base',
  };

  const pixelSizes = {
    sm: 36,
    md: 40,
    lg: 44,
  };

  return (
    <div
      className={cn(
        'relative rounded-xl overflow-hidden shrink-0 flex items-center justify-center font-semibold select-none',
        sizeClasses[size],
        isHero
          ? 'ring-2 ring-white/20 bg-slate-800 text-teal-300'
          : 'ring-1 ring-slate-200/90 bg-teal-50/80 text-primary',
        className
      )}
    >
      {!hasError && src ? (
        <Image
          src={src}
          alt={alt}
          width={pixelSizes[size]}
          height={pixelSizes[size]}
          className="w-full h-full object-cover"
          onError={() => setHasError(true)}
          unoptimized
        />
      ) : (
        <span className="tracking-tight font-heading">{initials}</span>
      )}
    </div>
  );
}
