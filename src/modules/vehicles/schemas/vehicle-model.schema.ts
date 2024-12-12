import { object, string } from 'zod';

export const vehicleModelSchema = object({
  description: string({ required_error: 'Description is required' }).min(1, 'Description is required'),
  brandDescription: string({ required_error: 'Brand description is required' }).min(1, 'Brand description is required'),
  newBrandDescription: string().optional(),
}).refine(
  data => {
    if (data.brandDescription === 'other') {
      return data.newBrandDescription && data.newBrandDescription.trim() !== '';
    }
    return true;
  },
  {
    message: 'New brand description is required',
    path: ['newBrandDescription'],
  }
);
