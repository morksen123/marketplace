import { useStripeSetup } from '@/hooks/useStripeSetup';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Outlet } from 'react-router-dom';

const stripePromise = loadStripe(
  'pk_live_51Pzeki09dtdSD0SknbeaEa37N9csq3Hzw3eGLgoxkR2eQwXsRZNp7Q0mrFI3jJbIe0uCcfX5v665bSuThsdfvAx800hO7SuN1z', // testing key
);

export const StripeWrapper = () => {
  const { clientSecret } = useStripeSetup();

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
