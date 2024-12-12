import { Appointment } from './appointment.interface';
import { Service } from './service.interface';
import { User } from './user.interface';
import { WorkerType } from './worker-type.interface';

export interface Worker {
  id?: string;
  user?: User;
  workerType?: WorkerType;
  services?: Service[];
  appointments?: Appointment[];
  createdAt?: string | Date;
  updatedAt?: string | Date;
  deletedAt?: string | Date;
}
