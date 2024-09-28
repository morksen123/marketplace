import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useBuyerProfile } from '@/features/BuyerAccount/hooks/useBuyerProfile';
import {
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import React, { useState } from 'react';
import { useCart } from '../hooks/useCart';
import { AddressForm, AddressFormState } from './AddressForm';

const initialAddressState: AddressFormState = {
  firstName: '',
  lastName: '',
  address: '',
  zipCode: '',
  country: '',
};

export const Checkout: React.FC = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { cart, cartPrice } = useCart();

  const [shippingAddress, setShippingAddress] =
    useState<AddressFormState>(initialAddressState);
  const [billingAddress, setBillingAddress] =
    useState<AddressFormState>(initialAddressState);
  const [useShippingForBilling, setUseShippingForBilling] = useState(true);
  const [shippingFee] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { buyerProfile } = useBuyerProfile();

  const handleShippingChange = (
    field: keyof AddressFormState,
    value: string,
  ) => {
    setShippingAddress((prev) => ({ ...prev, [field]: value }));
  };

  const handleBillingChange = (
    field: keyof AddressFormState,
    value: string,
  ) => {
    setBillingAddress((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/buyer/checkout/complete`,
        payment_method_data: {
          billing_details: {
            name: `${billingAddress.firstName} ${billingAddress.lastName}`,
            address: {
              line1: billingAddress.address,
              postal_code: billingAddress.zipCode,
              country: billingAddress.country,
              city: billingAddress.country,
            },
          },
        },
      },
    });

    setIsLoading(false);
  };

  return (
    <div className="wrapper">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-extrabold text-center text-gray-900 mb-8">
          Checkout
        </h1>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              <AddressForm
                title="Shipping Address"
                state={shippingAddress}
                onChange={handleShippingChange}
              />

              <div className="flex items-center space-x-2 bg-white p-4 rounded-lg ">
                <Checkbox
                  id="useShippingForBilling"
                  checked={useShippingForBilling}
                  onCheckedChange={(checked: boolean) => {
                    setUseShippingForBilling(checked);
                    if (checked) {
                      setBillingAddress(shippingAddress);
                    }
                  }}
                />
                <Label
                  htmlFor="useShippingForBilling"
                  className="text-sm font-medium text-gray-700"
                >
                  Use this address for billing
                </Label>
              </div>

              {!useShippingForBilling && (
                <AddressForm
                  title="Billing Address"
                  state={billingAddress}
                  onChange={handleBillingChange}
                />
              )}

              <Card>
                <CardHeader>
                  <CardTitle>Payment Details</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* <PaymentElement id="payment-element" /> */}
                  {buyerProfile && (
                    <PaymentElement
                      id="payment-element"
                      options={{
                        defaultValues: {
                          billingDetails: {
                            email: buyerProfile.email,
                            name:
                              buyerProfile.firstName +
                              ' ' +
                              buyerProfile.lastName,
                            address: {
                              postal_code: '100',
                            },
                          },
                        },
                      }}
                    />
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
                    {isLoading ? 'Processing...' : 'Place Order'}
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
