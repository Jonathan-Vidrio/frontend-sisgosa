'use client';

import { useModalStore, useUiStore } from '@/store';
import { ProductCategory } from '@/interfaces';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { fetchDeleteCategory, fetchGetProductCategory, fetchRestoreCategory } from '../../fetching/categories';
import { CustomButton } from '@/core';

export const ProductCategoryDetails = ({ id }: { id: string }) => {
  const { showLoading, hideLoading } = useUiStore(state => state);
  const { openModal, setIsConfirm, setChildren, functions } = useModalStore(state => state);

  const [category, setCategory] = useState<ProductCategory | null>(null);
  const [isActivated, setIsActivated] = useState<boolean>(false);

  const router = useRouter();

  const loadData = async (): Promise<void> => {
    const fetchedCategory = await fetchGetProductCategory(id);
    setCategory(fetchedCategory);
    setIsActivated(!!fetchedCategory?.deletedAt);
  };

  const deleteData = async (): Promise<void> => {
    try {
      const deleted = await fetchDeleteCategory(id);
      if (deleted) await loadData();
    } catch {}
  };

  const restoreData = async (): Promise<void> => {
    try {
      const restored = await fetchRestoreCategory(id);
      if (restored) await loadData();
    } catch {}
  };

  const handleDelete = async (): Promise<void> => {
    if (isActivated) {
      try {
        await restoreData();
        return;
      } catch {}
    }

    setIsConfirm();
    setChildren('Are you sure you want to delete this category product?');
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

  if (!category) return null;

  return (
    <div className='flex flex-row-reverse justify-between'>
      <div className='space-y-5'>
        <CustomButton color={isActivated ? '' : 'red'} onClick={handleDelete}>
          {isActivated ? 'Activate' : 'Delete'}
        </CustomButton>

        {!isActivated && (
          <CustomButton
            onClick={() => {
              router.push(`/products/categories/update/${id}`);
              showLoading();
            }}
          >
            Edit
          </CustomButton>
        )}
      </div>

      <div className='space-y-5'>
        {category.description && (
          <div>
            <strong>Description</strong>
            <p>{category.description}</p>
          </div>
        )}

        {category.createdAt && (
          <div>
            <strong>Created At</strong>
            <p>{new Date(category.createdAt).toLocaleString()}</p>
          </div>
        )}

        {category.updatedAt && (
          <div>
            <strong>Updated At</strong>
            <p>{new Date(category.updatedAt).toLocaleString()}</p>
          </div>
        )}

        {category.deletedAt && (
          <div>
            <strong>Deleted At</strong>
            <p>{new Date(category.deletedAt).toLocaleString()}</p>
          </div>
        )}
      </div>
    </div>
  );
};
