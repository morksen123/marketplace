import co2 from '@/assets/co2.png';
import electricity from '@/assets/electricity.png';
import food from '@/assets/food.png';
import water from '@/assets/water.png';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import {
  calculateCartImpact,
  createTransaction,
} from '@/features/Cart/api/api-cart';
import { PlatformRatingForm } from '@/features/Feedback/components/PlatformReview/PlatformRatingForm';
import {
  useCreatePlatformRating,
  usePlatformRatingEligibility,
} from '@/features/Feedback/hooks/usePlatformRating';
import { CreatePlatformRatingRequest } from '@/features/Feedback/types/review-types';
import { PaymentDetailsSkeleton } from '@/features/Payment/components/PaymentDetailsSkeleton';
import { ImpactExplanation } from '@/features/Sustainability/Profile/components/ImpactExplanation';
import { useStripe } from '@stripe/react-stripe-js';
import { PaymentIntent } from '@stripe/stripe-js';
import { motion } from 'framer-motion';
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

interface ImpactMetrics {
  weightSaved: number;
  co2Prevented: number;
  treesEquivalent: number;
  electricityDaysSaved: number;
  acNightsSaved: number;
  mealsSaved: number;
  waterLitresSaved: number;
  carKmEquivalent: number;
  showersEquivalent: number;
}

// Add these animation variants
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

export const CheckoutComplete: React.FC = () => {
  const stripe = useStripe();
  const [status, setStatus] = useState<Status | 'default'>('processing');
  const [paymentIntent, setPaymentIntent] = useState<PaymentIntent | null>(
    null,
  );
  const [impactMetrics, setImpactMetrics] = useState<ImpactMetrics | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [showRating, setShowRating] = useState(false);
  const navigate = useNavigate();
  const [selectedImpact, setSelectedImpact] = useState<{
    category: 'food' | 'water' | 'electricity' | 'carbon';
    type: 'personal' | 'community';
  } | null>(null);

  const { data: eligibility, isLoading: isEligibilityLoading } =
    usePlatformRatingEligibility();

  const createRating = useCreatePlatformRating();

  useEffect(() => {
    if (!stripe) return;

    const clientSecret = new URLSearchParams(window.location.search).get(
      'payment_intent_client_secret',
    );

    if (!clientSecret) {
      setIsLoading(false);
      return;
    }

    stripe
      .retrievePaymentIntent(clientSecret)
      .then(async ({ paymentIntent }) => {
        if (paymentIntent) {
          setStatus(paymentIntent.status);
          setPaymentIntent(paymentIntent);

          if (paymentIntent.status === 'succeeded') {
            const impact = await calculateCartImpact();
            setImpactMetrics(impact);
            return createTransaction(paymentIntent.id);
          }
        }
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
  const handleImpactCardClick = (
    category: 'food' | 'water' | 'electricity' | 'carbon',
    type: 'personal' | 'community',
  ) => {
    setSelectedImpact({ category, type });
  };

  const statusContent = STATUS_CONTENT_MAP[status];

  return (
    <div className="min-h-screen flex items-center justify-center py-12">
      <div className="max-w-6xl w-full">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className={`text-center ${statusContent.color}`}>
              {statusContent.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
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
                {status === 'succeeded' && (
                  <>
                    <div className="text-center space-y-2 mb-8">
                      <h2 className="text-2xl font-semibold text-gray-800">
                        Thank You for Making a Difference!
                      </h2>
                      <p className="text-gray-600">
                        Here's how your purchase has positively impacted the
                        environment:
                      </p>
                    </div>
                    <motion.div
                      variants={container}
                      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-8"
                    >
                      {/* Food Impact Card */}
                      <div
                        className="bg-white/80 backdrop-blur rounded-xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer"
                        onClick={() =>
                          handleImpactCardClick('food', 'personal')
                        }
                      >
                        <div className="flex flex-col items-center text-center">
                          <img src={food} alt="Food" className="w-8 h-8 mb-2" />
                          <h3 className="text-gray-600 text-sm font-bold">
                            Food Rescued
                          </h3>
                          <p className="text-2xl font-bold text-green-500 mt-1">
                            {impactMetrics.weightSaved.toFixed(1)} kg
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            🍽️ {impactMetrics.mealsSaved.toFixed(0)} meals saved
                          </p>
                        </div>
                      </div>

                      {/* Carbon Impact Card */}
                      <div
                        className="bg-white/80 backdrop-blur rounded-xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer"
                        onClick={() =>
                          handleImpactCardClick('carbon', 'personal')
                        }
                      >
                        <div className="flex flex-col items-center text-center">
                          <img src={co2} alt="CO2" className="w-8 h-8 mb-2" />
                          <h3 className="text-gray-600 text-sm font-bold">
                            Carbon Impact
                          </h3>
                          <p className="text-2xl font-bold text-green-500 mt-1">
                            {impactMetrics.co2Prevented.toFixed(1)} kg
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            🚗 {impactMetrics.carKmEquivalent.toFixed(1)} km not
                            driven
                          </p>
                        </div>
                      </div>

                      {/* Energy Impact Card */}
                      <div
                        className="bg-white/80 backdrop-blur rounded-xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer"
                        onClick={() =>
                          handleImpactCardClick('electricity', 'personal')
                        }
                      >
                        <div className="flex flex-col items-center text-center">
                          <img
                            src={electricity}
                            alt="Electricity"
                            className="w-8 h-8 mb-2"
                          />
                          <h3 className="text-gray-600 text-sm font-bold">
                            Energy Impact
                          </h3>
                          <p className="text-2xl font-bold text-green-500 mt-1">
                            {impactMetrics?.electricityDaysSaved.toFixed(1)}{' '}
                            days
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            ❄️ {impactMetrics.acNightsSaved.toFixed(1)} nights
                            of AC
                          </p>
                        </div>
                      </div>

                      {/* Water Impact Card */}
                      <div
                        className="bg-white/80 backdrop-blur rounded-xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer"
                        onClick={() =>
                          handleImpactCardClick('water', 'personal')
                        }
                      >
                        <div className="flex flex-col items-center text-center">
                          <img
                            src={water}
                            alt="Water"
                            className="w-8 h-8 mb-2"
                          />
                          <h3 className="text-gray-600 text-sm font-bold">
                            Water Saved
                          </h3>
                          <p className="text-2xl font-bold text-green-500 mt-1">
                            {impactMetrics.waterLitresSaved >= 1000000000000
                              ? `${(
                                  impactMetrics.waterLitresSaved / 1000000000000
                                ).toFixed(1)} tril`
                              : impactMetrics.waterLitresSaved >= 1000000000
                              ? `${(
                                  impactMetrics.waterLitresSaved / 1000000000
                                ).toFixed(1)} bil`
                              : impactMetrics.waterLitresSaved >= 1000000
                              ? `${(
                                  impactMetrics.waterLitresSaved / 1000000
                                ).toFixed(1)} mil`
                              : impactMetrics.waterLitresSaved.toFixed(0)}{' '}
                            ℓ
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            🚿 {impactMetrics.showersEquivalent.toFixed(0)}{' '}
                            showers
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </>
                )}
                <div className="flex justify-center space-x-6 mt-8">
                  <Button
                    variant="outline"
                    onClick={() => navigate('/buyer/home')}
                    disabled={status === 'processing'}
                  >
                    Return to Home
                  </Button>
                  <Button
                    variant="secondary"
                    className="button-green"
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
      <Dialog
        open={!!selectedImpact}
        onOpenChange={() => setSelectedImpact(null)}
      >
        <DialogContent className="max-w-4xl">
          {selectedImpact && (
            <ImpactExplanation
              category={selectedImpact.category}
              type={selectedImpact.type}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
