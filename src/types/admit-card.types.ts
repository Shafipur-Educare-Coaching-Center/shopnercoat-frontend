export type AdmitCardStatus = 'GENERATED' | 'REVOKED' | 'REGENERATING';
export type EmailDeliveryStatus = 'PENDING' | 'SENT' | 'FAILED';

export interface AdmitCard {
  id: string;
  examId: string;
  studentId: string;
  enrollmentId: string;
  admitCardNumber: string;
  locationSnapshot: {
    centreName: string;
    address: string;
    venue: string;
    roomNumber: string;
    seatNumber: string;
  };
  pdfUrl: string;
  storageKey: string;
  verificationToken: string;
  status: AdmitCardStatus;
  generatedAt: string;
  emailStatus: EmailDeliveryStatus;
  emailedAt: string | null;
  version: number;
  createdAt: string;
  updatedAt: string;
}
