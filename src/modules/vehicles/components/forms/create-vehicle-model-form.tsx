'use client';

import { convertToOptions } from '@/helpers/conver-to-options';
import { useUiStore, useVehiclesStore } from '@/store';
import { VehicleModel } from '@/interfaces';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { VehicleModelFormValues } from '../../types/vehicle-model-form-values';
import { vehicleModelSchema } from '../../schemas/vehicle-model.schema';
import { fetchCreateVehicleBrand, fetchGetVehicleBrands } from '../../fetching/brands';
import { fetchCreateVehicleModel } from '../../fetching/models';
import { CustomButton, CustomInput, Select } from '@/core';

export const CreateVehicleModelForm = ({ className }: { className?: string }) => {
  const { hideLoading } = useUiStore(state => state);
  const { brands } = useVehiclesStore(state => state);

  const [brandsOptions, setBrandsOptions] = useState<{ key: string; value: string }[]>([]);

  const router = useRouter();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VehicleModelFormValues>({
    resolver: zodResolver(vehicleModelSchema),
  });

  const selectedBrand = useWatch({
    control,
    name: 'brandDescription',
  });

  const loadData = async () => {
    try {
      if (!brands) await fetchGetVehicleBrands();
    } catch {}
  };

  const onSubmit = async (data: VehicleModelFormValues) => {
    let brandDescription = data.brandDescription;

    if (data.brandDescription === 'other' && data.newBrandDescription) {
      try {
        const brand = await fetchCreateVehicleBrand({ description: data.newBrandDescription });
        if (brand && brand.description) brandDescription = brand.description;
      } catch {}
    }

    const vehicleModelData: VehicleModel = {
      description: data.description,
      brand: {
        description: brandDescription,
      },
    };

    try {
      const vehicleModel = await fetchCreateVehicleModel(vehicleModelData);
      if (vehicleModel) router.push(`/vehicles/models/details/${vehicleModel.id}`);
    } catch {}
  };

  useEffect(() => {
    hideLoading();
  }, [hideLoading]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (brands) {
      const options = convertToOptions({ data: brands, withAll: false });
      options.push({ key: 'other', value: 'Other' });
      setBrandsOptions(options);
    }
  }, [brands]);

  if (!brands) return null;

  return (
    <form className={`flex flex-col gap-y-5 ${className}`} onSubmit={handleSubmit(onSubmit)}>
      <div>
        <CustomInput label='Model Description' {...register('description')} />
        {errors.description && <small className='text-red-500'>{errors.description.message}</small>}
      </div>

      {brandsOptions.length > 0 && (
        <div>
          <Controller control={control} name='brandDescription' render={({ field }) => <Select label='Brand' options={brandsOptions} {...field} />} />
          {errors.brandDescription && <small className='text-red-500'>{errors.brandDescription.message}</small>}
        </div>
      )}

      {selectedBrand === 'other' && (
        <div>
          <CustomInput label='New Brand Description' {...register('newBrandDescription')} />
          {errors.newBrandDescription && <small className='text-red-500'>{errors.newBrandDescription.message}</small>}
        </div>
      )}

      <CustomButton type='submit'>Save</CustomButton>
    </form>
  );
};
