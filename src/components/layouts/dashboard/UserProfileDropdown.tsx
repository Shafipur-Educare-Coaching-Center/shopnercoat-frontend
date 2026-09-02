'use client';

import React, { useTransition } from 'react';
import Link from 'next/link';
import { LogOut, User, ShieldCheck, Sparkles, Loader2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { DashboardUserSummary } from './DashboardNavTypes';
import { logoutAction } from '@/features/auth/actions/logoutAction';

interface UserProfileDropdownProps {
  user?: DashboardUserSummary;
}

export function UserProfileDropdown({ user }: UserProfileDropdownProps) {
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await logoutAction();
    });
  };

  const isAdmin = user?.role === 'ADMIN';
  const displayName = user?.name || (isAdmin ? 'System Admin' : 'Candidate Student');
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'SC';

  const profileHref = isAdmin
    ? '/dashboard/admin/profile'
    : '/dashboard/student/profile';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="relative outline-hidden focus-visible:ring-2 focus-visible:ring-teal-500 rounded-2xl group cursor-pointer">
        <div className="relative">
          <Avatar className="size-10 sm:size-11 rounded-2xl border-2 border-white shadow-xs group-hover:scale-105 transition-transform bg-gradient-to-tr from-slate-100 to-white">
            {user?.photoUrl && <AvatarImage src={user.photoUrl} alt={displayName} />}
            <AvatarFallback className="rounded-2xl bg-gradient-to-tr from-slate-200 to-slate-100 text-slate-700 font-bold text-xs">
              {initials}
            </AvatarFallback>
          </Avatar>
          {/* Active online status pill */}
          <span className="absolute -bottom-0.5 -right-0.5 size-3 bg-emerald-500 border-2 border-white rounded-full shadow-xs" />
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent side="right" align="end" sideOffset={12} className="w-64 p-2 shadow-xl border-slate-200/90 rounded-2xl">
        <DropdownMenuLabel className="p-2 font-normal">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 truncate">
                {displayName}
              </span>
              <Badge variant={isAdmin ? 'calmIndigo' : 'calmTeal'}>
                {isAdmin ? 'Admin' : 'Student'}
              </Badge>
            </div>

            {user?.rollNumber && (
              <span className="text-[11px] font-mono text-slate-500">
                Roll #{user.rollNumber}
              </span>
            )}
            
            {user?.email && (
              <span className="text-[11px] text-slate-400 truncate">
                {user.email}
              </span>
            )}
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href={profileHref} className="flex items-center gap-2 cursor-pointer">
            <User className="size-4 text-slate-500" />
            <span>My Profile</span>
          </Link>
        </DropdownMenuItem>

        {isAdmin ? (
          <DropdownMenuItem asChild>
            <Link href="/dashboard/admin/settings" className="flex items-center gap-2 cursor-pointer">
              <ShieldCheck className="size-4 text-indigo-500" />
              <span>Admin Settings</span>
            </Link>
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem asChild>
            <Link href="/ranking" className="flex items-center gap-2 cursor-pointer">
              <Sparkles className="size-4 text-amber-500" />
              <span>Public Rankings</span>
            </Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleLogout}
          disabled={isPending}
          className="text-red-600 hover:text-red-700 hover:bg-red-50 focus:bg-red-50 cursor-pointer"
        >
          {isPending ? (
            <>
              <Loader2 className="size-4 animate-spin text-red-500" />
              <span>Signing out...</span>
            </>
          ) : (
            <>
              <LogOut className="size-4 text-red-500" />
              <span>Sign out</span>
            </>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
