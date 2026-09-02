import { User, UserStatus } from './auth.types';

export type RegistrationStatus = 'PENDING' | 'VERIFIED' | 'COMPLETED' | 'REJECTED';

export interface Student {
  id: string;
  userId: string;
  fullName: string;
  dateOfBirth: string;
  fatherName: string;
  motherName: string;
  parentMobileNumber: string;
  guardianMobileNumber: string | null;
  presentAddress: string;
  permanentAddress: string;
  photoUrl: string;
  signatureUrl: string;
  rollNumber: number;
  registrationNumber: number;
  collegeName: string | null;
  registrationStatus: RegistrationStatus;
  createdAt: string;
  updatedAt: string;
  user?: User;
}

export interface StudentAdminFilters {
  search?: string;
  status?: RegistrationStatus | 'ALL';
  collegeName?: string;
  page?: number;
  limit?: number;
}

export interface StudentAdminFormData {
  fullName: string;
  mobileNumber: string;
  email?: string;
  password?: string;
  dateOfBirth: string;
  collegeName: string;
  fatherName: string;
  motherName: string;
  parentMobileNumber: string;
  guardianMobileNumber?: string;
  presentAddress: string;
  permanentAddress: string;
  photoUrl?: string;
  signatureUrl?: string;
  registrationStatus?: RegistrationStatus;
  userStatus?: UserStatus;
}

export interface StudentAdminStats {
  totalCandidates: number;
  activeCandidates: number;
  pendingCandidates: number;
  suspendedCandidates: number;
  topCollege: string;
}
