import { z } from 'zod';

export const enrollmentAdminFormSchema = z.object({
  studentId: z.string().min(1, 'Target candidate must be selected'),
  examId: z.string().min(1, 'Target model test must be selected'),
  status: z
    .enum(['ENROLLED', 'PENDING_APPROVAL', 'CANCELLED', 'COMPLETED'])
    .default('ENROLLED'),
});

export type EnrollmentAdminFormValues = z.infer<typeof enrollmentAdminFormSchema>;

export const enrollmentStatusUpdateSchema = z.object({
  status: z.enum(['ENROLLED', 'PENDING_APPROVAL', 'CANCELLED', 'COMPLETED']),
});

export type EnrollmentStatusUpdateValues = z.infer<typeof enrollmentStatusUpdateSchema>;
