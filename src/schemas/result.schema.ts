import { z } from 'zod';

export const resultRecordSchema = z.object({
  examId: z.string().uuid(),
  studentId: z.string().uuid(),
  totalAnswered: z.coerce.number().nonnegative(),
  skipped: z.coerce.number().nonnegative(),
  correctAnswered: z.coerce.number().nonnegative(),
  wrongAnswered: z.coerce.number().nonnegative(),
  deductMark: z.coerce.number().nonnegative(),
});

export type ResultRecordFormValues = z.infer<typeof resultRecordSchema>;

export const bulkResultRecordSchema = z.object({
  examId: z.string().uuid(),
  results: z.array(resultRecordSchema.omit({ examId: true })),
});

export type BulkResultRecordFormValues = z.infer<typeof bulkResultRecordSchema>;
