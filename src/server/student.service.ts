import 'server-only';
import { serverFetch } from '@/lib/server/apiClient';
import { Student } from '@/types/student.types';

export async function getStudentMe(token: string): Promise<Student> {
  const res = await serverFetch<Student>('/students/me', { token, cache: 'no-store' });
  return res.data;
}

export async function getAdminStudentList(token: string, page = 1, limit = 10, search?: string) {
  return serverFetch<Student[]>('/students/admin/list', {
    token,
    params: { page, limit, search },
    cache: 'no-store',
  });
}
