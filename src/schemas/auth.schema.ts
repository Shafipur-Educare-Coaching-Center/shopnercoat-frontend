import { z } from 'zod';

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(3, 'Full name must be at least 3 characters')
      .max(100, 'Full name cannot exceed 100 characters')
      .regex(
        /^[a-zA-Z\s.-]+$/,
        'Name can only contain letters, spaces, dots, and hyphens'
      ),
    dateOfBirth: z
      .string()
      .min(1, 'Date of birth is required')
      .refine(
        (dateStr) => {
          const parsed = new Date(dateStr);
          if (isNaN(parsed.getTime())) return false;
          const now = new Date();
          const ageInMs = now.getTime() - parsed.getTime();
          const ageInYears = ageInMs / (1000 * 60 * 60 * 24 * 365.25);
          return ageInYears >= 10 && ageInYears <= 60;
        },
        { message: 'Candidate must be between 10 and 60 years old' }
      ),
    mobileNumber: z
      .string()
      .trim()
      .regex(
        /^(?:\+88|88)?(01[3-9]\d{8})$/,
        'Enter a valid 11-digit Bangladeshi mobile number (e.g., 01712345678)'
      ),
    email: z
      .string()
      .trim()
      .email('Invalid email address')
      .optional()
      .or(z.literal('')),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one digit'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;

export type RegisterApiPayload = {
  fullName: string;
  dateOfBirth: string;
  mobileNumber: string;
  password: string;
  email?: string;
};

export const loginSchema = z.object({
  identifier: z
    .string()
    .trim()
    .min(1, 'Mobile number, Email, or 7-digit Roll number is required'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const verifyOtpSchema = z.object({
  mobileNumber: z.string().trim(),
  otp: z
    .string()
    .length(6, 'OTP must be exactly 6 digits')
    .regex(/^\d+$/, 'OTP must contain only digits'),
});

export type VerifyOtpFormValues = z.infer<typeof verifyOtpSchema>;

export const adminLoginSchema = z.object({
  mobileNumber: z.string().min(1, 'Mobile number or identifier is required'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean(),
});

export type AdminLoginFormValues = z.infer<typeof adminLoginSchema>;
