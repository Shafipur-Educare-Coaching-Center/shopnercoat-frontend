import { z } from 'zod';

export const manualAdmitCardSchema = z.object({
  studentId: z.string().uuid(),
});
