export type AdmitCardStatus = 'GENERATED' | 'REVOKED' | 'REGENERATING' | 'PROCESSING' | 'PENDING';
export type EmailDeliveryStatus = 'PENDING' | 'SENT' | 'FAILED';

export interface AdmitCardLocationSnapshot {
  centreName: string;
  address?: string;
  venue?: string;
  roomNumber?: string;
  seatNumber?: string;
}

export interface AdmitCard {
  id: string;
  examId: string;
  studentId: string;
  enrollmentId?: string;
  admitCardNumber: string;
  locationSnapshot?: AdmitCardLocationSnapshot;
  pdfUrl?: string;
  storageKey?: string;
  verificationToken?: string;
  status: AdmitCardStatus;
  generatedAt?: string;
  emailStatus?: EmailDeliveryStatus;
  emailedAt?: string | null;
  version?: number;
  createdAt?: string;
  updatedAt?: string;
  student?: {
    id: string;
    fullName: string;
    rollNumber: number | string;
    registrationNumber?: number | string;
    collegeName?: string;
    photoUrl?: string;
    user?: {
      email?: string;
      mobileNumber?: string;
    };
  };
  exam?: {
    id: string;
    title: string;
    code: string;
    examDate: string;
    startTime: string;
    endTime: string;
  };
}

export interface AdmitCardVerifyResponse {
  valid: boolean;
  studentName: string;
  rollNumber: number | string;
  photoUrl?: string;
  examTitle: string;
  examCode: string;
  examDate: string;
  status: string;
  message?: string;
}

export interface AdmitCardFilterParams {
  search?: string;
  examId?: string;
  status?: string;
  page?: number;
  limit?: number;
}
