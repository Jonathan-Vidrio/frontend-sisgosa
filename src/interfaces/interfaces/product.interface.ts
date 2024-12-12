import { ProductCategory } from './product-category.interface';

export interface Product {
  id?: string;
  description?: string;
  image?: string | File;
  category?: ProductCategory;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
