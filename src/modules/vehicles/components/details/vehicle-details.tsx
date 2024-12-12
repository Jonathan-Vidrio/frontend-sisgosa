'use client';

import { convertUTCToLocal, convertUTCToLocalDate, createError } from '@/helpers';
import { useAuthStore, useModalStore, useUiStore } from '@/store';
import { Vehicle } from '@/interfaces';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { fetchDeleteVehicle, fetchGetVehicle, fetchRestoreVehicle } from '../../fetching/vehicles';
import { ActionsDetails, CustomButton, RowDetail, Table } from '@/core';

export const VehicleDetails = ({ id }: { id: string }) => {
  const { permissions, user } = useAuthStore(state => state);
  const { hideLoading } = useUiStore(state => state);
  const { openModal, setIsConfirm, setChildren, functions } = useModalStore(state => state);

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [isActivated, setIsActivated] = useState<boolean>(false);

  const router = useRouter();

  const loadData = async () => {
    try {
      const fetchedVehicle = await fetchGetVehicle(id);
      setVehicle(fetchedVehicle);
      setIsActivated(!!fetchedVehicle.deletedAt);
    } catch {}
  };

  const deleteData = async () => {
    try {
      const deleted = await fetchDeleteVehicle(id);
      if (deleted) await loadData();
    } catch {}
  };

  const restoreData = async () => {
    try {
      const restored = await fetchRestoreVehicle(id);
      if (restored) await loadData();
    } catch {}
  };

  const handleDelete = async () => {
    if (isActivated) {
      try {
        await restoreData();
        return;
      } catch {}
    }

    setIsConfirm();
    setChildren('Are you sure you want to delete this vehicle?');
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
  }, [permissions, user]);

  const servicesColumns = [
    { key: 'id', value: 'ID' },
    { key: 'updatedAt', value: 'Last Update' },
    { key: 'serviceType.description', value: 'Service Type' },
    { key: 'status.description', value: 'Status' },
  ];

  const appointmentsColumns = [
    { key: 'id', value: 'ID' },
    { key: 'updatedAt', value: 'Last Update' },
    { key: 'status.description', value: 'Status' },
  ];

  const getNestedValue = (obj: any, path: string) => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  };

  if (!vehicle) return null;

  return (
    <>
      <div className='flex flex-row-reverse justify-between'>
        <ActionsDetails
          isActivated={isActivated}
          href={`/vehicles/update/${id}`}
          canDelete={['superAdmin', 'admin', 'receptionist', 'client'].some(role => permissions?.includes(role))}
          canUpdate={['superAdmin', 'admin', 'receptionist', 'client'].some(role => permissions?.includes(role))}
          handleDelete={handleDelete}
        />

        <div className='space-y-5'>
          {vehicle.image && (
            <div>
              <Image alt='ad' src={vehicle.image as string} width={500} height={0} />
            </div>
          )}

          {vehicle.client && (
            <RowDetail
              title='Owner'
              value={`${vehicle.client?.user?.firstName} ${vehicle.client?.user?.firstSurname} ${vehicle.client?.user?.secondSurname}`}
              href={`/users/details/${vehicle.client?.user?.id}`}
              message={vehicle.client?.user?.deletedAt ? 'This client is deleted. Please, select another one or restore this one.' : ''}
              canAccess={['superAdmin', 'admin', 'receptionist'].some(role => permissions?.includes(role))}
            />
          )}

          {vehicle.licensePlate && <RowDetail title='License Plate' value={vehicle.licensePlate} />}

          {vehicle.model?.brand && (
            <RowDetail
              title='Brand'
              value={vehicle.model?.brand?.description || ''}
              href={`/vehicles/brands/details/${vehicle.model?.brand?.id}`}
              message={vehicle.model?.brand?.deletedAt ? 'This brand is deleted. Please, select another one or restore this one.' : ''}
              canAccess={['superAdmin', 'admin', 'receptionist'].some(role => permissions?.includes(role))}
            />
          )}

          {vehicle.model && (
            <RowDetail
              title='Model'
              value={vehicle.model?.description || ''}
              href={`/vehicles/models/details/${vehicle.model?.id}`}
              message={vehicle.model?.deletedAt ? 'This model is deleted. Please, select another one or restore this one.' : ''}
              canAccess={['superAdmin', 'admin', 'receptionist'].some(role => permissions?.includes(role))}
            />
          )}

          {vehicle.color && <RowDetail title='Color' value={vehicle.color} />}

          {vehicle.version && <RowDetail title='Version' value={vehicle.version} />}

          {vehicle.createdAt && <RowDetail title='Created At' value={convertUTCToLocalDate(vehicle.createdAt)} />}

          {vehicle.updatedAt && <RowDetail title='Updated At' value={convertUTCToLocalDate(vehicle.updatedAt)} />}

          {vehicle.deletedAt && (
            <RowDetail
              title='Deleted At'
              value={convertUTCToLocal(vehicle.deletedAt)}
              canAccess={['superAdmin', 'admin', 'receptionist', 'worker'].some(role => permissions?.includes(role))}
            />
          )}
        </div>
      </div>

      <div className='mt-20'>
        <h1 className='text-xl font-bold'>Services History</h1>
        <div className='border-b border-gray-200 mt-2'></div>

        <Table
          columns={servicesColumns}
          data={(vehicle.services || [])?.map(item => {
            const row: any = {};
            servicesColumns.forEach(column => {
              if (column.key === 'createdAt' || column.key === 'updatedAt' || column.key === 'deletedAt') {
                row[column.key] = item[column.key] ? convertUTCToLocalDate(item[column.key] as Date) : '-';
              } else {
                row[column.key] = getNestedValue(item, column.key);
              }
            });
            return row;
          })}
          details
          href='/services/details/'
        />
      </div>

      <div className='mt-20'>
        <h1 className='text-xl font-bold'>Appointments History</h1>

        <div className='border-b border-gray-200 mt-2'></div>

        <Table
          columns={appointmentsColumns}
          data={(vehicle.appointments || [])?.map(item => {
            const row: any = {};
            servicesColumns.forEach(column => {
              if (column.key === 'createdAt' || column.key === 'updatedAt' || column.key === 'deletedAt') {
                row[column.key] = item[column.key] ? convertUTCToLocalDate(item[column.key] as Date) : '-';
              } else {
                row[column.key] = getNestedValue(item, column.key);
              }
            });
            return row;
          })}
          details
          href='/services/details/'
        />
      </div>
    </>
  );
};
