import { Service } from './service.interface';

export interface Resource {
  id?: string;
  image?: string | File;
  description?: string;
  service?: Service;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
