'use client';

import { useUiStore } from '@/store';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { VehicleBrandFormValues } from '../../types/vehicle-brand-form-values';
import { vehicleBrandSchema } from '../../schemas/vehicle-brand.schema';
import { fetchCreateVehicleBrand } from '../../fetching/brands';
import { CustomButton, CustomInput } from '@/core';

export const CreateVehicleBrandForm = ({ className }: { className?: string }) => {
  const { hideLoading } = useUiStore(state => state);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VehicleBrandFormValues>({
    resolver: zodResolver(vehicleBrandSchema),
  });

  const onSubmit = async (data: VehicleBrandFormValues) => {
    try {
      const vehicleBrand = await fetchCreateVehicleBrand({ ...data });
      if (vehicleBrand) router.push(`/vehicles/brands/details/${vehicleBrand.id}`);
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
