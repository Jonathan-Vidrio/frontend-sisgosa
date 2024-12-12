import { VehicleModel } from './model.interface';

export interface VehicleBrand {
  id?: string;
  description?: string;
  models?: VehicleModel[];
  createdAt?: Date | string;
  updatedAt?: Date | string;
  deletedAt?: Date | string;
}
