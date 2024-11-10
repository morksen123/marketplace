import { z } from 'zod';

export const platformRatingSchema = z.object({
  overallRating: z.number().min(1, 'Overall rating is required').max(5),
  impactAwareness: z
    .number()
    .min(1, 'Impact awareness rating is required')
    .max(5),
  valueSatisfaction: z
    .number()
    .min(1, 'Value satisfaction rating is required')
    .max(5),
  suggestions: z
    .string()
    .max(1000, 'Feedback cannot exceed 1000 characters')
    .optional(),
  wouldRecommend: z.boolean({
    required_error: 'Please indicate if you would recommend GudFood',
  }),
});
