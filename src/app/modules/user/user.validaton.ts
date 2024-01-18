import { z } from 'zod';

export const userValidationSchema = z.object({
  body: z.object({
    username: z.string(),
    email: z.string().email(),
    password: z.string(),
    role: z.enum(['user', 'admin']).default('user'),
  }),
});
