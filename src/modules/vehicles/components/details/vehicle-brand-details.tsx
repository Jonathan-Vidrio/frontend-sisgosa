'use client';

import { useModalStore, useUiStore } from '@/store';
import { VehicleBrand } from '@/interfaces';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { fetchDeleteVehicleBrand, fetchGetVehicleBrand, fetchRestoreVehicleBrand } from '../../fetching/brands';
import { CustomButton } from '@/core';

export const VehicleBrandDetails = ({ id }: { id: string }) => {
  const { showLoading, hideLoading } = useUiStore(state => state);
  const { openModal, setIsConfirm, setChildren, functions } = useModalStore(state => state);

  const [vehicleBrand, setVehicleBrand] = useState<VehicleBrand | null>(null);
  const [isActivated, setIsActivated] = useState<boolean>(false);

  const router = useRouter();

  const loadData = async () => {
    const fetchedVehicleBrand = await fetchGetVehicleBrand(id);
    setVehicleBrand(fetchedVehicleBrand);
    setIsActivated(!!fetchedVehicleBrand.deletedAt);
  };

  const deleteData = async () => {
    try {
      const deleted = await fetchDeleteVehicleBrand(id);
      if (deleted) await loadData();
    } catch {}
  };

  const restoreData = async () => {
    try {
      const restored = await fetchRestoreVehicleBrand(id);
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
    setChildren('Are you sure you want to delete this vehicle brand?');
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

  if (!vehicleBrand) return null;

  return (
    <div className='flex flex-row-reverse justify-between'>
      <div className='space-y-5'>
        <CustomButton color={isActivated ? '' : 'red'} onClick={handleDelete}>
          {isActivated ? 'Activate' : 'Delete'}
        </CustomButton>

        {!isActivated && (
          <CustomButton
            onClick={() => {
              router.push(`/vehicles/brands/update/${id}`);
              showLoading();
            }}
          >
            Edit
          </CustomButton>
        )}
      </div>

      <div className='space-y-5'>
        {vehicleBrand.description && (
          <div>
            <strong>Description</strong>
            <p>{vehicleBrand.description}</p>
          </div>
        )}

        {vehicleBrand.createdAt && (
          <div>
            <strong>Created At</strong>
            <p>{new Date(vehicleBrand.createdAt).toLocaleString()}</p>
          </div>
        )}

        {vehicleBrand.updatedAt && (
          <div>
            <strong>Updated At</strong>
            <p>{new Date(vehicleBrand.updatedAt).toLocaleString()}</p>
          </div>
        )}

        {vehicleBrand.deletedAt && (
          <div>
            <strong>Deleted At</strong>
            <p>{new Date(vehicleBrand.deletedAt).toLocaleString()}</p>
          </div>
        )}
      </div>
    </div>
  );
};
