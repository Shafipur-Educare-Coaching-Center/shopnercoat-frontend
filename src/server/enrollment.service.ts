import 'server-only';
import { serverFetch } from '@/lib/server/apiClient';
import {
  ExamEnrollmentAdmin,
  EnrollmentAdminFormData,
  EnrollmentFilterParams,
  EnrollmentStatus,
} from '@/types/exam.types';
import { ApiResponse } from '@/types/api.types';

/**
 * GET /enrollments/admin/list or GET /enrollments/admin/exam/:examId (Admin Only)
 */
export async function getAdminEnrollments(
  token: string,
  params?: EnrollmentFilterParams
): Promise<ApiResponse<ExamEnrollmentAdmin[]>> {
  const endpoint =
    params?.examId && params.examId !== 'ALL'
      ? `/enrollments/admin/exam/${params.examId}`
      : '/enrollments/admin/list';

  return serverFetch<ExamEnrollmentAdmin[]>(endpoint, {
    token,
    params: {
      search: params?.search,
      status: params?.status !== 'ALL' ? params?.status : undefined,
      page: params?.page,
      limit: params?.limit,
    },
    cache: 'no-store',
  });
}

/**
 * POST /enrollments/admin/enroll - Manual Candidate Enrollment (Admin Only)
 * Executes live REST call directly to backend.
 */
export async function adminCreateEnrollment(
  token: string,
  data: EnrollmentAdminFormData
): Promise<ExamEnrollmentAdmin> {
  const res = await serverFetch<ExamEnrollmentAdmin>('/enrollments/admin/enroll', {
    token,
    method: 'POST',
    body: JSON.stringify({
      studentId: data.studentId.trim(),
      examId: data.examId.trim(),
      status: data.status || 'ENROLLED',
    }),
    cache: 'no-store',
  });
  return res.data;
}

/**
 * PATCH /enrollments/admin/:id - Update Enrollment Status (Admin Only)
 */
export async function adminUpdateEnrollmentStatus(
  token: string,
  enrollmentId: string,
  status: EnrollmentStatus
): Promise<ExamEnrollmentAdmin> {
  const res = await serverFetch<ExamEnrollmentAdmin>(`/enrollments/admin/${enrollmentId}`, {
    token,
    method: 'PATCH',
    body: JSON.stringify({ status }),
    cache: 'no-store',
  });
  return res.data;
}

/**
 * DELETE /enrollments/admin/:id - Revoke Candidate Enrollment (Admin Only)
 */
export async function adminDeleteEnrollment(
  token: string,
  enrollmentId: string
): Promise<{ success: boolean; message: string }> {
  const res = await serverFetch<Record<string, unknown>>(`/enrollments/admin/${enrollmentId}`, {
    token,
    method: 'DELETE',
    cache: 'no-store',
  });
  const msg = (res?.message as string) || 'Candidate enrollment revoked successfully';
  return { success: true, message: msg };
}

/**
 * POST /admit-cards/admin/exam/:examId/generate - Batch Admit Card PDF Generation Trigger (Admin Only)
 */
export async function adminTriggerBatchAdmitCards(
  token: string,
  examId: string
): Promise<{ batchId: string; totalStudents: number; message: string }> {
  const res = await serverFetch<{ batchId: string; totalStudents: number; message?: string }>(
    `/admit-cards/admin/exam/${examId}/generate`,
    {
      token,
      method: 'POST',
      cache: 'no-store',
    }
  );

  return {
    batchId: res.data.batchId,
    totalStudents: res.data.totalStudents,
    message: res.data.message || `Triggered batch Admit Card dispatches for ${res.data.totalStudents} enrolled candidates.`,
  };
}

/**
 * GET /enrollments/me - Get candidate enrollments (Student Portal)
 */
export async function getMyEnrollments(token: string): Promise<ExamEnrollmentAdmin[]> {
  try {
    const res = await serverFetch<ExamEnrollmentAdmin[]>('/enrollments/me', {
      token,
      cache: 'no-store',
    });
    return res.data || [];
  } catch (err) {
    console.error('GET /enrollments/me failed:', err);
    return [];
  }
}

/**
 * POST /enrollments - Candidate Self-Enrollment into Model Test (Student Portal)
 */
export async function studentEnrollInExam(
  token: string,
  examId: string
): Promise<ExamEnrollmentAdmin> {
  const res = await serverFetch<ExamEnrollmentAdmin>('/enrollments', {
    token,
    method: 'POST',
    body: JSON.stringify({ examId: examId.trim() }),
    cache: 'no-store',
  });
  return res.data;
}
