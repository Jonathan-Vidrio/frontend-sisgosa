'use client';

import { createError } from '@/helpers';
import { convertToOptions } from '@/helpers/conver-to-options';
import { useAuthStore, useModalStore, useUiStore, useUsersStore, useVehiclesStore } from '@/store';
import { Client, User, Vehicle } from '@/interfaces';
import { zodResolver } from '@hookform/resolvers/zod';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { VehicleFormValues } from '../../types/vehicle-form-values';
import { vehicleSchema } from '../../schemas/vehicle.schema';
import { fetchGetVehicle, fetchUpdateVehicle } from '../../fetching/vehicles';
import { fetchGetVehicleBrands } from '../../fetching/brands';
import { fetchGetVehicleModels } from '../../fetching/models';
import { fetchGetUserByEmail, fetchGetUsers } from '@/modules/users/fetching/users';
import { CustomButton, CustomInput, ImageUploader, Select, SelectWithSearch } from '@/core';
import Link from 'next/link';
import { fetchGetClients } from '@/modules/users/fetching/clients';

export const UpdateVehicleForm = ({ id, className }: { id: string; className?: string }) => {
  const { permissions, user } = useAuthStore(state => state);
  const { hideLoading } = useUiStore(state => state);
  const { brands, models } = useVehiclesStore(state => state);
  const { clients } = useUsersStore(state => state);

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);

  const [brandsOptions, setBrandsOptions] = useState<{ key: string; value: string }[]>([]);
  const [modelsOptions, setModelsOptions] = useState<{ key: string; value: string }[]>([]);

  const [showClients, setShowClients] = useState<boolean>(false);
  const [clientsOptions, setClientsOptions] = useState<{ key: string; value: string }[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
    getValues,
  } = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleSchema),
  });

  const brandDescription = useWatch({
    control,
    name: 'brandDescription',
  });

  const modelDescription = useWatch({
    control,
    name: 'modelDescription',
  });

  const loadData = async () => {
    try {
      const fetchedVehicle = await fetchGetVehicle(id);
      setVehicle(fetchedVehicle);

      if (!brands) await fetchGetVehicleBrands();
      if (!models) await fetchGetVehicleModels();
      if (!clients && ['superAdmin', 'admin', 'receptionist'].some(role => permissions?.includes(role))) await fetchGetClients();
      if (['client'].some(role => permissions?.includes(role)) && user) setSelectedClient(user);
    } catch (error) {
      console.error(error);
    }
  };

  const onSubmit = async (data: VehicleFormValues) => {
    if (!selectedClient) return;

    const vehicleData: Vehicle = {
      image: data.image === vehicle?.image ? undefined : data.image,
      licensePlate: data.licensePlate,
      color: data.color,
      version: data.version,
      model: {
        description: data.modelDescription,
        brand: {
          description: data.brandDescription,
        },
      },
      client: {
        id: selectedClient?.id,
      },
    };

    try {
      const vehicle = await fetchUpdateVehicle(id, { ...vehicleData });
      if (vehicle) router.push(`/vehicles/details/${vehicle.id}`);
    } catch {}
  };

  const handleShowClients = () => {
    setShowClients(prev => !prev);
  };

  // Handle clicks outside to close the filters
  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setShowClients(false);
    }
  };

  useEffect(() => {
    hideLoading();
  }, [hideLoading]);

  useEffect(() => {
    loadData();
  }, [permissions, user]);

  useEffect(() => {
    if (brands) {
      const options = convertToOptions({ data: brands, withAll: false });
      setBrandsOptions(options);
    }
  }, [brands]);

  useEffect(() => {
    if (models && brandDescription) {
      const filteredModels = models.filter(model => model.brand?.description === brandDescription);
      const options = convertToOptions({ data: filteredModels, withAll: false });
      setModelsOptions(options);
    }
  }, [models, brandDescription]);

  useEffect(() => {
    if (clients) {
      const options = clients.map((client: Client) => ({
        key: client.user?.email || '',
        value: `${client.user?.firstName} ${client.user?.firstSurname} ${client.user?.secondSurname}`,
      }));
      setClientsOptions(options);
    }
  }, [clients]);

  useEffect(() => {
    if (selectedClient) {
      reset({
        ...getValues(),
        client: `${selectedClient.user?.firstName} ${selectedClient.user?.firstSurname} ${selectedClient.user?.secondSurname}`,
      });
    }
  }, [selectedClient]);

  useEffect(() => {
    if (vehicle) {
      reset({
        ...vehicle,
        brandDescription: vehicle.model?.brand?.description,
        modelDescription: vehicle.model?.description,
        client: `${vehicle.client?.user?.firstName} ${vehicle.client?.user?.firstSurname} ${vehicle.client?.user?.secondSurname}`,
      });

      if (!getValues('image')) {
        register('image');
      }
    }
  }, [vehicle, reset, getValues, register]);

  useEffect(() => {
    console.log(errors);
  }, [errors]);

  useEffect(() => {
    if (showClients) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showClients]);

  // Registrar el campo 'image'
  useEffect(() => {
    register('image');
  }, [register]);

  if (!brands || !models) return null;

  return (
    <form className={`flex flex-col gap-y-5 ${className}`} onSubmit={handleSubmit(onSubmit)}>
      {['superAdmin', 'admin', 'receptionist'].some(role => permissions?.includes(role)) && (
        <div>
          <div className='flex flex-row items-end gap-x-5'>
            <CustomInput className='w-full' label='Client' {...register('client')} disabled />

            <div ref={dropdownRef}>
              <CustomButton onClick={handleShowClients}>
                <Search />
              </CustomButton>

              {showClients && (
                <div className='absolute right-0 w-1/2 flex self-center px-10 mt-3'>
                  <SelectWithSearch
                    className='w-full'
                    columns={['Email', 'Name']}
                    options={clientsOptions}
                    onSelect={async (option: any) => {
                      const client = await fetchGetUserByEmail(option.key);
                      setSelectedClient(client);
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {errors.client && typeof errors.client.message === 'string' && <small className='text-red-500'>{errors.client.message}</small>}
        </div>
      )}

      <div>
        <CustomInput label='License Plate' disabled {...register('licensePlate')} />
        {errors.licensePlate && typeof errors.licensePlate.message === 'string' && (
          <small className='text-red-500'>{errors.licensePlate.message}</small>
        )}
      </div>

      <div>
        <CustomInput label='Color' {...register('color')} />
        {errors.color && typeof errors.color.message === 'string' && <small className='text-red-500'>{errors.color.message}</small>}
      </div>

      <div>
        <CustomInput label='Version' {...register('version')} />
        {errors.version && typeof errors.version.message === 'string' && <small className='text-red-500'>{errors.version.message}</small>}
      </div>

      {brandsOptions.length > 0 && (
        <div>
          <Controller name='brandDescription' control={control} render={({ field }) => <Select label='Brand' options={brandsOptions} {...field} />} />
          {errors.brandDescription && typeof errors.brandDescription.message === 'string' && (
            <small className='text-red-500'>{errors.brandDescription.message}</small>
          )}

          <small>
            If the brand is not in the list, please{' '}
            {!['client'].some(role => permissions?.includes(role)) ? (
              <Link href='/vehicles/brands/create' className='text-blue-500 hover:underline'>
                create it
              </Link>
            ) : (
              'contact us to add it to the list'
            )}
            .
          </small>
        </div>
      )}

      {modelsOptions.length > 0 && brandDescription && (
        <div>
          <Controller name='modelDescription' control={control} render={({ field }) => <Select label='Model' options={modelsOptions} {...field} />} />
          {errors.modelDescription && typeof errors.modelDescription.message === 'string' && (
            <small className='text-red-500'>{errors.modelDescription.message}</small>
          )}

          <small>
            If the model is not in the list, please{' '}
            {!['client'].some(role => permissions?.includes(role)) ? (
              <Link href='/vehicles/models/create' className='text-blue-500 hover:underline'>
                create it
              </Link>
            ) : (
              'contact us to add it to the list.'
            )}
            .
          </small>
        </div>
      )}

      <div>
        <label className='mb-1 font-semibold text-sm'>Image (optional)</label>
        <ImageUploader
          onSelect={(file: File) => {
            setValue('image', file);
          }}
          imageUrl={vehicle?.image as string}
        />
      </div>

      <CustomButton type='submit'>Save</CustomButton>
    </form>
  );
};
