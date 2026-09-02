import { ReactNode } from 'react';
import Link from 'next/link';
import { MedicalLogo } from '@/components/common/MedicalLogo';
import { ROUTES } from '@/constants/routes';
import { ShieldCheck, Award, Sparkles } from 'lucide-react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-slate-50 via-teal-50/40 to-indigo-50/30">
      
      {/* Top Header Brand Bar */}
      <header className="w-full px-6 py-4 flex items-center justify-between border-b border-slate-200/60 bg-white/70 backdrop-blur-md">
        <Link href={ROUTES.HOME} className="flex items-center gap-2 hover:opacity-90 transition-opacity">
          <MedicalLogo />
        </Link>

        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-600">
          <span className="flex items-center gap-1 text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200/60">
            <ShieldCheck className="size-3.5" />
            Official Portal
          </span>
          <span className="text-slate-400">•</span>
          <span className="text-slate-500">Shafipur Educare Coaching Center</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-4xl mx-auto">
          {children}
        </div>
      </main>

      {/* Subtle Footer */}
      <footer className="w-full py-4 text-center text-xs text-slate-500 border-t border-slate-200/50 bg-white/50">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} ShopnerCoat. All rights reserved.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span className="flex items-center gap-1 text-[11px]">
              <Award className="size-3 text-amber-500" />
              Medical &amp; Dental Admission System
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-[11px]">
              <Sparkles className="size-3 text-indigo-500" />
              256-Bit Encrypted
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
}
