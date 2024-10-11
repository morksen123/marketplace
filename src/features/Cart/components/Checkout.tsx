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
import { useBuyerProfile } from '@/features/BuyerAccount/hooks/useBuyerProfile';
import {
  AddressElement,
  LinkAuthenticationElement,
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { MapPin } from 'lucide-react';
import React, { useState } from 'react';
import { useCart } from '../hooks/useCart';
import { SaveAddressPrompt } from './SaveAddressPrompt';
import { SelfPickupItems } from './selfPickUpItems';

export const Checkout: React.FC = () => {
  const stripe = useStripe();
  const elements = useElements();
  const {
    cart,
    cartPrice,
    isShippingAddressRequired,
    cartItemsThatRequireSelfPickUp,
    cartItemsExpiringSoon,
  } = useCart();

  const [shippingFee] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const {
    buyerProfile,
    isLoading: buyerProfileLoading,
    defaultBillingAddress,
    defaultShippingAddress,
  } = useBuyerProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    await stripe.confirmPayment({
      elements,
      confirmParams: {
        receipt_email: buyerProfile?.email,
        return_url: `${window.location.origin}/buyer/checkout/complete`,
      },
    });

    setIsLoading(false);
  };

  if (buyerProfileLoading) {
    return <LoadingSpinner />;
  }

  const showSaveAddressPrompt = !defaultShippingAddress;

  const showPickUpPrompt =
    (cartItemsThatRequireSelfPickUp &&
      cartItemsThatRequireSelfPickUp?.length > 0) ||
    (cartItemsExpiringSoon && cartItemsExpiringSoon?.length > 0);

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
                      {showSaveAddressPrompt && <SaveAddressPrompt />}
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
                          <AddressElement
                            options={{
                              mode: 'shipping',
                              allowedCountries: ['SG'],
                              fields: {
                                phone: 'always',
                              },
                              defaultValues: {
                                name: defaultShippingAddress?.buyerName,
                                address: {
                                  line1: defaultShippingAddress?.addressLine1,
                                  line2: defaultShippingAddress?.addressLine2,
                                  postal_code:
                                    defaultShippingAddress?.postalCode,
                                  country: 'SG',
                                },
                                phone: defaultShippingAddress?.phoneNumber,
                              },
                            }}
                          />
                        )}
                      </div>

                      {/* Billing Address */}
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-2">
                          Billing Address
                        </h3>
                        <AddressElement
                          options={{
                            mode: 'billing',
                            allowedCountries: ['SG'],
                            fields: {
                              phone: 'always',
                            },
                            defaultValues: {
                              name: defaultBillingAddress?.buyerName,
                              address: {
                                line1: defaultBillingAddress?.addressLine1,
                                line2: defaultBillingAddress?.addressLine2,
                                postal_code: defaultBillingAddress?.postalCode,
                                country: 'SG',
                              },
                              phone: defaultBillingAddress?.phoneNumber,
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
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">${cartPrice.toFixed(2)}</span>
                  </div>
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
                    <span>${(cartPrice + shippingFee).toFixed(2)}</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    type="submit"
                    variant="secondary"
                    className="w-full"
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
