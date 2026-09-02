import { z } from 'zod';

export const completeProfileSchema = z.object({
  fullName: z.string().min(3),
  dateOfBirth: z.string(),
  fatherName: z.string().min(3),
  motherName: z.string().min(3),
  parentMobileNumber: z.string().regex(/^(?:\+88|88)?(01[3-9]\d{8})$/),
  presentAddress: z.string().min(10),
  permanentAddress: z.string().min(10),
  photoUrl: z.string().url(),
  signatureUrl: z.string().url(),
  guardianMobileNumber: z.string().optional().or(z.literal('')),
  collegeName: z.string().optional().or(z.literal('')),
});

export type CompleteProfileFormValues = z.infer<typeof completeProfileSchema>;

export const updateProfileSchema = completeProfileSchema.partial().omit({
  fullName: true,
  dateOfBirth: true,
});

export type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>;
