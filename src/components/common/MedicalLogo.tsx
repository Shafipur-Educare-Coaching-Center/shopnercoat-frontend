'use client';

import React from 'react';
import Image from 'next/image';
import { cn } from "@/lib/utils";

interface MedicalLogoProps {
  className?: string;
  variant?: 'full' | 'icon' | 'footer';
  width?: number;
  height?: number;
}

export function MedicalLogo({
  className,
  variant = 'full',
  width,
  height,
}: MedicalLogoProps) {
  if (variant === 'icon') {
    return (
      <div className={cn("inline-flex items-center justify-center shrink-0", className)}>
        <Image
          src="/shopnercoat-icon.png"
          alt="ShopnerCoat Icon"
          width={width || 36}
          height={height || 36}
          className="w-auto h-9 object-contain"
          priority
        />
      </div>
    );
  }

  if (variant === 'footer') {
    return (
      <div className={cn("flex items-center gap-3", className)}>
        <div className="w-10 h-10 rounded-xl overflow-hidden bg-teal-50/80 border border-teal-200/80 p-1 flex items-center justify-center shrink-0 shadow-2xs">
          <Image
            src="/shopnercoat-icon.png"
            alt="ShopnerCoat Icon"
            width={36}
            height={36}
            className="w-full h-full object-contain"
          />
        </div>
        <div className="flex flex-col">
          <span className="font-heading font-bold text-lg leading-tight tracking-tight text-slate-900">
            ShopnerCoat
          </span>
          <span className="text-[11px] font-medium tracking-wide uppercase text-primary">
            Medical Examination Board
          </span>
        </div>
      </div>
    );
  }

  // Default: Full Name Logo from /shopner-coat.png
  return (
    <div className={cn("flex items-center shrink-0", className)}>
      <Image
        src="/shopner-coat.png"
        alt="ShopnerCoat Logo"
        width={width || 160}
        height={height || 40}
        className="h-8 md:h-9 w-auto object-contain"
        priority
      />
    </div>
  );
}
