'use client';

import { useAuthStore, useModalStore, useUiStore } from '@/store';
import { Resource } from '@/interfaces';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { fetchDeleteResource, fetchGetResource, fetchRestoreResource } from '../../fetching/resources';
import { ActionsDetails, CustomButton, RowDetail } from '@/core';
import { convertUTCToLocal } from '@/helpers';

export const ResourceDetails = ({ id }: { id: string }) => {
  const { permissions } = useAuthStore(state => state);
  const { hideLoading } = useUiStore(state => state);
  const { openModal, setIsConfirm, setChildren, functions } = useModalStore(state => state);

  const [resource, setResource] = useState<Resource | null>(null);
  const [isActivated, setIsActivated] = useState<boolean>(false);

  const router = useRouter();

  const loadData = async () => {
    const fetchedResource = await fetchGetResource(id);
    setResource(fetchedResource);
    setIsActivated(!!fetchedResource.deletedAt);
  };

  const deleteData = async () => {
    try {
      const deleted = await fetchDeleteResource(id);
      if (deleted) await loadData();
    } catch {}
  };

  const restoreData = async () => {
    try {
      const restored = await fetchRestoreResource(id);
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
    setChildren('Are you sure you want to delete this resource?\n This action cannot be undone.');
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

  if (!resource) return null;

  return (
    <div className='flex flex-row-reverse justify-between'>
      <ActionsDetails
        isActivated={isActivated}
        canDelete={['superAdmin', 'admin', 'receptionist'].some(role => permissions?.includes(role))}
        handleDelete={handleDelete}
      />

      <div className='flex flex-col gap-y-5 w-1/2'>
        {resource.image && (
          <div>
            <Image alt='ad' src={resource.image as string} width={500} height={0} />
          </div>
        )}

        {resource.description && <RowDetail title='Description' value={resource.description} />}

        {resource.createdAt && <RowDetail title='Created At' value={convertUTCToLocal(resource.createdAt)} />}

        {resource.updatedAt && <RowDetail title='Updated At' value={convertUTCToLocal(resource.updatedAt)} />}

        {resource.deletedAt && (
          <RowDetail
            title='Deleted At'
            value={convertUTCToLocal(resource.deletedAt)}
            canAccess={['superAdmin', 'admin', 'receptionist', 'worker'].some(role => permissions?.includes(role))}
          />
        )}
      </div>
    </div>
  );
};
