import { useCart } from '@/features/Cart/hooks/useCart';
import { post } from '@/lib/api-client';
import { useEffect, useState } from 'react';

interface StripePaymentIntentData {
  client_secret: string;
}

export const useStripePaymentInit = () => {
  const [clientSecret, setClientSecret] = useState<string>('');
  const [dpmCheckerLink] = useState<string>('');
  const { cartPrice } = useCart();

  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const { data, error } = await post<StripePaymentIntentData>(
          `/payments/create-payment-intent?amount=${cartPrice}&distributorId=${2}`, // dummy distributor ID
          {}, // No body needed, params are in the URL
        );

        if (error) {
          console.error('Error creating payment intent:', error);
          return;
        }

        if (data) {
          setClientSecret(data.client_secret);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
      }
    };

    createPaymentIntent();
  }, [cartPrice]);

  return { clientSecret, dpmCheckerLink };
};
