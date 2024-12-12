'use client';

import { useModalStore, useUiStore } from '@/store';
import { Product } from '@/interfaces';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { fetchDeleteProduct, fetchGetProduct, fetchRestoreProduct } from '../../fetching/products';
import { CustomButton } from '@/core';

export const ProductDetails = ({ id }: { id: string }) => {
  const { showLoading, hideLoading } = useUiStore(state => state);
  const { openModal, setIsConfirm, setChildren, functions } = useModalStore(state => state);

  const [product, setProduct] = useState<Product | null>(null);
  const [isActivated, setIsActivated] = useState<boolean>(false);

  const router = useRouter();

  const loadData = async () => {
    try {
      const fetchedProduct = await fetchGetProduct(id);
      setProduct(fetchedProduct);
      setIsActivated(!!fetchedProduct?.deletedAt);
    } catch {}
  };

  const deleteData = async () => {
    try {
      const deleted = await fetchDeleteProduct(id);
      if (deleted) await loadData();
    } catch {}
  };

  const restoreData = async () => {
    try {
      const restored = await fetchRestoreProduct(id);
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
    setChildren('Are you sure you want to delete this product?');
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

  if (!product) return null;

  return (
    <div className='flex flex-row-reverse justify-between'>
      <div className='space-y-5'>
        <CustomButton color={isActivated ? '' : 'red'} onClick={handleDelete}>
          {isActivated ? 'Activate' : 'Delete'}
        </CustomButton>

        {!isActivated && (
          <CustomButton
            onClick={() => {
              router.push(`/products/update/${id}`);
              showLoading();
            }}
          >
            Edit
          </CustomButton>
        )}
      </div>

      <div className='flex flex-col gap-y-5 w-1/2'>
        {product.image && (
          <div>
            <Image alt='ad' src={product.image as string} width={500} height={0} />
          </div>
        )}

        {product.description && (
          <div>
            <strong>Description</strong>
            <p>{product.description}</p>
          </div>
        )}

        {product.category && (
          <div className='flex flex-col'>
            <>
              <strong>Category</strong>
              <Link
                href={`/products/categories/details/${product.category.id}`}
                className={`w-auto hover:underline ${product.category.deletedAt ? 'text-red-500' : 'text-blue-500'}`}
                onClick={showLoading}
              >
                {product.category.description}
              </Link>
              {product.category.deletedAt && (
                <small className='text-red-500'>This category is deleted. Please, select another one or restore this one.</small>
              )}
            </>
          </div>
        )}

        {product.createdAt && (
          <div>
            <strong>Created At</strong>
            <p>{new Date(product.createdAt).toLocaleString()}</p>
          </div>
        )}

        {product.updatedAt && (
          <div>
            <strong>Updated At</strong>
            <p>{new Date(product.updatedAt).toLocaleString()}</p>
          </div>
        )}

        {product.deletedAt && (
          <div>
            <strong>Deleted At</strong>
            <p>{new Date(product.deletedAt).toLocaleString()}</p>
          </div>
        )}
      </div>
    </div>
  );
};
