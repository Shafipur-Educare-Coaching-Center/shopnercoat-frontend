'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFormValues } from '@/schemas/auth.schema';
import { loginAction } from '@/features/auth/actions/loginAction';
import { ROUTES } from '@/constants/routes';
import {
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  AlertCircle,
  ShieldCheck,
  UserCheck,
  Clock,
  User,
} from 'lucide-react';
import { toast } from 'sonner';

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get('redirect');

  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [keepSignedIn, setKeepSignedIn] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: '',
      password: '',
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    setServerError(null);
    startTransition(async () => {
      try {
        const result = await loginAction(data);

        if (!result.success) {
          const errorMessage = result.error || 'Invalid credentials. Please verify and try again.';
          setServerError(errorMessage);
          toast.error('Authentication Failed', { description: errorMessage });
          return;
        }

        toast.success('Login Successful', {
          description: `Welcome back to ShopnerCoat Examination Portal.`,
        });

        if (result.needsProfileCompletion) {
          toast.info('Profile Incomplete', {
            description: 'Please complete your candidate profile before accessing the dashboard.',
          });
          router.push(ROUTES.COMPLETE_PROFILE);
          return;
        }

        if (redirectParam) {
          router.push(redirectParam);
          return;
        }

        if (result.role === 'ADMIN') {
          router.push(ROUTES.ADMIN_DASHBOARD);
        } else {
          router.push(ROUTES.STUDENT_DASHBOARD);
        }
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : 'Invalid credentials. Please verify and try again.';
        setServerError(message);
        toast.error('Authentication Failed', { description: message });
      }
    });
  };

  return (
    <div className="w-full rounded-[28px] sm:rounded-[32px] bg-white border border-slate-200/80 p-6 sm:p-7 lg:p-8 shadow-[0_20px_50px_rgba(15,118,110,0.06)] flex flex-col justify-between h-full">
      
      {/* Top Header Row */}
      <div>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-heading font-black text-xl sm:text-2xl text-slate-900 tracking-tight">
              Student Portal Login
            </h2>
            <p className="text-xs sm:text-[13px] text-slate-500 mt-0.5 font-medium">
              Access your roll profile, exam admit slip, and instant merit standings.
            </p>
          </div>

          {/* 256-bit SSL Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-[11px] font-bold shrink-0 shadow-2xs">
            <ShieldCheck className="size-3.5 text-emerald-600" />
            <span>256-bit SSL</span>
          </div>
        </div>

        {/* Server Error Alert */}
        {serverError && (
          <div className="mt-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-2 text-rose-700 text-xs">
            <AlertCircle className="size-4 shrink-0 mt-0.5" />
            <p className="font-medium leading-relaxed">{serverError}</p>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-4" noValidate>
          
          {/* Field 1: Medical Admission Roll / ID */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-800">
                Medical Admission Roll / ID
              </label>
              <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                Session 2025/2026
              </span>
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="size-4" />
              </div>
              <input
                type="text"
                {...register('identifier')}
                placeholder="e.g. MP-2025-88412 or 017XXXXXXXX"
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-hidden focus:ring-2 focus:ring-[#00796B]/25 focus:border-[#00796B] focus:bg-white transition-all font-medium"
              />
            </div>
            {errors.identifier && (
              <p className="text-[11px] text-rose-600 mt-1 font-medium flex items-center gap-1">
                <AlertCircle className="size-3" /> {errors.identifier.message}
              </p>
            )}
          </div>

          {/* Field 2: Secret PIN or Password */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-800">
                Secret PIN or Password
              </label>
              <button
                type="button"
                onClick={() => {
                  toast.info('Forgot PIN / Roll No?', {
                    description: 'Please contact the Central Admissions Desk below or use the Official Aspirants Channel for instant roll recovery.',
                  });
                }}
                className="text-[11px] font-bold text-[#00796B] hover:text-[#00594D] hover:underline transition-colors cursor-pointer"
              >
                Forgot PIN / Roll No?
              </button>
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="size-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                placeholder="Enter 6-digit candidate PIN"
                className="w-full pl-10 pr-10 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-hidden focus:ring-2 focus:ring-[#00796B]/25 focus:border-[#00796B] focus:bg-white transition-all font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-[11px] text-rose-600 mt-1 font-medium flex items-center gap-1">
                <AlertCircle className="size-3" /> {errors.password.message}
              </p>
            )}
          </div>

          {/* Option Row: Keep me signed in & 14 days valid */}
          <div className="flex items-center justify-between pt-0.5 text-xs">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={keepSignedIn}
                onChange={(e) => setKeepSignedIn(e.target.checked)}
                className="size-4 rounded-md border-slate-300 text-[#00796B] focus:ring-[#00796B] accent-[#00796B] cursor-pointer"
              />
              <span className="font-semibold text-slate-700 text-xs">
                Keep me signed in on this workstation
              </span>
            </label>

            <span className="flex items-center gap-1 text-[11px] font-medium text-slate-400">
              <Clock className="size-3 text-slate-400" />
              14 days valid
            </span>
          </div>

          {/* Submit Button */}
          <div className="pt-1">
            <button
              type="submit"
              disabled={isPending}
              className="w-full py-3 px-5 rounded-2xl bg-[#00695C] hover:bg-[#00594D] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg shadow-[#00695C]/15 transition-all active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin text-white" />
                  <span>Entering Candidate Portal...</span>
                </>
              ) : (
                <>
                  <span>Enter Candidate Portal</span>
                  <ArrowRight className="size-4" />
                </>
              )}
            </button>
          </div>

        </form>
      </div>

      {/* Bottom Aspirant Registration Banner */}
      <div className="mt-5 pt-4 border-t border-slate-100">
        <div className="p-3 sm:p-3.5 rounded-2xl bg-[#F0FDF9] border border-teal-100 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="size-8 rounded-xl bg-teal-100/80 text-[#00796B] flex items-center justify-center shrink-0">
              <UserCheck className="size-4" />
            </div>
            <div className="min-w-0">
              <p className="font-bold text-xs text-slate-900 leading-tight truncate">
                New Aspirant for Session 2026?
              </p>
              <p className="text-[11px] text-slate-500 truncate mt-0.5">
                Enroll online to secure your national model test roll &amp; kits.
              </p>
            </div>
          </div>

          <Link
            href={ROUTES.REGISTER}
            className="shrink-0 px-3 py-1.5 rounded-xl bg-white hover:bg-teal-50 text-[#00695C] border border-teal-200/80 font-bold text-xs flex items-center gap-1 shadow-2xs transition-colors"
          >
            <span>Register Now</span>
            <ArrowRight className="size-3" />
          </Link>
        </div>
      </div>

    </div>
  );
}

export default LoginForm;
