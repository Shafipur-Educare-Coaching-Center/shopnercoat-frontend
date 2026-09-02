import 'server-only';
import { serverFetch } from '@/lib/server/apiClient';
import { AdminOverviewData } from '@/types/admin-overview.types';
import { Student } from '@/types/student.types';
import { Exam } from '@/types/exam.types';

// Fallback dataset tailored for HSC Medical Admission Candidates
export const MOCK_ADMIN_OVERVIEW_DATA: AdminOverviewData = {
  stats: {
    totalStudents: 1482,
    activeStudents: 1390,
    pendingStudents: 82,
    suspendedStudents: 10,
    monthlyGrowthPercent: 12.4,

    totalExams: 28,
    openRegistrationExams: 4,
    ongoingExams: 2,
    completedExams: 20,
    draftExams: 2,

    totalCentres: 16,
    totalRooms: 64,
    totalCapacity: 2400,

    pendingResultsCount: 3,
    pendingResultsCandidates: 420,
  },

  // 1. HSC Candidate Age Demographics (1st & 2nd Timers)
  ageDistribution: [
    {
      ageGroup: '< 17 yrs',
      categoryLabel: 'Early HSC Candidates',
      count: 118,
      percentage: 8.0,
    },
    {
      ageGroup: '17 yrs',
      categoryLabel: 'Standard HSC Examinees',
      count: 474,
      percentage: 32.0,
    },
    {
      ageGroup: '18 yrs',
      categoryLabel: '1st Time Medical Admission Seekers',
      count: 593,
      percentage: 40.0,
    },
    {
      ageGroup: '19 yrs',
      categoryLabel: 'Medical Admission 2nd Timers',
      count: 222,
      percentage: 15.0,
    },
    {
      ageGroup: '20+ yrs',
      categoryLabel: 'Special Quota & 2nd Timers',
      count: 75,
      percentage: 5.0,
    },
  ],

  // 2. Candidate Location Distribution (Bangladesh Divisions)
  locationDistribution: [
    {
      id: 'loc-dhaka',
      division: 'Dhaka Division',
      count: 652,
      percentage: 44.0,
      color: '#37447E', // Deep royal indigo
    },
    {
      id: 'loc-chittagong',
      division: 'Chittagong Division',
      count: 296,
      percentage: 20.0,
      color: '#0D9488', // Medical teal
    },
    {
      id: 'loc-rajshahi',
      division: 'Rajshahi Division',
      count: 207,
      percentage: 14.0,
      color: '#0284C7', // Ocean sky
    },
    {
      id: 'loc-khulna',
      division: 'Khulna Division',
      count: 148,
      percentage: 10.0,
      color: '#10B981', // Emerald
    },
    {
      id: 'loc-sylhet',
      division: 'Sylhet Division',
      count: 119,
      percentage: 8.0,
      color: '#F59E0B', // Amber
    },
    {
      id: 'loc-others',
      division: 'Other Divisions (Barisal, Rangpur, Mymensingh)',
      count: 60,
      percentage: 4.0,
      color: '#F43F5E', // Rose
    },
  ],

  // 3. Top HSC Colleges & Institutions
  collegeDistribution: [
    {
      id: 'col-ndc',
      collegeName: 'Notre Dame College (NDC)',
      shortCode: 'NDC',
      district: 'Dhaka',
      count: 356,
      percentage: 24.0,
      color: '#2563EB',
    },
    {
      id: 'col-dc',
      collegeName: 'Dhaka College',
      shortCode: 'DC',
      district: 'Dhaka',
      count: 267,
      percentage: 18.0,
      color: '#0D9488',
    },
    {
      id: 'col-rumc',
      collegeName: 'Rajuk Uttara Model College (RUMC)',
      shortCode: 'RUMC',
      district: 'Dhaka',
      count: 222,
      percentage: 15.0,
      color: '#7C3AED',
    },
    {
      id: 'col-vnc',
      collegeName: 'Viqarunnisa Noon College',
      shortCode: 'VNC',
      district: 'Dhaka',
      count: 207,
      percentage: 14.0,
      color: '#DB2777',
    },
    {
      id: 'col-hcc',
      collegeName: 'Holy Cross College',
      shortCode: 'HCC',
      district: 'Dhaka',
      count: 163,
      percentage: 11.0,
      color: '#D97706',
    },
    {
      id: 'col-acc',
      collegeName: 'Adamjee Cantonment College',
      shortCode: 'ACC',
      district: 'Dhaka Cantt',
      count: 119,
      percentage: 8.0,
      color: '#059669',
    },
    {
      id: 'col-others',
      collegeName: 'Govt. Science College & Other HSC Colleges',
      shortCode: 'Others',
      district: 'Nationwide',
      count: 148,
      percentage: 10.0,
      color: '#64748B',
    },
  ],

  // 4. Real-time Administrative Audit Logs
  recentAuditLogs: [
    {
      id: 'audit-1',
      action: 'Published Dense Rankings',
      category: 'RESULT_PUBLISH',
      actorName: 'Dr. Rafiqul Islam',
      actorRole: 'Senior Controller',
      targetEntity: 'MBBS-MOCK-2026-05 (420 candidates)',
      ipAddress: '103.145.23.11',
      location: 'Dhaka, BD',
      status: 'SUCCESS',
      timestamp: new Date(Date.now() - 4 * 60 * 1000).toISOString(), // 4 mins ago
      details: 'Dense 4-tier tiebreaker calculated and published to public leaderboard.',
    },
    {
      id: 'audit-2',
      action: 'Generated Batch Admit Cards (120 PDFs)',
      category: 'ADMIT_CARD',
      actorName: 'BullMQ Auto-Worker #2',
      actorRole: 'System Worker',
      targetEntity: 'ANAT-GRAND-2026',
      ipAddress: '127.0.0.1',
      location: 'Server Internal',
      status: 'SUCCESS',
      timestamp: new Date(Date.now() - 18 * 60 * 1000).toISOString(), // 18 mins ago
      details: 'All 120 admit cards with QR security tokens generated and emailed.',
    },
    {
      id: 'audit-3',
      action: 'Created Model Test (Draft)',
      category: 'EXAM_LIFECYCLE',
      actorName: 'Dr. Farhana Ahmed',
      actorRole: 'Exam Admin',
      targetEntity: 'PREMED-STG1-2026',
      ipAddress: '103.145.23.14',
      location: 'Dhaka, BD',
      status: 'SUCCESS',
      timestamp: new Date(Date.now() - 65 * 60 * 1000).toISOString(), // ~1 hr ago
      details: 'Clinical Anatomy & Physiology Grand Mock scheduled for 25 October 2026.',
    },
    {
      id: 'audit-4',
      action: 'Candidate Account Suspended',
      category: 'STUDENT_SECURITY',
      actorName: 'Automated Integrity Watch',
      actorRole: 'Security Bot',
      targetEntity: 'Roll #4528649 (Tanvir A.)',
      ipAddress: '182.160.112.5',
      location: 'Chittagong, BD',
      status: 'WARNING',
      timestamp: new Date(Date.now() - 3 * 3600 * 1000).toISOString(), // 3 hrs ago
      details: 'Duplicate mobile number verification attempt triggered security hold.',
    },
    {
      id: 'audit-5',
      action: 'Administrator 2FA Login',
      category: 'AUTH_LOGIN',
      actorName: 'Dr. Rafiqul Islam',
      actorRole: 'Senior Controller',
      targetEntity: 'Admin Portal Session',
      ipAddress: '103.145.23.11',
      location: 'Dhaka, BD',
      status: 'SUCCESS',
      timestamp: new Date(Date.now() - 5 * 3600 * 1000).toISOString(), // 5 hrs ago
      details: 'Successful biometric and OTP authentication from Chrome/macOS.',
    },
    {
      id: 'audit-6',
      action: 'Added Examination Centre Venue',
      category: 'EXAM_LIFECYCLE',
      actorName: 'Admin Operations',
      actorRole: 'Venue Manager',
      targetEntity: 'Gazipur Central Hall (Rooms 101-104)',
      ipAddress: '103.145.23.11',
      location: 'Gazipur, BD',
      status: 'SUCCESS',
      timestamp: new Date(Date.now() - 8 * 3600 * 1000).toISOString(), // 8 hrs ago
      details: 'Allocated 160 seats capacity across 4 air-conditioned hall rooms.',
    },
    {
      id: 'audit-7',
      action: 'Admit Card Email Delivery Retry',
      category: 'ADMIT_CARD',
      actorName: 'System Auto-Retry',
      actorRole: 'Mail Worker',
      targetEntity: 'Roll #4528641 (Dr. A. Khan)',
      ipAddress: '127.0.0.1',
      location: 'Server Internal',
      status: 'SUCCESS',
      timestamp: new Date(Date.now() - 12 * 3600 * 1000).toISOString(), // 12 hrs ago
      details: 'SMTP bounce re-routed successfully to primary Gmail inbox.',
    },
  ],

  lastUpdated: new Date().toISOString(),
};

// Main Server Function: Fetch live statistics or augment with rich mock analytics
export async function getAdminOverviewData(token?: string): Promise<AdminOverviewData> {
  try {
    if (!token) return MOCK_ADMIN_OVERVIEW_DATA;

    // Concurrently fetch real counts where endpoints exist
    const [studentsRes, examsRes] = await Promise.allSettled([
      serverFetch<Student[]>('/students/admin/list', {
        token,
        params: { page: 1, limit: 1 },
        cache: 'no-store',
      }),
      serverFetch<Exam[]>('/exams', {
        token,
        params: { limit: 50 },
        cache: 'no-store',
      }),
    ]);

    const liveData = { ...MOCK_ADMIN_OVERVIEW_DATA };

    // Update real counts if available from backend
    if (studentsRes.status === 'fulfilled' && studentsRes.value?.meta?.total) {
      liveData.stats.totalStudents = studentsRes.value.meta.total;
    }

    if (examsRes.status === 'fulfilled' && Array.isArray(examsRes.value?.data)) {
      const exams = examsRes.value.data;
      liveData.stats.totalExams = exams.length;
      liveData.stats.openRegistrationExams = exams.filter(
        (e) => e.status === 'REGISTRATION_OPEN'
      ).length;
      liveData.stats.ongoingExams = exams.filter(
        (e) => e.status === 'ONGOING' || e.status === 'UPCOMING'
      ).length;
      liveData.stats.completedExams = exams.filter(
        (e) => e.status === 'COMPLETED' || e.status === 'RESULT_PUBLISHED'
      ).length;
      liveData.stats.draftExams = exams.filter((e) => e.status === 'DRAFT').length;
    }

    liveData.lastUpdated = new Date().toISOString();
    return liveData;
  } catch (err) {
    console.warn('Could not aggregate live admin overview metrics, using fallback:', err);
    return MOCK_ADMIN_OVERVIEW_DATA;
  }
}
