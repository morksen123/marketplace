import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ElectricBolt from '@mui/icons-material/ElectricBolt';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { useEffect, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { useDistributor } from '@/features/DIstributorAccount/hooks/useDistributor';
import { ProductReviews } from '@/features/Feedback/components/ProductReviews';
import { EditBatchModal } from '@/features/InventoryManagement/components/EditBatchModal';
import {
  Batch,
  BulkPricing,
  deliveryMethodMapping,
  foodCategoryMapping,
  foodConditionMapping,
  Product,
  unitMapping,
} from '@/features/ProductListing/constants';
import { useProductBoosts } from '@/features/Promotions/hooks/useProductBoost';
import { handleErrorApi, handleSuccessApi } from '@/lib/api-client';
import { Link, useNavigate, useParams } from 'react-router-dom';
import BoostProductModal from './BoostProductModal';

export const ViewProductListing = () => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
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
  const { createBoost, updateBoost, reactivateBoost } = useProductBoosts();
  const [isBoostModalOpen, setIsBoostModalOpen] = useState(false);
  const { distributorProfile } = useDistributor();

  const [promotionalDiscount, setPromotionalDiscount] = useState<number>(0);
  const [discountedBulkPricing, setDiscountedBulkPricing] = useState<
    BulkPricing[]
  >([]);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);

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
        setBatches((data.batches || []).filter(batch => batch.isActive));
        setBulkPricings(data.bulkPricings || []);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, location]);

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
    console.log(status);
    switch (status) {
      case 'ACTIVE':
        return 'Currently Boosted';
      case 'PAUSED':
        return 'Boost Paused';
      case 'COMPLETED':
        return 'Boost Again';
      case 'NOT_STARTED':
        return 'Boost has not started';
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

  const handleBoostProduct = (startDate: string) => {
    if (productId) {
      if (product?.boostStatus === 'PAUSED') {
        reactivateBoost(parseInt(productId));
      } else {
        // Parse the dates
        const startDateTime = new Date(startDate);

        // Set start time to 00:00:00
        startDateTime.setHours(0, 0, 0, 0);

        // Calculate end date (30 days from start date)
        const endDateTime = new Date(startDateTime);
        endDateTime.setDate(endDateTime.getDate() + 30);
        // Set end time to 23:59:59
        endDateTime.setHours(23, 59, 59, 999);

        // Convert to ISO strings
        const startDateISOString = startDateTime.toISOString();
        const endDateISOString = endDateTime.toISOString();

        if (product?.boostStatus === 'NONE') {
          createBoost({
            productId: parseInt(productId),
            boostData: {
              startDate: startDateISOString,
              endDate: endDateISOString,
            },
          });
        } else if (product?.boostStatus === 'NOT_STARTED') {
          updateBoost({
            productId: parseInt(productId),
            boostData: {
              startDate: startDateISOString,
              endDate: endDateISOString,
            },
          });
        }
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

  const handleEditPromotion = (promotionId: number) => {
    navigate(`/distributor/promotions/${promotionId}`, {
      state: { from: 'product', productId },
    });
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

  const handleEditClick = (batch: Batch) => {
    setSelectedBatch(batch);
    setEditModalOpen(true);
  };

  const handleEditSave = async (updatedBatch: Batch) => {
    try {
      const response = await fetch(`/api/products/product/${productId}/batch`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(updatedBatch),
      });

      if (response.ok) {
        const updatedBatches = batches.map((batch) =>
          batch.batchId === updatedBatch.batchId ? updatedBatch : batch,
        );
        setBatches(updatedBatches);
        handleSuccessApi('Success!', 'Batch has been updated.');
      } else {
        console.error('Failed to update batch');
        handleErrorApi('Error!', 'Failed to update batch.');
      }
    } catch (error) {
      console.error('Error updating batch:', error);
      handleErrorApi('Error!', 'Failed to update batch.');
    } finally {
      setEditModalOpen(false);
    }
  };

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
          <Button variant="orange" onClick={handleEdit}>
            <EditIcon className="mr-2" /> Edit
          </Button>
          <Button variant="destructive" onClick={handleClickOpen}>
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
                        $
                        {pricing.price *
                          (1 - promotionalDiscount / 100).toFixed(2)}
                      </td>
                    )}
                    <td className="px-4 py-3 text-sm text-gray-500 flex justify-center space-x-2">
                      <Button
                        onClick={() => handleDeleteBulkPricing(pricing.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <DeleteIcon fontSize="small" />
                      </Button>
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
          <div className="overflow-hidden rounded-lg border border-gray-300 shadow-sm">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                    Total Quantity
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                    Best Before Date
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                    Days to Expiry
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600 w-20">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {batches
                  .sort((a, b) => {
                    const aExpired = new Date(a.bestBeforeDate) < new Date();
                    const bExpired = new Date(b.bestBeforeDate) < new Date();
                    if (aExpired && !bExpired) return 1;
                    if (!aExpired && bExpired) return -1;
                    return (
                      new Date(a.bestBeforeDate).getTime() -
                      new Date(b.bestBeforeDate).getTime()
                    );
                  })
                  .map((batch, index) => {
                    const daysToExpiry = Math.ceil(
                      (new Date(batch.bestBeforeDate).getTime() -
                        new Date().getTime()) /
                        (1000 * 3600 * 24),
                    );
                    let alertClass = '';
                    let alertBadge = null;
                    const isExpired = daysToExpiry <= 0;

                    if (isExpired) {
                      alertClass = 'text-gray-500';
                      alertBadge = (
                        <Badge className="bg-gray-500 text-white">
                          Not Available for Sale
                        </Badge>
                      );
                    } else if (daysToExpiry <= 3) {
                      alertClass = 'text-red-600 font-bold';
                      alertBadge = (
                        <Badge className="bg-red-500 text-white">Urgent</Badge>
                      );
                    } else if (daysToExpiry <= 7) {
                      alertClass = 'text-orange-600 font-bold';
                      alertBadge = (
                        <Badge className="bg-orange-500 text-white">
                          Warning
                        </Badge>
                      );
                    } else if (daysToExpiry <= 14) {
                      alertClass = 'text-yellow-600 font-bold';
                      alertBadge = (
                        <Badge className="bg-yellow-500 text-white">
                          Near Expiry
                        </Badge>
                      );
                    } else {
                      alertClass = 'text-gray-500';
                    }

                    return (
                      <tr
                        key={index}
                        className={`${
                          index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                        } ${isExpired ? 'text-gray-400' : ''}`}
                      >
                        <td className="px-4 py-3 text-sm text-gray-500">
                          {batch.quantity}{' '}
                          {unitMapping[product.foodCategory] || 'unit'}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          {batch.bestBeforeDate
                            ? formatDisplayDate(batch.bestBeforeDate)
                            : 'Not specified'}
                        </td>
                        <td className={`px-4 py-3 text-sm ${alertClass}`}>
                          <div className="flex items-center space-x-2">
                            <span>
                              {isExpired ? 'Expired' : `${daysToExpiry} days`}
                            </span>
                            {alertBadge}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500 flex justify-center space-x-2">
                          <Button
                            onClick={() => handleEditClick(batch)}
                            className="text-blue-600 hover:text-blue-800"
                            disabled={isExpired}
                          >
                            <EditIcon fontSize="small" />
                          </Button>
                          <Button
                            onClick={() => handleDeleteBatch(batch.batchId)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <DeleteIcon fontSize="small" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                {openAddBatch && (
                  <tr>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        value={newBatchQuantity}
                        onChange={(e) => setNewBatchQuantity(e.target.value)}
                        className="w-full p-2 border rounded"
                        placeholder={`Quantity (${
                          unitMapping[product.foodCategory] || 'unit'
                        })`}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="date"
                        value={newBatchBestBeforeDate}
                        onChange={handleDateChange}
                        className="w-full p-2 border rounded"
                        min={getTodayDate()}
                      />
                    </td>
                    <td className="px-4 py-3">
                      {/* Placeholder for days to expiry */}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center space-x-2 h-full">
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
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end">
            {!openAddBatch && (
              <button
                onClick={() => setOpenAddBatch(true)}
                className="mt-4 text-gray-700"
              >
                <AddIcon /> Add Batch
              </button>
            )}
          </div>
        </div>

        {/* comment section */}
        <div className="mt-8">
          <ProductReviews productId={Number(productId)} />
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

        {/* Active Promotions Section */}
        {product.promotions && product.promotions.length > 0 && (
          <div className="mt-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Promotions</h2>
              <Link
                to="/distributor/promotions"
                className="flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200"
              >
                <VisibilityIcon className="mr-2" />
                View All Promotions
              </Link>
            </div>
            <div className="overflow-hidden rounded-lg border border-gray-300 shadow-sm">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                      Promotion Name
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                      Discount
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                      Start Date
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                      End Date
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600 w-20">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {product.promotions.map((promo, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                    >
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {promo.promotionName}
                      </td>
                      <td className="px-4 py-3 text-sm text-green-600 font-semibold">
                        {promo.discountPercentage}% off
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {new Date(promo.startDate).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {new Date(promo.endDate).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500 flex justify-center">
                        <Button
                          onClick={() => handleEditPromotion(promo.promotionId)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <EditIcon fontSize="small" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Boost Product Dialog */}
        <BoostProductModal
          boostStatus={product.boostStatus}
          isOpen={isBoostModalOpen}
          onClose={() => setIsBoostModalOpen(false)}
          onSubmit={handleBoostProduct}
          productName={product.listingTitle}
        />

        {/* Edit Batch Modal */}
        <EditBatchModal
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          batch={selectedBatch}
          onSave={handleEditSave}
        />
      </div>
    </div>
  );
};
