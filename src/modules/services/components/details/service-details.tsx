'use client';

import { convertToOptions } from '@/helpers/conver-to-options';
import { useAuthStore, useModalStore, useStatusesStore, useUiStore } from '@/store';
import { Resource, Service, ServiceDetail as ServiceDetailsData } from '@/interfaces';
import { SquarePlus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { fetchDeleteService, fetchGetService, fetchRestoreService, fetchUpdateService } from '../../fetching/services';
import { fetchGetResourcesByService } from '../../fetching/resources';
import { fetchGetServiceDetailsByService } from '../../fetching/service-details';
import { fetchGetStatuses } from '../../fetching/statuses/statutes';
import { ActionsDetails, RowDetail, Select, Table } from '@/core';
import { convertUTCToLocal } from '@/helpers';

export const ServiceDetails = ({ id }: { id: string }) => {
  const { user, permissions } = useAuthStore(state => state);
  const { showLoading, hideLoading } = useUiStore(state => state);
  const { openModal, setIsConfirm, setChildren, functions } = useModalStore(state => state);
  const { statuses } = useStatusesStore(state => state);

  const [service, setService] = useState<Service | null>(null);
  const [resources, setResources] = useState<Resource[] | null>(null);
  const [serviceDetailsData, setServiceDetailsData] = useState<ServiceDetailsData[] | null>(null);
  const [isActivated, setIsActivated] = useState<boolean>(false);

  const [statusesOptions, setStatusesOptions] = useState<{ key: string; value: string }[]>([]);

  const router = useRouter();

  const { setValue, control } = useForm<{ statusDescription: string }>();

  const statusDescription = useWatch({
    control,
    name: 'statusDescription',
  });

  const loadData = async () => {
    try {
      const fetchedService = await fetchGetService(id);
      setService(fetchedService);
      setIsActivated(!!fetchedService?.deletedAt);

      if (fetchedService.id) {
        const fetchedResources = await fetchGetResourcesByService(fetchedService.id);
        setResources(fetchedResources);

        const fetchedServiceDetailsData = await fetchGetServiceDetailsByService(fetchedService.id);
        setServiceDetailsData(fetchedServiceDetailsData);
      }

      if (!statuses) await fetchGetStatuses();
    } catch {}
  };

  const deleteData = async () => {
    try {
      const deleted = await fetchDeleteService(id);
      if (deleted) await loadData();
    } catch {}
  };

  const restoreData = async () => {
    try {
      const restored = await fetchRestoreService(id);
      if (restored) await loadData();
    } catch {}
  };

  const changeStatus = async () => {
    setIsConfirm();
    setChildren('Are you sure you want to change this status?');
    openModal();
    functions.handleSubmit = async () => {
      try {
        const updated = await fetchUpdateService(id, {
          status: {
            description: statusDescription,
          },
        });
      } catch {
      } finally {
        await loadData();
      }
    };
  };

  const handleDelete = async () => {
    if (isActivated) {
      try {
        await restoreData();
        return;
      } catch {}
    }

    setIsConfirm();
    setChildren('Are you sure you want to delete this service?');
    openModal();
    functions.handleSubmit = async () => {
      try {
        await deleteData();
      } catch {}
    };
  };

  useEffect(() => {
    hideLoading();
  }, [hideLoading]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (service) {
      setValue('statusDescription', service.status?.description || '');
    }
  }, [service]);

  useEffect(() => {
    if (statuses) setStatusesOptions(convertToOptions({ data: statuses, withAll: false }));
  }, [statuses]);

  useEffect(() => {
    if (statusDescription !== service?.status?.description) changeStatus();
  }, [statusDescription]);

  const columnsResources = [
    { key: 'id', value: 'ID' },
    { key: 'description', value: 'Description' },
    { key: 'updatedAt', value: 'Date' },
  ];

  const columnsServiceDetails = [
    { key: 'id', value: 'ID' },
    { key: 'product.description', value: 'Product' },
    { key: 'productsQuantity', value: 'Quantity' },
    { key: 'updatedAt', value: 'Date' },
  ];

  const getNestedValue = (obj: any, path: string) => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  };

  if (!service || !resources || !serviceDetailsData || !statuses) return null;

  return (
    <>
      <div className='flex flex-row-reverse justify-between'>
        <ActionsDetails
          isActivated={isActivated}
          href={`/services/update/${id}`}
          canUpdate={['superAdmin', 'admin', 'receptionist'].some(role => permissions?.includes(role))}
          canDelete={['superAdmin', 'admin', 'receptionist'].some(role => permissions?.includes(role))}
          handleDelete={handleDelete}
        />

        <div className='flex flex-col gap-y-5 w-1/2'>
          {['superAdmin', 'admin', 'receptionist'].some(role => permissions?.includes(role)) && statusesOptions.length > 0 && (
            <div>
              <Controller
                name='statusDescription'
                control={control}
                render={({ field }) => (
                  <Select label='Status' options={statusesOptions} {...field} withSelectAnOption={false} disabled={isActivated} />
                )}
              />
            </div>
          )}

          {service.vehicle?.licensePlate && (
            <RowDetail
              title='Vehicle'
              value={service.vehicle.licensePlate}
              href={`/vehicles/details/${service.vehicle.id}`}
              message={service.vehicle.deletedAt ? 'This vehicle has been deleted. Please, select another one or restore it' : ''}
              canAccess={['superAdmin', 'admin', 'receptionist', 'client'].some(role => permissions?.includes(role))}
            />
          )}

          {service.client && !permissions?.includes('client') && (
            <RowDetail
              title='Client'
              value={`${service.client.user?.firstName} ${service.client.user?.firstSurname} ${service.client.user?.secondSurname}`}
              href={`/users/details/${service.client.user?.id}`}
              message={service.client.deletedAt ? 'This client has been deleted. Please, select another one or restore it' : ''}
              canAccess={['superAdmin', 'admin', 'receptionist'].some(role => permissions?.includes(role))}
            />
          )}

          {service.worker && (
            <RowDetail
              title='Worker'
              value={`${service.worker.user?.firstName} ${service.worker.user?.firstSurname} ${service.worker.user?.secondSurname}`}
              href={`/users/details/${service.worker.user?.id}`}
              message={service.worker.deletedAt ? 'This worker has been deleted. Please, select another one or restore it' : ''}
              canAccess={['superAdmin', 'admin', 'receptionist'].some(role => permissions?.includes(role))}
            />
          )}

          {service?.serviceType && (
            <RowDetail
              title='Service Type'
              value={service.serviceType?.description || ''}
              href={`/services/types/details/${service.serviceType.id}`}
              message={service.serviceType.deletedAt ? 'This service type has been deleted. Please, select another one or restore it' : ''}
              canAccess={['superAdmin', 'admin', 'receptionist'].some(role => permissions?.includes(role))}
            />
          )}

          {service.status && <RowDetail title='Status' value={service.status.description || ''} />}

          {service.createdAt && <RowDetail title='Created At' value={convertUTCToLocal(service.createdAt)} />}

          {service.updatedAt && <RowDetail title='Updated At' value={convertUTCToLocal(service.updatedAt)} />}

          {service?.deletedAt && (
            <RowDetail
              title='Deleted At'
              value={convertUTCToLocal(service.deletedAt)}
              canAccess={['superAdmin', 'admin', 'receptionist', 'worker'].some(role => permissions?.includes(role))}
            />
          )}
        </div>
      </div>

      <div className='mt-20 relative'>
        <div>
          <h1 className='text-xl font-bold'>Resources</h1>

          <div className='border-b border-gray-200 mt-2'></div>

          {['superAdmin', 'admin', 'receptionist', 'worker'].some(role => permissions?.includes(role)) && (
            <Link
              href={`/services/details/${id}/resources/create`}
              className='absolute right-0 top-0 bg-blue-500 hover:bg-gray-500 text-white p-2 rounded-md'
              onClick={showLoading}
            >
              <SquarePlus />
            </Link>
          )}
        </div>

        <Table
          columns={columnsResources}
          data={resources?.map(item => {
            const row: Record<string, any> = {};
            columnsResources.forEach(column => {
              if (column.key === 'createdAt' || column.key === 'updatedAt' || column.key === 'deletedAt') {
                row[column.key] = item[column.key] ? convertUTCToLocal(item[column.key] as Date) : '-';
              } else {
                row[column.key] = getNestedValue(item, column.key);
              }
            });
            return row;
          })}
          details
          href={`/services/details/${id}/resources/details`}
        />
      </div>

      <div className='mt-20 relative'>
        <div>
          <h1 className='text-xl font-bold'>Details and Producs</h1>

          <div className='border-b border-gray-200 mt-2'></div>

          {['superAdmin', 'admin', 'receptionist', 'worker'].some(role => permissions?.includes(role)) && (
            <Link
              href={`/services/details/${id}/service-detail/create`}
              className='absolute right-0 top-0 bg-blue-500 hover:bg-gray-500 text-white p-2 rounded-md'
              onClick={showLoading}
            >
              <SquarePlus />
            </Link>
          )}
        </div>

        <Table
          columns={columnsServiceDetails}
          data={serviceDetailsData?.map(item => {
            const row: any = {};
            columnsServiceDetails.forEach(column => {
              if (column.key === 'createdAt' || column.key === 'updatedAt' || column.key === 'deletedAt') {
                row[column.key] = item[column.key] ? convertUTCToLocal(item[column.key] as Date) : '-';
              } else {
                row[column.key] = getNestedValue(item, column.key);
              }
            });
            return row;
          })}
          details
          href={`/services/details/${id}/service-detail/details`}
        />
      </div>
    </>
  );
};
