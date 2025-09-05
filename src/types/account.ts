import { z } from 'zod';

export const personalInfoSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  phoneNumber: z.string(),
  dateOfBirth: z.date({
    required_error: "Date of birth is required"
  }).refine((date) => {
    const now = new Date();
    const age = now.getFullYear() - date.getFullYear();
    return age >= 18;
  }, "Must be at least 18 years old"),
  gender: z.string().min(1, 'Gender is required'),
});

export const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;
export type PasswordFormData = z.infer<typeof passwordSchema>;

export interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: Date;
  gender: string;
  image: string;
  role: string;
  emailVerified: Date | null;
  kycVerified: boolean;
}

export interface TabConfig {
  value: string;
  label: string;
  icon: any;
  component: React.FC;
}
