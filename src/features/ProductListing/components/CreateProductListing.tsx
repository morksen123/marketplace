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
import {
  createProductListingDefaultValues,
  deliveryMethodMapping,
  foodCategoryMapping,
  foodConditionMapping,
  unitMapping,
} from '@/features/ProductListing/constants';
import { CreateProductListingSchema } from '@/features/ProductListing/schema';
import { handleErrorApi, handleSuccessApi } from '@/lib/api-client';
import { uploadMultipleFilesToS3 } from '@/lib/aws';
import { zodResolver } from '@hookform/resolvers/zod';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useForm, useWatch } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

export const CreateProductListing = () => {
  const navigate = useNavigate();
  const [foodCategories, setFoodCategories] = useState<string[]>([]);
  const [foodConditions, setFoodConditions] = useState<string[]>([]);
  const [deliveryMethods, setDeliveryMethods] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [productPictures, setProductPictures] = useState<[]>([]);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [inputValue, setInputValue] = useState('');

  const form = useForm({
    resolver: zodResolver(CreateProductListingSchema),
    defaultValues: createProductListingDefaultValues,
  });

  const deliveryMethod = useWatch({
    control: form.control,
    name: 'deliveryMethod',
  });

  // Fetch food categories, conditions, and delivery methods from backend
  useEffect(() => {
    const fetchEnums = async () => {
      try {
        const [categoryResponse, conditionResponse, deliveryResponse] =
          await Promise.all([
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

  // Retrieve the productTags field from the form
  const tags = form.watch('productTags');

  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Add leading 0 if necessary
    const day = String(today.getDate()).padStart(2, '0'); // Add leading 0 if necessary
    return `${year}-${month}-${day}`;
  };

  // Handle adding a tag to productTags
  const handleAddTag = (event) => {
    event.preventDefault();
    const newTag = event.target.value.trim();
    if (newTag && !tags.includes(newTag)) {
      form.setValue('productTags', [...tags, newTag]); // Update the form value
      event.target.value = ''; // Clear the input field after adding the tag
      setInputValue('');
    }
  };

  // Handle removing a tag from productTags
  const handleRemoveTag = (indexToRemove) => {
    const updatedTags = tags.filter((_, index) => index !== indexToRemove);
    form.setValue('productTags', updatedTags);
  };

  const handleFileSelection = (files: FileList) => {
    const newFiles = Array.from(files);
    setProductPictures((prevPictures: File[]) => [
      ...prevPictures,
      ...newFiles,
    ]);
    setSelectedImages((prevImages: File[]) => [...prevImages, ...newFiles]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': [],
    },
    onDrop: handleFileSelection,
    multiple: true, // Allow multiple file selection
  });

  const handleRemoveImage = (index: number) => {
    const updatedImages = [...selectedImages];
    const updatedPictures = [...productPictures];

    updatedImages.splice(index, 1);
    updatedPictures.splice(index, 1);

    setSelectedImages(updatedImages);
    setProductPictures(updatedPictures);
  };

  // Handle form submission and upload pictures
  const handleCreateListing = async (data) => {
    try {
      if (data.units) {
        data.description = `This product is being sold in ${data.units.toLowerCase()} - ${
          data.description
        }`;
      }

      // First, upload the files to S3
      const uploadedUrls = await uploadMultipleFilesToS3(productPictures);
      data.productPictures = uploadedUrls; // Assign uploaded picture URLs to form data

      const response = await fetch('/api/products/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
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
      handleSuccessApi('Success!', 'Product has been created.');
      navigate('/distributor/home');
    } catch (error) {
      console.error('Error creating product:', error);
      handleErrorApi('Error!', 'An error occurred while creating the product.');
    }
  };

  const isFormSubmitting = form.formState.isSubmitting;

  return (
    <div className="wrapper">
      <h1 className="text-2xl font-bold mb-6 text-left mt-6">
        Create New Product Listing
      </h1>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleCreateListing)}
          className="space-y-6 w-full"
        >
          {/* Listing Title */}
          <FormField
            control={form.control}
            name="listingTitle"
            render={({ field }) => (
              <FormItem className="block text-left">
                <FormLabel>Listing Title</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter the product title"
                    className="w-full"
                  />
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
              <FormItem className="block text-left">
                <FormLabel>Category</FormLabel>
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
              <FormItem className="block text-left">
                <FormLabel>Food Condition</FormLabel>
                <FormControl>
                  <select {...field} className="w-full p-2 border rounded">
                    <option value="">
                      Select the condition of the product
                    </option>
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

          {(selectedCategory === 'DAIRY_AND_EGGS' ||
            selectedCategory === 'DRY_GOODS_AND_STAPLES') && (
            <FormField
              control={form.control}
              name="units"
              render={({ field }) => (
                <FormItem className="block text-left">
                  <FormLabel>Units</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter the units of the product e.g. if your product is eggs, enter dozens"
                      className="w-full p-2 border rounded"
                      value={field.value ?? ''} // Ensure field.value is either a string or an empty string
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          )}

          {/* Product Image Upload Section */}
          <div>
            {/* Drag and Drop Zone */}
            <FormItem className="block text-left">
              <FormLabel>Upload Images</FormLabel>
            </FormItem>

            <div
              {...getRootProps()}
              className={`border-2 border-dashed p-6 rounded-lg cursor-pointer ${
                isDragActive ? 'border-green-500' : 'border-gray-300'
              }`}
            >
              <input {...getInputProps()} />

              {isDragActive ? (
                <p className="text-center text-green-500">
                  Drop the files here...
                </p>
              ) : (
                <p className="text-center text-gray-500">
                  Drag and drop some files here, or click to select files
                </p>
              )}
            </div>

            {/* Display Selected Images */}
            {selectedImages.length > 0 && (
              <div className="mt-4">
                <h4 className="text-left mb-2">Selected Images</h4>
                <div className="flex flex-wrap w-full gap-4">
                  {selectedImages.map((image, index) => {
                    const objectUrl = URL.createObjectURL(image); // Create a local URL for image preview
                    return (
                      <div
                        key={index}
                        className="relative w-24 h-24 border rounded overflow-hidden"
                      >
                        <img
                          src={objectUrl}
                          alt={`Selected ${index + 1}`}
                          className="object-cover w-full h-full"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
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

          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="block text-left">
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <textarea
                    {...field}
                    className="w-full p-2 border rounded"
                    rows={4}
                  />
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
                <FormLabel className="block text-left mb-2">
                  Add Product Tags
                </FormLabel>

                {/* Tags input section */}
                <div className="w-full p-2 border rounded flex flex-wrap items-center gap-2">
                  {tags.map((tag, index) => (
                    <div
                      key={index}
                      className="flex items-center bg-gray-200 text-gray-700 p-1 px-2 rounded-full"
                    >
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

          {/* Weight and Pickup Location
          {/* Conditionally show weight field only for CANNED_GOODS */}
          {selectedCategory === 'CANNED_GOODS' && (
            <FormField
              control={form.control}
              name="weight"
              render={({ field }) => (
                <FormItem className="block text-left flex-1">
                  <FormLabel>Weight per can (kg)</FormLabel>
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
          <div className="flex flex-col space-y-4">
            <FormField
              control={form.control}
              name="deliveryMethod"
              render={({ field }) => (
                <FormItem className="block text-left w-full">
                  <FormLabel>Delivery Method</FormLabel>
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
                  <FormItem className="block text-left w-full">
                    <FormLabel>Pickup Location</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Location" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          {/* Min Purchase Quantity and Price */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold mb-4 text-left">Pricing</h2>
            <div className="flex space-x-4">
              <FormField
                control={form.control}
                name="minPurchaseQty"
                render={({ field }) => (
                  <FormItem className="block text-left flex-1">
                    <FormLabel>
                      Minimum Purchase Quantity (
                      {unitMapping[selectedCategory] || 'unit'})
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
                  <FormItem className="block text-left flex-1">
                    <FormLabel>
                      Price (per {unitMapping[selectedCategory] || 'unit'})
                    </FormLabel>
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

          {/* Bulk Pricing Quantity */}
          <h3 className="text-xl font-bold mb-4 text-left">Bulk Pricing</h3>
          {form.watch('bulkPricings', []).map((bulkPricing, index) => (
            <div key={index}>
              <div className="flex space-x-4 items-start">
                <FormField
                  control={form.control}
                  name={`bulkPricings.${index}.minQuantity`}
                  render={({ field }) => (
                    <FormItem className="flex-1 block text-left">
                      <FormLabel>
                        Minimum Quantity (
                        {unitMapping[selectedCategory] || 'unit'})
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          step="1"
                          placeholder="Minimum Quantity"
                          value={field.value ?? ''}
                          onChange={(e) => {
                            const newValue = e.target.valueAsNumber;
                            field.onChange(newValue);
                            if (index > 0) {
                              const prevMaxQuantity = Number(
                                form.getValues(
                                  `bulkPricings.${index - 1}.maxQuantity`,
                                ),
                              );
                              if (newValue <= prevMaxQuantity) {
                                form.setError(
                                  `bulkPricings.${index}.minQuantity`,
                                  {
                                    type: 'manual',
                                    message: `Must be greater than previous max quantity (${prevMaxQuantity})`,
                                  },
                                );
                              } else {
                                form.clearErrors(
                                  `bulkPricings.${index}.minQuantity`,
                                );
                              }
                            }
                            // Check if max quantity is more than min quantity
                            const maxQuantity = Number(
                              form.getValues(
                                `bulkPricings.${index}.maxQuantity`,
                              ),
                            );
                            if (maxQuantity <= newValue) {
                              form.setError(
                                `bulkPricings.${index}.maxQuantity`,
                                {
                                  type: 'manual',
                                  message:
                                    'Max quantity must be greater than min quantity',
                                },
                              );
                            } else {
                              form.clearErrors(
                                `bulkPricings.${index}.maxQuantity`,
                              );
                            }
                          }}
                          className="h-10"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`bulkPricings.${index}.maxQuantity`}
                  render={({ field }) => (
                    <FormItem className="flex-1 block text-left">
                      <FormLabel>
                        Maximum Quantity (
                        {unitMapping[selectedCategory] || 'unit'})
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          step="1"
                          placeholder="Maximum Quantity"
                          value={field.value ?? ''}
                          onChange={(e) => {
                            const newValue = e.target.valueAsNumber;
                            field.onChange(newValue);
                            if (
                              index <
                              form.getValues('bulkPricings').length - 1
                            ) {
                              const nextMinQuantity = Number(
                                form.getValues(
                                  `bulkPricings.${index + 1}.minQuantity`,
                                ),
                              );
                              if (newValue >= nextMinQuantity) {
                                form.setError(
                                  `bulkPricings.${index}.maxQuantity`,
                                  {
                                    type: 'manual',
                                    message: `Must be less than next min quantity (${nextMinQuantity})`,
                                  },
                                );
                              } else {
                                form.clearErrors(
                                  `bulkPricings.${index}.maxQuantity`,
                                );
                              }
                            }
                            // Check if max quantity is more than min quantity
                            const minQuantity = Number(
                              form.getValues(
                                `bulkPricings.${index}.minQuantity`,
                              ),
                            );
                            if (newValue <= minQuantity) {
                              form.setError(
                                `bulkPricings.${index}.maxQuantity`,
                                {
                                  type: 'manual',
                                  message:
                                    'Max quantity must be greater than min quantity',
                                },
                              );
                            } else {
                              form.clearErrors(
                                `bulkPricings.${index}.maxQuantity`,
                              );
                            }
                          }}
                          className="h-10"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`bulkPricings.${index}.price`}
                  render={({ field }) => (
                    <FormItem className="flex-1 block text-left">
                      <FormLabel>
                        Price (per {unitMapping[selectedCategory] || 'unit'})
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          step="0.01"
                          placeholder="Price"
                          value={field.value ?? ''}
                          onChange={(e) => {
                            const newValue = e.target.valueAsNumber;
                            field.onChange(newValue);
                            if (index > 0) {
                              const prevPrice = Number(
                                form.getValues(
                                  `bulkPricings.${index - 1}.price`,
                                ),
                              );
                              if (newValue >= prevPrice) {
                                form.setError(`bulkPricings.${index}.price`, {
                                  type: 'manual',
                                  message: `Must be less than previous price (${prevPrice})`,
                                });
                              } else {
                                form.clearErrors(`bulkPricings.${index}.price`);
                              }
                            }
                          }}
                          className="h-10"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Remove Button */}
                <Button
                  variant="destructive"
                  className="self-end"
                  onClick={() => {
                    const bulkPricings = form.getValues('bulkPricings');
                    bulkPricings.splice(index, 1);
                    form.setValue('bulkPricings', bulkPricings);
                  }}
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}

          {/* Add Bulk Pricing Button */}
          <div className="flex justify-end w-full">
            <Button
              type="button"
              className="bg-transparent text-gray-500 hover:bg-transparent hover:text-black"
              onClick={() => {
                const bulkPricings = form.getValues('bulkPricings') || [];
                form.setValue('bulkPricings', [
                  ...bulkPricings,
                  { minQuantity: '', maxQuantity: '', price: '' },
                ]);
              }}
            >
              <AddIcon className="mr-2" />
              Add Bulk Pricing
            </Button>
          </div>

          {/* Batches */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold mb-4 text-left">Batch Details</h2>
            {form.watch('batches', []).map((batch, index) => (
              <div key={index}>
                <div className="flex space-x-4 items-start">
                  {' '}
                  {/* Use items-start to align inputs to the top */}
                  {/* Batch Quantity */}
                  <FormField
                    control={form.control}
                    name={`batches.${index}.quantity`}
                    render={({ field }) => (
                      <FormItem className="flex-1 block text-left">
                        <FormLabel>
                          Batch Quantity{' '}
                          {selectedCategory === 'CANNED_GOODS'
                            ? '(total number of cans)'
                            : `(total ${
                                unitMapping[selectedCategory] || 'units'
                              })`}
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            step="1"
                            placeholder="Quantity"
                            value={field.value ?? ''}
                            onChange={(e) =>
                              field.onChange(e.target.valueAsNumber)
                            }
                            className="h-10"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Best Before Date */}
                  <FormField
                    control={form.control}
                    name={`batches.${index}.bestBeforeDate`}
                    render={({ field }) => (
                      <FormItem className="block text-left flex-1">
                        <FormLabel>Best Before Date</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="date"
                            className="h-10"
                            min={getTodayDate()}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Remove Button */}
                  <Button
                    variant="destructive"
                    className="self-end"
                    onClick={() => {
                      const batches = form.getValues('batches');
                      batches.splice(index, 1);
                      form.setValue('batches', batches);
                    }}
                  >
                    Remove
                  </Button>
                </div>
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
              variant="secondary"
              type="submit"
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
