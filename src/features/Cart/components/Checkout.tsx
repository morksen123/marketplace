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
import {
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { StripePaymentElementOptions } from '@stripe/stripe-js';
import React, { useState } from 'react';
import { useCart } from '../hooks/useCart';
import { AddressForm } from './AddressForm';

export const Checkout = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { cart, cartPrice } = useCart();

  const [useShippingForBilling, setUseShippingForBilling] = useState(false);
  const [shippingFee] = useState(0);

  const [paymentMessage, setPaymentMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/buyer/checkout/complete`,
      },
    });

    if (error.type === 'card_error' || error.type === 'validation_error') {
      setPaymentMessage(error.message || 'An unexpected error occurred.');
    } else {
      setPaymentMessage('An unexpected error occurred.');
    }

    setIsLoading(false);
  };

  const paymentElementOptions: StripePaymentElementOptions = {
    layout: 'tabs',
  };

  return (
    <div className="wrapper">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Checkout</h1>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <AddressForm title="Shipping Address" prefix="shipping" />

              <div className="mb-6">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="useShippingForBilling"
                    checked={useShippingForBilling}
                    onCheckedChange={() =>
                      setUseShippingForBilling(!useShippingForBilling)
                    }
                  />
                  <Label htmlFor="useShippingForBilling">
                    Use shipping address for billing
                  </Label>
                </div>
              </div>

              {!useShippingForBilling && (
                <AddressForm title="Billing Address" prefix="billing" />
              )}

              <PaymentElement
                id="payment-element"
                options={paymentElementOptions}
              />
            </div>
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-md"
                      />
                      <div className="flex-grow text-left">
                        <p className="font-medium">{item.name}</p>
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
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${cartPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>
                      {shippingFee === 0
                        ? 'Free'
                        : `$${shippingFee.toFixed(2)}`}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold">
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
        {paymentMessage && (
          <div
            className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded"
            role="alert"
          >
            {paymentMessage}
          </div>
        )}
      </div>
    </div>
  );
};
