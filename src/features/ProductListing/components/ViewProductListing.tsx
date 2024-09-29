import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { Button } from '@/components/ui/button';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ElectricBolt from '@mui/icons-material/ElectricBolt';

import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined';
import {
  Carousel,
  CarouselItem,
  CarouselContent,
  CarouselPrevious,
  CarouselNext,
} from '@/components/ui/carousel';
import { useNavigate, useParams, Link } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import {
  foodCategoryMapping,
  foodConditionMapping,
  deliveryMethodMapping,
  unitMapping,
  Product,
  Batch,
  BulkPricing,
} from '@/features/ProductListing/constants';
import { handleSuccessApi, handleErrorApi } from '@/lib/api-client';
import { useProductBoosts } from '@/features/Promotions/hooks/useProductBoost';
import BoostProductModal from './BoostProductModal';
import { reactivateProductBoost } from '@/features/Promotions/lib/productboost';
import { Distributor } from '@/features/Home/constants';
import { useDistributor } from '@/features/DIstributorAccount/hooks/useDistributor';

export const ViewProductListing = () => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [distributor, setDistributor] = useState<Distributor | null>(null);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [bulkPricings, setBulkPricings] = useState<BulkPricing[]>([]);
  const [open, setOpen] = useState(false);
  const [openAddBatch, setOpenAddBatch] = useState(false);
  const [newBatchQuantity, setNewBatchQuantity] = useState('');
  const [newBatchBestBeforeDate, setNewBatchBestBeforeDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [openAddBulkPricing, setOpenAddBulkPricing] = useState(false);
  const [newBulkPrice, setNewBulkPrice] = useState({
    minQuantity: '',
    maxQuantity: '',
    price: '',
  });
  const { createBoost } = useProductBoosts();
  const [isBoostModalOpen, setIsBoostModalOpen] = useState(false);
  const { distributorProfile } = useDistributor();

  const [promotionalDiscount, setPromotionalDiscount] = useState<number>(0);
  const [discountedBulkPricing, setDiscountedBulkPricing] = useState<
    BulkPricing[]
  >([]);

  // const buyerId = 1; // To change

  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Add leading 0 if necessary
    const day = String(today.getDate()).padStart(2, '0'); // Add leading 0 if necessary
    return `${year}-${month}-${day}`;
  };

  const formatDisplayDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', options); // en-GB for British date formatting
  };

  const handleDateChange = (e) => {
    const dateValue = e.target.value;
    setNewBatchBestBeforeDate(dateValue);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/product/${productId}`);
        const data = await response.json();
        setProduct(data);
        setBatches(data.batches || []);
        setBulkPricings(data.bulkPricings || []);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleEdit = () => {
    navigate(`/edit-product-listing/${productId}`, { state: { product } });
  };

  // This actually deactivates the product not deletes
  const handleConfirmDeactivate = async () => {
    try {
      const response = await fetch(
        `/api/products/product/deactivate/${productId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        },
      );

      if (response.ok) {
        handleSuccessApi('Success!', 'Product has been deleted.');
        navigate('/distributor/home');
      } else {
        const errorMessage = await response.text();
        console.error('Error deleting product:', errorMessage);
        handleErrorApi('Error!', 'Failed to delete product.');
      }
    } catch (error) {
      console.error('Error occurred while deleting the product:', error);
    } finally {
      setOpen(false); // Close the delete dialog
    }
  };

  const handleAddBatch = async () => {
    if (newBatchQuantity && newBatchBestBeforeDate) {
      const batchData = {
        quantity: parseInt(newBatchQuantity),
        bestBeforeDate: newBatchBestBeforeDate,
      };

      try {
        // Make the API call to the backend to add the new batch
        const response = await fetch(
          `/api/products/product/${productId}/batch`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(batchData), // Send batch data as JSON
          },
        );

        if (response.ok) {
          const newBatch = await response.json();

          // Update the batches in the state with the new batch
          const updatedBatches = [...batches, newBatch];
          setBatches(updatedBatches);

          // Reset the form and close the dialog
          setOpenAddBatch(false);
          setNewBatchQuantity('');
          setNewBatchBestBeforeDate('');
          handleSuccessApi('Success!', 'Batch has been added.');
        } else {
          const errorMessage = await response.text();
          console.error('Error adding batch:', errorMessage);
          handleErrorApi('Error!', 'Failed to add batch.');
        }
      } catch (error) {
        console.error('Error occurred while adding the batch:', error);
        handleErrorApi('Error!', 'Failed to add batch.');
      }
    }
  };

  const handleDeleteBatch = async (batchId: Long) => {
    try {
      const response = await fetch(
        `/api/products/product/${productId}/batch?batchId=${batchId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        },
      );

      if (response.ok) {
        setBatches(batches.filter((batch) => batch.batchId !== batchId));
        handleSuccessApi('Success!', 'Batch has been deleted.');
      } else {
        const errorMessage = await response.text();
        handleErrorApi('Error!', 'Failed to delete batch.');
      }
    } catch (error) {
      console.error('Error deleting batch:', error);
      handleErrorApi('Error!', 'Failed to delete batch.');
    }
  };

  const handleAddBulkPricing = async () => {
    const { minQuantity, maxQuantity, price } = newBulkPrice;

    if (minQuantity && price) {
      const bulkPricingData = {
        minQuantity: parseInt(minQuantity),
        maxQuantity: maxQuantity ? parseInt(maxQuantity) : null,
        price: parseFloat(price),
      };

      try {
        console.log('hello');
        if (!validateBulkPricing(bulkPricingData)) {
          return;
        }

        const response = await fetch(
          `/api/products/product/${productId}/bulk-pricing`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(bulkPricingData),
          },
        );

        if (response.ok) {
          const newBulkPricing = await response.json();
          setBulkPricings([...bulkPricings, newBulkPricing]);
          setOpenAddBulkPricing(false);
          setNewBulkPrice({ minQuantity: '', maxQuantity: '', price: '' }); // Reset form
          handleSuccessApi('Success!', 'Bulk Pricing has been added.');
        } else {
          const errorMessage = await response.text();
          handleErrorApi('Error!', 'Failed to add bulk pricing.');
        }
      } catch (error) {
        console.error('Error adding bulk pricing:', error);
      }
    } else {
      alert('Please fill in all required fields');
    }
  };

  const validateBulkPricing = (newPricing) => {
    const { minQuantity, maxQuantity } = newPricing;

    if (maxQuantity && minQuantity > maxQuantity) {
      handleErrorApi(
        'Error!',
        'Minimum quantity cannot be greater than maximum quantity.',
      );
      return false;
    }

    for (const pricing of bulkPricings) {
      if (
        (minQuantity >= pricing.minQuantity &&
          minQuantity <= pricing.maxQuantity) ||
        (maxQuantity &&
          maxQuantity >= pricing.minQuantity &&
          maxQuantity <= pricing.maxQuantity)
      ) {
        handleErrorApi(
          'Error!',
          'The quantity range overlaps with an existing range.',
        );
        return false;
      }
    }

    return true;
  };

  const handleDeleteBulkPricing = async (id: Long) => {
    try {
      const response = await fetch(
        `/api/products/product/${productId}/bulk-pricing?bulkPricingId=${id}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        },
      );

      if (response.ok) {
        setBulkPricings(bulkPricings.filter((pricings) => pricings.id !== id));
        handleSuccessApi('Success!', 'Bulk Pricing has been deleted.');
      } else {
        const errorMessage = await response.text();
        handleErrorApi('Error!', 'Failed to delete bulk pricing.');
      }
    } catch (error) {
      console.error('Error deleting bulk pricing:', error);
      handleErrorApi('Error!', 'Failed to delete bulk pricing.');
    }
  };

  // Boost Product Functions
  const getButtonText = (status: string | null) => {
    if (distributorProfile?.boostCount === 0) return 'No More Boost';

    switch (status) {
      case 'ACTIVE':
        return 'Currently Boosted';
      case 'PAUSED':
        return 'Boost Paused';
      case 'COMPLETED':
        return 'Boost Again';
      case 'NONE':
      case null:
      default:
        return 'Boost This Product';
    }
  };

  const getButtonDisabledBoolean = (status: string | null) => {
    if (distributorProfile?.boostCount === 0) return true;

    switch (status) {
      case 'ACTIVE':
        return true;
      case 'PAUSED':
      case 'COMPLETED':
      case 'NONE':
      case null:
      default:
        return false;
    }
  };

  const handleBoostProduct = (startDate: string, endDate: string) => {
    if (productId) {
      if (product?.boostStatus === 'PAUSED') {
        reactivateProductBoost(parseInt(productId));
      } else {
        // Parse the dates
        const startDateTime = new Date(startDate);
        const endDateTime = new Date(endDate);

        // Set start time to 00:00:00
        startDateTime.setHours(0, 0, 0, 0);

        // Set end time to 23:59:59
        endDateTime.setHours(23, 59, 59, 999);

        // Convert to ISO strings
        const startDateISOString = startDateTime.toISOString();
        const endDateISOString = endDateTime.toISOString();
        createBoost({
          productId: parseInt(productId),
          boostData: {
            startDate: startDateISOString,
            endDate: endDateISOString,
          },
        });
      }

      // Refresh the page after 1 second
      setTimeout(() => {
        navigate(0);
      }, 500);
    }
  };

  // Promotional Functions
  // Function to calculate the promotional discount
  const calculatePromotionalDiscount = (product: Product): number => {
    if (!product.promotions || product.promotions.length === 0) return 0;

    const now = new Date();
    const activePromotions = product.promotions.filter(
      (promo) =>
        new Date(promo.startDate) <= now && new Date(promo.endDate) >= now,
    );

    if (activePromotions.length === 0) return 0;
    console.log(activePromotions);

    // Apply the highest discount
    return Math.max(
      ...activePromotions.map((promo) => promo.discountPercentage),
    );
  };

  // Function to apply discount to a price
  const applyDiscount = (price: number, discount: number): number => {
    return price * (1 - discount / 100);
  };

  useEffect(() => {
    if (product) {
      const discount = calculatePromotionalDiscount(product);
      setPromotionalDiscount(discount);

      // Update bulk pricing with discounts
      if (product.bulkPricings) {
        const updatedBulkPricing = product.bulkPricings.map((pricing) => ({
          ...pricing,
          discountedPrice: applyDiscount(pricing.price, discount),
        }));
        setDiscountedBulkPricing(updatedBulkPricing);
      }
    }
  }, [product]);

  if (loading) {
    return <div className="wrapper">Loading...</div>;
  }

  if (!product) {
    return <div className="wrapper">No product found</div>;
  }

  return (
    <div className="wrapper">
      {/* Carousel */}
      <Carousel className="w-full max-w-10xl mx-auto mb-6">
        <CarouselContent>
          {product.productPictures?.map((pictureUrl, index) => {
            if (index % 3 === 0) {
              return (
                <CarouselItem key={index}>
                  <div className="flex space-x-2">
                    {product.productPictures
                      .slice(index, index + 3)
                      .map((pic, idx) => (
                        <div key={idx} className="w-1/3 p-1">
                          <Card className="h-full rounded-lg border-none">
                            {' '}
                            {/* Added 'border-none' */}
                            <CardContent className="flex items-center justify-center h-full p-0">
                              <img
                                src={pic}
                                alt={`Product Image ${index + idx + 1}`}
                                className="object-cover w-full h-full rounded-lg"
                              />
                            </CardContent>
                          </Card>
                        </div>
                      ))}
                  </div>
                </CarouselItem>
              );
            }
            return null;
          })}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-left">
            {product.listingTitle}
          </h1>
          {/* Product Pricing */}
          <div className="flex items-baseline">
            {promotionalDiscount > 0 ? (
              <>
                <p className="text-2xl text-green-600 font-semibold text-left mr-2">
                  $
                  {applyDiscount(product.price, promotionalDiscount).toFixed(2)}
                </p>
                <p className="text-xl text-gray-500 line-through">
                  ${product.price.toFixed(2)}
                </p>
              </>
            ) : (
              <p className="text-2xl text-green-600 font-semibold text-left">
                ${product.price.toFixed(2)}
              </p>
            )}
            <span className="ml-2">
              per {unitMapping[product.foodCategory] || 'unit'}
            </span>
          </div>
        </div>
      </div>
      <div className="text-left">
        <hr className="border-gray-300 mb-6" />
        {/* Product Details */}
        <div className="text-left space-y-4">
          <h2 className="text-2xl font-semibold">Details</h2>

          <p>
            <strong>Food Condition: </strong>
            {foodConditionMapping[product.foodCondition] ||
              product.foodCondition}
          </p>
          <p>
            <strong>Food Category: </strong>
            {foodCategoryMapping[product.foodCategory] || product.foodCategory}
          </p>
          <p>
            <strong>Description: </strong>
            {product.description}
          </p>
          <p>
            <strong>Delivery Method: </strong>
            {deliveryMethodMapping[product.deliveryMethod] ||
              product.deliveryMethod}
          </p>
          {product.pickUpLocation && (
            <p>
              <strong>Pick Up Location: </strong>
              {product.pickUpLocation}
            </p>
          )}
          {product.weight != null && product.weight > 0 && (
            <p>
              <strong>Weight: </strong>
              {product.weight} kg
            </p>
          )}
          <p>
            <strong>Minimum Purchase Quantity: </strong>
            {product.minPurchaseQty}{' '}
            {unitMapping[product.foodCategory] || 'unit'}
          </p>
        </div>

        {/* Product Buttons */}
        <div className="mt-6 mb-6 flex justify-end items-end space-x-2">
          <Button className="button button-orange" onClick={handleEdit}>
            <EditIcon className="mr-2" /> Edit
          </Button>
          <Button className="button button-red" onClick={handleClickOpen}>
            <DeleteIcon className="mr-2" /> Delete
          </Button>
          <div className="flex flex-col items-end">
            <p className="text-s text-gray-600 mb-1">
              <Link
                to="/distributor/view-boosted-products"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Remaining Boosts: {distributorProfile?.boostCount ?? 0}
              </Link>
            </p>
            <Button
              variant="secondary"
              onClick={() => setIsBoostModalOpen(true)}
              disabled={getButtonDisabledBoolean(product.boostStatus)}
            >
              <ElectricBolt className="mr-2" />
              {getButtonText(product.boostStatus)}
            </Button>
          </div>
        </div>

        {/* Bulk Pricing Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Bulk Pricing</h2>
          <div className="overflow-hidden rounded-lg border border-gray-300 shadow-sm">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                    Min Quantity
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                    Max Quantity
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                    Price per {unitMapping[product.foodCategory] || 'unit'}
                  </th>
                  {promotionalDiscount > 0 && (
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                      Promotional Price
                    </th>
                  )}
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600 w-20">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {discountedBulkPricing.map((pricing, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                  >
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {pricing.minQuantity}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {pricing.maxQuantity || 'No limit'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {promotionalDiscount > 0 ? (
                        <span className="line-through">
                          ${pricing.price.toFixed(2)}
                        </span>
                      ) : (
                        `$${pricing.price.toFixed(2)}`
                      )}
                    </td>
                    {promotionalDiscount > 0 && (
                      <td className="px-4 py-3 text-sm text-green-600 font-semibold">
                        ${pricing.discountedPrice.toFixed(2)}
                      </td>
                    )}
                    <td className="px-4 py-3 text-sm text-gray-500 flex justify-center space-x-2">
                      <button
                        onClick={() => handleDeleteBulkPricing(pricing.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <DeleteIcon fontSize="small" />
                      </button>
                    </td>
                  </tr>
                ))}
                {openAddBulkPricing && (
                  <tr>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        value={newBulkPrice.minQuantity}
                        onChange={(e) =>
                          setNewBulkPrice({
                            ...newBulkPrice,
                            minQuantity: e.target.value,
                          })
                        }
                        className="w-full p-2 border rounded"
                        placeholder="Min Quantity"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        value={newBulkPrice.maxQuantity}
                        onChange={(e) =>
                          setNewBulkPrice({
                            ...newBulkPrice,
                            maxQuantity: e.target.value,
                          })
                        }
                        className="w-full p-2 border rounded"
                        placeholder="Max Quantity"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        value={newBulkPrice.price}
                        onChange={(e) =>
                          setNewBulkPrice({
                            ...newBulkPrice,
                            price: e.target.value,
                          })
                        }
                        className="w-full p-2 border rounded"
                        placeholder="Price"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center space-x-2 h-full">
                        <button
                          onClick={() => setOpenAddBulkPricing(false)}
                          className="bg-gray-300 text-gray-700 px-3 py-1 rounded hover:bg-gray-400"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleAddBulkPricing}
                          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                        >
                          Add
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end">
            {!openAddBulkPricing && (
              <button
                onClick={() => setOpenAddBulkPricing(true)}
                className="mt-4 text-gray-700"
              >
                <AddIcon /> Add Bulk Pricing
              </button>
            )}
          </div>
        </div>

        {/* Batches Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Batches</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {batches.map((batch, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition duration-300 ease-in-out relative"
              >
                <button
                  onClick={() => handleDeleteBatch(batch.batchId)}
                  className="absolute top-2 right-2 text-red-600 hover:text-red-800"
                >
                  <DeleteIcon />
                </button>
                <CardContent className="p-5">
                  <div className="mb-3">
                    <p className="text-sm text-gray-700 font-semibold">
                      Total Quantity
                    </p>
                    <p className="text-lg  text-gray-500">
                      {batch.quantity}{' '}
                      {unitMapping[product.foodCategory] || 'unit'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-700 font-semibold">
                      Best Before Date
                    </p>
                    <p className="text-lg text-gray-500">
                      {batch.bestBeforeDate
                        ? formatDisplayDate(batch.bestBeforeDate)
                        : 'Not specified'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
            {!openAddBatch ? (
              <Card className="hover:shadow-lg transition duration-300 ease-in-out flex items-center justify-center">
                <CardContent className="p-5 w-full h-full">
                  <button
                    className="w-full h-full bg-white text-black rounded-lg ease-in-out flex items-center justify-center"
                    onClick={() => setOpenAddBatch(true)}
                  >
                    <AddIcon className="mr-2" /> Add Batch
                  </button>
                </CardContent>
              </Card>
            ) : (
              <Card className="hover:shadow-lg transition duration-300 ease-in-out">
                <CardContent className="p-5">
                  <div className="mb-3">
                    <p className="text-sm text-gray-700 font-semibold">
                      Total Quantity
                    </p>
                    <input
                      type="number"
                      value={newBatchQuantity}
                      onChange={(e) => setNewBatchQuantity(e.target.value)}
                      className="w-full p-2 border rounded"
                      placeholder={`Quantity (${
                        unitMapping[product.foodCategory] || 'unit'
                      })`}
                    />
                  </div>
                  <div className="mb-3">
                    <p className="text-sm text-gray-700 font-semibold">
                      Best Before Date
                    </p>
                    <input
                      type="date"
                      value={newBatchBestBeforeDate}
                      onChange={handleDateChange}
                      className="w-full p-2 border rounded"
                      min={getTodayDate()}
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => setOpenAddBatch(false)}
                      className="bg-gray-300 text-gray-700 px-3 py-1 rounded hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddBatch}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    >
                      Add
                    </button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Delete Dialog */}
        <Dialog open={open} onClose={handleClose} className="wrapper">
          <DialogTitle>{'Confirm Deletion'}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this product listing? This action
              cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <button
              className="bg-white-600 text-black px-4 py-2 rounded-full flex items-center"
              onClick={handleClose}
            >
              Cancel
            </button>
            <button
              className="button button-red"
              onClick={handleConfirmDeactivate}
            >
              <DeleteIcon className="mr-2" /> Delete
            </button>
          </DialogActions>
        </Dialog>

        {/* Boost Product Dialog */}
        <BoostProductModal
          boostStatus={product.boostStatus}
          isOpen={isBoostModalOpen}
          onClose={() => setIsBoostModalOpen(false)}
          onSubmit={handleBoostProduct}
          productName={product.listingTitle}
        />
      </div>
    </div>
  );
};
