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
import { useDropzone } from 'react-dropzone';
import {
  foodCategoryMapping,
  foodConditionMapping,
  deliveryMethodMapping,
  unitMapping,
  createProductListingDefaultValues
} from '@/features/ProductListing/constants';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import { handleSuccessApi } from '@/lib/api-client';

export const EditProductListing = () => {
  const { productId } = useParams();
  const [loading, setLoading] = useState(true);
  const { state } = useLocation();
  const [productData, setProductData] = useState(state?.product || null);
  const navigate = useNavigate();
  const [foodCategories, setFoodCategories] = useState<string[]>([]);
  const [foodConditions, setFoodConditions] = useState<string[]>([]);
  const [deliveryMethods, setDeliveryMethods] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [productPictures, setProductPictures] = useState<File[]>([]);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);

  const form = useForm({
    resolver: zodResolver(CreateProductListingSchema),
    defaultValues: {
      ...createProductListingDefaultValues
    }
  });

  const deliveryMethod = useWatch({ control: form.control, name: 'deliveryMethod' });
  const tags = form.watch('productTags', []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoryResponse, conditionResponse, deliveryResponse, productResponse] = await Promise.all([
          fetch('/api/products/food-category'),
          fetch('/api/products/food-condition'),
          fetch('/api/products/delivery-method'),
          fetch(`/api/products/product/${productId}`),
        ]);

        const categoryData = await categoryResponse.json();
        const conditionData = await conditionResponse.json();
        const deliveryData = await deliveryResponse.json();
        const productData = await productResponse.json();

        setFoodCategories(categoryData);
        setFoodConditions(conditionData);
        setDeliveryMethods(deliveryData);

        const batchesWithDefaultValues = productData.batches?.map((batch) => ({
          ...batch,
          bestBeforeDate: batch.bestBeforeDate ?? '',  // Ensure it's a string, not null
        })) || [{ bestBeforeDate: '', quantity: '', isActive: true }];

        form.reset({
          listingTitle: productData.listingTitle || '',
          foodCategory: productData.foodCategory || '',
          foodCondition: productData.foodCondition || '',
          minPurchaseQty: productData.minPurchaseQty || '',
          price: productData.price || '',
          deliveryMethod: productData.deliveryMethod || '',
          description: productData.description || '',
          weight: productData.weight || '',
          pickUpLocation: productData.pickUpLocation || '',
          productPictures: productData.productPictures || [],
          productTags: productData.productTags || [],
          batches: batchesWithDefaultValues,
          bulkPricings: productData.bulkPricings || [{ minQuantity: '', maxQuantity: '', price: '' }],
        });

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [productId, form]);

  // File selection and removal
  const handleFileSelection = (files) => {
    const newFiles = Array.from(files);
    setProductPictures((prevPictures) => [...prevPictures, ...newFiles]);
    setSelectedImages((prevImages) => [...prevImages, ...newFiles]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: 'image/*',
    onDrop: handleFileSelection,
    multiple: true,
  });

    console.log(form.formState.errors);

  const handleRemoveCurrentImage = (index: number) => {
    setProductData((prevData) => {
      const updatedImages = [...prevData.productPictures];
      const removedImage = updatedImages.splice(index, 1)[0];
      setImagesToDelete((prevImages) => [...prevImages, removedImage]);
      return { ...prevData, productPictures: updatedImages };
    });
  };

  const handleRemoveSelectedImage = (index: number) => {
    setSelectedImages((prevImages) => {
      const updatedImages = [...prevImages];
      updatedImages.splice(index, 1);
      return updatedImages;
    });
  };

  // Tag handling
  const handleAddTag = (event: React.KeyboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const newTag = event.currentTarget.value.trim();
    if (newTag && !tags.includes(newTag)) {
      form.setValue('productTags', [...tags, newTag]);
      setInputValue('');
    }
  };

  const handleRemoveTag = (indexToRemove: number) => {
    const updatedTags = tags.filter((_, index) => index !== indexToRemove);
    form.setValue('productTags', updatedTags);
  };

  const handleUpdateListing = async (data: any) => {
    try {
      const updatedProductData = {
        ...data,
        distributorId: null,
        productPictures: [...productData.productPictures, ...selectedImages],
      };

      // Upload new images if any
      if (selectedImages.length > 0) {
        const uploadedUrls = await uploadFilesToS3(selectedImages);
        updatedProductData.productPictures = [
          ...productData.productPictures,
          ...uploadedUrls,
        ];
      }

      // Remove deleted images
      updatedProductData.productPictures = updatedProductData.productPictures.filter(
        (url: string) => !imagesToDelete.includes(url)
      );

      const response = await fetch(`/api/products/product/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProductData),
      });

      if (!response.ok) {
        throw new Error('Failed to update product');
      }

      handleSuccessApi('Success!', 'Product has been updated.');
      navigate(`/view-product-listing/${productId}`);
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product');
    }
  };

  const isFormSubmitting = form.formState.isSubmitting;

  if (loading) {
    return <div className="wrapper">Loading...</div>;
  }

  return (
    <div className="wrapper">
      <h1 className="text-2xl font-bold mb-6 text-left mt-6">Edit Product Listing</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleUpdateListing)} className="space-y-6 w-full">
          {/* ... (previous form fields remain unchanged) ... */}


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
                  <select {...field} className="w-full p-2 border rounded">
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

          {/* Units (conditional) */}
          {(selectedCategory === 'DAIRY_AND_EGGS' || selectedCategory === 'DRY_GOODS_AND_STAPLES') && (
            <FormItem>
              <FormLabel className="block text-left">Units</FormLabel>
              <FormControl>
                <Input placeholder="Enter units e.g., dozens" className="w-full p-2 border rounded" />
              </FormControl>
            </FormItem>
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
                      <Input {...field} placeholder="Pickup Location" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          {/* Weight (for CANNED_GOODS) */}
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
          {/* Image Upload Section */}
          <div>
            <FormLabel className=" block text-left">Upload Images</FormLabel>

            {/* Drag and Drop Zone */}
            <div
              {...getRootProps()}
              className={`border-2 border-dashed p-6 rounded-lg cursor-pointer ${isDragActive ? 'border-green-500' : 'border-gray-300'}`}
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <p className="text-center text-green-500">Drop the files here...</p>
              ) : (
                <p className="text-center text-gray-500">Drag and drop some files here, or click to select files</p>
              )}
            </div>

            {/* Display Current Images */}
            {productData.productPictures?.length > 0 && (
              <div className="mt-4">
                <h4 className="text-left mb-2">Current Images</h4>
                <div className="flex flex-wrap w-full gap-4">
                  {productData.productPictures.map((image, index) => (
                    <div key={index} className="relative w-24 h-24 border rounded overflow-hidden">
                      <img src={image} alt={`Current ${index + 1}`} className="object-cover w-full h-full" />
                      <button
                        type="button"
                        onClick={() => handleRemoveCurrentImage(index)}
                        className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1"
                      >
                        <CloseIcon fontSize="small" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Display Selected Images */}
            {selectedImages.length > 0 && (
              <div className="mt-4">
                <h4 className="text-left mb-2">Selected Images</h4>
                <div className="flex flex-wrap w-full gap-4">
                  {selectedImages.map((image, index) => {
                    const objectUrl = URL.createObjectURL(image);
                    return (
                      <div key={index} className="relative w-24 h-24 border rounded overflow-hidden">
                        <img src={objectUrl} alt={`Selected ${index + 1}`} className="object-cover w-full h-full" />
                        <button
                          type="button"
                          onClick={() => handleRemoveSelectedImage(index)}
                          className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1"
                        >
                          <CloseIcon fontSize="small" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="block text-left">
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <textarea {...field} className="w-full p-2 border rounded" rows={4} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Product Tags Input */}
          <FormField
            control={form.control}
            name="productTags"
            render={() => (
              <FormItem>
                <FormLabel className="block text-left mb-2">Add Product Tags</FormLabel>
                <div className="w-full p-2 border rounded flex flex-wrap items-center gap-2">
                  {tags.map((tag, index) => (
                    <div key={index} className="flex items-center bg-gray-200 text-gray-700 p-1 px-2 rounded-full">
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(index)}
                        className="ml-2 text-gray-500"
                      >
                        <CloseIcon fontSize="small" />
                      </button>
                    </div>
                  ))}
                  <Input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddTag(e)}
                    placeholder="Type and press Enter..."
                    className="border-none focus:outline-none w-40"
                  />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Min Purchase Quantity and Price */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold mb-4 text-left">Pricing</h2>
            <div className="flex space-x-4">
              <FormField
                control={form.control}
                name="minPurchaseQty"
                render={({ field }) => (
                  <FormItem className="block text-left flex-1">
                    <FormLabel>Minimum Purchase Quantity ({unitMapping[selectedCategory] || 'unit'})</FormLabel>

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
                  <FormItem className="block text-left flex-1">
                    <FormLabel>Price (per {unitMapping[selectedCategory] || 'unit'})</FormLabel>
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
          </div>
          
          {/* Submit Button */}
          <div className="flex justify-end w-full">
            <Button
              type="submit"
              className="w-50 bg-green-600 hover:bg-green-700 text-white"
              disabled={isFormSubmitting}
            >
              {isFormSubmitting ? 'Processing...' : 'Update Product'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};