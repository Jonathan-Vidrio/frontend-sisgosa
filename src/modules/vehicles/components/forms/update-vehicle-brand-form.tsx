'use client';

import { useUiStore } from '@/store';
import { VehicleBrand } from '@/interfaces';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { VehicleBrandFormValues } from '../../types/vehicle-brand-form-values';
import { vehicleBrandSchema } from '../../schemas/vehicle-brand.schema';
import { fetchGetVehicleBrand, fetchUpdateVehicleBrand } from '../../fetching/brands';
import { CustomButton, CustomInput } from '@/core';

export const UpdateVehicleBrandForm = ({ id, className }: { id: string; className?: string }) => {
  const { hideLoading } = useUiStore(state => state);
  const [vehicleBrand, setVehicleBrand] = useState<VehicleBrand | null>(null);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<VehicleBrandFormValues>({
    resolver: zodResolver(vehicleBrandSchema),
  });

  const loadData = async () => {
    try {
      const vehicleBrand = await fetchGetVehicleBrand(id);
      setVehicleBrand(vehicleBrand);
    } catch {}
  };

  const onSubmit = async (data: VehicleBrandFormValues) => {
    try {
      const vehicleBrand = await fetchUpdateVehicleBrand(id, { ...data });
      if (vehicleBrand) router.back();
      // router.push(`/vehicles/brands/details/${vehicleBrand.id}`);
    } catch {}
  };

  useEffect(() => {
    hideLoading();
  }, [hideLoading]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (vehicleBrand) {
      reset({ description: vehicleBrand.description });
    }
  }, [vehicleBrand, reset]);

  if (!vehicleBrand) return null;

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
