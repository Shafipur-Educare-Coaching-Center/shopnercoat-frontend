export type Role = 'STUDENT' | 'ADMIN';
export type UserStatus = 'PENDING' | 'ACTIVE' | 'SUSPENDED';

export interface User {
  id: string;
  mobileNumber: string;
  email: string | null;
  role: Role;
  mobileVerified: boolean;
  emailVerified: boolean;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  user: User & { studentId?: string | null };
}
