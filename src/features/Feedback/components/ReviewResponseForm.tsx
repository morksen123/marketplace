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
  const [error, setError] = useState<string | null>(null);
  const createResponse = useCreateReviewResponse();
  const updateResponse = useUpdateReviewResponse();

  const validateResponse = (text: string) => {
    if (text.trim().length < 10) {
      return 'Response must be at least 10 characters long';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateResponse(response);
    if (validationError) {
      setError(validationError);
      return;
    }

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
      setError(null);
      onClose();
    } catch (error) {
      console.error('Error submitting response:', error);
      setError('Failed to submit response. Please try again.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setResponse(e.target.value);
    // Clear error when user starts typing
    if (error) setError(null);
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
          <div>
            <textarea
              value={response}
              onChange={handleInputChange}
              className={`w-full min-h-[100px] p-2 border rounded-md ${
                error ? 'border-red-500' : 'border-gray-200'
              }`}
              placeholder="Write your response"
              maxLength={1000}
              required
            />
            {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
            <p className="text-sm text-gray-500 mt-1">
              {response.length}/1000 characters
              {response.length < 10 && (
                <span className="text-gray-400">
                  {' '}
                  (minimum 10 characters required)
                </span>
              )}
            </p>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              type="submit"
              className={`button-green hover:bg-green-600 ${
                response.trim().length < 10
                  ? 'opacity-50 cursor-not-allowed'
                  : ''
              }`}
              disabled={response.trim().length < 10}
            >
              {existingResponse ? 'Update' : 'Submit'} Response
            </AlertDialogAction>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};
