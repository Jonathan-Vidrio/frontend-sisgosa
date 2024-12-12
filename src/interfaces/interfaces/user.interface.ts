import { Client } from './client.interface';
import { Status } from './status.interface';
import { UserType } from './user-type.interface';
import { Worker } from './worker.interface';

export interface User {
  id?: string;
  email?: string;
  password?: string;
  firstName?: string;
  firstSurname?: string;
  secondSurname?: string;
  userType?: UserType;
  status?: Status;
  client?: Client;
  worker?: Worker;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  deletedAt?: string | Date;
}
