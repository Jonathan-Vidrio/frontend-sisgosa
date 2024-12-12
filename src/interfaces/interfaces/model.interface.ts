import { VehicleBrand } from './brand.interface';

export interface VehicleModel {
  id?: string;
  description?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  deletedAt?: string | Date;
  brand?: VehicleBrand;
}
