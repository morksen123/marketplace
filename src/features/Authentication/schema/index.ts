import * as z from 'zod';

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
    referredByCode: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export const DistributorSignUpSchema = z
  .object({
    distributorName: z.string().min(1, 'Distributor name is required'),
    address: z.string().min(1, 'Address is required'),
    contactNumber: z
      .string()
      .min(8, 'Contact number must be at least 8 characters'),
    uen: z.string().min(1, 'UEN/ROC is required'),
    username: z.string().min(1, 'Username is required'),
    contactName: z.string().min(1, 'Contact name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, {
      message: 'Password must be at least 6 characters long',
    }),
    confirmPassword: z.string().min(6, {
      message: 'Password must be at least 6 characters long',
    }),
    proofOfAddress: z
      .instanceof(File)
      .optional()
      .refine((file) => {
        if (file) {
          return file.size <= 5 * 1024 * 1024; // 5MB limit
        }
        return true;
      }, 'File size should be less than 5MB'),
    bizProfile: z
      .instanceof(File)
      .optional()
      .refine((file) => {
        if (file) {
          return file.size <= 5 * 1024 * 1024; // 5MB limit
        }
        return true;
      }, 'File size should be less than 5MB'),
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
