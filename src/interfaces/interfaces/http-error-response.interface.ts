import { HttpStatusType } from '../types/http-status.type';

export interface HttpErrorResponse {
  error: HttpStatusType;
  message: string | string[];
  statusCode: number;
}
