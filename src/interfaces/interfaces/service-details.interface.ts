import { Product } from './product.interface';
import { Service } from './service.interface';

export interface ServiceDetail {
  id?: string;
  productsQuantity?: number;
  notes?: string;
  service?: Service;
  product?: Product;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
