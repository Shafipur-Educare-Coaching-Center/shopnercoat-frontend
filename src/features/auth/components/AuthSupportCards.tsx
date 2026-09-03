import React from 'react';
import Link from 'next/link';
import { Bell, Headphones, MessageSquare, ExternalLink } from 'lucide-react';

export function AuthSupportCards() {
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 mt-4 sm:mt-5">
      
      {/* Card 1: Live Schedule Alert */}
      <div className="bg-white/90 rounded-2xl border border-slate-200/80 p-3 sm:p-3.5 shadow-2xs hover:shadow-xs transition-shadow flex items-start gap-3 backdrop-blur-md">
        <div className="size-9 rounded-xl bg-amber-50 border border-amber-200/70 text-amber-600 flex items-center justify-center shrink-0">
          <Bell className="size-4.5" />
        </div>
        <div className="space-y-0.5 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="px-1.5 py-0.5 rounded-md bg-amber-100/70 text-amber-800 text-[9px] font-bold uppercase tracking-wider">
              Live Schedule Alert
            </span>
            <span className="text-[10px] font-semibold text-slate-400">
              This Friday
            </span>
          </div>
          <h4 className="font-heading font-bold text-xs text-slate-900 leading-snug">
            National Medical Mock Test 08
          </h4>
          <p className="text-[11px] text-slate-500 leading-tight">
            Starts sharp at 10:00 AM across all nationwide exam centers.
          </p>
        </div>
      </div>

      {/* Card 2: Admissions Desk */}
      <div className="bg-white/90 rounded-2xl border border-slate-200/80 p-3 sm:p-3.5 shadow-2xs hover:shadow-xs transition-shadow flex items-start gap-3 backdrop-blur-md">
        <div className="size-9 rounded-xl bg-teal-50 border border-teal-200/70 text-[#00796B] flex items-center justify-center shrink-0">
          <Headphones className="size-4.5" />
        </div>
        <div className="space-y-0.5 min-w-0">
          <span className="inline-block px-1.5 py-0.5 rounded-md bg-teal-100/70 text-[#00594D] text-[9px] font-bold uppercase tracking-wider">
            Admissions Desk
          </span>
          <h4 className="font-heading font-bold text-xs text-slate-900 leading-snug">
            Roll Verification &amp; Support
          </h4>
          <p className="text-[11px] text-slate-500 leading-tight">
            Recover misplaced roll slips, duplicate student IDs, or delayed SMS codes.
          </p>
        </div>
      </div>

      {/* Card 3: Official Aspirants Channel */}
      <div className="bg-white/90 rounded-2xl border border-slate-200/80 p-3 sm:p-3.5 shadow-2xs hover:shadow-xs transition-shadow flex items-center justify-between gap-2.5 backdrop-blur-md">
        <div className="flex items-center gap-3 min-w-0">
          <div className="size-9 rounded-xl bg-[#00594D] text-white flex items-center justify-center shrink-0 shadow-2xs">
            <MessageSquare className="size-4.5" />
          </div>
          <div className="space-y-0.5 min-w-0">
            <h4 className="font-heading font-bold text-xs text-slate-900 leading-tight truncate">
              Official Aspirants Channel
            </h4>
            <p className="text-[11px] text-slate-500 truncate">
              Telegram &amp; WhatsApp live helpline
            </p>
          </div>
        </div>

        <Link
          href="https://t.me"
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1 transition-colors"
        >
          <span>Connect</span>
          <ExternalLink className="size-3 text-slate-500" />
        </Link>
      </div>

    </div>
  );
}

export default AuthSupportCards;
