'use client';

import { useUiStore } from '@/store';
import { ProductCategory } from '@/interfaces';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ProductCategoryFormValues } from '../../types/product-category-form-values';
import { productCategorySchema } from '../../schemas/product-category.schema';
import { fetchGetProductCategory, fetchUpdateCategory } from '../../fetching/categories';
import { CustomButton, CustomInput } from '@/core';

export const UpdateProductCategoryForm = ({ id, className }: { id: string; className?: string }) => {
  const { hideLoading } = useUiStore(state => state);
  const [category, setCategory] = useState<ProductCategory | null>(null);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductCategoryFormValues>({
    resolver: zodResolver(productCategorySchema),
  });

  const loadData = async () => {
    try {
      const fetchedCategory = await fetchGetProductCategory(id);
      setCategory(fetchedCategory);
    } catch {}
  };

  const onSubmit = async (data: ProductCategoryFormValues) => {
    try {
      const productCategory = await fetchUpdateCategory(id, { ...data });
      if (productCategory) router.back();
    } catch {}
  };

  useEffect(() => {
    hideLoading();
  }, [hideLoading]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (category) {
      reset({ description: category.description });
    }
  }, [category, reset]);

  if (!category) return null;

  return (
    <form className={`flex flex-col gap-y-4 ${className}`} onSubmit={handleSubmit(onSubmit)}>
      <div>
        <CustomInput label='Description' {...register('description')} />
        {errors.description && <small className='text-red-500'>{errors.description.message}</small>}
      </div>

      <CustomButton type='submit'>Save</CustomButton>
    </form>
  );
};
