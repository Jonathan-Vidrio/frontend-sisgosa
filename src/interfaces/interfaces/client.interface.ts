import { Appointment } from './appointment.interface';
import { Service } from './service.interface';
import { User } from './user.interface';
import { Vehicle } from './vehicle.interface';
import { WorkerType } from './worker-type.interface';

export interface Client {
  id?: string;
  street?: string;
  number?: number;
  phoneNumber?: string;
  user?: User;
  vehicles?: Vehicle[];
  services?: Service[];
  appointments?: Appointment[];
  createdAt?: string | Date;
  updatedAt?: string | Date;
  deletedAt?: string | Date;
}
