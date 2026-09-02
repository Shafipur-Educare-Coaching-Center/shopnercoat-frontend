import 'server-only';
import { serverFetch } from '@/lib/server/apiClient';
import { Student, StudentAdminFormData } from '@/types/student.types';
import { ApiResponse } from '@/types/api.types';

export async function getStudentMe(token: string): Promise<Student> {
  const res = await serverFetch<Student>('/students/me', { token, cache: 'no-store' });
  return res.data;
}

/**
 * GET /students/admin/list - List all students (Admin Only)
 */
export async function getAdminStudentList(
  token: string,
  page = 1,
  limit = 20,
  search?: string,
  status?: string
): Promise<ApiResponse<Student[]>> {
  try {
    const res = await serverFetch<Student[]>('/students/admin/list', {
      token,
      params: { page, limit, search, status: status !== 'ALL' ? status : undefined },
      cache: 'no-store',
    });

    if (res && res.data && Array.isArray(res.data)) {
      return res;
    }
  } catch (err) {
    console.error('GET /students/admin/list failed:', err);
  }

  return {
    statusCode: 200,
    success: true,
    data: [],
    meta: {
      page,
      limit,
      total: 0,
      totalPages: 1,
    },
  };
}

/**
 * POST /students/admin/create - Admin Add Candidate / Register Student
 */
export async function adminCreateStudent(
  token: string,
  data: StudentAdminFormData
): Promise<Student> {
  const res = await serverFetch<Student>('/students/admin/create', {
    token,
    method: 'POST',
    body: JSON.stringify(data),
    cache: 'no-store',
  });
  return res.data;
}

/**
 * PATCH /students/admin/{id} - Update Student Profile / User Data (Admin Only)
 */
export async function adminUpdateStudent(
  token: string,
  studentId: string,
  data: Partial<StudentAdminFormData>
): Promise<Student> {
  const res = await serverFetch<Student>(`/students/admin/${studentId}`, {
    token,
    method: 'PATCH',
    body: JSON.stringify(data),
    cache: 'no-store',
  });
  return res.data;
}

/**
 * DELETE /students/admin/{id} - Delete Student and User Account (Admin Only)
 */
export async function adminDeleteStudent(
  token: string,
  studentId: string
): Promise<{ success: boolean; message: string }> {
  const res = await serverFetch<Record<string, unknown>>(
    `/students/admin/${studentId}`,
    {
      token,
      method: 'DELETE',
      cache: 'no-store',
    }
  );
  const msg = (res?.message as string) || 'Candidate removed successfully';
  return { success: true, message: msg };
}
