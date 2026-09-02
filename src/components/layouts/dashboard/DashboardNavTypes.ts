import { LucideIcon } from 'lucide-react';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Contact,
  CreditCard,
  Award,
  Trophy,
  Megaphone,
  Settings,
  FileCheck,
  UserCircle,
} from 'lucide-react';
import { Role } from '@/types/auth.types';

export interface DashboardNavItem {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  exact?: boolean;
}

export interface DashboardUserSummary {
  name: string;
  email?: string | null;
  mobileNumber?: string;
  rollNumber?: number | string;
  role: Role;
  photoUrl?: string | null;
  status?: string;
}

// 1. Admin Portal Navigation Items (Full sync with Frontend Spec & API Guide)
export const ADMIN_NAV_ITEMS: DashboardNavItem[] = [
  {
    id: 'admin-overview',
    label: 'Dashboard Overview',
    href: '/dashboard/admin',
    icon: LayoutDashboard,
    exact: true,
  },
  {
    id: 'admin-students',
    label: 'Student Directory',
    href: '/dashboard/admin/students',
    icon: Users,
  },
  {
    id: 'admin-exams',
    label: 'Exam Management',
    href: '/dashboard/admin/exams',
    icon: BookOpen,
  },
  {
    id: 'admin-enrollments',
    label: 'Enrollment Management',
    href: '/dashboard/admin/enrollments',
    icon: Contact,
  },
  {
    id: 'admin-admit-cards',
    label: 'Admit Card Issuance',
    href: '/dashboard/admin/admit-cards',
    icon: CreditCard,
  },
  {
    id: 'admin-results',
    label: 'Result Management',
    href: '/dashboard/admin/results',
    icon: Award,
  },
  {
    id: 'admin-rankings',
    label: 'Rankings Publisher',
    href: '/dashboard/admin/rankings',
    icon: Trophy,
  },
  {
    id: 'admin-announcements',
    label: 'Announcements Manager',
    href: '/dashboard/admin/announcements',
    icon: Megaphone,
  },
  {
    id: 'admin-settings',
    label: 'System Settings',
    href: '/dashboard/admin/settings',
    icon: Settings,
  },
];

// 2. Student Portal Navigation Items (Full sync with Frontend Spec & API Guide)
export const STUDENT_NAV_ITEMS: DashboardNavItem[] = [
  {
    id: 'student-dashboard',
    label: 'Dashboard Home',
    href: '/dashboard/student',
    icon: LayoutDashboard,
    exact: true,
  },
  {
    id: 'student-exams',
    label: 'Available Exams',
    href: '/dashboard/student/exams',
    icon: BookOpen,
  },
  {
    id: 'student-enrollments',
    label: 'My Enrollments',
    href: '/dashboard/student/enrollments',
    icon: FileCheck,
  },
  {
    id: 'student-admit-cards',
    label: 'My Admit Cards',
    href: '/dashboard/student/admit-cards',
    icon: CreditCard,
  },
  {
    id: 'student-results',
    label: 'My Results',
    href: '/dashboard/student/results',
    icon: Award,
  },
  {
    id: 'student-rankings',
    label: 'Leaderboard & Standing',
    href: '/dashboard/student/rankings',
    icon: Trophy,
  },
  {
    id: 'student-announcements',
    label: 'Official Notices',
    href: '/dashboard/student/announcements',
    icon: Megaphone,
  },
  {
    id: 'student-profile',
    label: 'My Profile',
    href: '/dashboard/student/profile',
    icon: UserCircle,
  },
];
