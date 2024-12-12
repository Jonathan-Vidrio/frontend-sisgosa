'use client';

import { useUiStore } from '@/store';
import { ServiceType } from '@/interfaces';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ServiceTypeFormValues } from '../../types/service-type-form-values';
import { serviceTypeSchema } from '../../schemas/service-type.schema';
import { fetchGetServiceType, fetchUpdateServiceType } from '../../fetching/services-types';
import { CustomButton, CustomInput } from '@/core';

export const UpdateServiceTypeForm = ({ id, className }: { id: string; className?: string }) => {
  const { hideLoading } = useUiStore(state => state);

  const [serviceType, setServiceType] = useState<ServiceType | null>(null);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ServiceTypeFormValues>({
    resolver: zodResolver(serviceTypeSchema),
  });

  const loadData = async () => {
    const fetchedServiceType = await fetchGetServiceType(id);
    setServiceType(fetchedServiceType);
  };

  const onSubmit = async (data: ServiceTypeFormValues) => {
    try {
      const serviceType = await fetchUpdateServiceType(id, data);
      if (serviceType) router.back();
    } catch {}
  };

  useEffect(() => {
    hideLoading();
  }, [hideLoading]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (serviceType) {
      reset({
        description: serviceType.description,
      });
    }
  }, [serviceType, reset]);

  if (!serviceType) return null;

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
