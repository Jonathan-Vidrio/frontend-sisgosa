'use client';

import { useUiStore } from '@/store';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CustomButton, CustomInput, Spinner } from '@/core';
import { PasswordResetFormValues } from '../../types/password-reset-form-values';
import { passwordResetSchema } from '../../schemas/password-reset';
import { fetchPasswordReset } from '../../fetching/auth';

/**
 * @function PasswordResetForm
 * @description Component that handles the password reset process.
 * Validates email and OTP presence, and allows users to set a new password.
 *
 * @returns {JSX.Element} Password reset form component
 */
export const PasswordResetForm = (): JSX.Element => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get('email');
  const otp = searchParams.get('otp');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PasswordResetFormValues>({
    resolver: zodResolver(passwordResetSchema),
  });

  /**
   * @function onSubmit
   * @description Handles the submission of the password reset form
   *
   * @param {PasswordResetFormValues} data - Form data containing password and confirmPassword
   * @returns {Promise<void>}
   *
   * @async
   */
  const onSubmit = async (data: PasswordResetFormValues): Promise<void> => {
    try {
      setIsSubmitting(true);

      await fetchPasswordReset({ ...data, email: email!, otp: otp! });

      router.push('/appointments');
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
      router.refresh();
    }
  };

  /**
   * @description Effect that checks for email presence in URL parameters
   * Redirects to password-recovery if not present
   */
  useEffect(() => {
    if (!email) router.push('/password-recovery');
  }, [searchParams, router, email]);

  /**
   * @description Effect that validates OTP
   * Redirects to password-recovery if invalid or missing
   */
  useEffect(() => {
    if (!otp || otp.length !== 6) router.push('/password-recovery');
  }, [searchParams, otp, router]);

  return (
    <div>
      <form className='space-y-5 mt-5' onSubmit={handleSubmit(onSubmit)}>
        <div>
          <CustomInput label='New Password' {...register('password')} type='password' />
          {errors.password && <small className='text-red-500'>{errors.password.message}</small>}
        </div>

        <div>
          <CustomInput label='Confirm Password' {...register('confirmPassword')} type='password' />
          {errors.confirmPassword && <small className='text-red-500'>{errors.confirmPassword.message}</small>}
        </div>

        <CustomButton type='submit' disabled={isSubmitting}>
          {isSubmitting ? <Spinner size='sm' color='white' /> : 'Change Password'}
        </CustomButton>
      </form>
    </div>
  );
};
