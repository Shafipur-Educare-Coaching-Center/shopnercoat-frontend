import { z } from 'zod';

export const studentAdminFormSchema = z.object({
  fullName: z
    .string()
    .min(3, 'Full name must be at least 3 characters')
    .max(100, 'Full name cannot exceed 100 characters'),
  mobileNumber: z
    .string()
    .regex(/^01[3-9]\d{8}$/, 'Must be a valid 11-digit Bangladeshi mobile number (e.g., 01712345678)'),
  email: z
    .string()
    .email('Invalid email address')
    .optional()
    .or(z.literal('')),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .optional()
    .or(z.literal('')),
  dateOfBirth: z
    .string()
    .min(1, 'Date of birth is required'),
  collegeName: z
    .string()
    .min(2, 'HSC College name is required'),
  fatherName: z
    .string()
    .min(2, "Father's name is required"),
  motherName: z
    .string()
    .min(2, "Mother's name is required"),
  parentMobileNumber: z
    .string()
    .regex(/^01[3-9]\d{8}$/, 'Parent mobile must be a valid 11-digit BD number'),
  guardianMobileNumber: z
    .string()
    .optional()
    .or(z.literal('')),
  presentAddress: z
    .string()
    .min(5, 'Present address must be at least 5 characters'),
  permanentAddress: z
    .string()
    .min(5, 'Permanent address must be at least 5 characters'),
  photoUrl: z
    .string()
    .optional()
    .or(z.literal('')),
  signatureUrl: z
    .string()
    .optional()
    .or(z.literal('')),
  registrationStatus: z
    .enum(['PENDING', 'VERIFIED', 'COMPLETED', 'REJECTED']),
  userStatus: z
    .enum(['ACTIVE', 'PENDING', 'SUSPENDED']),
});

export type StudentAdminFormValues = z.infer<typeof studentAdminFormSchema>;
