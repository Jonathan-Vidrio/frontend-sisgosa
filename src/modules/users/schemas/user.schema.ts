import { object, string, ZodIssueCode } from 'zod';

export const userSchema = object({
  email: string({ required_error: 'Email is required' }).email('Invalid email'),
  firstName: string({ required_error: 'First name is required' }).min(2, 'First name is too short'),
  firstSurname: string({ required_error: 'First surname is required' }).min(2, 'First surname is too short'),
  secondSurname: string().optional(),
  userTypeDescription: string({ required_error: 'User type is required' }),

  // worker data
  workerTypeDescription: string().optional(),

  // client data
  street: string().optional(),
  number: string().optional(),
  phoneNumber: string().optional(),
}).superRefine((data, ctx) => {
  if (data.userTypeDescription === 'client') {
    if (!data.phoneNumber || data.phoneNumber.trim() === '') {
      ctx.addIssue({
        code: ZodIssueCode.custom,
        path: ['phoneNumber'],
        message: 'Phone Number is required for clients',
      });
    }

    // Si deseas que 'number' sea obligatorio cuando 'street' está presente
    if (data.street && (!data.number || data.number.toString().trim() === '')) {
      ctx.addIssue({
        code: ZodIssueCode.custom,
        path: ['number'],
        message: 'Number is required when street is provided',
      });
    }
  }

  if (data.userTypeDescription === 'worker') {
    if (!data.workerTypeDescription || data.workerTypeDescription.trim() === '') {
      ctx.addIssue({
        code: ZodIssueCode.custom,
        path: ['workerTypeDescription'],
        message: 'Worker Type is required for workers',
      });
    }
  }
});
