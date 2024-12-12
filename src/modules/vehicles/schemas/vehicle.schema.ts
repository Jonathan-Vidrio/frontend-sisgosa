import { object, string, any } from 'zod';

export const vehicleSchema = object({
  licensePlate: string({ required_error: 'License plate is required' }).min(1, 'License plate is required'),
  color: string({ required_error: 'Color is required' }).min(1, 'Color is required'),
  client: string({ required_error: 'Client is required' }),
  version: string().optional(),
  brandDescription: string({ required_error: 'Brand is required' }).min(1, 'Brand is required'),
  modelDescription: string({ required_error: 'Model is required' }).min(1, 'Model is required'),
  image: any().optional(),
});
