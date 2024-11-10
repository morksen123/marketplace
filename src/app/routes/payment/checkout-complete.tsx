import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { createTransaction } from '@/features/Cart/api/api-cart';
import { PlatformRatingForm } from '@/features/Feedback/components/PlatformReview/PlatformRatingForm';
import {
  useCreatePlatformRating,
  usePlatformRatingEligibility,
} from '@/features/Feedback/hooks/usePlatformRating';
import { CreatePlatformRatingRequest } from '@/features/Feedback/types/review-types';
import { PaymentDetailsSkeleton } from '@/features/Payment/components/PaymentDetailsSkeleton';
import { useStripe } from '@stripe/react-stripe-js';
import { PaymentIntent } from '@stripe/stripe-js';
import { CheckIcon } from 'lucide-react';
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

export const CheckoutComplete: React.FC = () => {
  const stripe = useStripe();
  const [status, setStatus] = useState<Status | 'default'>('processing');
  const [paymentIntent, setPaymentIntent] = useState<PaymentIntent | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [showRating, setShowRating] = useState(false);
  const navigate = useNavigate();

  const { data: eligibility, isLoading: isEligibilityLoading } =
    usePlatformRatingEligibility();

  const createRating = useCreatePlatformRating();

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

  useEffect(() => {
    if (
      status === 'succeeded' &&
      !isLoading &&
      !isEligibilityLoading &&
      eligibility?.canRate
    ) {
      const timer = setTimeout(() => {
        setShowRating(true);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [status, isLoading, isEligibilityLoading, eligibility]);

  const handleRatingSubmit = async (data: CreatePlatformRatingRequest) => {
    await createRating.mutateAsync(data);
    setShowRating(false);
    navigate('/buyer/transactions');
  };

  const statusContent = STATUS_CONTENT_MAP[status];

  return (
    <div className="wrapper py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Payment Status Card */}
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
              </>
            )}
          </CardContent>
        </Card>

        {/* Rating Section */}
        {status === 'succeeded' && !isLoading && showRating && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Card>
              <CardHeader className="text-center space-y-2">
                <div className="h-12 w-12 rounded-full bg-green-100 mx-auto flex items-center justify-center">
                  <CheckIcon className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Help Us Reduce Food Waste</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Your feedback helps us improve and make a bigger impact on
                  reducing food waste.
                </p>
              </CardHeader>
              <CardContent>
                <PlatformRatingForm onSubmit={handleRatingSubmit} />
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setShowRating(false);
                    navigate('/buyer/transactions');
                  }}
                >
                  Skip for now
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}

        {/* Navigation Buttons */}
        {status === 'succeeded' && !isLoading && !showRating && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-center space-x-4">
                <Button
                  variant="outline"
                  onClick={() => navigate('/buyer/home')}
                >
                  Return to Home
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => navigate('/buyer/transactions')}
                >
                  View Transactions
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
