import { z } from 'zod';

const tagSchema = z.object({
  name: z.string().min(1),
  isDeleted: z.boolean(),
});

const updatedTagSchema = z.object({
  name: z.string().min(1).optional(),
  isDeleted: z.boolean(),
});

const courseDetailsSchema = z.object({
  level: z.string().min(1),
  description: z.string().min(1),
});

const updatedCourseDetailsSchema = z.object({
  level: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
});

export const createCourseValidationSchema = z.object({
  body: z.object({
    title: z.string().min(1),
    instructor: z.string().min(1),
    price: z.number().positive(),
    tags: z.array(tagSchema),
    startDate: z.string().min(1),
    endDate: z.string().min(1),
    language: z.string().min(1),
    provider: z.string().min(1),
    details: courseDetailsSchema,
  }),
});

export const updateCourseValidationSchema = z.object({
  body: z.object({
    title: z.string().min(1).optional(),
    instructor: z.string().min(1).optional(),
    price: z.number().positive().optional(),
    tags: z.array(updatedTagSchema).optional(),
    startDate: z.string().min(1).optional(),
    endDate: z.string().min(1).optional(),
    language: z.string().min(1).optional(),
    provider: z.string().min(1).optional(),
    durationInWeeks: z.number().int().positive().optional(),
    details: updatedCourseDetailsSchema.optional(),
  }),
});
