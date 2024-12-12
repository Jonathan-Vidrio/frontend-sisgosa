'use client';

import { useServicesStore, useUiStore, useUsersStore, useVehiclesStore } from '@/store';
import { Service, User, Vehicle } from '@/interfaces';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { convertToOptions } from '@/helpers';
import { Search } from 'lucide-react';
import { ServiceFormValues } from '../../types/service-form-values';
import { serviceSchema } from '../../schemas/service.schema';
import { fetchGetService, fetchUpdateService } from '../../fetching/services';
import { fetchGetServicesTypes } from '../../fetching/services-types';
import { CustomButton, CustomInput, Select, SelectWithSearch } from '@/core';
import { fetchGetVehicle, fetchGetVehicles } from '@/modules/vehicles/fetching/vehicles';
import { fetchGetUsers } from '@/modules/users/fetching/users';

export const UpdateServiceForm = ({ id, className }: { id: string; className?: string }) => {
  const { hideLoading } = useUiStore(state => state);
  const { vehicles } = useVehiclesStore(state => state);
  const { serviceTypes } = useServicesStore(state => state);
  const { users } = useUsersStore(state => state);

  const [service, setService] = useState<Service | null>();
  const [vehicle, setVehicle] = useState<Vehicle | null>();

  const [showVehicles, setShowVehicles] = useState<boolean>(false);
  const [showWorkers, setShowWorkers] = useState<boolean>(false);
  const [showClients, setShowClients] = useState<boolean>(false);

  const [vehiclesOptions, setVehiclesOptions] = useState<{ key: string; value: string }[]>([]);
  const [workersOptions, setWorkersOptions] = useState<{ key: string; value: string }[]>([]);
  const [clientsOptions, setClientsOptions] = useState<{ key: string; value: string }[]>([]);
  const [serviceTypesOptions, setServiceTypesOptions] = useState<{ key: string; value: string }[]>([]);

  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>();
  const [selectedWorker, setSelectedWorker] = useState<User | null>();
  const [selectedClient, setSelectedClient] = useState<User | null>();

  const dropdownRefWorkers = useRef<HTMLDivElement>(null);

  const router = useRouter();

  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
    getValues,
  } = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
  });

  const serviceTypeDescription = useWatch({
    control,
    name: 'serviceTypeDescription',
  });

  const images = useWatch({
    control,
    name: 'images',
  });

  const loadData = async () => {
    try {
      const fetchedService = await fetchGetService(id);
      setService(fetchedService);

      if (fetchedService.vehicle && fetchedService.vehicle.id) {
        const fetchedVehicle = await fetchGetVehicle(fetchedService.vehicle.id);
        setVehicle(fetchedVehicle);
        setSelectedVehicle(fetchedVehicle);
      }

      if (!vehicles) await fetchGetVehicles();
      if (!serviceTypes) await fetchGetServicesTypes();
      if (!users) await fetchGetUsers();
    } catch {}
  };

  const onSubmit = async (data: ServiceFormValues) => {
    if (!selectedWorker || !selectedClient) return;

    const serviceData: Service = {
      worker: {
        id: selectedWorker.worker?.id,
      },
      serviceType: {
        description: serviceTypes?.find(type => type.description === data.serviceTypeDescription)?.description,
      },
    };

    try {
      const service = await fetchUpdateService(id, { ...serviceData });
      if (service) router.back();
    } catch {}
  };

  // Handle clicks outside to close the filters
  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRefWorkers.current && !dropdownRefWorkers.current.contains(event.target as Node)) {
      setShowWorkers(false);
    }
  };

  useEffect(() => {
    hideLoading();
  }, [hideLoading]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (users) {
      setWorkersOptions(
        users
          .filter(user => user.userType?.description === 'worker' && user.worker?.workerType?.description?.toLowerCase() !== 'receptionist')
          .map(worker => ({
            key: worker.email || '',
            value: `${worker.firstName} ${worker.firstSurname} ${worker.secondSurname}`,
          }))
      );
    }
  }, [users]);

  useEffect(() => {
    if (serviceTypes) setServiceTypesOptions(convertToOptions({ data: serviceTypes, withAll: false }));
  }, [serviceTypes]);

  useEffect(() => {
    if (service) {
      reset({
        client: `${service.client?.user?.firstName} ${service.client?.user?.firstSurname} ${service.client?.user?.secondSurname}`,
        vehicle: `${service.vehicle?.licensePlate} - ${service.vehicle?.model?.brand?.description} ${service.vehicle?.model?.description}`,
        worker: `${service.worker?.user?.firstName} ${service.worker?.user?.firstSurname} ${service.worker?.user?.secondSurname}`,
        serviceTypeDescription: service.serviceType?.description || '',
      });

      // Establecer los elementosetVehicles seleccionados
      setSelectedClient(service.client?.user || null);
      setSelectedVehicle(service.vehicle || null);
      setSelectedWorker(service.worker?.user || null);
    }
  }, [service, reset]);

  useEffect(() => {
    const isAnyDropdownOpen = showVehicles || showClients || showWorkers;

    if (isAnyDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showVehicles, showClients, showWorkers]);

  useEffect(() => {
    if (selectedWorker) {
      setValue('worker', `${selectedWorker.firstName} ${selectedWorker.firstSurname} ${selectedWorker.secondSurname}`);
    }
  }, [selectedWorker, setValue]);

  useEffect(() => {
    if (selectedVehicle) {
      setValue('vehicle', `${selectedVehicle.licensePlate} - ${selectedVehicle.model?.brand?.description} ${selectedVehicle.model?.description}`);
    }
  }, [selectedVehicle, setValue]);

  if (!vehicles || !serviceTypes || !users) return null;

  return (
    <form className={`flex flex-col gap-y-5 ${className}`} onSubmit={handleSubmit(onSubmit)}>
      <div>
        <CustomInput className='w-full' label='Client' {...register('client')} disabled />
        {errors.client && typeof errors.client.message === 'string' && <span className='text-red-500 text-sm'>{errors.client.message}</span>}
      </div>

      <div>
        <CustomInput className='w-full' label='Vehicle' {...register('vehicle')} disabled />
        {errors.vehicle && typeof errors.vehicle.message === 'string' && <span className='text-red-500 text-sm'>{errors.vehicle.message}</span>}
      </div>

      {workersOptions.length > 0 && (
        <div>
          <div className='flex flex-row items-end gap-x-5'>
            <CustomInput className='w-full' label='Worker' {...register('worker')} disabled />

            <div ref={dropdownRefWorkers}>
              <CustomButton onClick={() => setShowWorkers(prev => !prev)}>
                <Search />
              </CustomButton>

              {showWorkers && (
                <div className='absolute right-0 w-1/2 flex self-center px-10 mt-3'>
                  <SelectWithSearch
                    className='w-full'
                    columns={['Name', 'Worker Type']}
                    options={workersOptions}
                    onSelect={(option: any) => {
                      const worker = users?.find(user => user.email === option.key);
                      setSelectedWorker(worker);
                      setShowWorkers(false);
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {errors.worker && typeof errors.worker.message === 'string' && <span className='text-red-500 text-sm'>{errors.worker.message}</span>}
        </div>
      )}

      {serviceTypesOptions.length > 0 && (
        <div>
          <Controller
            control={control}
            name='serviceTypeDescription'
            render={({ field }) => <Select label='Service Type' options={serviceTypesOptions} {...field} />}
          />
          {errors.serviceTypeDescription && <small className='text-red-500'>{errors.serviceTypeDescription.message}</small>}
        </div>
      )}

      <CustomButton type='submit'>Save</CustomButton>
    </form>
  );
};
