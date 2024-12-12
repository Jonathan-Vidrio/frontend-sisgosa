'use client';

import { useAuthStore, useModalStore, useUiStore } from '@/store';
import { ServiceDetail } from '@/interfaces';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { fetchDeleteServiceDetail, fetchGetServiceDetail, fetchRestoreServiceDetail } from '../../fetching/service-details';
import { ActionsDetails, RowDetail } from '@/core';
import { convertUTCToLocal } from '@/helpers';

export const ServiceDetailDetails = ({ id }: { id: string }) => {
  const { permissions } = useAuthStore(state => state);
  const { hideLoading } = useUiStore(state => state);
  const { openModal, setIsConfirm, setChildren, functions } = useModalStore(state => state);

  const [serviceDetail, setServiceDetail] = useState<ServiceDetail | null>(null);
  const [isActivated, setIsActivated] = useState<boolean>(false);

  const router = useRouter();

  const loadData = async () => {
    const fetchedServiceDetail = await fetchGetServiceDetail(id);
    setServiceDetail(fetchedServiceDetail);
    setIsActivated(!!fetchedServiceDetail.deletedAt);
  };

  const deleteData = async () => {
    try {
      const deleted = await fetchDeleteServiceDetail(id);
      if (deleted) await loadData();
    } catch {}
  };

  const restoreData = async () => {
    try {
      const restored = await fetchRestoreServiceDetail(id);
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
    setChildren('Are you sure you want to delete this detail? This action cannot be undone.');
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

  if (!serviceDetail) return null;

  return (
    <div className='flex flex-row-reverse justify-between'>
      <ActionsDetails
        isActivated={isActivated}
        canDelete={['superAdmin', 'admin', 'receptionist'].some(role => permissions?.includes(role))}
        handleDelete={handleDelete}
      />

      <div className='flex flex-col gap-y-5 w-1/2'>
        {serviceDetail?.product && (
          <RowDetail
            title='Product'
            value={serviceDetail.product.description || ''}
            href={`/products/details/${serviceDetail.product.id}`}
            message={serviceDetail.product.deletedAt ? 'This product is deleted. Please, select another one or restore this one.' : ''}
            canAccess={['superAdmin', 'admin', 'receptionist', 'worker', 'client'].some(role => permissions?.includes(role))}
          />
        )}

        {serviceDetail?.productsQuantity && <RowDetail title='Products Quantity' value={serviceDetail.productsQuantity.toString()} />}

        {serviceDetail?.createdAt && <RowDetail title='Created At' value={convertUTCToLocal(serviceDetail.createdAt)} />}

        {serviceDetail?.updatedAt && <RowDetail title='Updated At' value={convertUTCToLocal(serviceDetail.updatedAt)} />}

        {serviceDetail?.deletedAt && (
          <RowDetail
            title='Deleted At'
            value={convertUTCToLocal(serviceDetail.deletedAt)}
            canAccess={['superAdmin', 'admin', 'receptionist', 'worker'].some(role => permissions?.includes(role))}
          />
        )}
      </div>
    </div>
  );
};
