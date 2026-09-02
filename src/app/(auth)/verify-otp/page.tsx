'use client';

import React, { useState, useEffect, useRef, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ROUTES } from '@/constants/routes';
import { verifyOtpAction, resendOtpAction } from '@/features/auth/actions/registerAction';
import {
  ShieldCheck,
  Phone,
  RefreshCw,
  ArrowRight,
  ArrowLeft,
  Loader2,
  AlertCircle,
  KeyRound,
} from 'lucide-react';
import { toast } from 'sonner';

export default function VerifyOtpPage() {
  const router = useRouter();
  const [mobileNumber] = useState<string>(() => {
    if (typeof document !== 'undefined') {
      const match = document.cookie.match(/pendingMobile=([^;]+)/);
      if (match && match[1]) {
        return decodeURIComponent(match[1]);
      }
    }
    return '';
  });

  const [otpValues, setOtpValues] = useState<string[]>(['', '', '', '', '', '']);
  const [timer, setTimer] = useState<number>(60);
  const [serverError, setServerError] = useState<string | null>(null);

  const [isVerifying, startVerifying] = useTransition();
  const [isResending, startResending] = useTransition();

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Derived state: can resend once timer reaches 0
  const canResend = timer === 0;

  // Auto-focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // 60-second countdown
  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  // Handle single digit input
  const handleDigitChange = (index: number, val: string) => {
    const char = val.replace(/\D/g, '').slice(-1);
    const newOtp = [...otpValues];
    newOtp[index] = char;
    setOtpValues(newOtp);

    // Auto focus next box
    if (char && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace navigation
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste full 6-digit OTP
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;

    const newOtp = [...otpValues];
    for (let i = 0; i < 6; i++) {
      newOtp[i] = pasted[i] || '';
    }
    setOtpValues(newOtp);

    const nextIndex = Math.min(pasted.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const fullOtp = otpValues.join('');
  const isOtpComplete = fullOtp.length === 6;

  // Mask mobile for security (e.g. 017*****678)
  const maskedMobile =
    mobileNumber.length === 11
      ? `${mobileNumber.slice(0, 3)}•••••${mobileNumber.slice(8)}`
      : mobileNumber || 'your registered phone';

  const handleVerify = () => {
    if (!isOtpComplete) {
      setServerError('Please enter the complete 6-digit verification code.');
      return;
    }

    setServerError(null);
    startVerifying(async () => {
      try {
        const res = await verifyOtpAction({
          mobileNumber,
          otp: fullOtp,
        });

        if (res.success) {
          toast.success('Mobile Verified Successfully!', {
            description: 'Now please complete your candidate profile to receive your Roll Number.',
          });
          router.push(ROUTES.COMPLETE_PROFILE);
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Invalid or expired OTP code.';
        setServerError(message);
        toast.error('Verification Failed', { description: message });
      }
    });
  };

  const handleResend = () => {
    if (!canResend || !mobileNumber) return;

    setServerError(null);
    startResending(async () => {
      try {
        const res = await resendOtpAction(mobileNumber);
        toast.success('OTP Resent!', { description: res.message });
        setTimer(60);
        setOtpValues(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to resend OTP.';
        setServerError(message);
        toast.error('Resend Failed', { description: message });
      }
    });
  };

  return (
    <div className="max-w-lg mx-auto bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-xl">
      
      {/* Top Header */}
      <div className="text-center space-y-2">
        <div className="size-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mx-auto shadow-xs">
          <KeyRound className="size-7" />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-semibold border border-teal-200/60">
          <ShieldCheck className="size-3.5" />
          <span>Step 2 of 3: SMS Verification</span>
        </div>
        <h1 className="font-heading font-black text-2xl text-slate-900">
          Verify Your Mobile Number
        </h1>
        <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
          We have dispatched a 6-digit one-time code to{' '}
          <span className="font-mono font-bold text-slate-800">{maskedMobile}</span>.
        </p>
      </div>

      {serverError && (
        <div className="mt-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-rose-700 text-xs">
          <AlertCircle className="size-4 shrink-0 mt-0.5" />
          <p className="font-medium leading-relaxed">{serverError}</p>
        </div>
      )}

      {/* 6-Box OTP Input */}
      <div className="mt-8 space-y-6">
        <div className="flex justify-center gap-2 sm:gap-3">
          {otpValues.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => { inputRefs.current[idx] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleDigitChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              onPaste={handlePaste}
              className={`size-12 sm:size-14 text-center font-mono font-black text-lg sm:text-xl rounded-2xl border transition-all outline-hidden ${
                digit
                  ? 'border-indigo-600 bg-indigo-50/40 text-indigo-900 ring-2 ring-indigo-500/20 shadow-xs'
                  : 'border-slate-200 bg-slate-50 text-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:bg-white'
              }`}
            />
          ))}
        </div>

        {/* Verify Button */}
        <button
          type="button"
          onClick={handleVerify}
          disabled={!isOtpComplete || isVerifying}
          className="w-full py-3.5 px-5 rounded-2xl bg-[#37447E] hover:bg-[#2C3765] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
        >
          {isVerifying ? (
            <>
              <Loader2 className="size-4 animate-spin text-white" />
              <span>Verifying OTP Code...</span>
            </>
          ) : (
            <>
              <span>Verify &amp; Continue</span>
              <ArrowRight className="size-4" />
            </>
          )}
        </button>

        {/* Resend OTP Section */}
        <div className="pt-2 flex flex-col items-center gap-2 text-xs text-slate-500">
          {canResend ? (
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending}
              className="inline-flex items-center gap-1.5 font-bold text-indigo-600 hover:text-indigo-700 underline cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`size-3.5 ${isResending ? 'animate-spin' : ''}`} />
              <span>Resend Verification Code</span>
            </button>
          ) : (
            <p className="text-slate-400">
              Resend available in{' '}
              <span className="font-mono font-bold text-slate-700">{timer}s</span>
            </p>
          )}

          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-100 w-full justify-between">
            <Link
              href={ROUTES.REGISTER}
              className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 transition-colors"
            >
              <ArrowLeft className="size-3" />
              <span>Change Mobile Number</span>
            </Link>

            <span className="flex items-center gap-1 text-[11px] text-slate-400">
              <Phone className="size-3" /> SMS Valid for 2 mins
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}
