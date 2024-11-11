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
import { useState } from 'react';
import {
  useCreateReviewResponse,
  useUpdateReviewResponse,
} from '../hooks/useReviews';

interface ReviewResponseFormProps {
  reviewId: number;
  isOpen: boolean;
  onClose: () => void;
  existingResponse?: string;
  responseId?: number;
}

export const ReviewResponseForm = ({
  reviewId,
  isOpen,
  onClose,
  existingResponse,
  responseId,
}: ReviewResponseFormProps) => {
  const [response, setResponse] = useState(existingResponse || '');
  const createResponse = useCreateReviewResponse();
  const updateResponse = useUpdateReviewResponse();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!response.trim()) return;

    try {
      if (responseId) {
        await updateResponse.mutateAsync({
          responseId,
          data: { response: response.trim() },
        });
      } else {
        await createResponse.mutateAsync({
          reviewId,
          response: response.trim(),
        });
      }
      onClose();
    } catch (error) {
      console.error('Error submitting response:', error);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {existingResponse ? 'Update Response' : 'Respond to Review'}
          </AlertDialogTitle>
          <AlertDialogDescription>
            Your response will be public and visible to all users. Please ensure
            your response is professional and helpful.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            className="w-full min-h-[100px] p-2 border rounded-md"
            placeholder="Write your response..."
            maxLength={1000}
            required
          />
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction type="submit" className="bg-secondary">
              {existingResponse ? 'Update' : 'Submit'} Response
            </AlertDialogAction>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};
