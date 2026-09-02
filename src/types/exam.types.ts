export type ExamStatus =
  | 'DRAFT'
  | 'REGISTRATION_OPEN'
  | 'REGISTRATION_CLOSED'
  | 'UPCOMING'
  | 'ONGOING'
  | 'COMPLETED'
  | 'RESULT_PUBLISHED'
  | 'CANCELLED';

export type EnrollmentStatus =
  | 'ENROLLED'
  | 'PENDING_APPROVAL'
  | 'CANCELLED'
  | 'COMPLETED';

export interface ExamRoom {
  id: string;
  centreId: string;
  roomNumber: string;
  capacity: number;
  createdAt: string;
  updatedAt: string;
}

export interface ExamCentre {
  id: string;
  examId: string;
  name: string;
  address: string;
  venue: string;
  capacity: number;
  createdAt: string;
  updatedAt: string;
  rooms?: ExamRoom[];
}

export interface Exam {
  id: string;
  title: string;
  code: string;
  description: string;
  totalMarks: number;
  passMarks: number;
  examDate: string;
  startTime: string;
  endTime: string;
  registrationStartAt: string;
  registrationEndAt: string;
  instructions: string;
  status: ExamStatus;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  centres?: ExamCentre[];
  _count?: {
    enrollments?: number;
  };
}

export interface ExamSeatAssignment {
  id: string;
  examId: string;
  studentId: string;
  centreId: string;
  roomId: string;
  seatNumber: string;
  createdAt: string;
  updatedAt: string;
  student?: { fullName: string; rollNumber: number; registrationNumber: number; photoUrl: string };
  centre?: { name: string; address: string; venue: string };
  room?: { roomNumber: string };
}

export interface ExamEnrollmentAdmin {
  id: string;
  examId: string;
  studentId: string;
  status: EnrollmentStatus;
  createdAt: string;
  updatedAt: string;
  exam?: {
    id: string;
    title: string;
    code: string;
    examDate: string;
    startTime: string;
    endTime: string;
    totalMarks: number;
    passMarks: number;
  };
  student?: {
    id: string;
    fullName: string;
    rollNumber: number;
    registrationNumber: number;
    collegeName: string;
    photoUrl: string;
    user?: {
      mobileNumber: string;
      email?: string | null;
    };
  };
  seatPlan?: {
    centreName: string;
    roomNumber: string;
    seatNumber: string;
  };
  admitCard?: {
    id: string;
    admitCardNumber: string;
    status: 'GENERATED' | 'NOT_GENERATED';
    pdfUrl?: string;
  };
}

export interface EnrollmentAdminFormData {
  studentId: string;
  examId: string;
  status?: EnrollmentStatus;
}

export interface EnrollmentFilterParams {
  examId?: string;
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export interface ExamAdminFormData {
  title: string;
  code: string;
  description: string;
  totalMarks: number;
  passMarks: number;
  examDate: string;
  startTime: string;
  endTime: string;
  registrationStartAt: string;
  registrationEndAt: string;
  instructions: string;
  status?: ExamStatus;
}

export interface ExamCentreFormData {
  name: string;
  address: string;
  venue: string;
  capacity: number;
}

export interface ExamRoomFormData {
  roomNumber: string;
  capacity: number;
}
