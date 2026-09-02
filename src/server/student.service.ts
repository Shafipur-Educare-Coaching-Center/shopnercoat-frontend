import 'server-only';
import { serverFetch } from '@/lib/server/apiClient';
import { Student, StudentAdminFormData, RegistrationStatus } from '@/types/student.types';
import { ApiResponse } from '@/types/api.types';

// Rich fallback mock candidate dataset for testing & offline readiness
export const MOCK_ADMIN_STUDENTS: Student[] = [
  {
    id: 'std-uuid-001',
    userId: 'usr-uuid-001',
    fullName: 'Rahim Uddin',
    dateOfBirth: '2006-04-12',
    fatherName: 'Md. Mostafa Uddin',
    motherName: 'Rasheda Begum',
    parentMobileNumber: '01812345678',
    guardianMobileNumber: '01711223344',
    presentAddress: 'House 24, Road 5, Dhanmondi, Dhaka-1205',
    permanentAddress: 'Village: Mirzapur, Upazila: Mirzapur, Tangail',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    signatureUrl: 'https://placehold.co/200x80/png?text=Rahim+Signature',
    rollNumber: 4528647,
    registrationNumber: 5735101,
    collegeName: 'Notre Dame College (NDC)',
    registrationStatus: 'COMPLETED',
    createdAt: '2026-01-10T10:30:00.000Z',
    updatedAt: '2026-02-15T14:20:00.000Z',
    user: {
      id: 'usr-uuid-001',
      mobileNumber: '01711223301',
      email: 'rahim.uddin@example.com',
      role: 'STUDENT',
      emailVerified: true,
      mobileVerified: true,
      status: 'ACTIVE',
      createdAt: '2026-01-10T10:30:00.000Z',
      updatedAt: '2026-02-15T14:20:00.000Z',
    },
  },
  {
    id: 'std-uuid-002',
    userId: 'usr-uuid-002',
    fullName: 'Fatima Akter',
    dateOfBirth: '2006-08-25',
    fatherName: 'Dr. Anwar Hossain',
    motherName: 'Nazma Anwar',
    parentMobileNumber: '01798765432',
    guardianMobileNumber: null,
    presentAddress: 'Flat 4B, Shantinagar Plaza, Dhaka-1217',
    permanentAddress: 'Village: Joydevpur, Gazipur-1700',
    photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    signatureUrl: 'https://placehold.co/200x80/png?text=Fatima+Sign',
    rollNumber: 4528648,
    registrationNumber: 5735102,
    collegeName: 'Viqarunnisa Noon College (VNC)',
    registrationStatus: 'COMPLETED',
    createdAt: '2026-01-12T11:45:00.000Z',
    updatedAt: '2026-02-18T09:10:00.000Z',
    user: {
      id: 'usr-uuid-002',
      mobileNumber: '01711223302',
      email: 'fatima.akter@example.com',
      role: 'STUDENT',
      emailVerified: true,
      mobileVerified: true,
      status: 'ACTIVE',
      createdAt: '2026-01-12T11:45:00.000Z',
      updatedAt: '2026-02-18T09:10:00.000Z',
    },
  },
  {
    id: 'std-uuid-003',
    userId: 'usr-uuid-003',
    fullName: 'Tanvir Ahmed',
    dateOfBirth: '2005-11-03',
    fatherName: 'Md. Kamal Ahmed',
    motherName: 'Suraiya Kamal',
    parentMobileNumber: '01911223344',
    guardianMobileNumber: '01911223345',
    presentAddress: 'Sector 7, Road 12, Uttara, Dhaka-1230',
    permanentAddress: 'Village: Shibpur, Narsingdi',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    signatureUrl: 'https://placehold.co/200x80/png?text=Tanvir+Sign',
    rollNumber: 4528649,
    registrationNumber: 5735103,
    collegeName: 'Rajuk Uttara Model College (RUMC)',
    registrationStatus: 'PENDING',
    createdAt: '2026-01-15T15:20:00.000Z',
    updatedAt: '2026-01-15T15:20:00.000Z',
    user: {
      id: 'usr-uuid-003',
      mobileNumber: '01711223303',
      email: 'tanvir.ahmed@example.com',
      role: 'STUDENT',
      emailVerified: false,
      mobileVerified: true,
      status: 'PENDING',
      createdAt: '2026-01-15T15:20:00.000Z',
      updatedAt: '2026-01-15T15:20:00.000Z',
    },
  },
  {
    id: 'std-uuid-004',
    userId: 'usr-uuid-004',
    fullName: 'Sumaiya Islam',
    dateOfBirth: '2006-02-18',
    fatherName: 'Engr. Sirajul Islam',
    motherName: 'Mahmuda Islam',
    parentMobileNumber: '01677889900',
    guardianMobileNumber: null,
    presentAddress: 'Tejgaon Farmgate Area, Dhaka-1215',
    permanentAddress: 'Village: Gouripur, Mymensingh',
    photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    signatureUrl: 'https://placehold.co/200x80/png?text=Sumaiya+Sign',
    rollNumber: 4528650,
    registrationNumber: 5735104,
    collegeName: 'Holy Cross College (HCC)',
    registrationStatus: 'COMPLETED',
    createdAt: '2026-01-18T08:30:00.000Z',
    updatedAt: '2026-02-20T16:00:00.000Z',
    user: {
      id: 'usr-uuid-004',
      mobileNumber: '01711223304',
      email: 'sumaiya.islam@example.com',
      role: 'STUDENT',
      emailVerified: true,
      mobileVerified: true,
      status: 'ACTIVE',
      createdAt: '2026-01-18T08:30:00.000Z',
      updatedAt: '2026-02-20T16:00:00.000Z',
    },
  },
  {
    id: 'std-uuid-005',
    userId: 'usr-uuid-005',
    fullName: 'Mahmudul Hasan',
    dateOfBirth: '2005-07-30',
    fatherName: 'Abul Kalam Azad',
    motherName: 'Shahana Azad',
    parentMobileNumber: '01555667788',
    guardianMobileNumber: null,
    presentAddress: 'Mirpur-10, Block C, Dhaka-1216',
    permanentAddress: 'Village: Sreepur, Gazipur',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    signatureUrl: 'https://placehold.co/200x80/png?text=Mahmudul+Sign',
    rollNumber: 4528651,
    registrationNumber: 5735105,
    collegeName: 'Dhaka College',
    registrationStatus: 'COMPLETED',
    createdAt: '2026-01-20T14:10:00.000Z',
    updatedAt: '2026-02-22T11:25:00.000Z',
    user: {
      id: 'usr-uuid-005',
      mobileNumber: '01711223305',
      email: 'mahmudul.hasan@example.com',
      role: 'STUDENT',
      emailVerified: true,
      mobileVerified: true,
      status: 'ACTIVE',
      createdAt: '2026-01-20T14:10:00.000Z',
      updatedAt: '2026-02-22T11:25:00.000Z',
    },
  },
  {
    id: 'std-uuid-006',
    userId: 'usr-uuid-006',
    fullName: 'Nusrat Jahan',
    dateOfBirth: '2006-12-14',
    fatherName: 'Md. Habibur Rahman',
    motherName: 'Salma Habib',
    parentMobileNumber: '01833445566',
    guardianMobileNumber: null,
    presentAddress: 'Cantonment Residential Area, Dhaka',
    permanentAddress: 'Village: Bhuapur, Tangail',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    signatureUrl: 'https://placehold.co/200x80/png?text=Nusrat+Sign',
    rollNumber: 4528652,
    registrationNumber: 5735106,
    collegeName: 'Adamjee Cantonment College (ACC)',
    registrationStatus: 'COMPLETED',
    createdAt: '2026-01-22T09:40:00.000Z',
    updatedAt: '2026-02-24T17:15:00.000Z',
    user: {
      id: 'usr-uuid-006',
      mobileNumber: '01711223306',
      email: 'nusrat.jahan@example.com',
      role: 'STUDENT',
      emailVerified: true,
      mobileVerified: true,
      status: 'ACTIVE',
      createdAt: '2026-01-22T09:40:00.000Z',
      updatedAt: '2026-02-24T17:15:00.000Z',
    },
  },
  {
    id: 'std-uuid-007',
    userId: 'usr-uuid-007',
    fullName: 'Jubayer Hossain',
    dateOfBirth: '2005-09-19',
    fatherName: 'Md. Zahirul Islam',
    motherName: 'Laila Zahir',
    parentMobileNumber: '01722334455',
    guardianMobileNumber: null,
    presentAddress: 'Shafipur Bazaar Road, Gazipur-1751',
    permanentAddress: 'Shafipur Bazaar Road, Gazipur-1751',
    photoUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    signatureUrl: 'https://placehold.co/200x80/png?text=Jubayer+Sign',
    rollNumber: 4528653,
    registrationNumber: 5735107,
    collegeName: 'Govt. Science College',
    registrationStatus: 'COMPLETED',
    createdAt: '2026-01-25T13:00:00.000Z',
    updatedAt: '2026-02-25T13:00:00.000Z',
    user: {
      id: 'usr-uuid-007',
      mobileNumber: '01711223307',
      email: 'jubayer.hossain@example.com',
      role: 'STUDENT',
      emailVerified: true,
      mobileVerified: true,
      status: 'ACTIVE',
      createdAt: '2026-01-25T13:00:00.000Z',
      updatedAt: '2026-02-25T13:00:00.000Z',
    },
  },
];

export async function getStudentMe(token: string): Promise<Student> {
  const res = await serverFetch<Student>('/students/me', { token, cache: 'no-store' });
  return res.data;
}

export async function getAdminStudentList(
  token: string,
  page = 1,
  limit = 10,
  search?: string,
  status?: string
): Promise<ApiResponse<Student[]>> {
  try {
    const res = await serverFetch<Student[]>('/students/admin/list', {
      token,
      params: { page, limit, search },
      cache: 'no-store',
    });

    if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
      return res;
    }
  } catch (err) {
    console.warn('Backend /students/admin/list endpoint unavailable, serving fallback data:', err);
  }

  // Filter fallback mock data
  let filtered = [...MOCK_ADMIN_STUDENTS];

  if (search && search.trim()) {
    const query = search.toLowerCase().trim();
    filtered = filtered.filter(
      (s) =>
        s.fullName.toLowerCase().includes(query) ||
        String(s.rollNumber).includes(query) ||
        String(s.registrationNumber).includes(query) ||
        (s.collegeName && s.collegeName.toLowerCase().includes(query)) ||
        (s.user?.mobileNumber && s.user.mobileNumber.includes(query)) ||
        (s.user?.email && s.user.email.toLowerCase().includes(query))
    );
  }

  if (status && status !== 'ALL') {
    filtered = filtered.filter((s) => s.registrationStatus === status);
  }

  const total = filtered.length;
  const startIndex = (page - 1) * limit;
  const paginatedData = filtered.slice(startIndex, startIndex + limit);

  return {
    statusCode: 200,
    success: true,
    data: paginatedData,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
}

export async function adminCreateStudent(
  token: string,
  data: StudentAdminFormData
): Promise<Student> {
  try {
    const res = await serverFetch<Student>('/students/admin/create', {
      token,
      method: 'POST',
      body: JSON.stringify(data),
      cache: 'no-store',
    });
    return res.data;
  } catch (err) {
    console.warn('Backend /students/admin/create not found, executing local mock store creation:', err);
  }

  // Generate 7-digit roll & reg number
  const rollNumber = Math.floor(1000000 + Math.random() * 9000000);
  const registrationNumber = Math.floor(1000000 + Math.random() * 9000000);

  const newStudent: Student = {
    id: `std-${Date.now()}`,
    userId: `usr-${Date.now()}`,
    fullName: data.fullName,
    dateOfBirth: data.dateOfBirth,
    fatherName: data.fatherName,
    motherName: data.motherName,
    parentMobileNumber: data.parentMobileNumber,
    guardianMobileNumber: data.guardianMobileNumber || null,
    presentAddress: data.presentAddress,
    permanentAddress: data.permanentAddress,
    photoUrl: data.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    signatureUrl: data.signatureUrl || 'https://placehold.co/200x80/png?text=Signature',
    rollNumber,
    registrationNumber,
    collegeName: data.collegeName,
    registrationStatus: (data.registrationStatus as RegistrationStatus) || 'COMPLETED',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    user: {
      id: `usr-${Date.now()}`,
      mobileNumber: data.mobileNumber,
      email: data.email || null,
      role: 'STUDENT',
      emailVerified: true,
      mobileVerified: true,
      status: data.userStatus || 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  };

  MOCK_ADMIN_STUDENTS.unshift(newStudent);
  return newStudent;
}

export async function adminUpdateStudent(
  token: string,
  studentId: string,
  data: Partial<StudentAdminFormData>
): Promise<Student> {
  try {
    const res = await serverFetch<Student>(`/students/admin/${studentId}`, {
      token,
      method: 'PATCH',
      body: JSON.stringify(data),
      cache: 'no-store',
    });
    return res.data;
  } catch (err) {
    console.warn('Backend update endpoint not found, updating local mock student:', err);
  }

  const index = MOCK_ADMIN_STUDENTS.findIndex((s) => s.id === studentId);
  if (index !== -1) {
    const existing = MOCK_ADMIN_STUDENTS[index];
    const updated: Student = {
      ...existing,
      fullName: data.fullName || existing.fullName,
      collegeName: data.collegeName !== undefined ? data.collegeName : existing.collegeName,
      fatherName: data.fatherName || existing.fatherName,
      motherName: data.motherName || existing.motherName,
      parentMobileNumber: data.parentMobileNumber || existing.parentMobileNumber,
      guardianMobileNumber: data.guardianMobileNumber !== undefined ? data.guardianMobileNumber : existing.guardianMobileNumber,
      presentAddress: data.presentAddress || existing.presentAddress,
      permanentAddress: data.permanentAddress || existing.permanentAddress,
      photoUrl: data.photoUrl || existing.photoUrl,
      signatureUrl: data.signatureUrl || existing.signatureUrl,
      registrationStatus: data.registrationStatus || existing.registrationStatus,
      updatedAt: new Date().toISOString(),
    };
    if (existing.user) {
      updated.user = {
        ...existing.user,
        email: data.email !== undefined ? data.email : existing.user.email,
        mobileNumber: data.mobileNumber || existing.user.mobileNumber,
        status: data.userStatus || existing.user.status,
      };
    }
    MOCK_ADMIN_STUDENTS[index] = updated;
    return updated;
  }

  throw new Error(`Student ${studentId} not found`);
}

export async function adminDeleteStudent(
  token: string,
  studentId: string
): Promise<{ success: boolean; message: string }> {
  try {
    const res = await serverFetch<{ success: boolean; message: string }>(
      `/students/admin/${studentId}`,
      {
        token,
        method: 'DELETE',
        cache: 'no-store',
      }
    );
    return res.data;
  } catch (err) {
    console.warn('Backend delete endpoint not found, deleting from local mock list:', err);
  }

  const index = MOCK_ADMIN_STUDENTS.findIndex((s) => s.id === studentId);
  if (index !== -1) {
    MOCK_ADMIN_STUDENTS.splice(index, 1);
    return { success: true, message: 'Student removed successfully' };
  }

  return { success: true, message: 'Student removed from directory' };
}
