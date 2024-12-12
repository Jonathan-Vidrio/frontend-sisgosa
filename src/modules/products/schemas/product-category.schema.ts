import { object, string } from 'zod';

export const productCategorySchema = object({
  description: string({ required_error: 'Description is required' }).min(1, 'Description is required'),
});
