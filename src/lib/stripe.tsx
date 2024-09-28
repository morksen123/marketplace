import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { post } from './api-client';

interface StripePaymentIntentData {
  amount: number;
  clientSecret: string;
  paymentIntentId: string;
}

const stripePromise = loadStripe(
  'pk_test_51Pzg2OP14CSbMBqVF7tQVEMIDNhzJlYxmC5yrBpOxOeqajaZ5UyuL9Z6NmnC6oYYCcvem45P7WoJoxNQ3XfLtBXU00PQKwmWEZ', // testing key
);

export const StripeWrapper = () => {
  const [clientSecret, setClientSecret] = useState('');
  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const { data, error } = await post<StripePaymentIntentData>(
          '/cart/checkout',
          {},
        );

        if (error) {
          console.error('Error creating payment intent:', error);
          return;
        }

        console.log(data);

        if (data) {
          setClientSecret(data.clientSecret);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
      }
    };

    createPaymentIntent();
  }, []);

  const appearance = {
    theme: 'stripe' as const,
  };

  const options = {
    clientSecret,
    appearance,
  };

  if (!clientSecret) {
    return <div>Loading Stripe Client...</div>;
  }

  return (
    <Elements options={options} stripe={stripePromise}>
      <Outlet />
    </Elements>
  );
};
