import { z } from 'zod';

export const registerSchema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters").max(100),
  dateOfBirth: z.string().refine((date) => new Date(date) < new Date(), { message: "Date of birth cannot be in the future" }),
  mobileNumber: z.string().regex(/^(?:\+88|88)?(01[3-9]\d{8})$/, "Invalid Bangladeshi mobile number"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  email: z.string().email("Invalid email address").optional().or(z.literal('')),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  identifier: z.string().min(1, "Mobile, email, or roll number is required"),
  password: z.string().min(1, "Password is required"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const verifyOtpSchema = z.object({
  mobileNumber: z.string(),
  otp: z.string().length(6, "OTP must be exactly 6 digits").regex(/^\d+$/, "OTP must contain only digits"),
});

export type VerifyOtpFormValues = z.infer<typeof verifyOtpSchema>;

export const adminLoginSchema = z.object({
  mobileNumber: z.string().min(1, "Mobile number or identifier is required"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean(),
});

export type AdminLoginFormValues = z.infer<typeof adminLoginSchema>;


