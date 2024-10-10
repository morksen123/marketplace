import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';

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
        const response = await fetch('/api/cart/checkout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        if (response.ok) {
          const data = (await response.json()) as StripePaymentIntentData;
          console.log(data);
          setClientSecret(data.clientSecret);
        } else {
          window.location.href = '/buyer/cart';
        }
      } catch (error) {
        console.error('Error fetching buyer ID:', error);
      }
    };
    createPaymentIntent();
  }, []);

  const appearance = {
    theme: 'stripe' as const,
    variables: {
      colorPrimary: '#017A37', // Set the primary color as --secondary green
    },
  };

  const options = {
    clientSecret,
    appearance,
  };

  if (!clientSecret) {
    return <LoadingSpinner />;
  }

  return (
    <Elements options={options} stripe={stripePromise}>
      <Outlet />
    </Elements>
  );
};
