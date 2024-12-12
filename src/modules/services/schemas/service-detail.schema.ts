import { any, number, object, string } from 'zod';

export const serviceDetailSchema = object({
  productsQuantity: string({ required_error: 'Products quantity is required' }).min(1, 'Products quantity is required'),
  product: string({ required_error: 'Product is required' }).min(1, 'Product is required'),
  service: string({ required_error: 'Service is required' }).min(1, 'Service is required'),
  notes: string().optional(),
});
