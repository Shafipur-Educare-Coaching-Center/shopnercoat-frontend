import { z } from 'zod';

export const manualEnrollmentSchema = z.object({
  studentId: z.string().uuid(),
});
