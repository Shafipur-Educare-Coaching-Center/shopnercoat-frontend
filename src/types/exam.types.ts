export type ExamStatus = 'DRAFT' | 'REGISTRATION_OPEN' | 'REGISTRATION_CLOSED' | 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'RESULT_PUBLISHED' | 'CANCELLED';

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
