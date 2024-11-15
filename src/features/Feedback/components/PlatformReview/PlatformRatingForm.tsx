import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { platformRatingSchema } from '../../schema';
import { StarRating } from '../StarRating';

type PlatformRatingFormValues = z.infer<typeof platformRatingSchema>;

interface PlatformRatingFormProps {
  onSubmit: (data: PlatformRatingFormValues) => Promise<void>;
  onClose?: () => void;
}

export function PlatformRatingForm({
  onSubmit,
  onClose,
}: PlatformRatingFormProps) {
  const form = useForm<PlatformRatingFormValues>({
    resolver: zodResolver(platformRatingSchema),
    defaultValues: {
      overallRating: 0,
      impactAwareness: 0,
      valueSatisfaction: 0,
      suggestions: '',
      wouldRecommend: true,
    },
  });

  const handleSubmit = async (data: PlatformRatingFormValues) => {
    await onSubmit(data);
    form.reset();
  };

  const isFormSubmitting = form.formState.isSubmitting;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Rate Your GudFood Experience</CardTitle>
      </CardHeader>
      <CardContent className="text-left">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            {/* Overall Rating */}
            <FormField
              control={form.control}
              name="overallRating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Overall Platform Experience</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        How satisfied are you with your overall experience using
                        GudFood?
                      </p>
                      <StarRating
                        rating={field.value}
                        onRatingChange={field.onChange}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Value Satisfaction */}
            <FormField
              control={form.control}
              name="valueSatisfaction"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value for Money</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        How satisfied are you with the prices of imperfect
                        products?
                      </p>
                      <StarRating
                        rating={field.value}
                        onRatingChange={field.onChange}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Impact Awareness */}
            <FormField
              control={form.control}
              name="impactAwareness"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Food Waste Impact</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        How well did GudFood help you understand the importance
                        of reducing food waste?
                      </p>
                      <StarRating
                        rating={field.value}
                        onRatingChange={field.onChange}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Would Recommend */}
            <FormField
              control={form.control}
              name="wouldRecommend"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Would you recommend GudFood for finding food options?
                  </FormLabel>
                  <FormControl>
                    <div className="flex space-x-4">
                      {['Yes', 'No'].map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => field.onChange(option === 'Yes')}
                          className={`px-4 py-2 rounded-lg border ${
                            field.value === (option === 'Yes')
                              ? 'bg-green-50 border-green-500 text-green-700'
                              : 'hover:bg-gray-50'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Suggestions */}
            <FormField
              control={form.control}
              name="suggestions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>How can we improve?</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Share your suggestions for improvement..."
                      className="h-32 resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-4">
              {onClose && (
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
              )}
              <Button
                variant="secondary"
                type="submit"
                disabled={isFormSubmitting || !form.formState.isValid}
              >
                {isFormSubmitting ? 'Submitting...' : 'Submit Feedback'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
