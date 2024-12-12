import { Client } from './client.interface';
import { Status } from './status.interface';
import { Vehicle } from './vehicle.interface';
import { Worker } from './worker.interface';

export interface Appointment {
  id?: string;
  scheduleDate?: Date | string;
  scheduleTime?: string;
  description?: string;
  client?: Client;
  worker?: Worker;
  status?: Status;
  vehicle?: Vehicle;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
