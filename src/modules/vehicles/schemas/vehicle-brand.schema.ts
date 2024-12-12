import { object, string } from 'zod';

export const vehicleBrandSchema = object({
  description: string({ required_error: 'Description is required' }).min(1, 'Description is required'),
});
