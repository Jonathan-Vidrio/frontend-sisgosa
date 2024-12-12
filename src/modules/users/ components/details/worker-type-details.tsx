'use client';

import { useModalStore, useUiStore } from '@/store';
import { WorkerType } from '@/interfaces';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { fetchDeleteWorkerType, fetchGetWorkerType, fetchRestoreWorkerType } from '../../fetching/worker-types';
import { CustomButton } from '@/core';

export const WorkerTypeDetails = ({ id }: { id: string }) => {
  const { showLoading } = useUiStore(state => state);
  const { openModal, setIsConfirm, setChildren, functions } = useModalStore(state => state);

  const [workerType, setWorkerType] = useState<WorkerType | null>();
  const [isActivated, setIsActivated] = useState<boolean>(false);

  const router = useRouter();

  const loadData = async () => {
    try {
      const response = await fetchGetWorkerType(id);
      setWorkerType(response);
      setIsActivated(!!response?.deletedAt);
    } catch {}
  };

  const deleteData = async () => {
    try {
      const deleted = await fetchDeleteWorkerType(id);
      if (deleted) {
        setIsActivated(false);
        await loadData();
      }
    } catch {}
  };

  const restoreData = async () => {
    try {
      const restored = await fetchRestoreWorkerType(id);
      if (restored) {
        setIsActivated(true);
        await loadData();
      }
    } catch {}
  };

  const handleDelete = async () => {
    if (isActivated) {
      try {
        await restoreData();
        setIsActivated(false);
        return;
      } catch {}
    }

    setIsConfirm();
    setChildren('Are you sure you want to delete this worker type?');
    openModal();
    functions.handleSubmit = async () => {
      try {
        await deleteData();
      } catch {}
    };
  };

  useEffect(() => {
    loadData();
  }, []);

  if (!workerType) return null;

  return (
    <div className='flex flex-row-reverse justify-between'>
      <div className='space-y-5'>
        <CustomButton color={isActivated ? '' : 'red'} onClick={handleDelete}>
          {isActivated ? 'Activate' : 'Delete'}
        </CustomButton>

        {!isActivated && (
          <CustomButton
            color=''
            onClick={() => {
              router.push(`/users/worker-types/update/${id}`);
              showLoading();
            }}
          >
            Edit
          </CustomButton>
        )}
      </div>

      <div className='space-y-5'>
        <div>
          <strong>Name</strong>
          <p>{workerType.description}</p>
        </div>

        <div>
          <strong>Created At</strong>
          <p>{workerType.createdAt?.toString()}</p>
        </div>

        <div>
          <strong>Updated At</strong>
          <p>{workerType.updatedAt?.toString()}</p>
        </div>

        {workerType.deletedAt && (
          <div>
            <strong>Deleted At</strong>
            <p>{workerType.deletedAt.toString()}</p>
          </div>
        )}
      </div>
    </div>
  );
};
