import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { createTransaction } from '@/features/Cart/api/api-cart';
import { useStripe } from '@stripe/react-stripe-js';
import { PaymentIntent } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type Status = PaymentIntent['status'];

const STATUS_CONTENT_MAP: Record<
  Status | 'default',
  {
    title: string;
    message: string;
    color: string;
  }
> = {
  succeeded: {
    title: 'Payment Successful',
    message: 'Thank you for your purchase!',
    color: 'text-green-600',
  },
  processing: {
    title: 'Payment Processing',
    message: 'Your payment is being processed. Please do not leave the page...',
    color: 'text-blue-600',
  },
  requires_payment_method: {
    title: 'Payment Failed',
    message: 'Your payment was not successful. Please try again.',
    color: 'text-red-600',
  },
  canceled: {
    title: 'Payment Canceled',
    message: 'Your payment has been canceled.',
    color: 'text-yellow-600',
  },
  requires_action: {
    title: 'Action Required',
    message: 'Additional action is required to complete your payment.',
    color: 'text-yellow-600',
  },
  requires_capture: {
    title: 'Payment Authorized',
    message: 'Your payment has been authorized and is awaiting capture.',
    color: 'text-blue-600',
  },
  requires_confirmation: {
    title: 'Confirmation Needed',
    message: 'Your payment requires confirmation. Please wait...',
    color: 'text-yellow-600',
  },
  default: {
    title: 'Payment Status',
    message:
      'We encountered an issue processing your payment. Please try again.',
    color: 'text-red-600',
  },
};

const PaymentDetailsSkeleton = () => (
  <>
    <div className="space-y-2">
      <div className="flex justify-between">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <div className="flex justify-between">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/4" />
      </div>
      <div className="flex justify-between">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/4" />
      </div>
    </div>
    <div className="flex justify-center space-x-6 mt-6">
      <Skeleton className="h-10 w-32" />
      <Skeleton className="h-10 w-32" />
    </div>
  </>
);

export const CheckoutComplete: React.FC = () => {
  const stripe = useStripe();
  const [status, setStatus] = useState<Status | 'default'>('processing');
  const [paymentIntent, setPaymentIntent] = useState<PaymentIntent | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      'payment_intent_client_secret',
    );

    if (!clientSecret) {
      setIsLoading(false);
      return;
    }

    stripe
      .retrievePaymentIntent(clientSecret)
      .then(({ paymentIntent }) => {
        if (paymentIntent) {
          setStatus(paymentIntent.status);
          setPaymentIntent(paymentIntent);

          if (paymentIntent.status === 'succeeded') {
            return createTransaction(paymentIntent.id);
          }
        }
      })
      .then(() => {
        console.log('Payment process completed');
      })
      .catch((err) => {
        console.error('Error processing payment intent:', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [stripe]);

  const statusContent = STATUS_CONTENT_MAP[status];

  return (
    <div className="wrapper">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className={`text-center ${statusContent.color}`}>
              {statusContent.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center">{statusContent.message}</p>
            <Separator />
            {isLoading ? (
              <PaymentDetailsSkeleton />
            ) : (
              <>
                {paymentIntent && (
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Payment ID:</span>
                      <span>{paymentIntent.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Amount:</span>
                      <span>${(paymentIntent.amount / 100).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Status:</span>
                      <span className="capitalize">{status}</span>
                    </div>
                  </div>
                )}
                <div className="flex justify-center space-x-6 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => navigate('/buyer/home')}
                    disabled={status === 'processing'}
                  >
                    Return to Home
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => navigate('/buyer/transactions')}
                    disabled={status === 'processing'}
                  >
                    View Transactions
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
