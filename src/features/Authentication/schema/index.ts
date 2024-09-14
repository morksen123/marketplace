import * as z from 'zod';

export const SignUpSchema = z
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

export const SignInSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address',
  }),
  password: z.string().min(6, {
    message: 'Password must be at least 6 characters long',
  }),
});

export const CreateProductListingSchema = z.object({
  category: z.string().min(1, {
    message: 'Category is required',
  }),
  title: z.string().min(1, {
    message: 'Title is required',
  }),
  condition: z.string().min(1, {
    message: 'Condition is required',
  }),
  expirationDate: z.string().min(1, {
    message: 'Expiration date is required',
  }),
  price: z
    .number()
    .positive({
      message: 'Price must be a positive number',
    })
    .min(0.01, {
      message: 'Price must be greater than zero',
    }),
  description: z.string().min(1, {
    message: 'Description is required',
  }),
});
