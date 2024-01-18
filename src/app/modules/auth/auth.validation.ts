import { z } from 'zod';

const registrationValidationSchema = z.object({
  body: z.object({
    username: z.string({ required_error: 'Username must be provided' }),
    email: z.string().email(),
    password: z.string({ required_error: 'Password is required' }),
    role: z.enum(['user', 'admin']),
  }),
});

const loginValidationSchema = z.object({
  body: z.object({
    username: z.string({ required_error: 'Username must be provided' }),
    password: z.string({ required_error: 'Password is required' }),
  }),
});

const changePasswordValidationSchema = z.object({
  body: z.object({
    currentPassword: z.string({
      required_error: 'Current password must be provided',
    }),
    newPassword: z.string({ required_error: 'New Password is required' }),
  }),
});

export const AuthValidation = {
  registrationValidationSchema,
  loginValidationSchema,
  changePasswordValidationSchema,
};
