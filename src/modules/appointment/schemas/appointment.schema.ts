import { date, object, string } from 'zod';

export const appointmentSchema = object({
  scheduleDate: date({ required_error: 'Schedule date is required' }),
  scheduleTime: string({ required_error: 'Schedule time is required' }).min(1, 'Schedule time is required'),
  client: string({ required_error: 'Client is required' }).min(1, 'Client is required'),
  vehicle: string({ required_error: 'Vehicle is required' }).min(1, 'Vehicle is required'),
  worker: string().optional(),
  description: string().optional(),
});
