'use client';

import { useUiStore } from '@/store';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { productCategorySchema } from '../../schemas/product-category.schema';
import { ProductCategoryFormValues } from '../../types/product-category-form-values';
import { fetchCreateCategory } from '../../fetching/categories';
import { CustomButton, CustomInput } from '@/core';

export const CreateProductCategoryForm = ({ className }: { className?: string }) => {
  const { hideLoading } = useUiStore(state => state);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductCategoryFormValues>({
    resolver: zodResolver(productCategorySchema),
  });

  const onSubmit = async (data: ProductCategoryFormValues) => {
    try {
      const productCategory = await fetchCreateCategory({ ...data });
      router.push(`/products/categories/details/${productCategory.id}`);
    } catch {}
  };

  useEffect(() => {
    hideLoading();
  }, [hideLoading]);

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
