import React from 'react';
import { Metadata } from 'next';
import { AdminLoginForm, AdminLoginVisual } from '@/components/admin/auth';
import { getAccessToken, getUserRole } from '@/lib/server/getTokens';
import { redirect } from 'next/navigation';
import { ROUTES } from '@/constants/routes';

export const metadata: Metadata = {
  title: 'Admin Portal Login | ShopnerCoat Medical Exam Board',
  description:
    'Secure administrator login portal for ShopnerCoat Medical Examination, result management, and candidate grading.',
};

export default async function AdminLoginPage() {
  // If already authenticated as ADMIN, redirect to admin dashboard directly
  const token = await getAccessToken();
  const role = await getUserRole();

  if (token && role === 'ADMIN') {
    redirect(ROUTES.ADMIN_DASHBOARD);
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#070C16] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      
      {/* Ambient Deep Atmospheric Glows */}
      <div
        className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-teal-600/10 rounded-full blur-[140px] pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-950/20 rounded-full blur-[160px] pointer-events-none"
        aria-hidden="true"
      />

      {/* Main Admin Login Card Container matching UI design */}
      <div className="relative z-10 w-full max-w-6xl bg-[#0C1322]/90 border border-slate-800/80 rounded-3xl shadow-[0_24px_70px_rgba(0,0,0,0.7)] backdrop-blur-2xl p-6 sm:p-10 lg:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* Left Column: Admin Login Form */}
          <div className="lg:col-span-6 w-full">
            <AdminLoginForm />
          </div>

          {/* Right Column: Interactive Admin Dashboard Preview & Floating Stats */}
          <div className="lg:col-span-6 w-full flex items-center justify-center">
            <AdminLoginVisual />
          </div>

        </div>
      </div>

    </div>
  );
}
