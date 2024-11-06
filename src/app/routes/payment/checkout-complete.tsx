import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { createTransaction, calculateCartImpact } from '@/features/Cart/api/api-cart';
import { useStripe } from '@stripe/react-stripe-js';
import { PaymentIntent } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Apple, TreePine, Factory, Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';

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

interface ImpactMetrics {
  weightSaved: number;
  co2Prevented: number;
  treesEquivalent: number;
  electricityDaysSaved: number;
}

export const CheckoutComplete: React.FC = () => {
  const stripe = useStripe();
  const [status, setStatus] = useState<Status | 'default'>('processing');
  const [paymentIntent, setPaymentIntent] = useState<PaymentIntent | null>(null);
  const [impactMetrics, setImpactMetrics] = useState<ImpactMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

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

  const renderImpactMetrics = () => {
    if (!impactMetrics) return null;

    const fadeInUp = {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.6 }
    };

    const container = {
      hidden: { opacity: 0 },
      show: {
        opacity: 1,
        transition: {
          staggerChildren: 0.2
        }
      }
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="mt-6 overflow-hidden">
          <CardHeader>
            <CardTitle className="text-center text-gray-800">
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
                className="flex items-center justify-center space-x-2"
              >
                <span>Your Environmental Impact</span>
                <motion.span
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                >
                  🌍
                </motion.span>
              </motion.div>
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="space-y-6"
            >
              {/* Impact Summary Message */}
              <motion.div 
                variants={fadeInUp}
                className="text-center text-lg text-gray-700 bg-green-50 p-4 rounded-lg"
              >
                <p className="leading-relaxed">
                  Thanks to your efforts, you've saved{' '}
                  <span className="font-bold text-green-600">{impactMetrics.weightSaved.toFixed(2)} kg</span> of food! 🌍
                  <br />
                  This has prevented{' '}
                  <span className="font-bold text-green-600">{impactMetrics.co2Prevented.toFixed(2)} kg</span> of CO₂ emissions,
                  which is like planting{' '}
                  <span className="font-bold text-green-600">{impactMetrics.treesEquivalent.toFixed(1)}</span> trees! 🌳
                  <br />
                  Plus, it's equal to saving{' '}
                  <span className="font-bold text-green-600">{impactMetrics.electricityDaysSaved.toFixed(1)}</span> days of electricity at home! 💡
                </p>
              </motion.div>

              {/* Detailed Metrics */}
              <motion.div 
                variants={container}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
              >
                {/* Food Saved Metric */}
                <motion.div
                  variants={fadeInUp}
                  className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col items-center space-y-2">
                    <div className="p-3 bg-green-100 rounded-full">
                      <Apple className="h-8 w-8 text-green-600" />
                    </div>
                    <p className="text-2xl font-bold text-green-600">
                      {impactMetrics.weightSaved.toFixed(2)}kg
                    </p>
                    <p className="text-sm text-gray-600 text-center">Food Saved</p>
                  </div>
                </motion.div>

                {/* CO2 Prevented Metric */}
                <motion.div
                  variants={fadeInUp}
                  className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col items-center space-y-2">
                    <div className="p-3 bg-blue-100 rounded-full">
                      <Factory className="h-8 w-8 text-blue-600" />
                    </div>
                    <p className="text-2xl font-bold text-blue-600">
                      {impactMetrics.co2Prevented.toFixed(2)}kg
                    </p>
                    <p className="text-sm text-gray-600 text-center">CO₂ Prevented</p>
                  </div>
                </motion.div>

                {/* Trees Equivalent Metric */}
                <motion.div
                  variants={fadeInUp}
                  className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col items-center space-y-2">
                    <div className="p-3 bg-yellow-100 rounded-full">
                      <TreePine className="h-8 w-8 text-yellow-600" />
                    </div>
                    <p className="text-2xl font-bold text-yellow-600">
                      {impactMetrics.treesEquivalent.toFixed(1)}
                    </p>
                    <p className="text-sm text-gray-600 text-center">Trees Equivalent</p>
                  </div>
                </motion.div>

                {/* Electricity Days Saved Metric */}
                <motion.div
                  variants={fadeInUp}
                  className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col items-center space-y-2">
                    <div className="p-3 bg-purple-100 rounded-full">
                      <Lightbulb className="h-8 w-8 text-purple-600" />
                    </div>
                    <p className="text-2xl font-bold text-purple-600">
                      {impactMetrics.electricityDaysSaved.toFixed(1)}
                    </p>
                    <p className="text-sm text-gray-600 text-center">Days of Electricity Saved</p>
                  </div>
                </motion.div>
              </motion.div>

              {/* Encouraging Message */}
              <motion.div
                variants={fadeInUp}
                className="text-center mt-6"
              >
                <p className="text-gray-600 italic">
                  Keep going and help us reach our next community milestone! 🎉
                </p>
              </motion.div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

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
                {status === 'succeeded' && renderImpactMetrics()}
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
