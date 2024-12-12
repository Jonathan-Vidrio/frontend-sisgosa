import { object, string, any } from 'zod';

export const serviceSchema = object({
  vehicle: string({ required_error: 'Vehicle is required' }).min(1, 'Vehicle is required'),
  worker: string({ required_error: 'Worker is required' }).min(1, 'Worker is required'),
  client: string({ required_error: 'Client is required' }).min(1, 'Client is required'),
  serviceTypeDescription: string({ required_error: 'Service type is required' }).min(1, 'Service type is required'),
  images: any().optional(),
  observations: string().optional(),
});
