import { z } from 'zod';

export const createCourseReviewValidatorSchema = z.object({
  body: z.object({
    rating: z.number().min(1).max(5),
    review: z.string(),
  }),
});
