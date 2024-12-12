'use client';

import { useUiStore } from '@/store';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { PasswordRecoveryFormValues } from '../../types/password-recovery-form-values';
import { passwordRecoverySchema } from '../../schemas/password-recovery.schema';
import { CustomButton, CustomInput, Spinner } from '@/core';
import { fetchPasswordRecovery } from '../../fetching/auth';

/**
 * @function PasswordRecoveryForm
 * @description Component that renders a password recovery form.
 * Allows users to request an OTP code to reset their password.
 *
 * @returns {JSX.Element} Password recovery form
 *
 * @example
 * <PasswordRecoveryForm />
 */
export const PasswordRecoveryForm = (): JSX.Element => {
  const { showLoading } = useUiStore(state => state);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordRecoveryFormValues>({
    resolver: zodResolver(passwordRecoverySchema),
  });

  /**
   * @function onSubmit
   * @description Handles the submission of the password recovery form
   *
   * @param {PasswordRecoveryFormValues} data - Form data containing email
   * @returns {Promise<void>}
   *
   * @async
   */
  const onSubmit = async (data: PasswordRecoveryFormValues): Promise<void> => {
    try {
      setIsSubmitting(true);

      await fetchPasswordRecovery(data);

      showLoading();
    } catch {
    } finally {
      setIsSubmitting(false);
      router.refresh();
    }
  };

  return (
    <div>
      <form className='space-y-5 mt-5' onSubmit={handleSubmit(onSubmit)}>
        <div>
          <CustomInput label='Email' {...register('email')} />
          {errors.email && <small className='text-red-500'>{errors.email.message}</small>}
        </div>

        <CustomButton type='submit' disabled={isSubmitting}>
          {isSubmitting ? <Spinner size='sm' color='white' /> : 'Send OTP'}
        </CustomButton>
      </form>
    </div>
  );
};
