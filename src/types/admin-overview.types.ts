export interface AdminKPIStats {
  totalStudents: number;
  activeStudents: number;
  pendingStudents: number;
  suspendedStudents: number;
  monthlyGrowthPercent: number;

  totalExams: number;
  openRegistrationExams: number;
  ongoingExams: number;
  completedExams: number;
  draftExams: number;

  totalCentres: number;
  totalRooms: number;
  totalCapacity: number;

  pendingResultsCount: number;
  pendingResultsCandidates: number;
}

export interface CandidateAgeDistributionItem {
  ageGroup: string;
  categoryLabel: string;
  count: number;
  percentage: number;
}

export interface LocationDistributionItem {
  id: string;
  division: string;
  count: number;
  percentage: number;
  color: string;
}

export interface HSCCollegeDistributionItem {
  id: string;
  collegeName: string;
  shortCode: string;
  district: string;
  count: number;
  percentage: number;
  color: string;
}

export type AuditLogCategory =
  | 'RESULT_PUBLISH'
  | 'ADMIT_CARD'
  | 'EXAM_LIFECYCLE'
  | 'STUDENT_SECURITY'
  | 'AUTH_LOGIN'
  | 'SYSTEM_CONFIG';

export type AuditLogStatus = 'SUCCESS' | 'WARNING' | 'FAILED' | 'IN_PROGRESS';

export interface AuditLogItem {
  id: string;
  action: string;
  category: AuditLogCategory;
  actorName: string;
  actorRole: string;
  actorAvatar?: string;
  targetEntity: string;
  ipAddress: string;
  location: string;
  status: AuditLogStatus;
  timestamp: string; // ISO 8601
  details?: string;
}

export interface AdminOverviewData {
  stats: AdminKPIStats;
  ageDistribution: CandidateAgeDistributionItem[];
  locationDistribution: LocationDistributionItem[];
  collegeDistribution: HSCCollegeDistributionItem[];
  recentAuditLogs: AuditLogItem[];
  lastUpdated: string;
}
