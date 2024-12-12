import { Appointment } from './appointment.interface';
import { Client } from './client.interface';
import { VehicleModel } from './model.interface';
import { Service } from './service.interface';

export interface Vehicle {
  id?: string;
  image?: string | File;
  licensePlate?: string;
  color?: string;
  client?: Client;
  model?: VehicleModel;
  version?: string;
  services?: Service[];
  appointments?: Appointment[];
  createdAt?: Date | string;
  updatedAt?: Date | string;
  deletedAt?: Date | string;
}
