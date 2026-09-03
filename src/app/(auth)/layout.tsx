import { ReactNode } from 'react';
import { Auth3DCanvas } from '@/features/auth/components/Auth3DCanvas';
import { AuthFooter } from '@/features/auth/components/AuthFooter';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-b from-[#eaf7f5] via-[#f3faf9] to-[#ecf4f7] text-slate-900 selection:bg-teal-500 selection:text-white relative overflow-x-hidden py-3 sm:py-5 lg:py-6 px-4 sm:px-6">
      
      {/* Interactive 3D Canvas in background */}
      <Auth3DCanvas />

      {/* Ambient background lighting blurs */}
      <div className="fixed -top-32 -left-32 w-80 h-80 rounded-full bg-teal-400/10 blur-[100px] pointer-events-none z-0" />
      <div className="fixed top-1/2 -right-32 w-80 h-80 rounded-full bg-cyan-400/10 blur-[100px] pointer-events-none z-0" />
      <div className="fixed -bottom-32 left-1/3 w-80 h-80 rounded-full bg-emerald-400/10 blur-[100px] pointer-events-none z-0" />

      {/* Main Content Area */}
      <main className="w-full max-w-[1140px] mx-auto flex-1 flex flex-col justify-center relative z-10 my-auto">
        {children}
      </main>

      {/* Standardized Bottom Footer */}
      <div className="w-full max-w-[1140px] mx-auto relative z-10">
        <AuthFooter />
      </div>

    </div>
  );
}
