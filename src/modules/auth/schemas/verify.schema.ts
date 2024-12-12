import { object, string } from 'zod';

export const verifySchema = object({
  otp: string({ required_error: 'OTP is required' }).length(6, { message: 'OTP must be 6 characters long' }),
});
