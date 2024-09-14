import React, { useState, useEffect } from 'react';
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
import { useForm, useWatch } from 'react-hook-form';
import AddIcon from '@mui/icons-material/Add';
import { CreateProductListingSchema } from '@/features/ProductListing/schema';
import { useNavigate } from 'react-router-dom';
import { foodCategoryMapping, foodConditionMapping, deliveryMethodMapping, unitMapping } from '@/features/ProductListing/constants';
import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";

export const CreateProductListing = () => {
  const navigate = useNavigate();
  const [foodCategories, setFoodCategories] = useState<string[]>([]);
  const [foodConditions, setFoodConditions] = useState<string[]>([]);
  const [deliveryMethods, setDeliveryMethods] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [productPictures, setProductPictures] = useState<string[]>([]);

  const form = useForm({
    resolver: zodResolver(CreateProductListingSchema),
    defaultValues: {
      listingTitle: '',
      foodCategory: '',
      foodCondition: '',
      minPurchaseQty: '',
      price: '',
      deliveryMethod: '',
      description: '',
      weight: '',
      pickUpLocation: '',
      batches: [{ bestBeforeDate: '', quantity: '', isActive: true }],
      productPictures: [],
      productTags: [],
    },
  });

  const deliveryMethod = useWatch({
    control: form.control,
    name: "deliveryMethod",
  });

  // Fetch food categories, conditions, and delivery methods from backend
  useEffect(() => {
    const fetchEnums = async () => {
      try {
        const [categoryResponse, conditionResponse, deliveryResponse] = await Promise.all([
          fetch('/api/products/food-category'),
          fetch('/api/products/food-condition'),
          fetch('/api/products/delivery-method'),
        ]);

        const categoryData = await categoryResponse.json();
        const conditionData = await conditionResponse.json();
        const deliveryData = await deliveryResponse.json();

        setFoodCategories(categoryData);
        setFoodConditions(conditionData);
        setDeliveryMethods(deliveryData);

      } catch (error) {
        console.error('Error fetching enum values:', error);
      }
    };

    fetchEnums();
  }, []);

  const handleCreateListing = async (data) => {
    try {
      const response = await fetch('/api/products/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJzdHJpbmdAZ21haWwuY29tIiwiaWF0IjoxNzI2MjA3NDIzLCJleHAiOjE3MjY4MTIyMjN9.SScCI90ac49GsW1hVd-7Q8tXNo3UAWjkL3G5Ej2aywo',
        },

        body: JSON.stringify({
          ...data,
          distributorId: null,
          isActive: true,
          createdDateTime: new Date().toISOString(),
          editedOn: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create product');
      }

      const result = await response.json();
      console.log('Product created successfully:', result);
    } catch (error) {
      console.error('Error creating product:', error);
    }

    window.alert('Product created successfully!');
    navigate('/home/distributor');
  };

  const s3Client = new S3Client({
    region: 'ap-southeast-2',
    credentials: {
      accessKeyId: 'AKIAS2VS4QJVRXLKSVXV',
      secretAccessKey: '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',
    },
  });

  const handleFileUpload = async (files) => {
    const uploadedPictureUrls = [];
  
    for (const file of files) {
      const fileName = `${Date.now()}-${file.name}`;
      const upload = new Upload({
        client: s3Client,
        params: {
          Bucket: 'gudfood-pictures',
          Key: fileName,
          Body: file,
          ACL: 'public-read',        
        },
      });
  
      try {
        const result = await upload.done();
        const url = `https://${result.Bucket}.s3.amazonaws.com/${result.Key}`;
        uploadedPictureUrls.push(url);
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  
    setProductPictures([...productPictures, ...uploadedPictureUrls]);
  };

  const isFormSubmitting = form.formState.isSubmitting;

  return (
    <div className="wrapper">
      <h1 className="text-2xl font-bold mb-6 text-left mt-6">Create New Product Listing</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleCreateListing)} className="space-y-6 w-2/3">
          {/* Listing Title */}
          <FormField
            control={form.control}
            name="listingTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-left">Listing Title</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter the product title" className="w-full" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Category */}
          <FormField
            control={form.control}
            name="foodCategory"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-left">Category</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    className="w-full p-2 border rounded"
                    onChange={(e) => {
                      setSelectedCategory(e.target.value);
                      field.onChange(e);
                    }}
                  >
                    <option value="">Select the category of the product</option>
                    {foodCategories.map((category) => (
                      <option key={category} value={category}>
                        {foodCategoryMapping[category] || category}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Condition */}
          <FormField
            control={form.control}
            name="foodCondition"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-left">Food Condition</FormLabel>
                <FormControl>
                  <select {...field}
                    className="w-full p-2 border rounded"
                  >
                    <option value="">Select the condition of the product</option>
                    {foodConditions.map((condition) => (
                      <option key={condition} value={condition}>
                        {foodConditionMapping[condition] || condition}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {(selectedCategory === 'DAIRY_AND_EGGS' || selectedCategory === 'DRY_GOODS_AND_STAPLES') && (
            <div className="flex space-x-4">
              <FormItem className="flex-1">
                <FormLabel className="block text-left">Units</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter the units of the product e.g. if your product is eggs, enter dozens"
                    className="w-full p-2 border rounded"
                  />
                </FormControl>
              </FormItem>
            </div>
          )}

          <FormItem>
            <FormLabel className="block text-left">Upload Product Images</FormLabel>
            <FormControl>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleFileUpload(e.target.files)}
                className="w-full p-2 border rounded"
              />
            </FormControl>
            <FormMessage />
          </FormItem>

          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-left">Description</FormLabel>
                <FormControl>
                  <textarea {...field} className="w-full p-2 border rounded" rows={4} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Min Purchase Quantity and Price */}
          <div className="flex space-x-4">
            <FormField
              control={form.control}
              name="minPurchaseQty"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel className="block text-left">
                    {selectedCategory === 'CANNED_GOODS'
                      ? 'Minimum Purchase Quantity (number of cans)'
                      : `Minimum Purchase Quantity (${unitMapping[selectedCategory] || 'units'})`}
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      step="1"
                      placeholder="Minimum Quantity"
                      value={field.value ?? ''}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
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
                  <FormLabel className="block text-left">Price (per {unitMapping[selectedCategory] || 'unit'})</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      step="1"
                      placeholder="Price"
                      value={field.value ?? ''}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Weight and Pickup Location */}
          {/* Conditionally show weight field only for CANNED_GOODS */}
          {selectedCategory === 'CANNED_GOODS' && (
            <FormField
              control={form.control}
              name="weight"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel className="block text-left">Weight per can (kg)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      step="1"
                      placeholder="Weight"
                      value={field.value ?? ''}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* Delivery Method */}
          <div className="flex space-x-4">
            <FormField
              control={form.control}
              name="deliveryMethod"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel className="block text-left">Delivery Method</FormLabel>
                  <FormControl>
                    <select {...field} className="w-full p-2 border rounded">
                      <option value="">Select the delivery method</option>
                      {deliveryMethods.map((method) => (
                        <option key={method} value={method}>
                          {deliveryMethodMapping[method] || method}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {deliveryMethod === 'SELF_PICK_UP' && (
              <FormField
                control={form.control}
                name="pickUpLocation"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="block text-left">Pickup Location</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Location" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          {/* Batches */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold mb-4 text-left">Batch Details</h2>
            {form.watch('batches', []).map((batch, index) => (
              <div key={index} className="flex space-x-4 items-end">
                <FormField
                  control={form.control}
                  name={`batches.${index}.quantity`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel className="block text-left">Batch Quantity {selectedCategory === 'CANNED_GOODS'
                        ? '(total number of cans)'
                        : `(total ${unitMapping[selectedCategory] || 'units'})`}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          step="1"
                          placeholder="Quantity"
                          value={field.value ?? ''}
                          onChange={(e) => field.onChange(e.target.valueAsNumber)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`batches.${index}.bestBeforeDate`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel className="block text-left">Best Before Date</FormLabel>
                      <FormControl>
                        <Input {...field} type="date" />
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
            <div className="flex justify-end w-full">
              <Button
                type="button"
                className="bg-transparent text-gray-500 hover:bg-transparent hover:text-black"
                onClick={() => {
                  const batches = form.getValues('batches') || [];
                  form.setValue('batches', [
                    ...batches,
                    { quantity: '', bestBeforeDate: '', isActive: true },
                  ]);
                }}
              >
                <AddIcon className="mr-2" />
                Add Batch
              </Button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end w-full">
            <Button
              type="submit"
              className="w-50 bg-green-600 hover:bg-green-700 text-white"
              disabled={isFormSubmitting}
            >
              {isFormSubmitting ? 'Processing...' : 'Create Product'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
