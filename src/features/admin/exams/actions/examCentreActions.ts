'use server';

import { revalidatePath } from 'next/cache';
import { getAccessToken, getUserRole } from '@/lib/server/getTokens';
import {
  getExamCentres,
  adminAddCentre,
  adminDeleteCentre,
  adminAddRoom,
  adminDeleteRoom,
  adminAutoAssignSeats,
} from '@/server/exam.service';
import {
  examCentreFormSchema,
  ExamCentreFormValues,
  examRoomFormSchema,
  ExamRoomFormValues,
} from '../schemas/exam-admin.schema';

export async function getExamCentresAction(examId: string) {
  try {
    const token = await getAccessToken();
    const role = await getUserRole();

    if (!token || role !== 'ADMIN') {
      return { success: false, error: 'Unauthorized: Admin privileges required.' };
    }

    const centres = await getExamCentres(token, examId);
    return {
      success: true,
      centres,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to fetch exam centres';
    return { success: false, error: errorMsg };
  }
}

export async function addExamCentreAction(examId: string, formData: ExamCentreFormValues) {
  try {
    const token = await getAccessToken();
    const role = await getUserRole();

    if (!token || role !== 'ADMIN') {
      return { success: false, error: 'Unauthorized: Admin privileges required.' };
    }

    const validated = examCentreFormSchema.parse(formData);
    const newCentre = await adminAddCentre(token, examId, validated);

    revalidatePath('/dashboard/admin/exams');
    return {
      success: true,
      message: `Exam centre "${newCentre.name}" added successfully!`,
      centre: newCentre,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to add exam centre';
    return { success: false, error: errorMsg };
  }
}

export async function deleteExamCentreAction(centreId: string) {
  try {
    const token = await getAccessToken();
    const role = await getUserRole();

    if (!token || role !== 'ADMIN') {
      return { success: false, error: 'Unauthorized: Admin privileges required.' };
    }

    const res = await adminDeleteCentre(token, centreId);
    revalidatePath('/dashboard/admin/exams');
    return { success: true, message: res.message };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to delete centre';
    return { success: false, error: errorMsg };
  }
}

export async function addExamRoomAction(centreId: string, formData: ExamRoomFormValues) {
  try {
    const token = await getAccessToken();
    const role = await getUserRole();

    if (!token || role !== 'ADMIN') {
      return { success: false, error: 'Unauthorized: Admin privileges required.' };
    }

    const validated = examRoomFormSchema.parse(formData);
    const newRoom = await adminAddRoom(token, centreId, validated);

    revalidatePath('/dashboard/admin/exams');
    return {
      success: true,
      message: `Room "${newRoom.roomNumber}" added!`,
      room: newRoom,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to add room';
    return { success: false, error: errorMsg };
  }
}

export async function deleteExamRoomAction(roomId: string) {
  try {
    const token = await getAccessToken();
    const role = await getUserRole();

    if (!token || role !== 'ADMIN') {
      return { success: false, error: 'Unauthorized: Admin privileges required.' };
    }

    const res = await adminDeleteRoom(token, roomId);
    revalidatePath('/dashboard/admin/exams');
    return { success: true, message: res.message };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to delete room';
    return { success: false, error: errorMsg };
  }
}

export async function autoAssignSeatsAction(examId: string) {
  try {
    const token = await getAccessToken();
    const role = await getUserRole();

    if (!token || role !== 'ADMIN') {
      return { success: false, error: 'Unauthorized: Admin privileges required.' };
    }

    const res = await adminAutoAssignSeats(token, examId);
    revalidatePath('/dashboard/admin/exams');
    return {
      success: true,
      message: res.message,
      data: res,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Seat allocation failed';
    return { success: false, error: errorMsg };
  }
}
