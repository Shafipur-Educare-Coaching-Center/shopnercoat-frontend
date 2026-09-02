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
  User,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  AlertCircle,
  GraduationCap,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get('redirect');

  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

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

        toast.success('Login Successful', {
          description: `Welcome back to ShopnerCoat portal.`,
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
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
      
      {/* Left Column: Branding / Value Proposition (Desktop only) */}
      <div className="hidden lg:flex lg:col-span-5 flex-col justify-between p-8 rounded-3xl bg-gradient-to-br from-[#37447E] to-[#1E2749] text-white shadow-xl min-h-[500px]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-teal-300 text-xs font-semibold backdrop-blur-sm border border-white/10 mb-6">
            <GraduationCap className="size-4" />
            <span>Official Examination Portal</span>
          </div>

          <h2 className="font-heading font-black text-2xl xl:text-3xl text-white leading-tight">
            Shafipur Educare Coaching Center
          </h2>
          <p className="mt-3 text-xs text-slate-300 leading-relaxed">
            Sign in using your registered mobile number, email, or 7-digit roll number to check model test admit cards, results, and rank sheets.
          </p>

          <div className="mt-8 space-y-4">
            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10">
              <div className="size-8 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center shrink-0">
                <CheckCircle2 className="size-4" />
              </div>
              <div>
                <p className="font-bold text-xs text-white">Admit Card PDF Downloads</p>
                <p className="text-[11px] text-slate-300">Access instant digital admit cards with QR security.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10">
              <div className="size-8 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0">
                <ShieldCheck className="size-4" />
              </div>
              <div>
                <p className="font-bold text-xs text-white">Live Merit Ranking</p>
                <p className="text-[11px] text-slate-300">View competitive performance and Top-10 leaderboards.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
          <span>New candidate?</span>
          <Link
            href={ROUTES.REGISTER}
            className="font-bold text-teal-300 hover:text-white underline underline-offset-4 flex items-center gap-1 transition-colors"
          >
            Register Here <ArrowRight className="size-3" />
          </Link>
        </div>
      </div>

      {/* Right Column: Sign In Card */}
      <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xl max-w-lg mx-auto lg:max-w-none w-full">
        <div className="mb-6">
          <h1 className="font-heading font-black text-xl sm:text-2xl text-slate-900">
            Sign In to Portal
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Enter your mobile number, email, or 7-digit roll number to continue.
          </p>
        </div>

        {serverError && (
          <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-rose-700 text-xs">
            <AlertCircle className="size-4 shrink-0 mt-0.5" />
            <p className="font-medium leading-relaxed">{serverError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          
          {/* Identifier Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Mobile, Email or 7-Digit Roll Number *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="size-4" />
              </div>
              <input
                type="text"
                {...register('identifier')}
                placeholder="017XXXXXXXX / Roll # / Email"
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-medium"
              />
            </div>
            {errors.identifier && (
              <p className="text-[11px] text-rose-500 mt-1 font-medium flex items-center gap-1">
                <AlertCircle className="size-3" /> {errors.identifier.message}
              </p>
            )}
          </div>

          {/* Password Input */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700">
                Password *
              </label>
              <span className="text-[11px] text-slate-400">Default or custom password</span>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="size-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                placeholder="Enter password"
                className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-[11px] text-rose-500 mt-1 font-medium flex items-center gap-1">
                <AlertCircle className="size-3" /> {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isPending}
              className="w-full py-3 px-5 rounded-2xl bg-[#37447E] hover:bg-[#2C3765] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin text-white" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Portal</span>
                  <ArrowRight className="size-4" />
                </>
              )}
            </button>
          </div>

          {/* Bottom links */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-600">
            <p>
              Don&apos;t have an account?{' '}
              <Link href={ROUTES.REGISTER} className="font-bold text-indigo-600 hover:underline">
                Register as Candidate
              </Link>
            </p>

            <Link href={ROUTES.ADMIN_LOGIN} className="text-[11px] text-slate-400 hover:text-slate-700">
              Admin Portal →
            </Link>
          </div>

        </form>
      </div>

    </div>
  );
}
