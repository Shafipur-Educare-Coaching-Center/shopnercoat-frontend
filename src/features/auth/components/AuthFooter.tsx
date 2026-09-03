import React from 'react';
import Link from 'next/link';

export function AuthFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full pt-3 pb-2 text-[11px] sm:text-xs text-slate-500">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
        <p className="text-[11px] sm:text-xs text-slate-500">
          © {currentYear} Shopner Coat Central Medical Exam Board. All rights reserved.
        </p>

        <div className="flex items-center gap-3 text-[11px] sm:text-xs text-slate-500 flex-wrap justify-center">
          <Link
            href="/announcements"
            className="hover:text-slate-800 transition-colors hover:underline underline-offset-2"
          >
            DGHS Exam Conduct Code
          </Link>
          <span className="text-slate-300">•</span>
          <Link
            href="/how-to-register"
            className="hover:text-slate-800 transition-colors hover:underline underline-offset-2"
          >
            Candidate Ombudsman Desk
          </Link>
          <span className="text-slate-300">•</span>
          <Link
            href="/announcements"
            className="hover:text-slate-800 transition-colors hover:underline underline-offset-2"
          >
            Privacy &amp; Security
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default AuthFooter;
