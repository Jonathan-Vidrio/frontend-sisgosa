'use client';

import { useModalStore, useUiStore } from '@/store';
import { VehicleModel } from '@/interfaces';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { fetchDeleteVehicleModel, fetchGetVehicleModel, fetchRestoreVehicleModel } from '../../fetching/models';
import { CustomButton } from '@/core';

export const VehicleModelDetails = ({ id }: { id: string }) => {
  const { showLoading, hideLoading } = useUiStore(state => state);
  const { openModal, setIsConfirm, setChildren, functions } = useModalStore(state => state);

  const [model, setModel] = useState<VehicleModel | null>(null);
  const [isActivated, setIsActivated] = useState<boolean>(false);

  const router = useRouter();

  const loadData = async () => {
    const fetchedModel = await fetchGetVehicleModel(id);
    setModel(fetchedModel);
    setIsActivated(!!fetchedModel?.deletedAt);
  };

  const deleteData = async () => {
    try {
      const deleted = await fetchDeleteVehicleModel(id);
      if (deleted) await loadData();
    } catch {}
  };

  const restoreData = async () => {
    try {
      const restored = await fetchRestoreVehicleModel(id);
      if (restored) await loadData();
    } catch {}
  };

  const handleDelete = async () => {
    try {
      if (isActivated) {
        await restoreData();
        return;
      }

      setIsConfirm();
      setChildren('Are you sure you want to delete this vehicle model?');
      openModal();
      functions.handleSubmit = async () => {
        await deleteData();
      };
    } catch {}
  };

  useEffect(() => {
    hideLoading();
  }, [hideLoading]);

  useEffect(() => {
    loadData();
  }, []);

  if (!model) return null;

  return (
    <div className='flex flex-row-reverse justify-between'>
      <div className='space-y-5'>
        <CustomButton color={isActivated ? '' : 'red'} onClick={handleDelete}>
          {isActivated ? 'Activate' : 'Delete'}
        </CustomButton>

        {!isActivated && <CustomButton onClick={() => router.push(`/vehicles/models/update/${id}`)}>Edit</CustomButton>}
      </div>

      <div className='space-y-5'>
        {model.description && (
          <div>
            <strong>Description</strong>
            <p>{model.description}</p>
          </div>
        )}

        {model.brand && (
          <div className='flex flex-col'>
            <strong>Brand</strong>
            {!model.brand?.deletedAt ? (
              <Link href={`/vehicles/brands/details/${model.brand?.id}`} className='text-blue-500 hover:underline w-auto'>
                {model.brand?.description}
              </Link>
            ) : (
              <div>
                <Link href={`/vehicles/brands/details/${model.brand?.id}`} className='text-red-500 hover:underline w-auto' onClick={showLoading}>
                  {model.brand?.description}
                </Link>
                <small className='text-red-500'>This brand is deleted. Please, select another one or restore this one.</small>
              </div>
            )}
          </div>
        )}

        {model.createdAt && (
          <div>
            <strong>Created At</strong>
            <p>{new Date(model.createdAt).toLocaleString()}</p>
          </div>
        )}

        {model.updatedAt && (
          <div>
            <strong>Updated At</strong>
            <p>{new Date(model.updatedAt).toLocaleString()}</p>
          </div>
        )}

        {model.deletedAt && (
          <div>
            <strong>Deleted At</strong>
            <p>{new Date(model.deletedAt).toLocaleString()}</p>
          </div>
        )}
      </div>
    </div>
  );
};
