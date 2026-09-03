'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ROUTES } from '@/constants/routes';
import { NotFound3DCanvas } from '@/components/404/NotFound3DCanvas';
import { NotFoundContent } from '@/components/404/NotFoundContent';

export default function NotFound() {
  const [shockTrigger, setShockTrigger] = useState(0);

  const handleTriggerShock = () => {
    setShockTrigger((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-between bg-gradient-to-b from-[#eaf7f5] via-[#f3faf9] to-[#ecf4f7] text-slate-900 selection:bg-teal-500 selection:text-white relative overflow-hidden py-4 sm:py-6 px-4 sm:px-6">
      
      {/* 1. Interactive 3D Canvas Layer */}
      <NotFound3DCanvas
        externalShockTrigger={shockTrigger}
        onShock={handleTriggerShock}
      />

      {/* 2. Ambient Lighting Glow Blurs */}
      <div className="fixed -top-28 -left-28 w-96 h-96 rounded-full bg-teal-400/15 blur-[120px] pointer-events-none z-0" />
      <div className="fixed top-1/2 -right-32 w-96 h-96 rounded-full bg-cyan-400/15 blur-[120px] pointer-events-none z-0" />
      <div className="fixed -bottom-32 left-1/3 w-96 h-96 rounded-full bg-emerald-400/15 blur-[120px] pointer-events-none z-0" />

      {/* 3. Top Navigation Header */}
      <header className="relative z-10 w-full max-w-5xl mx-auto flex items-center justify-between">
        <Link
          href={ROUTES.HOME}
          className="flex items-center gap-2.5 group cursor-pointer"
        >
          <div className="size-10 rounded-xl bg-gradient-to-br from-teal-50 to-slate-100 border border-teal-200/70 p-1.5 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
            <Image
              src="/shopnercoat-icon.png"
              alt="Shopner Coat"
              width={32}
              height={32}
              className="w-full h-full object-contain"
              priority
            />
          </div>
          <div>
            <span className="font-heading font-black text-sm sm:text-base text-slate-900 tracking-tight block leading-tight group-hover:text-[#00796B] transition-colors">
              Shopner Coat
            </span>
            <span className="text-[10px] font-semibold text-slate-500 block leading-tight">
              Central Examination Board
            </span>
          </div>
        </Link>

        <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-teal-200/70 shadow-2xs backdrop-blur-xs text-[11px] font-bold text-teal-800">
          <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>National Admission System</span>
        </div>
      </header>

      {/* 4. Centerpiece 404 Medical Interactive Content */}
      <main className="relative z-10 my-auto py-8 sm:py-12 flex items-center justify-center">
        <NotFoundContent
          onTriggerShock={handleTriggerShock}
          shockCount={shockTrigger}
        />
      </main>

      {/* 5. Minimal Clinical Footer */}
      <footer className="relative z-10 w-full max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500 pt-3 border-t border-slate-200/60">
        <p className="font-medium">
          &copy; {new Date().getFullYear()} Shopner Coat Examination Board. All rights reserved.
        </p>
        <p className="font-mono text-[10px] text-slate-400">
          Ref: ERR_404_PAGE_FLATLINED &bull; Clinical v4.2
        </p>
      </footer>

    </div>
  );
}
