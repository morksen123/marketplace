import * as z from 'zod';

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
