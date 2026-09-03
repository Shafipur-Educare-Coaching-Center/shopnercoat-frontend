'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';
import { adminLoginSchema, AdminLoginFormValues } from '@/schemas/auth.schema';
import { adminLoginAction } from '@/features/auth/actions/adminLoginAction';
import { ROUTES } from '@/constants/routes';

export function AdminLoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminLoginFormValues>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      mobileNumber: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (values: AdminLoginFormValues) => {
    setIsLoading(true);
    try {
      const result = await adminLoginAction(values);
      if (result.success) {
        toast.success('Welcome back, Administrator!', {
          description: 'Redirecting to your dashboard...',
        });
        router.push(ROUTES.ADMIN_DASHBOARD);
        router.refresh();
      } else {
        toast.error('Authentication Failed', {
          description: result.error || 'Invalid credentials or connection error.',
        });
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'Invalid credentials or connection error.';
      toast.error('Authentication Failed', {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="w-full max-w-md mx-auto flex flex-col justify-center"
    >
      {/* Brand Header */}
      <div className="flex items-center gap-2 mb-2">
        <span className="font-heading font-bold text-xl sm:text-2xl text-white tracking-tight">
          ShopnerCoat
        </span>
      </div>

      {/* Title & Subtitle */}
      <div className="mt-4 mb-6 sm:mb-8">
        <h1 className="font-heading font-black text-3xl sm:text-4xl text-white tracking-tight">
          <span className="text-teal-400">Admin</span> Login
        </h1>
        <p className="text-slate-400 text-sm sm:text-base mt-2 font-normal">
          Please enter your credentials to proceed.
        </p>
      </div>

      {/* Login Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4 sm:space-y-5">
        
        {/* 1. Mobile Number / Email / Identifier Input */}
        <div className="space-y-1.5">
          <div className="relative">
            <input
              id="mobileNumber"
              type="text"
              autoComplete="username"
              placeholder="Enter your mobile number"
              disabled={isLoading}
              {...register('mobileNumber')}
              className={`w-full px-4 py-3 sm:py-3.5 bg-white text-slate-900 placeholder:text-slate-400 text-sm sm:text-base rounded-xl border transition-all outline-hidden focus:ring-2 focus:ring-teal-400 ${
                errors.mobileNumber ? 'border-red-400 ring-1 ring-red-400' : 'border-transparent'
              }`}
            />
          </div>
          {errors.mobileNumber && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-red-400 font-medium pl-1"
            >
              {errors.mobileNumber.message}
            </motion.p>
          )}
        </div>

        {/* 2. Password Input */}
        <div className="space-y-1.5">
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="Enter password"
              disabled={isLoading}
              {...register('password')}
              className={`w-full px-4 py-3 sm:py-3.5 pr-11 bg-white text-slate-900 placeholder:text-slate-400 text-sm sm:text-base rounded-xl border transition-all outline-hidden focus:ring-2 focus:ring-teal-400 ${
                errors.password ? 'border-red-400 ring-1 ring-red-400' : 'border-transparent'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              tabIndex={-1}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-red-400 font-medium pl-1"
            >
              {errors.password.message}
            </motion.p>
          )}
        </div>

        {/* 3. Options: Remember me & Forgot Password */}
        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              {...register('rememberMe')}
              className="w-4 h-4 rounded-sm border-slate-700 bg-slate-900 text-teal-500 focus:ring-teal-400 focus:ring-offset-slate-900 cursor-pointer accent-teal-500"
            />
            <span className="text-xs sm:text-sm text-slate-300">Remember me</span>
          </label>

          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              toast.info('Password Reset', {
                description: 'Please contact the system administrator to reset credentials.',
              });
            }}
            className="text-xs sm:text-sm text-slate-400 hover:text-teal-400 transition-colors"
          >
            Forgot your password?
          </a>
        </div>

        {/* 4. Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-2 py-3 sm:py-3.5 px-6 rounded-xl bg-teal-600 hover:bg-teal-500 active:bg-teal-700 text-white font-heading font-semibold text-sm sm:text-base shadow-lg shadow-teal-900/30 hover:shadow-teal-500/20 transition-all transform active:scale-[0.99] disabled:opacity-60 disabled:pointer-events-none cursor-pointer flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Verifying Credentials...</span>
            </>
          ) : (
            <>
              <span>Sign in</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

      </form>
    </motion.div>
  );
}
