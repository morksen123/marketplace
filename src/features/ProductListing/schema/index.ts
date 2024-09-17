import * as z from 'zod';

export const CreateProductListingSchema = z.object({
  listingTitle: z.string().nonempty("Title is required"),
  foodCategory: z.string().nonempty("Category is required"),
  foodCondition: z.string().nonempty("Condition is required"),
  deliveryMethod: z.string().nonempty("Delivery method is required"),
  description: z.string(),
  minPurchaseQty: z.coerce.number()
    .min(1, "Minimum purchase quantity is required"),
  price: z.coerce.number()
    .min(0.01, "Price is required"),
  weight: z.coerce.number().optional(),
  units: z.string().optional(),
  pickUpLocation: z.string().optional(),
  batches: z.array(
    z.object({
      quantity: z.number(),
      bestBeforeDate: z.string(),
    })
  ),
  productPictures: z.array(z.string()).optional(),
  productTags: z.array(z.string()).optional(),
  bulkPricings: z.array(
    z.object({
      minQuantity: z.number(),
      maxQuantity: z.number(),
      price: z.number(),
    })
  ),
});
