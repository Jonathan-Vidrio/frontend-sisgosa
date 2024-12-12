'use client';

import { useAuthStore, useModalStore, useUiStore } from '@/store';
import { ServiceType } from '@/interfaces';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { fetchDeleteServiceType, fetchGetServiceType, fetchRestoreServiceType } from '../../fetching/services-types';
import { ActionsDetails, CustomButton, RowDetail } from '@/core';
import { convertUTCToLocal } from '@/helpers';

export const ServiceTypeDetails = ({ id }: { id: string }) => {
  const { permissions } = useAuthStore(state => state);
  const { showLoading, hideLoading } = useUiStore(state => state);
  const { openModal, setIsConfirm, setChildren, functions } = useModalStore(state => state);

  const [serviceType, setServiceType] = useState<ServiceType | null>(null);
  const [isActivated, setIsActivated] = useState<boolean>(false);

  const router = useRouter();

  const loadData = async () => {
    const fetchedServiceType = await fetchGetServiceType(id);
    setServiceType(fetchedServiceType);
    setIsActivated(!!fetchedServiceType.deletedAt);
  };

  const deleteData = async () => {
    try {
      const deleted = await fetchDeleteServiceType(id);
      if (deleted) await loadData();
    } catch {}
  };

  const restoreData = async () => {
    try {
      const restored = await fetchRestoreServiceType(id);
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
    setChildren('Are you sure you want to delete this service type?');
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

  if (!serviceType) return null;

  return (
    <div className='flex flex-row-reverse justify-between'>
      <ActionsDetails
        isActivated={isActivated}
        href={`/services/types/update/${id}`}
        canUpdate={['superAdmin', 'admin', 'receptionist'].some(role => permissions?.includes(role))}
        canDelete={['superAdmin', 'admin', 'receptionist'].some(role => permissions?.includes(role))}
        handleDelete={handleDelete}
      />

      <div className='flex flex-col gap-y-5 w-1/2'>
        {serviceType.description && <RowDetail title='Description' value={serviceType.description} />}

        {serviceType.createdAt && <RowDetail title='Created At' value={convertUTCToLocal(serviceType.createdAt)} />}

        {serviceType.updatedAt && <RowDetail title='Updated At' value={convertUTCToLocal(serviceType.updatedAt)} />}

        {serviceType.deletedAt && (
          <RowDetail
            title='Deleted At'
            value={convertUTCToLocal(serviceType.deletedAt)}
            canAccess={['superAdmin', 'admin', 'receptionist', 'worker'].some(role => permissions?.includes(role))}
          />
        )}
      </div>
    </div>
  );
};
