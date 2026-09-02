'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterFormValues } from '@/schemas/auth.schema';
import { registerAction } from '@/features/auth/actions/registerAction';
import { ROUTES } from '@/constants/routes';
import {
  User,
  Calendar,
  Phone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  ShieldCheck,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';

export default function RegisterPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: 'onBlur',
    defaultValues: {
      fullName: '',
      dateOfBirth: '',
      mobileNumber: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const passwordVal = watch('password') || '';
  const confirmPasswordVal = watch('confirmPassword') || '';

  // Calculate password strength
  const getPasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[a-z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 2) return { label: 'Weak', color: 'bg-rose-500', width: 'w-1/4', text: 'text-rose-600' };
    if (score === 3 || score === 4) return { label: 'Good', color: 'bg-amber-500', width: 'w-3/4', text: 'text-amber-600' };
    return { label: 'Strong', color: 'bg-emerald-500', width: 'w-full', text: 'text-emerald-600' };
  };

  const passwordStrength = getPasswordStrength(passwordVal);
  const passwordsMatch = passwordVal && confirmPasswordVal && passwordVal === confirmPasswordVal;

  const onSubmit = (data: RegisterFormValues) => {
    setServerError(null);
    startTransition(async () => {
      try {
        const res = await registerAction(data);
        if (res.success) {
          toast.success('Registration Initiated', {
            description: `Verification OTP sent to ${res.mobileNumber}.`,
          });
          router.push(ROUTES.VERIFY_OTP);
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Registration failed. Please try again.';
        setServerError(message);
        toast.error('Registration Failed', { description: message });
      }
    });
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
      
      {/* Left Column: Branding / Guidance (Desktop only) */}
      <div className="hidden lg:flex lg:col-span-5 flex-col justify-between p-8 rounded-3xl bg-gradient-to-br from-[#37447E] to-[#1E2749] text-white shadow-xl min-h-[580px]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-teal-300 text-xs font-semibold backdrop-blur-sm border border-white/10 mb-6">
            <GraduationCap className="size-4" />
            <span>Candidate Admissions 2026</span>
          </div>

          <h2 className="font-heading font-black text-2xl xl:text-3xl text-white leading-tight">
            Start Your Medical &amp; Dental Journey
          </h2>
          <p className="mt-3 text-xs text-slate-300 leading-relaxed">
            Create an official candidate account for model tests, real-time result tabulation, computerized merit ranking, and instant admit card generation.
          </p>

          <div className="mt-8 space-y-4">
            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10">
              <div className="size-8 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center shrink-0">
                <CheckCircle2 className="size-4" />
              </div>
              <div>
                <p className="font-bold text-xs text-white">Instant SMS Verification</p>
                <p className="text-[11px] text-slate-300">Fast 6-digit OTP delivery directly to your phone.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10">
              <div className="size-8 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center shrink-0">
                <Sparkles className="size-4" />
              </div>
              <div>
                <p className="font-bold text-xs text-white">7-Digit Roll Assignment</p>
                <p className="text-[11px] text-slate-300">Unique cryptographic roll &amp; registration number.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10">
              <div className="size-8 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0">
                <ShieldCheck className="size-4" />
              </div>
              <div>
                <p className="font-bold text-xs text-white">Shafipur Educare Certified</p>
                <p className="text-[11px] text-slate-300">Authorized coaching center admission portal.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
          <span>Already registered?</span>
          <Link
            href={ROUTES.LOGIN}
            className="font-bold text-teal-300 hover:text-white underline underline-offset-4 flex items-center gap-1 transition-colors"
          >
            Sign In Here <ArrowRight className="size-3" />
          </Link>
        </div>
      </div>

      {/* Right Column: Registration Form */}
      <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xl">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h1 className="font-heading font-black text-xl sm:text-2xl text-slate-900">
              Candidate Registration
            </h1>
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
              Step 1 of 3
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Fill in your authentic student details. Mobile number will be verified with OTP.
          </p>
        </div>

        {serverError && (
          <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-rose-700 text-xs">
            <AlertCircle className="size-4 shrink-0 mt-0.5" />
            <p className="font-medium leading-relaxed">{serverError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          
          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Full Name (As per SSC/HSC Certificate) *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="size-4" />
              </div>
              <input
                type="text"
                {...register('fullName')}
                placeholder="e.g. Rahim Uddin"
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-medium"
              />
            </div>
            {errors.fullName && (
              <p className="text-[11px] text-rose-500 mt-1 font-medium flex items-center gap-1">
                <AlertCircle className="size-3" /> {errors.fullName.message}
              </p>
            )}
          </div>

          {/* Date of Birth & Mobile Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Date of Birth */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Date of Birth *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Calendar className="size-4" />
                </div>
                <input
                  type="date"
                  {...register('dateOfBirth')}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-medium"
                />
              </div>
              {errors.dateOfBirth && (
                <p className="text-[11px] text-rose-500 mt-1 font-medium flex items-center gap-1">
                  <AlertCircle className="size-3" /> {errors.dateOfBirth.message}
                </p>
              )}
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Mobile Number (BD 11-Digit) *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Phone className="size-4" />
                </div>
                <input
                  type="tel"
                  {...register('mobileNumber')}
                  placeholder="01712345678"
                  maxLength={14}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-mono font-medium"
                />
              </div>
              {errors.mobileNumber && (
                <p className="text-[11px] text-rose-500 mt-1 font-medium flex items-center gap-1">
                  <AlertCircle className="size-3" /> {errors.mobileNumber.message}
                </p>
              )}
            </div>
          </div>

          {/* Email Address (Optional) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700">
                Email Address
              </label>
              <span className="text-[10px] text-slate-400">Optional (Recommended for Admit PDF)</span>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="size-4" />
              </div>
              <input
                type="email"
                {...register('email')}
                placeholder="candidate@gmail.com"
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-medium"
              />
            </div>
            {errors.email && (
              <p className="text-[11px] text-rose-500 mt-1 font-medium flex items-center gap-1">
                <AlertCircle className="size-3" /> {errors.email.message}
              </p>
            )}
          </div>

          {/* Password & Confirm Password Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Create Password *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="size-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  placeholder="Min 8 characters"
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

              {/* Password Strength Indicator */}
              {passwordVal.length > 0 && (
                <div className="mt-1.5 space-y-1">
                  <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full ${passwordStrength.color} ${passwordStrength.width} transition-all duration-300`} />
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-slate-400">Strength:</span>
                    <span className={`font-bold ${passwordStrength.text}`}>{passwordStrength.label}</span>
                  </div>
                </div>
              )}

              {errors.password && (
                <p className="text-[11px] text-rose-500 mt-1 font-medium flex items-center gap-1">
                  <AlertCircle className="size-3" /> {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700">
                  Confirm Password *
                </label>
                {passwordsMatch && (
                  <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="size-3" /> Match
                  </span>
                )}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="size-4" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  {...register('confirmPassword')}
                  placeholder="Repeat password"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-[11px] text-rose-500 mt-1 font-medium flex items-center gap-1">
                  <AlertCircle className="size-3" /> {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-3">
            <button
              type="submit"
              disabled={isPending}
              className="w-full py-3 px-5 rounded-2xl bg-[#37447E] hover:bg-[#2C3765] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin text-white" />
                  <span>Sending Verification OTP...</span>
                </>
              ) : (
                <>
                  <span>Continue to OTP Verification</span>
                  <ArrowRight className="size-4" />
                </>
              )}
            </button>
          </div>

          {/* Bottom helper */}
          <p className="text-center text-[11px] text-slate-500 pt-2">
            By registering, you agree to our candidate examination guidelines and data verification terms.
          </p>

          <div className="pt-2 text-center lg:hidden">
            <p className="text-xs text-slate-600">
              Already have an account?{' '}
              <Link href={ROUTES.LOGIN} className="font-bold text-indigo-600 hover:underline">
                Sign In
              </Link>
            </p>
          </div>

        </form>
      </div>

    </div>
  );
}
