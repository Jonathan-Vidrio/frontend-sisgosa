import { any, object, string } from 'zod';

export const resourceSchema = object({
  service: string({ required_error: 'Service is required' }).min(1, 'Service is required'),
  description: string({ required_error: 'Description is required' }).min(1, 'Description is required'),
  image: any().optional(),
});
