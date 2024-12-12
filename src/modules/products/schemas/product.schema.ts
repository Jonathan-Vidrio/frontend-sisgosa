import { object, string, any } from 'zod';

export const productSchema = object({
  description: string({ message: 'Description is required' }).min(1, 'Description is too short'),
  categoryDescription: string({ message: 'Category is required' }),
  newCategoryDescription: string().optional(),
  image: any().optional(),
}).refine(
  data => {
    if (data.categoryDescription === 'other') {
      return data.newCategoryDescription && data.newCategoryDescription.trim() !== '';
    }
    return true;
  },
  {
    message: 'New category description is required',
    path: ['newCategoryDescription'],
  }
);
