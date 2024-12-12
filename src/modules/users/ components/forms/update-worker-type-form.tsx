'use client';

import { WorkerType } from '@/interfaces';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { WorkerTypeFormValues } from '../../types/worker-type-form-values';
import { workerTypeSchema } from '../../schemas/worker-type.schema';
import { fetchGetWorkerType, fetchUpdateWorkerType } from '../../fetching/worker-types';
import { CustomButton, CustomInput } from '@/core';

export const UpdateWorkerTypeForm = ({ id, className }: { id: string; className?: string }) => {
  const [workerType, setWorkerType] = useState<WorkerType | null>(null);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<WorkerTypeFormValues>({
    resolver: zodResolver(workerTypeSchema),
  });

  const loadData = async () => {
    const response = await fetchGetWorkerType(id);
    setWorkerType(response);
  };

  const onSubmit = async (data: WorkerTypeFormValues) => {
    try {
      const workerType = await fetchUpdateWorkerType(id, { ...data });
      if (workerType) router.push(`/users/worker-types/details/${workerType.id}`);
    } catch {}
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (workerType) {
      setValue('description', workerType.description || '');
    }
  }, [workerType, setValue]);

  if (!workerType) return null;

  return (
    <form className={`flex flex-col gap-y-5 ${className}`} onSubmit={handleSubmit(onSubmit)}>
      <div>
        <CustomInput label='Description' {...register('description')} />
        {errors.description && <small className='text-red-500'>{errors.description.message}</small>}
      </div>

      <div>
        <CustomButton type='submit'>Save</CustomButton>
      </div>
    </form>
  );
};
