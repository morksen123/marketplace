import { useStripePaymentInit } from '@/hooks/useStripePaymentInit';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Outlet } from 'react-router-dom';

const stripePromise = loadStripe(
  'pk_test_51Pzg2OP14CSbMBqVF7tQVEMIDNhzJlYxmC5yrBpOxOeqajaZ5UyuL9Z6NmnC6oYYCcvem45P7WoJoxNQ3XfLtBXU00PQKwmWEZ', // testing key
);

export const StripeWrapper = () => {
  const { clientSecret } = useStripePaymentInit();

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
