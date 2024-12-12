import { Client } from './client.interface';
import { Resource } from './resource.interface';
import { ServiceDetail } from './service-details.interface';
import { ServiceType } from './service-type.interface';
import { Status } from './status.interface';
import { Vehicle } from './vehicle.interface';
import { Worker } from './worker.interface';

export interface Service {
  id?: string;
  worker?: Worker;
  client?: Client;
  serviceType?: ServiceType;
  status?: Status;
  resources?: Resource[];
  serviceDetails?: ServiceDetail;
  vehicle?: Vehicle;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
