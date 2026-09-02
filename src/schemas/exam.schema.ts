import { z } from 'zod';

export const examSchema = z.object({
  title: z.string().min(5),
  code: z.string().min(3).toUpperCase(),
  description: z.string().min(10),
  totalMarks: z.coerce.number().positive(),
  passMarks: z.coerce.number().positive(),
  examDate: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  registrationStartAt: z.string(),
  registrationEndAt: z.string(),
  instructions: z.string().min(10),
  status: z.enum(['DRAFT', 'REGISTRATION_OPEN', 'REGISTRATION_CLOSED', 'UPCOMING', 'ONGOING', 'COMPLETED', 'RESULT_PUBLISHED', 'CANCELLED']).optional(),
}).refine(data => data.passMarks <= data.totalMarks, {
  message: "Pass marks cannot exceed total marks",
  path: ["passMarks"],
}).refine(data => new Date(data.registrationEndAt) < new Date(data.examDate), {
  message: "Registration must end before exam date",
  path: ["registrationEndAt"],
});

export type ExamFormValues = z.infer<typeof examSchema>;

export const centreSchema = z.object({
  name: z.string().min(3),
  address: z.string().min(5),
  venue: z.string().min(3),
  capacity: z.coerce.number().positive(),
});

export type CentreFormValues = z.infer<typeof centreSchema>;

export const roomSchema = z.object({
  roomNumber: z.string().min(1),
  capacity: z.coerce.number().positive(),
});

export type RoomFormValues = z.infer<typeof roomSchema>;
