import 'server-only';
import { serverFetch } from '@/lib/server/apiClient';
import {
  Exam,
  ExamAdminFormData,
  ExamCentre,
  ExamCentreFormData,
  ExamRoomFormData,
  ExamRoom,
  ExamStatus,
} from '@/types/exam.types';
import { ApiResponse } from '@/types/api.types';

/**
 * Format string to ISO 8601 DateTime
 */
function toIsoDateTime(val: string): string {
  if (!val) return new Date().toISOString();
  if (val.includes('T')) return val;
  const d = new Date(val);
  if (!isNaN(d.getTime())) return d.toISOString();
  return new Date().toISOString();
}

/**
 * GET /exams - List all exams (Public or Admin)
 */
export async function getExams(params?: {
  status?: string;
  page?: number;
  limit?: number;
  search?: string;
}): Promise<ApiResponse<Exam[]>> {
  try {
    const res = await serverFetch<Exam[]>('/exams', {
      params: {
        status: params?.status !== 'ALL' ? params?.status : undefined,
        page: params?.page,
        limit: params?.limit,
        search: params?.search,
      },
      cache: 'no-store',
    });

    if (res && res.data && Array.isArray(res.data)) {
      return res;
    }
  } catch (err) {
    console.error('GET /exams failed:', err);
  }

  return {
    statusCode: 200,
    success: true,
    data: [],
    meta: {
      page: params?.page || 1,
      limit: params?.limit || 20,
      total: 0,
      totalPages: 1,
    },
  };
}

/**
 * GET /exams/:id - Returns exam detail with centres and rooms
 */
export async function getExamDetail(id: string): Promise<Exam> {
  const res = await serverFetch<Exam>(`/exams/${id}`, { cache: 'no-store' });
  return res.data;
}

/**
 * GET /exams/:id/centres - Lists all centres with their rooms for an exam (Admin Only)
 */
export async function getExamCentres(
  token: string,
  examId: string
): Promise<ExamCentre[]> {
  try {
    const res = await serverFetch<ExamCentre[]>(`/exams/${examId}/centres`, {
      token,
      cache: 'no-store',
    });

    if (res && res.data && Array.isArray(res.data)) {
      return res.data;
    }
  } catch (err) {
    console.error(`GET /exams/${examId}/centres failed:`, err);
  }

  return [];
}

/**
 * POST /exams - Create a new model test (Admin Only)
 */
export async function adminCreateExam(
  token: string,
  data: ExamAdminFormData
): Promise<Exam> {
  const payload = {
    title: data.title.trim(),
    code: data.code.toUpperCase().trim(),
    description: data.description.trim(),
    totalMarks: Number(data.totalMarks),
    passMarks: Number(data.passMarks),
    examDate: toIsoDateTime(data.examDate),
    startTime: data.startTime.trim(),
    endTime: data.endTime.trim(),
    registrationStartAt: toIsoDateTime(data.registrationStartAt),
    registrationEndAt: toIsoDateTime(data.registrationEndAt),
    instructions: data.instructions.trim(),
    status: data.status === 'REGISTRATION_OPEN' ? 'REGISTRATION_OPEN' : 'DRAFT',
  };

  const res = await serverFetch<Exam>('/exams', {
    token,
    method: 'POST',
    body: JSON.stringify(payload),
    cache: 'no-store',
  });
  return res.data;
}

/**
 * PATCH /exams/:id - Update exam or transition lifecycle status (Admin Only)
 */
export async function adminUpdateExam(
  token: string,
  examId: string,
  data: Partial<ExamAdminFormData> & { status?: ExamStatus }
): Promise<Exam> {
  const payload: Partial<ExamAdminFormData> & { status?: ExamStatus } = { ...data };
  if (data.title) payload.title = data.title.trim();
  if (data.code) payload.code = data.code.toUpperCase().trim();
  if (data.description) payload.description = data.description.trim();
  if (data.totalMarks !== undefined) payload.totalMarks = Number(data.totalMarks);
  if (data.passMarks !== undefined) payload.passMarks = Number(data.passMarks);
  if (data.examDate) payload.examDate = toIsoDateTime(data.examDate);
  if (data.registrationStartAt) payload.registrationStartAt = toIsoDateTime(data.registrationStartAt);
  if (data.registrationEndAt) payload.registrationEndAt = toIsoDateTime(data.registrationEndAt);
  if (data.instructions) payload.instructions = data.instructions.trim();

  const res = await serverFetch<Exam>(`/exams/${examId}`, {
    token,
    method: 'PATCH',
    body: JSON.stringify(payload),
    cache: 'no-store',
  });
  return res.data;
}

/**
 * DELETE /exams/:id - Delete Exam (Admin Only)
 * Note: Falls back to status CANCELLED if DELETE route is missing
 */
export async function adminDeleteExam(
  token: string,
  examId: string
): Promise<{ success: boolean; message: string }> {
  try {
    const res = await serverFetch<Record<string, unknown>>(`/exams/${examId}`, {
      token,
      method: 'DELETE',
      cache: 'no-store',
    });
    const msg = (res?.message as string) || 'Model test deleted successfully';
    return { success: true, message: msg };
  } catch (err: unknown) {
    const errObj = err as Record<string, unknown>;
    if (errObj?.statusCode === 404 || (typeof errObj?.message === 'string' && errObj.message.includes('Not Found'))) {
      const patchRes = await serverFetch<Record<string, unknown>>(`/exams/${examId}`, {
        token,
        method: 'PATCH',
        body: JSON.stringify({ status: 'CANCELLED' }),
        cache: 'no-store',
      });
      const msg = (patchRes?.message as string) || 'Model test status updated to CANCELLED';
      return { success: true, message: msg };
    }
    throw err;
  }
}

/**
 * POST /exams/:id/centres - Add an Exam Centre (Admin Only)
 */
export async function adminAddCentre(
  token: string,
  examId: string,
  data: ExamCentreFormData
): Promise<ExamCentre> {
  const res = await serverFetch<ExamCentre>(`/exams/${examId}/centres`, {
    token,
    method: 'POST',
    body: JSON.stringify({
      ...data,
      capacity: Number(data.capacity),
    }),
    cache: 'no-store',
  });
  return res.data || (res as unknown as ExamCentre);
}

/**
 * DELETE /exams/centres/:centreId - Delete Exam Centre (Admin Only)
 */
export async function adminDeleteCentre(
  token: string,
  centreId: string
): Promise<{ success: boolean; message: string }> {
  const res = await serverFetch<Record<string, unknown>>(
    `/exams/centres/${centreId}`,
    {
      token,
      method: 'DELETE',
      cache: 'no-store',
    }
  );
  const msg = (res?.message as string) || 'Centre removed successfully';
  return { success: true, message: msg };
}

/**
 * POST /exams/centres/:centreId/rooms - Add Room to Centre (Admin Only)
 */
export async function adminAddRoom(
  token: string,
  centreId: string,
  data: ExamRoomFormData
): Promise<ExamRoom> {
  const res = await serverFetch<ExamRoom>(`/exams/centres/${centreId}/rooms`, {
    token,
    method: 'POST',
    body: JSON.stringify({
      ...data,
      capacity: Number(data.capacity),
    }),
    cache: 'no-store',
  });
  return res.data || (res as unknown as ExamRoom);
}

/**
 * DELETE /exams/rooms/:roomId - Delete Room (Admin Only)
 */
export async function adminDeleteRoom(
  token: string,
  roomId: string
): Promise<{ success: boolean; message: string }> {
  const res = await serverFetch<Record<string, unknown>>(
    `/exams/rooms/${roomId}`,
    {
      token,
      method: 'DELETE',
      cache: 'no-store',
    }
  );
  const msg = (res?.message as string) || 'Room removed successfully';
  return { success: true, message: msg };
}

/**
 * POST /exams/:id/seat-plan/auto-assign - Smart Auto Seat Allocation (Admin Only)
 */
export async function adminAutoAssignSeats(
  token: string,
  examId: string
): Promise<{ message: string; totalAssigned: number; totalRoomsUsed: number }> {
  const res = await serverFetch<{ message: string; totalAssigned: number; totalRoomsUsed: number }>(
    `/exams/${examId}/seat-plan/auto-assign`,
    {
      token,
      method: 'POST',
      cache: 'no-store',
    }
  );
  return res.data;
}
