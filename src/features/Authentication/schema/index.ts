import * as z from 'zod';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];

export const BuyerSignUpSchema = z
  .object({
    email: z.string().email({
      message: 'Please enter a valid email address',
    }),
    firstName: z.string().min(1, {
      message: 'Please enter your first name',
    }),
    lastName: z.string().min(1, {
      message: 'Please enter your last name',
    }),
    password: z.string().min(6, {
      message: 'Password must be at least 6 characters long',
    }),
    confirmPassword: z.string().min(6, {
      message: 'Password must be at least 6 characters long',
    }),
    homeAddress: z.string().min(6, {
      message: 'Home address must be at least 6 characters long',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export const DistributorSignUpSchema = z
  .object({
    companyName: z.string().min(1, 'Company name is required'),
    businessRegistrationNumber: z
      .string()
      .min(1, 'Business registration number is required'),
    companyAddress: z.string().min(1, 'Company address is required'),
    proofOfAddress: z
      .custom<File>()
      .refine((file) => file !== null, 'Proof of address is required')
      .refine((file) => file instanceof File, 'Invalid file')
      .refine(
        (file) => file.size <= MAX_FILE_SIZE,
        'File size should be less than 5MB',
      )
      .refine(
        (file) => ACCEPTED_FILE_TYPES.includes(file.type),
        'Only .pdf, .jpeg and .png files are accepted',
      ),
    acraBusinessProfile: z
      .custom<File>()
      .refine((file) => file !== null, 'ACRA business profile is required')
      .refine((file) => file instanceof File, 'Invalid file')
      .refine(
        (file) => file.size <= MAX_FILE_SIZE,
        'File size should be less than 5MB',
      )
      .refine(
        (file) => ACCEPTED_FILE_TYPES.includes(file.type),
        'Only .pdf, .jpeg and .png files are accepted',
      ),
    primaryContactName: z.string().min(1, 'Primary contact name is required'),
    primaryContactEmail: z.string().email('Invalid email address'),
    primaryPhoneNumber: z
      .string()
      .min(8, 'Phone number must be at least 8 characters'),
    username: z.string().min(3, 'Username must be at least 3 characters'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character',
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export const SignInSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address',
  }),
  password: z.string().min(6, {
    message: 'Password must be at least 6 characters long',
  }),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export const resetPasswordSchema = z
  .object({
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });
