export interface StudentProfileAnalytics {
  id: string;
  fullName: string;
  rollNumber: number | string;
  registrationNumber?: string | number;
  collegeName?: string;
  academicTrack?: string;
  targetCollege?: string;
  session?: string;
  isVerified?: boolean;
}

export interface NationalMeritStanding {
  currentRank: number;
  percentile: number;
  totalExaminees?: number;
  rankChange?: number;
  trendDirection?: 'UP' | 'DOWN' | 'SAME';
}

export interface MeanScoreKpi {
  averageMarks: number;
  totalPossible: number;
  percentage: number;
  passCutoff: number;
  growthPercentage?: number;
}

export interface OmrPrecisionKpi {
  accuracyPercentage: number;
  totalAttempted: number;
  totalCorrect: number;
  totalWrong: number;
  totalSkipped: number;
  totalDeductions: number;
}

export interface TestSeriesProgressKpi {
  completedTests: number;
  totalEnrolledTests: number;
  completionPercentage: number;
  nextExamLabel?: string;
}

export interface KpiSummary {
  nationalMeritStanding: NationalMeritStanding;
  meanScore: MeanScoreKpi;
  omrPrecisionRate: OmrPrecisionKpi;
  testSeriesProgress: TestSeriesProgressKpi;
}

export interface ProgressionTrendPoint {
  examId: string;
  examCode: string;
  examTitle: string;
  examDate: string;
  studentScore: number;
  nationalTop10Avg: number;
  passMark: number;
  nationalRank: number;
  percentile?: number;
}

export interface OmrAccuracyBreakdown {
  totalQuestions: number;
  correct: {
    count: number;
    percentage: number;
    markImpact: string;
  };
  wrong: {
    count: number;
    percentage: number;
    markImpact: string;
  };
  skipped: {
    count: number;
    percentage: number;
    markImpact: string;
  };
  netAccuracyPercentage: number;
  penaltyRule?: string;
}

export interface NegativeMarkingAuditItem {
  examLabel: string;
  code: string;
  correctMarks: number;
  wrongCount: number;
  deductMarks: number;
  netScore: number;
}

export interface NegativeMarkingAuditSummary {
  penaltyReductionPercentage: string;
  strategyInsight: string;
  penaltyHistory: NegativeMarkingAuditItem[];
}

export interface UpcomingExamPass {
  examId: string;
  examCode: string;
  examTitle: string;
  scheduledDate: string;
  scheduleDisplay?: string;
  venue: string;
  room?: string;
  seatNumber?: string;
  admitCardAvailable: boolean;
  admitCardToken?: string | null;
  admitCardDownloadUrl?: string;
  syllabusUrl?: string;
}

export interface RecentScorecardItem {
  id: string;
  examId: string;
  examCode: string;
  examTitle: string;
  examDate: string;
  totalAnswered: number;
  correctAnswered: number;
  wrongAnswered: number;
  skipped: number;
  deductMark: number;
  obtainedMarks: number;
  totalMarks: number;
  percentage: number;
  position: number | null;
  resultStatus: 'PASSED' | 'FAILED';
}

export interface BackendStudentAnalyticsResponse {
  studentProfile: StudentProfileAnalytics;
  progressionTrend: ProgressionTrendPoint[];
  negativeMarkingAudit: NegativeMarkingAuditItem[];
  negativeMarkingAuditSummary?: NegativeMarkingAuditSummary;
  upcomingExam: UpcomingExamPass | null;
  recentScorecards: RecentScorecardItem[];
  kpiSummary?: KpiSummary;
  omrAccuracyBreakdown?: OmrAccuracyBreakdown;
}

export interface StudentDashboardAnalytics {
  studentProfile: StudentProfileAnalytics;
  kpiSummary: KpiSummary;
  progressionTrend: ProgressionTrendPoint[];
  omrAccuracyBreakdown: OmrAccuracyBreakdown;
  negativeMarkingAudit: NegativeMarkingAuditItem[];
  negativeMarkingAuditSummary?: NegativeMarkingAuditSummary;
  upcomingExam: UpcomingExamPass | null;
  recentScorecards: RecentScorecardItem[];
}
