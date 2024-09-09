import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { createProductListingDefaultValues } from '../constants';
import { CreateProductListingSchema } from '../schema';
import AddIcon from '@mui/icons-material/Add';

export const CreateProductListing = () => {
  const form = useForm({
    resolver: zodResolver(CreateProductListingSchema),
    defaultValues: createProductListingDefaultValues,
  });

  const handleCreateListing = async (data: z.infer<typeof CreateProductListingSchema>) => {
    console.log('Listing created:', data);
    // You can handle form submission here (e.g., send data to the backend)
  };

  const isFormSubmitting = form.formState.isSubmitting;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6 text-left mt-6">Create New Product Listing</h1>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleCreateListing)}
          className="space-y-6 w-2/3"
        >
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block text-left">Listing Title</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter the name of the product e.g. Tomatoes" className="w-full" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block text-left">Category</FormLabel>
                  <FormControl>
                    <select {...field} className="w-full p-2 border rounded">
                      <option value="">Select the category of the product</option>
                      <option value="fruits-vegetables">Fruits & Vegetables</option>
                      <option value="canned-food">Canned Food</option>
                      <option value="frozen">Frozen</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="condition"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block text-left">Food Condition</FormLabel>
                  <FormControl>
                    <select {...field} className="w-full p-2 border rounded">
                      <option value="">Select the condition of the product</option>
                      <option value="near-expiry">Near Expiry</option>
                      <option value="bruised">Bruised</option>
                      <option value="dented">Dented</option>
                      <option value="ugly">Ugly</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex space-x-4">
              <FormField
                control={form.control}
                name="minPurchaseQuantity"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="block text-left">Minimum Purchase Quantity (in kg)</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" step="0.1" placeholder="Enter the minimum purchase quantity" className="w-full" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="block text-left">Price (in kg)</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" step="0.01" placeholder="Enter the price of the product" className="w-full" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="deliveryMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block text-left">Delivery Method</FormLabel>
                  <FormControl>
                    <select {...field} className="w-full p-2 border rounded">
                      <option value="">Select the delivery method</option>
                      <option value="self-pickup">Self Pickup</option>
                      <option value="arranged-delivery">Arranged Delivery</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block text-left">Description</FormLabel>
                  <FormControl>
                    <textarea
                      {...field}
                      className="w-full p-2 border rounded"
                      rows={4}
                      placeholder="Enter a description about the product"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block text-left">Upload Pictures</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept=".png,.jpg,.jpeg"
                      multiple
                      onChange={(e) => field.onChange(e.target.files)}
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                  <p className="text-sm text-gray-500">Accept PNG or JPG up to 10MB</p>
                </FormItem>
              )}
            /> */}
          </div>

          <hr className="my-6 border-gray-300" />

          <div className="space-y-4">
            <h2 className="text-xl font-bold mb-4 text-left">Batch</h2>
            {form.watch('batches', []).map((batch, index) => (
              <div key={index} className="flex space-x-4 items-end">
                <FormField
                  control={form.control}
                  name={`batches.${index}.quantity`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel className="block text-left">Quantity (in kg)</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" step="0.1" placeholder="Enter the batch quantity" className="w-full" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`batches.${index}.bestBefore`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel className="block text-left">Best Before Date</FormLabel>
                      <FormControl>
                        <Input {...field} type="date" placeholder="DD/MM/YYYY" className="w-full" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  className="bg-red-600 hover:bg-red-700 text-white"
                  onClick={() => {
                    const batches = form.getValues('batches');
                    batches.splice(index, 1);
                    form.setValue('batches', batches);
                  }}
                >
                  Remove
                </Button>
              </div>
            ))}
            {form.watch('batches', []).length < 1 && (
              <div className="flex justify-end w-full">
                <Button
                  type="button"
                  className="bg-transparent text-gray-500 hover:bg-transparent hover:text-black"
                  onClick={() => {
                    const batches = form.getValues('batches') || [];
                    form.setValue('batches', [...batches, { quantity: '', bestBefore: '' }]);
                  }}
                >
                  <AddIcon className="mr-2" />
                  Add Batch
                </Button>
              </div>
            )}
            {/* TODO: This is only for SR1 */}

          </div>

          <div className="flex justify-end w-full">
            <Button
              type="submit"
              className="w-50 bg-green-600 hover:bg-green-700 text-white "
            >
              {isFormSubmitting ? 'Processing...' : 'Create Product'}
            </Button>
          </div>
        </form>
      </Form>

      {/* <div className="w-1/2 p-4 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Preview Your Listing</h2>
          <h3 className="text-lg font-bold mb-2">{form.watch('title') || 'Product Title'}</h3>
          <p className="mb-2 text-left">
            <b>Category:</b> {form.watch('category') || ''}
          </p>
          <p className="mb-2 text-left">
            <b>Condition:</b> {form.watch('condition') || ''}
          </p>
          <p className="mb-2 text-left">
            <b>Expiration Date:</b> {form.watch('expirationDate') || ''}
          </p>
          <p className="mb-2 text-left">
            <b>Price:</b> {form.watch('price') ? `$${form.watch('price')}` : ''} per kg
          </p>
          <p className="mb-2 text-left">
            <b>Minimum Purchase Quantity:</b> {form.watch('minPurchaseQuantity') || ''} kg
          </p>
          <p className="mb-2 text-left">
            <b>Total Quantity:</b> {form.watch('totalQuantity') || ''} kg
          </p>
          <p className="mb-2 text-left">
            <b>Delivery Method:</b> {form.watch('deliveryMethod') || ''}
          </p>
          <p className="mb-2 text-left">
            <b>Description:</b> {form.watch('description') || ''}
          </p>
          {form.watch('images') && (
            <p className="text-gray-500 mb-2">
              Images: {form.watch('images').length} file(s) selected
            </p>
          )}
        </div> */}
    </div>
  );
};
