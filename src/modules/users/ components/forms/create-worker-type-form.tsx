'use client';

import { useUiStore } from '@/store';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { WorkerTypeFormValues } from '../../types/worker-type-form-values';
import { workerTypeSchema } from '../../schemas/worker-type.schema';
import { fetchCreateWorkerType } from '../../fetching/worker-types';
import { CustomButton, CustomInput } from '@/core';

export const CreateWorkerTypeForm = ({ className }: { className?: string }) => {
  const { hideLoading } = useUiStore(state => state);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<WorkerTypeFormValues>({
    resolver: zodResolver(workerTypeSchema),
  });

  const onSubmit = async (data: { description: string }) => {
    try {
      const workerType = await fetchCreateWorkerType({ ...data });
      if (workerType) router.push(`/users/worker-types/details/${workerType.id}`);
    } catch {}
  };

  useEffect(() => {
    hideLoading();
  }, []);

  return (
    <form className={`flex flex-col gap-y-4 ${className}`} onSubmit={handleSubmit(onSubmit)}>
      <div>
        <CustomInput label='Description' {...register('description')} />
        {errors.description && <small className='text-red-500'>{errors.description.message}</small>}
      </div>

      <CustomButton type='submit'>Save</CustomButton>
    </form>
  );
};
