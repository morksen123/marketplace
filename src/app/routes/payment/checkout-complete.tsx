import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useStripe } from '@stripe/react-stripe-js';
import { PaymentIntent } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';

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
    message: 'Your payment is being processed. Please wait...',
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

export const CheckoutComplete = () => {
  const stripe = useStripe();
  const [status, setStatus] = useState<Status | 'default'>('processing');
  const [paymentIntent, setPaymentIntent] = useState<PaymentIntent | null>(
    null,
  );

  useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      'payment_intent_client_secret',
    );

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      if (paymentIntent) {
        setStatus(paymentIntent.status);
        setPaymentIntent(paymentIntent);
      }
    });
  }, [stripe]);

  const statusContent = STATUS_CONTENT_MAP[status];

  return (
    <div className="wrapper">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          Checkout Complete
        </h1>
        <Card>
          <CardHeader>
            <CardTitle className={`text-center ${statusContent.color}`}>
              {statusContent.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center">{statusContent.message}</p>
            {paymentIntent && (
              <>
                <Separator />
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
              </>
            )}
          </CardContent>
          <CardFooter className="flex justify-center space-x-4">
            <Button
              variant="outline"
              onClick={() => (window.location.href = '/')}
            >
              Return to Home
            </Button>
            {paymentIntent && <Button>View Details</Button>}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
