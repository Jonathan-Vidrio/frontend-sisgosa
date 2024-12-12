'use client';

import { createError } from '@/helpers';
import { useModalStore } from '@/store';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { VerifyFormValues } from '../../types/verify-form-values';
import { verifySchema } from '../../schemas/verify.schema';
import { fetchVerify } from '../../fetching/auth';
import { CustomButton, CustomInput, Spinner } from '@/core';

/**
 * @function VerifyForm
 * @description Component that renders an OTP verification form.
 * Handles the verification process for newly registered users.
 *
 * @returns {JSX.Element} OTP verification form component
 *
 * @example
 * <VerifyForm />
 */
export const VerifyForm = (): JSX.Element => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyFormValues>({ resolver: zodResolver(verifySchema) });

  /**
   * @function onSubmit
   * @description Handles the submission of the OTP verification form
   *
   * @param {VerifyFormValues} data - Form data containing the OTP code
   * @returns {Promise<void>}
   *
   * @async
   */
  const onSubmit = async (data: VerifyFormValues): Promise<void> => {
    try {
      setIsSubmitting(true);

      await fetchVerify({ ...data, email: email || '' });
    } catch {
    } finally {
      setIsSubmitting(false);
      router.refresh();
    }
  };

  return (
    <div>
      <form className='space-y-5 mt-5' onSubmit={handleSubmit(onSubmit)}>
        <span className='text-sm text-gray-500'>Please enter the OTP sent to your email.</span>

        <div>
          <CustomInput label='OTP' {...register('otp')} />
          {errors.otp && <small className='text-red-500'>{errors.otp.message}</small>}
        </div>

        <CustomButton type='submit' disabled={isSubmitting}>
          {isSubmitting ? <Spinner size='sm' color='white' /> : 'Verify'}
        </CustomButton>
      </form>
    </div>
  );
};
