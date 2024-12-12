import { object, string } from 'zod';

export const passwordRecoverySchema = object({
  email: string({ required_error: 'Email is required' }).email('Invalid email'),
});
