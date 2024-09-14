import * as z from 'zod';

export const CreateProductListingSchema = z.object({
  listingTitle: z.string().nonempty("Title is required"),
  foodCategory: z.string().nonempty("Category is required"),
  foodCondition: z.string().nonempty("Condition is required"),
  minPurchaseQty: z.number().min(1, "Minimum purchase quantity must be greater than 0"),
  price: z.number().min(0.01, "Price must be greater than 0"),
  deliveryMethod: z.string().nonempty("Delivery method is required"),
  description: z.string(),
  weight: z.number().min(0.1, "Weight must be greater than 0").optional(),
  pickUpLocation: z.string().nonempty("Pick up location is required").optional(),
  batches: z.array(
    z.object({
      quantity: z.number(),
      bestBeforeDate: z.string(),
    })
  ),
  productPictures: z.array(z.string()).optional(),
  productTags: z.array(z.string()).optional(),
});
