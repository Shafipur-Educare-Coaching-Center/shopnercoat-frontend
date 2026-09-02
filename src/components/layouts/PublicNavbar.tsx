'use client';

import React, { useState, useEffect, useRef, useTransition } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  LayoutDashboard,
  LogOut,
  ChevronDown,
  Loader2,
  ShieldCheck,
  GraduationCap,
} from 'lucide-react';
import { MedicalLogo } from '../common/MedicalLogo';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/lib/utils';
import { logoutAction } from '@/features/auth/actions/logoutAction';

export interface PublicNavbarUser {
  isAuthenticated: boolean;
  role?: 'ADMIN' | 'STUDENT';
  name?: string;
  email?: string | null;
  rollNumber?: number | string;
  photoUrl?: string | null;
}

interface PublicNavbarProps {
  user?: PublicNavbarUser;
}

const NAV_LINKS = [
  { name: 'Home', href: ROUTES.HOME },
  { name: 'How to Register', href: ROUTES.HOW_TO_REGISTER },
  { name: 'Announcement', href: ROUTES.ANNOUNCEMENTS },
  { name: 'Ranking', href: ROUTES.RANKING },
];

export function PublicNavbar({ user }: PublicNavbarProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);
  const [isLoggingOut, startTransition] = useTransition();

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close menus automatically on route change during render
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setIsMobileMenuOpen(false);
    setIsUserDropdownOpen(false);
  }

  // Click outside to close user dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    startTransition(async () => {
      await logoutAction();
    });
  };

  const dashboardHref =
    user?.role === 'ADMIN' ? '/dashboard/admin' : '/dashboard/student';

  const userInitials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : user?.role === 'ADMIN'
    ? 'AD'
    : 'ST';

  return (
    <div className="px-3 md:px-4 w-full max-w-5xl mx-auto select-none">
      <header className="rounded-xl md:rounded-2xl bg-white/95 backdrop-blur-md border border-border/80 shadow-clinical w-full relative z-50">
        <div className="px-5 md:px-6 h-14 md:h-16 flex items-center justify-between">
          
          {/* 1. Brand Logo */}
          <Link href={ROUTES.HOME} className="shrink-0 flex items-center">
            <MedicalLogo />
          </Link>

          {/* 2. Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 absolute left-1/2 transform -translate-x-1/2">
            {NAV_LINKS.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'text-sm transition-colors hover:text-primary',
                    isActive ? 'text-primary font-bold' : 'text-slate-500 font-medium'
                  )}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* 3. Desktop Actions / Auth Capsule */}
          <div className="hidden md:flex items-center gap-2 lg:gap-3">
            {user?.isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                
                {/* User Avatar Capsule Toggle */}
                <button
                  type="button"
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="inline-flex items-center gap-2 p-1.5 pr-3 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all active:scale-95 cursor-pointer outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-500"
                  aria-expanded={isUserDropdownOpen}
                  aria-label="User profile menu"
                >
                  {user.photoUrl ? (
                    <img
                      src={user.photoUrl}
                      alt={user.name || 'User'}
                      className="size-8 rounded-full object-cover border border-slate-200"
                    />
                  ) : (
                    <div className="size-8 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                      {userInitials}
                    </div>
                  )}

                  <div className="flex flex-col text-left">
                    <span className="text-xs font-bold text-slate-900 leading-tight truncate max-w-[120px]">
                      {user.name || 'Account'}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono font-semibold">
                      {user.role === 'ADMIN'
                        ? 'Admin'
                        : user.rollNumber
                        ? `Roll #${user.rollNumber}`
                        : 'Student'}
                    </span>
                  </div>

                  <ChevronDown
                    className={cn(
                      'size-3.5 text-slate-400 transition-transform duration-200',
                      isUserDropdownOpen && 'rotate-180 text-slate-700'
                    )}
                  />
                </button>

                {/* Floating User Dropdown Menu (2 Options: Dashboard & Logout) */}
                <AnimatePresence>
                  {isUserDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -4 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -4 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-slate-200/90 shadow-xl p-1.5 flex flex-col gap-1 z-50"
                    >
                      {/* User Header Summary in Dropdown */}
                      <div className="px-3 py-2 border-b border-slate-100 flex items-center gap-2">
                        {user.role === 'ADMIN' ? (
                          <ShieldCheck className="size-4 text-indigo-600 shrink-0" />
                        ) : (
                          <GraduationCap className="size-4 text-teal-600 shrink-0" />
                        )}
                        <div className="truncate">
                          <p className="text-xs font-bold text-slate-900 truncate">
                            {user.name || 'User Profile'}
                          </p>
                          <p className="text-[10px] text-slate-500 font-mono">
                            {user.role === 'ADMIN' ? 'Super Administrator' : 'Candidate Student'}
                          </p>
                        </div>
                      </div>

                      {/* Option 1: Dashboard */}
                      <Link
                        href={dashboardHref}
                        onClick={() => setIsUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors cursor-pointer group"
                      >
                        <div className="size-7 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                          <LayoutDashboard className="size-3.5" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 leading-tight">Dashboard</p>
                          <p className="text-[10px] text-slate-400">Open portal control panel</p>
                        </div>
                      </Link>

                      {/* Option 2: Logout */}
                      <button
                        type="button"
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer text-left group disabled:opacity-60"
                      >
                        <div className="size-7 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition-colors">
                          {isLoggingOut ? (
                            <Loader2 className="size-3.5 animate-spin" />
                          ) : (
                            <LogOut className="size-3.5" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-rose-700 leading-tight">Logout</p>
                          <p className="text-[10px] text-rose-400">Sign out of your session</p>
                        </div>
                      </button>

                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            ) : (
              <>
                <Link
                  href={ROUTES.LOGIN}
                  className="text-sm font-semibold text-primary hover:text-primary/80 px-4 py-2 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href={ROUTES.REGISTER}
                  className="bg-primary text-white hover:bg-primary/90 rounded-full px-6 py-2 text-sm font-semibold shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* 4. Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden flex items-center justify-center p-2 -mr-2 text-slate-600 hover:text-primary hover:bg-slate-50 rounded-md transition-colors min-w-[44px] min-h-[44px] cursor-pointer"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

        </div>

        {/* 5. Mobile Dropdown Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden border-t border-border/50 bg-white/95 rounded-b-xl"
            >
              <div className="px-5 py-4 flex flex-col gap-4">
                
                {/* Navigation Links */}
                <nav className="flex flex-col gap-1.5">
                  {NAV_LINKS.map((link) => {
                    const isActive =
                      pathname === link.href ||
                      (link.href !== '/' && pathname.startsWith(link.href));
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={cn(
                          'text-[15px] py-2.5 px-3 rounded-lg transition-colors font-semibold',
                          isActive
                            ? 'bg-primary/10 text-primary font-bold'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-primary'
                        )}
                      >
                        {link.name}
                      </Link>
                    );
                  })}
                </nav>

                {/* Mobile Auth Actions */}
                <div className="border-t border-border/50 pt-4 pb-2 flex flex-col gap-2.5">
                  {user?.isAuthenticated ? (
                    <>
                      {/* User Info Capsule on Mobile */}
                      <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200/80 mb-1">
                        {user.photoUrl ? (
                          <img
                            src={user.photoUrl}
                            alt={user.name || 'User'}
                            className="size-10 rounded-full object-cover border border-slate-200"
                          />
                        ) : (
                          <div className="size-10 rounded-full bg-indigo-600 text-white font-bold text-sm flex items-center justify-center">
                            {userInitials}
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-sm text-slate-900 leading-tight">
                            {user.name || 'Account'}
                          </p>
                          <p className="text-xs text-slate-500 font-mono">
                            {user.role === 'ADMIN'
                              ? 'Admin Portal'
                              : user.rollNumber
                              ? `Roll #${user.rollNumber}`
                              : 'Candidate Student'}
                          </p>
                        </div>
                      </div>

                      {/* Go to Dashboard Button */}
                      <Link
                        href={dashboardHref}
                        className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#37447E] text-white rounded-full text-[15px] font-bold shadow-sm active:scale-98 transition-all"
                      >
                        <LayoutDashboard className="size-4" />
                        <span>Go to Dashboard</span>
                      </Link>

                      {/* Logout Button */}
                      <button
                        type="button"
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="w-full flex items-center justify-center gap-2 py-2.5 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-full text-[15px] font-bold transition-colors cursor-pointer"
                      >
                        {isLoggingOut ? (
                          <Loader2 className="size-4 animate-spin text-rose-600" />
                        ) : (
                          <LogOut className="size-4" />
                        )}
                        <span>Sign Out</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href={ROUTES.LOGIN}
                        className="w-full text-center py-2.5 text-[15px] font-semibold text-primary hover:bg-primary/5 rounded-xl transition-colors"
                      >
                        Login
                      </Link>
                      <Link
                        href={ROUTES.REGISTER}
                        className="w-full text-center bg-primary text-white hover:bg-primary/90 rounded-full py-2.5 text-[15px] font-semibold shadow-sm transition-colors"
                      >
                        Register
                      </Link>
                    </>
                  )}
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </header>
    </div>
  );
}
