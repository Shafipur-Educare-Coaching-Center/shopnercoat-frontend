'use client';

import React, { useState, useTransition } from 'react';
import { ShieldCheck, KeyRound, Lock, Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export function SecuritySettingsTab() {
  const [isPending, startTransition] = useTransition();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('All Fields Required', { description: 'Please fill in all password fields.' });
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Password Too Short', { description: 'New password must be at least 6 characters long.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords Do Not Match', { description: 'Confirm password must match your new password.' });
      return;
    }

    startTransition(async () => {
      // Simulate credential change
      await new Promise((resolve) => setTimeout(resolve, 800));
      toast.success('Admin Password Updated', {
        description: 'Your administrative credentials have been successfully updated.',
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    });
  };

  return (
    <div className="space-y-6 select-none animate-in fade-in-0 duration-200">
      
      {/* 1. Admin Account Dossier Card */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
          <div className="size-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <ShieldCheck className="size-4" />
          </div>
          <div>
            <h3 className="font-heading font-black text-sm text-slate-900">
              Primary Administrator Account
            </h3>
            <p className="text-[11px] text-slate-500">
              Super-Administrator with role-guarded privileges across examinees, marks, and admit cards.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <p className="text-[10px] text-slate-400 font-bold uppercase">Admin Email</p>
            <p className="font-bold text-slate-900 mt-1">admin@shopnercoat.xyz</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <p className="text-[10px] text-slate-400 font-bold uppercase">Mobile Number</p>
            <p className="font-bold text-slate-900 mt-1">01700000000</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <p className="text-[10px] text-slate-400 font-bold uppercase">Access Level</p>
            <p className="font-bold text-indigo-700 mt-1">ROLE: ADMIN (Global)</p>
          </div>
        </div>
      </div>

      {/* 2. Change Admin Password Form */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
          <div className="size-8 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
            <KeyRound className="size-4" />
          </div>
          <div>
            <h3 className="font-heading font-black text-sm text-slate-900">
              Update Administrator Password
            </h3>
            <p className="text-[11px] text-slate-500">
              Ensure you use a strong password with letters, numbers, and special characters.
            </p>
          </div>
        </div>

        <form onSubmit={handlePasswordSubmit} className="space-y-3.5 text-xs max-w-lg">
          
          {/* Current Password */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Current Password *
            </label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter existing password"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-hidden focus:ring-2 focus:ring-indigo-500 font-mono"
                required
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3.5 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showPass ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              New Password *
            </label>
            <input
              type={showPass ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-hidden focus:ring-2 focus:ring-indigo-500 font-mono"
              required
            />
          </div>

          {/* Confirm New Password */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Confirm New Password *
            </label>
            <input
              type={showPass ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-hidden focus:ring-2 focus:ring-indigo-500 font-mono"
              required
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all active:scale-95 disabled:opacity-60 cursor-pointer"
            >
              {isPending ? (
                <>
                  <Loader2 className="size-3.5 animate-spin text-white" />
                  <span>Updating Credentials...</span>
                </>
              ) : (
                <>
                  <Lock className="size-3.5 text-white" />
                  <span>Update Password</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>

      {/* 3. Session Strategy & Token Specifications */}
      <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 shrink-0">
            <CheckCircle2 className="size-4 text-teal-600" />
          </div>
          <div>
            <p className="font-bold text-xs text-slate-900">Secure JWT Authentication Architecture</p>
            <p className="text-[11px] text-slate-500">
              Access token validity: 1 Day • Refresh token: 7 Days with HttpOnly cookie isolation.
            </p>
          </div>
        </div>
        <span className="px-3 py-1 rounded-xl bg-white border border-slate-200 text-xs font-mono font-bold text-teal-700 shadow-2xs">
          Active Session Secure
        </span>
      </div>

    </div>
  );
}
