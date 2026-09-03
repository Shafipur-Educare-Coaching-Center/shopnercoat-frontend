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
  LogIn,
} from 'lucide-react';
import { toast } from 'sonner';

export function RegisterForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [agreedTerms, setAgreedTerms] = useState(true);

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
    if (!agreedTerms) {
      toast.error('Terms Required', {
        description: 'Please accept the DGHS examination conduct terms to proceed.',
      });
      return;
    }

    setServerError(null);
    startTransition(async () => {
      try {
        const res = await registerAction(data);
        if (res.success) {
          toast.success('Registration Initiated', {
            description: `Verification OTP code dispatched to ${res.mobileNumber}.`,
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
    <div className="w-full rounded-[28px] sm:rounded-[32px] bg-white border border-slate-200/80 p-6 sm:p-7 lg:p-8 shadow-[0_20px_50px_rgba(15,118,110,0.06)] flex flex-col justify-between h-full">
      
      {/* Top Header Row */}
      <div>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-heading font-black text-xl sm:text-2xl text-slate-900 tracking-tight">
              Candidate Registration
            </h2>
            <p className="text-xs sm:text-[13px] text-slate-500 mt-0.5 font-medium">
              Enter your authentic student details. Mobile number will receive OTP.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-teal-50 text-[#00695C] border border-teal-200/70 text-[10px] font-bold">
              Step 1 of 3
            </span>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-[11px] font-bold shadow-2xs">
              <ShieldCheck className="size-3.5 text-emerald-600" />
              <span>256-bit SSL</span>
            </div>
          </div>
        </div>

        {/* Server Error Alert */}
        {serverError && (
          <div className="mt-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-2 text-rose-700 text-xs">
            <AlertCircle className="size-4 shrink-0 mt-0.5" />
            <p className="font-medium leading-relaxed">{serverError}</p>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-3.5" noValidate>
          
          {/* Full Name */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-800">
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
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-hidden focus:ring-2 focus:ring-[#00796B]/25 focus:border-[#00796B] focus:bg-white transition-all font-medium"
              />
            </div>
            {errors.fullName && (
              <p className="text-[11px] text-rose-600 mt-1 font-medium flex items-center gap-1">
                <AlertCircle className="size-3" /> {errors.fullName.message}
              </p>
            )}
          </div>

          {/* Date of Birth & Mobile Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Date of Birth */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-800">
                Date of Birth *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Calendar className="size-4" />
                </div>
                <input
                  type="date"
                  {...register('dateOfBirth')}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-hidden focus:ring-2 focus:ring-[#00796B]/25 focus:border-[#00796B] focus:bg-white transition-all font-medium"
                />
              </div>
              {errors.dateOfBirth && (
                <p className="text-[11px] text-rose-600 mt-1 font-medium flex items-center gap-1">
                  <AlertCircle className="size-3" /> {errors.dateOfBirth.message}
                </p>
              )}
            </div>

            {/* Mobile Number */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-800">
                  Mobile Number (BD) *
                </label>
                <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                  11-Digit
                </span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Phone className="size-4" />
                </div>
                <input
                  type="tel"
                  {...register('mobileNumber')}
                  placeholder="017XXXXXXXX"
                  maxLength={14}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-hidden focus:ring-2 focus:ring-[#00796B]/25 focus:border-[#00796B] focus:bg-white transition-all font-mono font-medium"
                />
              </div>
              {errors.mobileNumber && (
                <p className="text-[11px] text-rose-600 mt-1 font-medium flex items-center gap-1">
                  <AlertCircle className="size-3" /> {errors.mobileNumber.message}
                </p>
              )}
            </div>
          </div>

          {/* Email Address (Optional) */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-800">
                Email Address
              </label>
              <span className="text-[10px] text-slate-400 font-medium">
                Optional (For Admit PDF)
              </span>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="size-4" />
              </div>
              <input
                type="email"
                {...register('email')}
                placeholder="candidate@gmail.com"
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-hidden focus:ring-2 focus:ring-[#00796B]/25 focus:border-[#00796B] focus:bg-white transition-all font-medium"
              />
            </div>
            {errors.email && (
              <p className="text-[11px] text-rose-600 mt-1 font-medium flex items-center gap-1">
                <AlertCircle className="size-3" /> {errors.email.message}
              </p>
            )}
          </div>

          {/* Password & Confirm Password Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Password */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-800">
                Create Password *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="size-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  placeholder="Min 8 chars"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-hidden focus:ring-2 focus:ring-[#00796B]/25 focus:border-[#00796B] focus:bg-white transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {passwordVal.length > 0 && (
                <div className="mt-1 space-y-0.5">
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
                <p className="text-[11px] text-rose-600 mt-1 font-medium flex items-center gap-1">
                  <AlertCircle className="size-3" /> {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-800">
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
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-hidden focus:ring-2 focus:ring-[#00796B]/25 focus:border-[#00796B] focus:bg-white transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-[11px] text-rose-600 mt-1 font-medium flex items-center gap-1">
                  <AlertCircle className="size-3" /> {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>

          {/* Terms Checkbox */}
          <div className="pt-0.5">
            <label className="flex items-start gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={agreedTerms}
                onChange={(e) => setAgreedTerms(e.target.checked)}
                className="size-4 rounded-md border-slate-300 text-[#00796B] focus:ring-[#00796B] accent-[#00796B] cursor-pointer mt-0.5"
              />
              <span className="text-[11px] text-slate-600 leading-snug">
                I agree to the <span className="font-semibold text-slate-800">DGHS Exam Conduct Code</span>.
              </span>
            </label>
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
                  <span>Dispatching SMS OTP...</span>
                </>
              ) : (
                <>
                  <span>Continue to SMS Verification</span>
                  <ArrowRight className="size-4" />
                </>
              )}
            </button>
          </div>

        </form>
      </div>

      {/* Bottom Aspirant Sign-in Banner */}
      <div className="mt-5 pt-4 border-t border-slate-100">
        <div className="p-3 sm:p-3.5 rounded-2xl bg-[#F0FDF9] border border-teal-100 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="size-8 rounded-xl bg-teal-100/80 text-[#00796B] flex items-center justify-center shrink-0">
              <LogIn className="size-4" />
            </div>
            <div className="min-w-0">
              <p className="font-bold text-xs text-slate-900 leading-tight truncate">
                Already registered as an Aspirant?
              </p>
              <p className="text-[11px] text-slate-500 truncate mt-0.5">
                Sign in with your Roll or Mobile to access mock tests.
              </p>
            </div>
          </div>

          <Link
            href={ROUTES.LOGIN}
            className="shrink-0 px-3 py-1.5 rounded-xl bg-white hover:bg-teal-50 text-[#00695C] border border-teal-200/80 font-bold text-xs flex items-center gap-1 shadow-2xs transition-colors"
          >
            <span>Sign In</span>
            <ArrowRight className="size-3" />
          </Link>
        </div>
      </div>

    </div>
  );
}

export default RegisterForm;
