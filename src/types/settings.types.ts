export type SettingsTab =
  | 'GENERAL'
  | 'EXAM_RULES'
  | 'GATEWAYS'
  | 'SECURITY'
  | 'CACHE';

export interface CenterProfileSettings {
  centerName: string;
  tagline: string;
  helplineMobile: string;
  supportEmail: string;
  campusAddress: string;
  timezone: string;
}

export interface ExamRuleSettings {
  defaultNegativeMark: number;
  defaultPassPercentage: number;
  rollNumberLength: number;
  autoGeneratePodium: boolean;
  tiebreakerStrategy: string;
}

export interface GatewayServiceStatus {
  serviceName: string;
  provider: string;
  status: 'OPERATIONAL' | 'DEGRADED' | 'MAINTENANCE';
  latencyMs?: number;
  lastChecked: string;
  description: string;
}

export interface PasswordChangeFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface SystemSettingsState {
  profile: CenterProfileSettings;
  examRules: ExamRuleSettings;
}
