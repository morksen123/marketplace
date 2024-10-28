import { z } from "zod";

export const AddressFormSchema = z.object({
  firstName: z.string().nonempty("First name is required"),
  lastName: z.string().nonempty("Last name is required"),
  address: z.string().nonempty("Address is required"),
  zipCode: z.string()
    .nonempty("ZIP code is required")
    .regex(/^\d+$/, "ZIP code must contain only numbers"),
  country: z.string().nonempty("Country is required"),
});

export type AddressFormData = z.infer<typeof AddressFormSchema>;
