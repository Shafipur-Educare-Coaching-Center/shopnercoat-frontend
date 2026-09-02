import { User } from './auth.types';

export type RegistrationStatus = 'PENDING' | 'VERIFIED' | 'COMPLETED';

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
