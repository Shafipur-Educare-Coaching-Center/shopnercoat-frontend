import { z } from 'zod';

export const examAdminFormSchema = z
  .object({
    title: z
      .string()
      .min(3, 'Exam title must be at least 3 characters')
      .max(150, 'Exam title cannot exceed 150 characters'),
    code: z
      .string()
      .min(3, 'Exam code must be at least 3 characters')
      .max(30, 'Exam code cannot exceed 30 characters'),
    description: z
      .string()
      .min(5, 'Description must be at least 5 characters'),
    totalMarks: z.coerce
      .number()
      .min(1, 'Total marks must be greater than 0')
      .max(1000, 'Total marks cannot exceed 1000'),
    passMarks: z.coerce
      .number()
      .min(1, 'Pass marks must be greater than 0'),
    examDate: z
      .string()
      .min(1, 'Exam date is required'),
    startTime: z
      .string()
      .min(1, 'Start time is required (e.g., 10:00 AM)'),
    endTime: z
      .string()
      .min(1, 'End time is required (e.g., 11:15 AM)'),
    registrationStartAt: z
      .string()
      .min(1, 'Registration start date & time is required'),
    registrationEndAt: z
      .string()
      .min(1, 'Registration deadline is required'),
    instructions: z
      .string()
      .min(5, 'Instructions must be at least 5 characters'),
    status: z
      .enum([
        'DRAFT',
        'REGISTRATION_OPEN',
        'REGISTRATION_CLOSED',
        'UPCOMING',
        'ONGOING',
        'COMPLETED',
        'RESULT_PUBLISHED',
        'CANCELLED',
      ])
      .default('DRAFT'),
  })
  .refine((data) => data.passMarks <= data.totalMarks, {
    message: 'Pass marks cannot be greater than Total marks',
    path: ['passMarks'],
  })
  .refine(
    (data) => {
      if (!data.registrationStartAt || !data.registrationEndAt) return true;
      return new Date(data.registrationStartAt).getTime() < new Date(data.registrationEndAt).getTime();
    },
    {
      message: 'Registration deadline must be after registration start time',
      path: ['registrationEndAt'],
    }
  );

export type ExamAdminFormValues = z.infer<typeof examAdminFormSchema>;

export const examCentreFormSchema = z.object({
  name: z.string().min(3, 'Centre name must be at least 3 characters'),
  address: z.string().min(5, 'Address is required'),
  venue: z.string().min(2, 'Venue description is required (e.g., Academic Building)'),
  capacity: z.coerce.number().min(1, 'Capacity must be at least 1 seat'),
});

export type ExamCentreFormValues = z.infer<typeof examCentreFormSchema>;

export const examRoomFormSchema = z.object({
  roomNumber: z.string().min(1, 'Room number is required (e.g., Room 101)'),
  capacity: z.coerce.number().min(1, 'Room capacity must be at least 1 seat'),
});

export type ExamRoomFormValues = z.infer<typeof examRoomFormSchema>;
