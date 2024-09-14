import React, { useEffect, useState } from 'react';
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
import { CreateProductListingSchema } from '../schema';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  foodCategoryMapping,
  foodConditionMapping,
  deliveryMethodMapping,
  unitMapping,
} from '@/features/ProductListing/constants';

export const EditProductListing = () => {
  const { productId } = useParams();
  const [loading, setLoading] = useState(true);
  const { state } = useLocation();
  const [productData, setProductData] = useState(state?.product || null);
  const navigate = useNavigate();
  const [foodCategories, setFoodCategories] = useState<string[]>([]);
  const [foodConditions, setFoodConditions] = useState<string[]>([]);
  const [deliveryMethods, setDeliveryMethods] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(''); // Track selected category

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

  const deliveryMethod = useWatch({ control: form.control, name: 'deliveryMethod' });
  const watchedTitle = useWatch({ control: form.control, name: 'listingTitle' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoryResponse, conditionResponse, deliveryResponse, productResponse] = await Promise.all([
          fetch('/api/products/food-category'),
          fetch('/api/products/food-condition'),
          fetch('/api/products/delivery-method'),
          fetch(`/api/products/${productId}`),
        ]);

        const categoryData = await categoryResponse.json();
        const conditionData = await conditionResponse.json();
        const deliveryData = await deliveryResponse.json();
        const productData = await productResponse.json();

        setFoodCategories(categoryData);
        setFoodConditions(conditionData);
        setDeliveryMethods(deliveryData);

        if (!watchedTitle) {
          setProductData(productData);
          form.reset({
            listingTitle: productData.listingTitle,
            foodCategory: productData.foodCategory,
            foodCondition: productData.foodCondition,
            minPurchaseQty: productData.minPurchaseQty,
            price: productData.price,
            deliveryMethod: productData.deliveryMethod,
            description: productData.description,
            weight: productData.weight,
            pickUpLocation: productData.pickUpLocation,
            batches: productData.batches || [],
            productPictures: productData.productPictures || [],
            productTags: productData.productTags || [],
          });
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [productData, productId, form]);

  const handleUpdateListing = async (data) => {
    try {
      const updatedProductData = {
        ...data,
        distributorId: null,
      };

      const response = await fetch(`/api/products/product/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJzdHJpbmdAZ21haWwuY29tIiwiaWF0IjoxNzI2MjA3NDIzLCJleHAiOjE3MjY4MTIyMjN9.SScCI90ac49GsW1hVd-7Q8tXNo3UAWjkL3G5Ej2aywo',
        },
        body: JSON.stringify(updatedProductData),
      });

      if (!response.ok) {
        throw new Error('Failed to update product');
      }

      alert('Product updated successfully!');
      navigate(`/view-product-listing/${productId}`);
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product');
    }
  };

  const isFormSubmitting = form.formState.isSubmitting;

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6 text-left mt-6">Edit Product Listing</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleUpdateListing)} className="space-y-6 w-2/3">
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
                    onChange={(e) => {
                      setSelectedCategory(e.target.value);
                      field.onChange(e);
                    }}
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

          {/* Units (conditional field for DAIRY_AND_EGGS and DRY_GOODS_AND_STAPLES) */}
          {(selectedCategory === 'DAIRY_AND_EGGS' || selectedCategory === 'DRY_GOODS_AND_STAPLES') && (
            <FormItem>
              <FormLabel className="block text-left">Units</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter units e.g., dozens"
                  className="w-full p-2 border rounded"
                />
              </FormControl>
            </FormItem>
          )}

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
                    <Input {...field} type="number" step="5" placeholder="Minimum Quantity"  onChange={(e) => field.onChange(e.target.valueAsNumber)} />
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
                    <Input {...field} type="number" step="1" placeholder="Price" onChange={(e) => field.onChange(e.target.valueAsNumber)}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

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
                      <Input {...field} placeholder="Pickup Location" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          {/* Weight (only for CANNED_GOODS) */}
          {selectedCategory === 'CANNED_GOODS' && (
            <FormField
              control={form.control}
              name="weight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block text-left">Weight per can (kg)</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" step="0.1" placeholder="Weight per can" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <hr className="my-6 border-gray-300" />

          <div className="flex justify-end w-full">
            <Button type="submit" className="w-50 bg-green-600 hover:bg-green-700 text-white">
              {isFormSubmitting ? 'Processing...' : 'Update Product'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
