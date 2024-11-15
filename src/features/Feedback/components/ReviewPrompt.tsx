import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ReviewPromptData } from '../types/review-types';

// TODO: separate connection logic and dialog component using jotai
export const ReviewPrompt = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [promptData, setPromptData] = useState<ReviewPromptData[] | null>(null);

  useEffect(() => {
    const eventSource = new EventSource('/api/review-prompts/subscribe');

    eventSource.addEventListener('review-prompt', (event) => {
      const data = JSON.parse(event.data);
      setPromptData(data);
      setIsOpen(true);
    });

    eventSource.onerror = (error) => {
      console.error('SSE connection error:', error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const handleDismiss = async () => {
    if (!promptData) return;

    try {
      // Dismiss all orders
      await Promise.all(
        promptData.map((prompt) =>
          fetch(`/api/review-prompts/${prompt.orderId}/dismiss`, {
            method: 'POST',
          }),
        ),
      );
      setIsOpen(false);
    } catch (error) {
      console.error('Error dismissing review prompts:', error);
    }
  };

  const handleReviewNow = () => {
    if (!promptData) return;
    // Navigate to reviews page
    window.location.href = '/buyer/orders';
    setIsOpen(false);
  };

  if (!promptData || promptData.length === 0) return null;

  // Group orders by distributor
  const ordersByDistributor = promptData.reduce((acc, prompt) => {
    if (!acc[prompt.distributorName]) {
      acc[prompt.distributorName] = [];
    }
    acc[prompt.distributorName].push(prompt);
    return acc;
  }, {} as Record<string, ReviewPromptData[]>);

  const totalOrders = promptData.length;
  const isAllLastPrompt = promptData.every((prompt) => prompt.isLastPrompt);

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className="max-w-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex justify-between items-center">
            Pending Order Reviews
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-full p-1 hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
            </button>
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-4">
            <p className="text-base">
              You have {totalOrders} {totalOrders === 1 ? 'order' : 'orders'}{' '}
              pending review. Your feedback helps other buyers make informed
              decisions!
            </p>

            <div className="space-y-4">
              {Object.entries(ordersByDistributor).map(
                ([distributorName, orders]) => (
                  <div
                    key={distributorName}
                    className="bg-gray-50 p-4 rounded-lg"
                  >
                    <h3 className="font-medium mb-3">
                      Orders from {distributorName}
                    </h3>
                    <div className="space-y-3">
                      {orders.map((order) => (
                        <div
                          key={order.orderId}
                          className="pl-4 border-l-2 border-gray-200"
                        >
                          <p className="text-sm text-gray-600 mb-1">
                            Order #{order.orderId}
                          </p>
                          <ul className="list-disc pl-5 space-y-1 text-sm">
                            {order.productNames.map((product, idx) => (
                              <li key={idx}>{product}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                ),
              )}
            </div>

            {isAllLastPrompt && (
              <p className="text-sm text-gray-500 italic">
                This is your last reminder to review these orders.
              </p>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="sm:justify-start gap-3">
          <AlertDialogCancel onClick={handleDismiss} className="mt-0">
            Remind me later
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleReviewNow}
            className="button-green text-white hover:bg-green-600"
          >
            View pending orders
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
