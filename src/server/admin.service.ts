import 'server-only';
import { serverFetch } from '@/lib/server/apiClient';
import { AdminOverviewData, HSCCollegeDistributionItem } from '@/types/admin-overview.types';
import { Student } from '@/types/student.types';
import { Exam } from '@/types/exam.types';

// Palette for dynamically-assigned chart colors
const CHART_COLORS = [
  '#2563EB', '#0D9488', '#7C3AED', '#DB2777', '#D97706',
  '#059669', '#DC2626', '#0284C7', '#EA580C', '#64748B',
];

// Static fallback — only used if ALL live calls fail
export const MOCK_ADMIN_OVERVIEW_DATA: AdminOverviewData = {
  stats: {
    totalStudents: 0,
    activeStudents: 0,
    pendingStudents: 0,
    suspendedStudents: 0,
    monthlyGrowthPercent: 0,
    totalExams: 0,
    openRegistrationExams: 0,
    ongoingExams: 0,
    completedExams: 0,
    draftExams: 0,
    totalCentres: 0,
    totalRooms: 0,
    totalCapacity: 0,
    pendingResultsCount: 0,
    pendingResultsCandidates: 0,
  },
  ageDistribution: [],
  locationDistribution: [],
  collegeDistribution: [],
  recentAuditLogs: [],
  lastUpdated: new Date().toISOString(),
};

// ─────────────────────────────────────────────────────────────────────────────
// Main server function: fetch all live dashboard data in parallel
// ─────────────────────────────────────────────────────────────────────────────
export async function getAdminOverviewData(token?: string): Promise<AdminOverviewData> {
  if (!token) return MOCK_ADMIN_OVERVIEW_DATA;

  const [studentStatsRes, demographicsRes, examStatsRes, auditLogsRes, examsRes] =
    await Promise.allSettled([
      serverFetch<Record<string, unknown>>('/students/admin/stats', { token, cache: 'no-store' }),
      serverFetch<Record<string, unknown>>('/students/admin/demographics', { token, cache: 'no-store' }),
      serverFetch<Record<string, unknown>>('/exams/admin/stats', { token, cache: 'no-store' }),
      serverFetch<Record<string, unknown>>('/admin/audit-logs?limit=10', { token, cache: 'no-store' }),
      serverFetch<Exam[]>('/exams', { token, params: { limit: 200 }, cache: 'no-store' }),
    ]);

  // ── 1. Student Stats ───────────────────────────────────────────────────────
  const studentStats =
    studentStatsRes.status === 'fulfilled' ? (studentStatsRes.value?.data as Record<string, number> | null) : null;

  const totalStudents   = studentStats?.total   ?? 0;
  const activeStudents  = studentStats?.active  ?? 0;
  const pendingStudents = studentStats?.pending  ?? 0;
  const suspendedStudents = studentStats?.suspended ?? 0;

  // ── 2. Demographics ────────────────────────────────────────────────────────
  const demoData =
    demographicsRes.status === 'fulfilled' ? (demographicsRes.value?.data as Record<string, unknown> | null) : null;

  const rawAge = Array.isArray(demoData?.ageDistribution)
    ? (demoData!.ageDistribution as Array<{ ageGroup: string; count: number; percentage: number }>)
    : [];

  const ageDistribution = rawAge.map((item) => ({
    ageGroup: item.ageGroup,
    categoryLabel: ageCategoryLabel(item.ageGroup),
    count: item.count,
    percentage: item.percentage,
  }));

  const rawColleges = Array.isArray(demoData?.collegeDistribution)
    ? (demoData!.collegeDistribution as Array<{ collegeName: string; count: number; percentage: number }>)
    : [];

  const collegeDistribution: HSCCollegeDistributionItem[] = rawColleges.map((item, idx) => ({
    id: `col-${idx}`,
    collegeName: item.collegeName,
    shortCode: makeShortCode(item.collegeName),
    district: 'Bangladesh',
    count: item.count,
    percentage: item.percentage,
    color: CHART_COLORS[idx % CHART_COLORS.length],
  }));

  // ── 3. Exam Stats ──────────────────────────────────────────────────────────
  const examStatsData =
    examStatsRes.status === 'fulfilled' ? (examStatsRes.value?.data as Record<string, unknown> | null) : null;

  const byStatus = (examStatsData?.byStatus as Record<string, number>) ?? {};
  const centresData = (examStatsData?.centres as Record<string, number>) ?? {};
  const pendingData = (examStatsData?.pendingResults as Record<string, number>) ?? {};

  // Fallback: derive exam status counts from /exams if stats endpoint unavailable
  const exams =
    examsRes.status === 'fulfilled' && Array.isArray(examsRes.value?.data)
      ? examsRes.value.data as Exam[]
      : [];

  const totalExams            = byStatus.TOTAL ?? exams.length;
  const openRegistrationExams = byStatus.REGISTRATION_OPEN ?? exams.filter((e) => e.status === 'REGISTRATION_OPEN').length;
  const ongoingExams          = (byStatus.ONGOING ?? 0) + (byStatus.UPCOMING ?? 0) ||
    exams.filter((e) => e.status === 'ONGOING' || e.status === 'UPCOMING').length;
  const completedExams        = (byStatus.COMPLETED ?? 0) + (byStatus.RESULT_PUBLISHED ?? 0) ||
    exams.filter((e) => e.status === 'COMPLETED' || e.status === 'RESULT_PUBLISHED').length;
  const draftExams            = byStatus.DRAFT ?? exams.filter((e) => e.status === 'DRAFT').length;

  const totalCentres          = centresData.total      ?? 0;
  const totalRooms            = centresData.totalRooms ?? 0;
  const totalCapacity         = centresData.totalCapacity ?? 0;
  const pendingResultsCount   = pendingData.examCount      ?? exams.filter((e) => e.status === 'COMPLETED').length;
  const pendingResultsCandidates = pendingData.candidateCount ?? 0;

  // ── 4. Audit Logs ──────────────────────────────────────────────────────────
  const rawAuditLogs =
    auditLogsRes.status === 'fulfilled'
      ? Array.isArray(auditLogsRes.value?.data)
        ? auditLogsRes.value.data
        : []
      : [];

  const recentAuditLogs = (rawAuditLogs as Array<Record<string, unknown>>).map((log, idx) => ({
    id:           String(log.id           ?? `log-${idx}`),
    action:       String(log.action       ?? ''),
    category:     String(log.category     ?? 'SYSTEM_CONFIG') as any,
    actorName:    String(log.actorName    ?? 'System'),
    actorRole:    String(log.actorRole    ?? 'Admin'),
    targetEntity: String(log.targetEntity ?? ''),
    ipAddress:    String(log.ipAddress    ?? ''),
    location:     String(log.location     ?? ''),
    status:       String(log.status       ?? 'SUCCESS') as any,
    timestamp:    String(log.createdAt    ?? log.timestamp ?? new Date().toISOString()),
    details:      log.details ? String(log.details) : undefined,
  }));

  return {
    stats: {
      totalStudents,
      activeStudents,
      pendingStudents,
      suspendedStudents,
      monthlyGrowthPercent: 0,
      totalExams,
      openRegistrationExams,
      ongoingExams,
      completedExams,
      draftExams,
      totalCentres,
      totalRooms,
      totalCapacity,
      pendingResultsCount,
      pendingResultsCandidates,
    },
    ageDistribution,
    locationDistribution: MOCK_ADMIN_OVERVIEW_DATA.locationDistribution, // Requires structured `division` field on backend
    collegeDistribution,
    recentAuditLogs,
    lastUpdated: new Date().toISOString(),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Admin Student List (used in /students admin page)
// ─────────────────────────────────────────────────────────────────────────────
export async function getAdminStudentList(
  token: string,
  page = 1,
  limit = 20,
  search?: string,
  status?: string
) {
  try {
    const res = await serverFetch<Student[]>('/students/admin/list', {
      token,
      params: { page, limit, search, status: status !== 'ALL' ? status : undefined },
      cache: 'no-store',
    });
    if (res?.data && Array.isArray(res.data)) return res;
  } catch (err) {
    console.error('GET /students/admin/list failed:', err);
  }
  return { statusCode: 200, success: true, data: [], meta: { page, limit, total: 0, totalPages: 1 } };
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
function ageCategoryLabel(ageGroup: string): string {
  const map: Record<string, string> = {
    '< 17': 'Early HSC Candidates',
    '<17':  'Early HSC Candidates',
    '17':   'Standard HSC Examinees',
    '18':   '1st Time Medical Admission Seekers',
    '19':   'Medical Admission 2nd Timers',
    '20+':  'Special Quota & 2nd Timers',
  };
  return map[ageGroup] ?? ageGroup;
}

function makeShortCode(name: string): string {
  return name
    .split(/\s+/)
    .filter((w) => /^[A-Z]/.test(w))
    .map((w) => w[0])
    .join('')
    .slice(0, 5)
    .toUpperCase() || name.slice(0, 4).toUpperCase();
}
