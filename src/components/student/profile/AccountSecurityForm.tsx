'use client';

import React, { useState } from 'react';
import { Student } from '@/types/student.types';
import { changePasswordAction } from '@/features/student/actions/profileActions';
import {
  Shield,
  KeyRound,
  Phone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';

interface AccountSecurityFormProps {
  student: Student | null;
}

export function AccountSecurityForm({ student }: AccountSecurityFormProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);

  const [isPending, setIsPending] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const mobileNumber = student?.user?.mobileNumber || student?.parentMobileNumber || '---';
  const email = student?.user?.email || 'Not provided';

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    if (newPassword.length < 6) {
      setStatusMessage({
        type: 'error',
        text: 'New password must be at least 6 characters long.',
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setStatusMessage({
        type: 'error',
        text: 'New password and confirm password do not match.',
      });
      return;
    }

    setIsPending(true);

    try {
      const res = await changePasswordAction({
        currentPassword,
        newPassword,
      });

      if (res.success) {
        setStatusMessage({ type: 'success', text: res.message });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setStatusMessage({ type: 'error', text: res.message });
      }
    } catch {
      setStatusMessage({
        type: 'error',
        text: 'An unexpected error occurred while changing password.',
      });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      
      {/* Account Login Credentials Summary */}
      <div className="p-6 rounded-[28px] bg-white border border-slate-200/80 shadow-2xs space-y-4">
        <h3 className="font-heading font-black text-sm text-slate-900 flex items-center gap-2">
          <Phone className="size-4 text-[#00796B]" />
          <span>Login Identity &amp; Account Credentials</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Registered Login Mobile
            </span>
            <p className="font-mono font-bold text-sm text-slate-900">
              {mobileNumber}
            </p>
            <p className="text-[11px] text-slate-500">
              Primary authentication identifier for SMS OTP &amp; login
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Account Email
            </span>
            <p className="font-bold text-sm text-slate-900">
              {email}
            </p>
            <p className="text-[11px] text-slate-500">
              Digital admit card PDF dispatch &amp; announcements
            </p>
          </div>
        </div>
      </div>

      {/* Change Password Form */}
      <div className="p-6 rounded-[28px] bg-white border border-slate-200/80 shadow-2xs space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="font-heading font-black text-sm text-slate-900 flex items-center gap-2">
            <KeyRound className="size-4 text-[#00796B]" />
            <span>Change Account Password</span>
          </h3>

          <button
            type="button"
            onClick={() => setShowPasswords(!showPasswords)}
            className="text-xs font-bold text-[#00796B] hover:text-[#00594D] flex items-center gap-1 cursor-pointer"
          >
            {showPasswords ? (
              <>
                <EyeOff className="size-3.5" />
                <span>Hide Passwords</span>
              </>
            ) : (
              <>
                <Eye className="size-3.5" />
                <span>Show Passwords</span>
              </>
            )}
          </button>
        </div>

        {/* Alert Status Banner */}
        {statusMessage ? (
          <div
            className={`p-4 rounded-2xl border text-xs font-bold flex items-center gap-2.5 animate-in fade-in-50 duration-200 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                : 'bg-rose-50 text-rose-900 border-rose-200'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="size-4 text-rose-600 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        ) : null}

        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            {/* Current Password */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Current Password *</label>
              <input
                type={showPasswords ? 'text' : 'password'}
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs sm:text-sm text-slate-900 outline-hidden focus:ring-2 focus:ring-[#00796B]/25 focus:border-[#00796B] transition-all"
              />
            </div>

            {/* New Password */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">New Password *</label>
              <input
                type={showPasswords ? 'text' : 'password'}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min. 6 characters"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs sm:text-sm text-slate-900 outline-hidden focus:ring-2 focus:ring-[#00796B]/25 focus:border-[#00796B] transition-all"
              />
            </div>

            {/* Confirm New Password */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Confirm New Password *</label>
              <input
                type={showPasswords ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs sm:text-sm text-slate-900 outline-hidden focus:ring-2 focus:ring-[#00796B]/25 focus:border-[#00796B] transition-all"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isPending}
              className="px-6 py-3 rounded-2xl bg-[#00796B] hover:bg-[#00594D] text-white font-bold text-xs sm:text-sm shadow-xs transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Updating Password...</span>
                </>
              ) : (
                <>
                  <Lock className="size-4" />
                  <span>Update Account Password</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

    </div>
  );
}

export default AccountSecurityForm;
