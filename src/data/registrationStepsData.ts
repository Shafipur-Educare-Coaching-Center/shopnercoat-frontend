import {
  UserPlus,
  ShieldCheck,
  FileCheck,
  Sparkles,
  Lock,
  ScanLine,
  Award,
  LucideIcon,
} from 'lucide-react';

export interface RegistrationStep {
  stepNumber: number;
  title: string;
  description: string;
  icon: LucideIcon;
  badgeText: string;
  side: 'left' | 'right';
  estimatedTime: string;
  checkpointProgress: number; // 0 to 1 position
}

export const REGISTRATION_STEPS: RegistrationStep[] = [
  {
    stepNumber: 1,
    title: 'Sign Up',
    description:
      'Provide your basic details including Mobile Number, Email, Full Name, and create a secure password to initialize your academic profile.',
    icon: UserPlus,
    badgeText: 'Step 01',
    side: 'left',
    estimatedTime: '2 Mins',
    checkpointProgress: 0.16,
  },
  {
    stepNumber: 2,
    title: 'Verify OTP',
    description:
      'We ensure identity integrity through an instant one-time password sent directly to your registered mobile number and email address.',
    icon: ShieldCheck,
    badgeText: 'Step 02',
    side: 'right',
    estimatedTime: '1 Min',
    checkpointProgress: 0.44,
  },
  {
    stepNumber: 3,
    title: 'Complete Profile',
    description:
      'Fill in your academic history and upload required documents, including your passport-sized photograph and digital signature for board verification.',
    icon: FileCheck,
    badgeText: 'Step 03',
    side: 'left',
    estimatedTime: '5 Mins',
    checkpointProgress: 0.72,
  },
  {
    stepNumber: 4,
    title: 'Confirmation & Access',
    description:
      'Once verified, your candidate account is activated immediately. You are now ready to retrieve admit cards, enrol in exams, and access your dashboard.',
    icon: Sparkles,
    badgeText: 'Step 04',
    side: 'right',
    estimatedTime: 'Instant',
    checkpointProgress: 0.96,
  },
];

export interface JourneyObstacle {
  id: string;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  progress: number;
  unlockedTitle: string;
}

export const JOURNEY_OBSTACLES: JourneyObstacle[] = [
  {
    id: 'otp-firewall',
    title: 'Security OTP Firewall',
    subtitle: 'Encrypted verification gateway',
    unlockedTitle: 'Identity Verified & Secure',
    icon: Lock,
    progress: 0.30,
  },
  {
    id: 'bio-scanner',
    title: 'Document & Photo Bio-Scanner',
    subtitle: 'Automated document compliance check',
    unlockedTitle: 'Credentials Approved (PDF / JPG)',
    icon: ScanLine,
    progress: 0.58,
  },
  {
    id: 'board-clearance',
    title: 'Board Merit Clearance Bureau',
    subtitle: 'Checking HSC GPA & quota benchmarks',
    unlockedTitle: 'Eligibility Confirmed by Board',
    icon: Award,
    progress: 0.84,
  },
];
