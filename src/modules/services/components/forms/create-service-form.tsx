'use client';

import { convertToOptions } from '@/helpers';
import { useServicesStore, useUiStore, useUsersStore, useVehiclesStore } from '@/store';
import { Client, Resource, Service, User, Vehicle, Worker } from '@/interfaces';
import { zodResolver } from '@hookform/resolvers/zod';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { serviceSchema } from '../../schemas/service.schema';
import { ServiceFormValues } from '../../types/service-form-values';
import { fetchGetServicesTypes } from '../../fetching/services-types';
import { fetchCreateService } from '../../fetching/services';
import { fetchCreateResource } from '../../fetching/resources';
import { CustomButton, CustomInput, ImageUploader, Select, SelectWithSearch } from '@/core';
import { fetchGetVehicle, fetchGetVehicles } from '@/modules/vehicles/fetching/vehicles';
import { fetchGetUsers } from '@/modules/users/fetching/users';
import Link from 'next/link';
import { fetchGetClients } from '@/modules/users/fetching/clients';
import { fetchGetWorkers } from '@/modules/users/fetching/workers';

export const CreateServiceForm = ({ className }: { className?: string }) => {
  const { showLoading, hideLoading } = useUiStore(state => state);
  const { vehicles } = useVehiclesStore(state => state);
  const { serviceTypes } = useServicesStore(state => state);
  const { clients, workers } = useUsersStore(state => state);

  const [showVehicles, setShowVehicles] = useState<boolean>(false);
  const [showWorkers, setShowWorkers] = useState<boolean>(false);
  const [showClients, setShowClients] = useState<boolean>(false);

  const [vehiclesOptions, setVehiclesOptions] = useState<{ key: string; value: string }[]>([]);
  const [workersOptions, setWorkersOptions] = useState<{ key: string; value: string }[]>([]);
  const [clientsOptions, setClientsOptions] = useState<{ key: string; value: string }[]>([]);
  const [serviceTypesOptions, setServiceTypesOptions] = useState<{ key: string; value: string }[]>([]);

  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>();
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>();
  const [selectedClient, setSelectedClient] = useState<Client | null>();

  const dropdownRefVehicles = useRef<HTMLDivElement>(null);
  const dropdownRefWorkers = useRef<HTMLDivElement>(null);
  const dropdownRefClients = useRef<HTMLDivElement>(null);

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
      if (!vehicles) await fetchGetVehicles();
      if (!serviceTypes) await fetchGetServicesTypes();
      if (!clients) await fetchGetClients();
      if (!workers) await fetchGetWorkers();
    } catch {}
  };

  const onSubmit = async (data: ServiceFormValues) => {
    if (!selectedWorker || !selectedClient || !selectedVehicle) return;

    const serviceData: Service = {
      client: {
        id: selectedClient?.id,
      },
      worker: {
        id: selectedWorker?.id,
      },
      vehicle: {
        id: selectedVehicle?.id,
      },
      serviceType: {
        id: serviceTypes?.find(type => type.description === data.serviceTypeDescription)?.id,
        description: serviceTypes?.find(type => type.description === data.serviceTypeDescription)?.description,
      },
    };

    try {
      const createdService = await fetchCreateService({ ...serviceData });

      if (data.images.length > 0) {
        const resourcePromises = data.images.map(async (image, index) => {
          const resourceData: Resource = {
            image: image,
            description: `${data.observations || `Starting Condition`} : ${index + 1}`,
            service: {
              id: createdService.id,
            },
          };

          const createdResource = await fetchCreateResource({ ...resourceData });
          return createdResource;
        });

        const resources = await Promise.all(resourcePromises);
      }

      router.push(`/services/details/${createdService.id}`);
    } catch {}
  };

  // Handle clicks outside to close the filters
  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRefVehicles.current && !dropdownRefVehicles.current.contains(event.target as Node)) {
      setShowVehicles(false);
    }

    if (dropdownRefWorkers.current && !dropdownRefWorkers.current.contains(event.target as Node)) {
      setShowWorkers(false);
    }

    if (dropdownRefClients.current && !dropdownRefClients.current.contains(event.target as Node)) {
      setShowClients(false);
    }
  };

  useEffect(() => {
    hideLoading();
  }, [hideLoading]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (vehicles && selectedClient) {
      setVehiclesOptions(
        vehicles
          .filter(vehicle => vehicle.client?.id === selectedClient?.id)
          .map(vehicle => ({
            key: vehicle.id || '',
            value: `${vehicle.licensePlate} - ${vehicle.model?.brand?.description} ${vehicle.model?.description}`,
          }))
      );
    }
  }, [vehicles, selectedClient]);

  useEffect(() => {
    if (clients) {
      setClientsOptions(
        clients
          .filter(client => client.vehicles && client.vehicles.length > 0)
          .map(client => ({
            key: client.user?.email || '',
            value: `${client.user?.firstName} ${client.user?.firstSurname} ${client.user?.secondSurname}`,
          }))
      );
    }
  }, [clients]);

  useEffect(() => {
    if (workers) {
      setWorkersOptions(
        workers
          .filter(worker => worker?.workerType?.description?.toLowerCase() !== 'receptionist')
          .map(worker => ({
            key: worker.user?.email || '',
            value: `${worker.user?.firstName} ${worker.user?.firstSurname} ${worker.user?.secondSurname}`,
          }))
      );
    }
  }, [workers]);

  useEffect(() => {
    if (serviceTypes) setServiceTypesOptions(convertToOptions({ data: serviceTypes, withAll: false }));
  }, [serviceTypes]);

  useEffect(() => {
    if (selectedClient) {
      reset({
        ...getValues(),
        client: `${selectedClient.user?.firstName} ${selectedClient.user?.firstSurname} ${selectedClient.user?.secondSurname}`,
        vehicle: '',
      });

      setSelectedVehicle(null);
      setValue('vehicle', '');
    }
  }, [selectedClient]);

  useEffect(() => {
    if (selectedWorker) {
      reset({
        ...getValues(),
        worker: `${selectedWorker.user?.firstName} ${selectedWorker.user?.firstSurname} ${selectedWorker.user?.secondSurname}`,
      });
    }
  }, [selectedWorker]);

  useEffect(() => {
    if (selectedVehicle) {
      reset({
        ...getValues(),
        vehicle: `${selectedVehicle.licensePlate} - ${selectedVehicle.model?.brand?.description} ${selectedVehicle.model?.description}`,
      });
    }
  }, [selectedVehicle]);

  useEffect(() => {
    const isAnyDropdownOpen = showVehicles || showClients || showWorkers;

    if (isAnyDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', event => {
        if (event.key === 'Escape') {
          setShowVehicles(false);
          setShowClients(false);
          setShowWorkers(false);
        }
      });
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showVehicles, showClients, showWorkers]);

  if (!vehicles || !serviceTypes || !clients || !workers) return null;
  if (!serviceTypes.length || !workersOptions.length || !clientsOptions.length) {
    return (
      <div>
        <span>Necessary to register a </span>
        <Link
          href={!serviceTypes.length ? '/services/types/create' : '/users/create'}
          className='text-blue-500 hover:underline'
          onClick={showLoading}
        >
          {!serviceTypes.length ? 'service type' : !workersOptions.length ? 'worker' : 'client or vehicle'}
        </Link>
        <span> first</span>
      </div>
    );
  }

  return (
    <form className={`flex flex-col gap-y-5 ${className}`} onSubmit={handleSubmit(onSubmit)}>
      {clientsOptions.length > 0 && (
        <div>
          <div className='flex flex-row items-end gap-x-5'>
            <CustomInput className='w-full' label='Client' {...register('client')} disabled />

            <div ref={dropdownRefClients}>
              <CustomButton onClick={() => setShowClients(prev => !prev)}>
                <Search />
              </CustomButton>

              {showClients && (
                <div className='absolute right-0 w-1/2 flex self-center px-10 mt-3'>
                  <SelectWithSearch
                    className='w-full'
                    columns={['Email', 'Client']}
                    options={clientsOptions}
                    onSelect={(option: any) => {
                      const client = clients?.find(client => client.user?.email === option.key);
                      setSelectedClient(client);
                      setShowClients(false);
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {errors.client && typeof errors.client.message === 'string' && <span className='text-red-500 text-sm'>{errors.client.message}</span>}
        </div>
      )}

      {vehiclesOptions.length > 0 && selectedClient && (
        <div>
          <div className='flex flex-row items-end gap-x-5'>
            <CustomInput className='w-full' label='Vehicle' {...register('vehicle')} disabled />

            <div ref={dropdownRefVehicles}>
              <CustomButton onClick={() => setShowVehicles(prev => !prev)}>
                <Search />
              </CustomButton>

              {showVehicles && (
                <div className='absolute right-0 w-1/2 flex self-center px-10 mt-3'>
                  <SelectWithSearch
                    className='w-full'
                    columns={['License Plate', 'Model']}
                    options={vehiclesOptions}
                    onSelect={async (option: any) => {
                      const vehicle = await fetchGetVehicle(option.key);
                      setSelectedVehicle(vehicle);
                      setShowVehicles(false);
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {errors.vehicle && typeof errors.vehicle.message === 'string' && <span className='text-red-500 text-sm'>{errors.vehicle.message}</span>}
        </div>
      )}

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
                    columns={['Email', 'Worker']}
                    options={workersOptions}
                    onSelect={(option: any) => {
                      const worker = workers?.find(worker => worker.user?.email === option.key);
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

      <div className='flex flex-col'>
        <label className='mb-1 font-semibold text-sm'>Images (optional)</label>
        <small>This is to check the initial condition of the vehicle</small>
        <ImageUploader
          multiple={true}
          onSelect={(files: File[]) => {
            setValue('images', files);
          }}
        />
        {errors.images && <span className='text-red-500 text-sm'>{errors.images.message}</span>}
      </div>

      {images?.length > 0 && (
        <div>
          <CustomInput label='Description' {...register('observations')} />
          {errors.observations && <small className='text-red-500'>{errors.observations.message}</small>}
        </div>
      )}

      <CustomButton type='submit'>Save</CustomButton>
    </form>
  );
};
