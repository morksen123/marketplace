import { post } from '@/lib/api-client';
import { useEffect, useState } from 'react';

export const useStripeSetup = () => {
  const [clientSecret, setClientSecret] = useState<string>('');
  const [dpmCheckerLink, setDpmCheckerLink] = useState<string>('');

  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const amount = 1000; // $10.00 in cents
        const distributorId = 1; // Replace with actual distributor ID

        const { data, error } = await post(
          `/payments/create-payment-intent?amount=${amount}&distributorId=${distributorId}`,
          null, // No body needed, params are in the URL
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
  }, []);

  return { clientSecret, dpmCheckerLink };
};
