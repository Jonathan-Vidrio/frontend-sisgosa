'use client';

import { useUiStore } from '@/store';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { serviceTypeSchema } from '../../schemas/service-type.schema';
import { ServiceTypeFormValues } from '../../types/service-type-form-values';
import { fetchCreateServiceType } from '../../fetching/services-types';
import { CustomButton, CustomInput } from '@/core';

export const CreateServiceTypeForm = ({ className }: { className?: string }) => {
  const { hideLoading } = useUiStore(state => state);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ServiceTypeFormValues>({
    resolver: zodResolver(serviceTypeSchema),
  });

  const onSubmit = async (data: ServiceTypeFormValues) => {
    try {
      const productCategory = await fetchCreateServiceType({ ...data });
      if (productCategory) router.push(`/services/types/details/${productCategory.id}`);
    } catch {}
  };

  useEffect(() => {
    hideLoading();
  }, [hideLoading]);

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
