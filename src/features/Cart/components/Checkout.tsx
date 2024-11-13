import {
  LoadingSpinner,
  LoadingSpinnerSvg,
} from '@/components/common/LoadingSpinner';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Address } from '@/features/BuyerAccount/hooks/useAddress';
import { useBuyerProfile } from '@/features/BuyerAccount/hooks/useBuyerProfile';
import { setShippingAddressForOrder } from '@/features/BuyerAccount/lib/address';
import { transformStripeAddressToAddress } from '@/lib/utils';
import {
  AddressElement,
  LinkAuthenticationElement,
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { StripeAddressElementChangeEvent } from '@stripe/stripe-js';
import { MapPin } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useCart } from '../hooks/useCart';
import { SavedAddressDropdown } from './SavedAddressDropdown';
import { SelfPickupItems } from './selfPickUpItems';

export const Checkout: React.FC = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { cart, isShippingAddressRequired, cartItemsThatRequireSelfPickUp } =
    useCart();

  const {
    buyerProfile,
    isLoading: buyerProfileLoading,
    defaultBillingAddress,
    defaultShippingAddress,
  } = useBuyerProfile();

  const [shippingFee] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedShippingAddress, setSelectedShippingAddress] =
    useState<Address>();
  const [selectedBillingAddress, setSelectedBillingAddress] =
    useState<Address>();
  const [calculatedTotal, setCalculatedTotal] = useState(0);
  const [adminPromotionAmount, setAdminPromotionAmount] = useState(0);
  const [originalTotal, setOriginalTotal] = useState(0);
  const [bulkPricingDiscount, setBulkPricingDiscount] = useState(0);

  useEffect(() => {
    if (defaultBillingAddress) {
      setSelectedBillingAddress(defaultBillingAddress);
    }

    if (defaultShippingAddress) {
      setSelectedShippingAddress(defaultShippingAddress);
    }
  }, [defaultBillingAddress, defaultShippingAddress]);

  const handleAddressDropdownChange =
    (mode: 'shipping' | 'billing') => (addressId: string) => {
      const selectedAddress = buyerProfile?.shippingAddresses?.find(
        (addr) => addr.shippingAddressId?.toString() === addressId,
      );
      if (selectedAddress) {
        if (mode === 'shipping') {
          setSelectedShippingAddress(selectedAddress);
        } else {
          setSelectedBillingAddress(selectedAddress);
        }
      }
    };

  const handleAddressInputChange = (
    e: StripeAddressElementChangeEvent,
    mode: 'shipping' | 'billing',
  ) => {
    const setAddress =
      mode === 'shipping'
        ? setSelectedShippingAddress
        : setSelectedBillingAddress;

    setAddress((prev: Address | undefined) => {
      if (e.complete) {
        const transformedAddress = transformStripeAddressToAddress(
          e.value,
          prev,
        );
        return transformedAddress;
      }
      return prev;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    if (selectedShippingAddress && selectedShippingAddress.shippingAddressId) {
      await setShippingAddressForOrder(
        selectedShippingAddress.shippingAddressId,
      );
    }

    await stripe.confirmPayment({
      elements,
      confirmParams: {
        receipt_email: buyerProfile?.email,
        return_url: `${window.location.origin}/buyer/checkout/complete`,
      },
    });

    setIsLoading(false);
  };

  const fetchCalculatedTotal = async () => {
    try {
      const response = await fetch('/api/cart/calculate-total', {
        method: 'GET',
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setCalculatedTotal(data.cartTotal);
      setAdminPromotionAmount(data.adminPromotionAmount);
    } catch (error) {
      console.error('Error fetching calculated total:', error);
    }
  };

  useEffect(() => {
    fetchCalculatedTotal();
  }, []);

  useEffect(() => {
    calculateTotals();
  }, [cart]);

  const calculateTotals = () => {
    let originalSum = 0;
    let discountedSum = 0;

    cart?.cartLineItems.forEach((item) => {
      const originalItemTotal = item.product.price * item.quantity;
      const discountedItemTotal = item.price * item.quantity;

      originalSum += originalItemTotal;
      discountedSum += discountedItemTotal;
    });

    setOriginalTotal(originalSum);
    setBulkPricingDiscount(originalSum - discountedSum);
  };

  if (buyerProfileLoading) {
    return <LoadingSpinner />;
  }

  const showPickUpPrompt =
    cartItemsThatRequireSelfPickUp &&
    cartItemsThatRequireSelfPickUp?.length > 0;

  return (
    <div className="wrapper mb-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-extrabold text-center text-gray-900 mb-8">
          Checkout
        </h1>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 text-left">
                  {buyerProfile && (
                    <>
                      {/* Link Authentication */}
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-2">
                          Account Information
                        </h3>
                        <LinkAuthenticationElement
                          id="link-authentication-element"
                          options={{
                            defaultValues: { email: buyerProfile.email },
                          }}
                        />
                      </div>

                      {/* Shipping Address */}
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-2">
                          Shipping Address
                        </h3>
                        {showPickUpPrompt && (
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4 shadow-sm mb-2">
                            <div className="flex items-center">
                              <div className="bg-green-100 rounded-full p-2 mr-4">
                                <MapPin className="text-secondary" size={24} />
                              </div>
                              <div>
                                <p className="text-secondary font-semibold text-sm">
                                  Self Pick-up
                                </p>
                                <SelfPickupItems />
                              </div>
                            </div>
                          </div>
                        )}
                        {isShippingAddressRequired && (
                          <>
                            <SavedAddressDropdown
                              mode="shipping"
                              onAddressChange={handleAddressDropdownChange(
                                'shipping',
                              )}
                            />
                            <AddressElement
                              key={`shipping-${selectedShippingAddress?.shippingAddressId}`}
                              onChange={(e) =>
                                handleAddressInputChange(e, 'shipping')
                              }
                              options={{
                                mode: 'shipping',
                                allowedCountries: ['SG'],
                                fields: {
                                  phone: 'always',
                                },
                                defaultValues: selectedShippingAddress && {
                                  name: selectedShippingAddress.buyerName || '',
                                  address: {
                                    line1:
                                      selectedShippingAddress.addressLine1 ||
                                      '',
                                    line2:
                                      selectedShippingAddress.addressLine2 ||
                                      '',
                                    postal_code:
                                      selectedShippingAddress.postalCode || '',
                                    country: 'SG',
                                  },
                                  phone:
                                    selectedShippingAddress.phoneNumber || '',
                                },
                              }}
                            />
                          </>
                        )}
                      </div>

                      {/* Billing Address */}
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-2">
                          Billing Address
                        </h3>
                        <SavedAddressDropdown
                          mode="billing"
                          onAddressChange={handleAddressDropdownChange(
                            'billing',
                          )}
                        />
                        <AddressElement
                          key={`billing-${selectedBillingAddress?.shippingAddressId}`}
                          onChange={(e) =>
                            handleAddressInputChange(e, 'billing')
                          }
                          options={{
                            mode: 'billing',
                            allowedCountries: ['SG'],
                            fields: {
                              phone: 'always',
                            },
                            defaultValues: selectedBillingAddress && {
                              name: selectedBillingAddress?.buyerName,
                              address: {
                                line1: selectedBillingAddress?.addressLine1,
                                line2: selectedBillingAddress?.addressLine2,
                                postal_code: selectedBillingAddress?.postalCode,
                                country: 'SG',
                              },
                              phone: selectedBillingAddress?.phoneNumber,
                            },
                          }}
                        />
                      </div>

                      {/* Payment Details */}
                      <div>
                        <h3 className="text-lg font-semibold mb-2">
                          Payment Details
                        </h3>
                        <PaymentElement
                          id="payment-element"
                          options={{
                            defaultValues: {
                              billingDetails: {
                                email: buyerProfile.email,
                                name: `${buyerProfile.firstName} ${buyerProfile.lastName}`,
                              },
                            },
                          }}
                        />
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {cart?.cartLineItems.map((item) => (
                    <div
                      key={item.cartLineItemId}
                      className="flex items-center space-x-4"
                    >
                      <img
                        src={item.product.productPictures[0]}
                        alt={item.product.listingTitle}
                        className="w-12 h-12 object-cover rounded-md"
                      />
                      <div className="flex-grow text-left">
                        <p className="font-medium">
                          {item.product.listingTitle}
                        </p>
                        <p className="text-sm text-gray-500">
                          Qty: {item.quantity} x ${item.price.toFixed(2)}
                        </p>
                      </div>
                      <p className="font-medium">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                  <Separator />
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Original Total</span>
                    <span className="font-medium">
                      ${originalTotal.toFixed(2)}
                    </span>
                  </div>
                  {bulkPricingDiscount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Item Discounts</span>
                      <span>-${bulkPricingDiscount.toFixed(2)}</span>
                    </div>
                  )}
                  {adminPromotionAmount > 0 && (
                    <div className="flex justify-between text-sm text-orange-600">
                      <span>Sitewide Promotion</span>
                      <span>-${adminPromotionAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">
                      {shippingFee === 0
                        ? 'Free'
                        : `$${shippingFee.toFixed(2)}`}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${calculatedTotal.toFixed(2)}</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    type="submit"
                    variant="secondary"
                    className="w-full button-green"
                    disabled={isLoading || !stripe || !elements}
                  >
                    {isLoading ? (
                      <LoadingSpinnerSvg size={24} />
                    ) : (
                      'Place Order'
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
