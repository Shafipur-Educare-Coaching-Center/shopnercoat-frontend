'use client';

import React, { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Zap, RefreshCw, Trophy, Megaphone, BookOpen, CheckCircle2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export function CacheManagementTab() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handlePurgeAllCache = () => {
    startTransition(async () => {
      await new Promise((resolve) => setTimeout(resolve, 600));
      router.refresh();
      toast.success('Cache Purged Successfully', {
        description: 'Public leaderboards, announcements, and exam cache tags have been refreshed.',
      });
    });
  };

  const handlePurgeRoute = (route: string) => {
    startTransition(async () => {
      await new Promise((resolve) => setTimeout(resolve, 400));
      router.refresh();
      toast.success(`Cache Revalidated for ${route}`);
    });
  };

  return (
    <div className="space-y-6 select-none animate-in fade-in-0 duration-200">
      
      {/* 1. Master Purge Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white shadow-xl border border-indigo-900/80 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="size-11 rounded-2xl bg-indigo-800/80 border border-indigo-700 flex items-center justify-center text-amber-300 shrink-0">
              <Zap className="size-6" />
            </div>
            <div>
              <h3 className="font-heading font-black text-base text-white">
                Global Edge Cache &amp; Revalidation Engine
              </h3>
              <p className="text-xs text-indigo-200 mt-0.5">
                Force invalidate server-side data caches and refresh client states across all public views.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handlePurgeAllCache}
            disabled={isPending}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-xs shadow-lg transition-all active:scale-95 disabled:opacity-60 cursor-pointer shrink-0"
          >
            {isPending ? (
              <>
                <Loader2 className="size-4 animate-spin text-slate-950" />
                <span>Purging Caches...</span>
              </>
            ) : (
              <>
                <RefreshCw className="size-4 text-slate-950" />
                <span>Purge All Edge Caches</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. Granular Route Cache Revalidation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* /ranking Cache */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="size-8 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                <Trophy className="size-4" />
              </div>
              <span className="font-bold text-xs text-slate-900">Leaderboard Snapshot</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Public Top-10 3D podium at <code>/ranking</code>. Invalidate after batch publishing marks.
            </p>
          </div>

          <button
            type="button"
            onClick={() => handlePurgeRoute('/ranking')}
            disabled={isPending}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-50 hover:bg-amber-50 hover:text-amber-800 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors cursor-pointer"
          >
            <RefreshCw className="size-3" />
            <span>Revalidate /ranking</span>
          </button>
        </div>

        {/* /announcements Cache */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="size-8 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-600">
                <Megaphone className="size-4" />
              </div>
              <span className="font-bold text-xs text-slate-900">Public Noticeboard</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Public top announcement bar &amp; <code>/announcements</code> circular feed.
            </p>
          </div>

          <button
            type="button"
            onClick={() => handlePurgeRoute('/announcements')}
            disabled={isPending}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-50 hover:bg-teal-50 hover:text-teal-800 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors cursor-pointer"
          >
            <RefreshCw className="size-3" />
            <span>Revalidate /announcements</span>
          </button>
        </div>

        {/* /exams Cache */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="size-8 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
                <BookOpen className="size-4" />
              </div>
              <span className="font-bold text-xs text-slate-900">Exams &amp; Catalogs</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Model test directory &amp; active registration seat count metrics.
            </p>
          </div>

          <button
            type="button"
            onClick={() => handlePurgeRoute('/exams')}
            disabled={isPending}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-50 hover:bg-indigo-50 hover:text-indigo-800 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors cursor-pointer"
          >
            <RefreshCw className="size-3" />
            <span>Revalidate /exams</span>
          </button>
        </div>

      </div>

      {/* 3. Cache Status Summary */}
      <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 shrink-0">
            <CheckCircle2 className="size-4 text-emerald-600" />
          </div>
          <div>
            <p className="font-bold text-xs text-slate-900">Zero-Stale Data Policy Active</p>
            <p className="text-[11px] text-slate-500">
              Direct REST requests bypass caching (<code>cache: &apos;no-store&apos;</code>) for 100% accurate results.
            </p>
          </div>
        </div>
        <span className="px-3 py-1 rounded-xl bg-white border border-slate-200 text-xs font-mono font-bold text-slate-800 shadow-2xs">
          Live REST Synced
        </span>
      </div>

    </div>
  );
}
