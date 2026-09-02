import { z } from 'zod';

export const completeProfileSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(3, 'Full name must be at least 3 characters')
    .max(100, 'Full name cannot exceed 100 characters'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  fatherName: z
    .string()
    .trim()
    .min(3, "Father's name must be at least 3 characters")
    .max(100, "Father's name cannot exceed 100 characters"),
  motherName: z
    .string()
    .trim()
    .min(3, "Mother's name must be at least 3 characters")
    .max(100, "Mother's name cannot exceed 100 characters"),
  parentMobileNumber: z
    .string()
    .trim()
    .regex(
      /^(?:\+88|88)?(01[3-9]\d{8})$/,
      'Enter a valid 11-digit Bangladeshi mobile number'
    ),
  guardianMobileNumber: z
    .string()
    .trim()
    .regex(
      /^(?:\+88|88)?(01[3-9]\d{8})$/,
      'Enter a valid 11-digit Bangladeshi mobile number'
    )
    .optional()
    .or(z.literal('')),
  presentAddress: z
    .string()
    .trim()
    .min(10, 'Present address must be at least 10 characters')
    .max(300, 'Present address cannot exceed 300 characters'),
  permanentAddress: z
    .string()
    .trim()
    .min(10, 'Permanent address must be at least 10 characters')
    .max(300, 'Permanent address cannot exceed 300 characters'),
  collegeName: z.string().trim().max(100).optional().or(z.literal('')),
  photoUrl: z
    .string()
    .url('Please upload a valid candidate photo')
    .min(1, 'Candidate photo is mandatory'),
  signatureUrl: z
    .string()
    .url('Please upload a valid candidate signature')
    .min(1, 'Candidate signature is mandatory'),
});

export type CompleteProfileFormValues = z.infer<typeof completeProfileSchema>;

export const updateProfileSchema = completeProfileSchema.partial().omit({
  fullName: true,
  dateOfBirth: true,
});

export type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>;
