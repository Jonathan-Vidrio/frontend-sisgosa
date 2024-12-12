'use client';

import { convertToOptions } from '@/helpers/conver-to-options';
import { useProductsStore, useUiStore } from '@/store';
import { Product } from '@/interfaces';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { ProductFormValues } from '../../types/product-form-values';
import { productSchema } from '../../schemas/product.schema';
import { fetchCreateCategory, fetchGetCategories } from '../../fetching/categories';
import { fetchCreateProduct } from '../../fetching/products';
import { CustomButton, CustomInput, ImageUploader, Select } from '@/core';
import Link from 'next/link';

export const CreateProductForm = ({ className }: { className?: string }) => {
  const { showLoading, hideLoading } = useUiStore(state => state);
  const { categories } = useProductsStore(state => state);

  const [categoriesOptions, setCategoriesOptions] = useState<{ key: string; value: string }[]>([]);

  const router = useRouter();

  const {
    control,
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
  });

  const categoryDescription = useWatch({
    control,
    name: 'categoryDescription',
  });

  const loadData = async () => {
    try {
      if (!categories) await fetchGetCategories();
    } catch {}
  };

  const onSubmit = async (data: ProductFormValues) => {
    let categoryDescription = data.categoryDescription;

    if (data.categoryDescription === 'other' && data.newCategoryDescription) {
      try {
        const category = await fetchCreateCategory({ description: data.newCategoryDescription });
        if (category && category.description) categoryDescription = category.description;
      } catch {}
    }

    const productData: Product = {
      image: data.image,
      description: data.description,
      category: {
        description: categoryDescription,
      },
    };

    try {
      const product = await fetchCreateProduct({ ...productData });
      if (product) router.push(`/products/details/${product.id}`);
    } catch (error: any) {}
  };

  useEffect(() => {
    hideLoading();
  }, [hideLoading]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (categories) {
      const options = convertToOptions({ data: categories, withAll: false });
      options.push({ key: 'other', value: 'Other' });
      setCategoriesOptions(options);
    }
  }, [categories]);

  if (!categories) return null;
  if (!categories.length) {
    return (
      <div>
        <span>Necesary to register a </span>
        <Link href='/products/categories/create' className='text-blue-500 hover:underline' onClick={showLoading}>
          category
        </Link>
        <span> first</span>
      </div>
    );
  }

  return (
    <form className={`flex flex-col gap-y-5 ${className}`} onSubmit={handleSubmit(onSubmit)}>
      <div>
        <CustomInput label='Product Description' {...register('description')} />
        {errors.description && <small className='text-red-500'>{errors.description.message}</small>}
      </div>

      {categoriesOptions.length > 0 && (
        <div>
          <Controller
            name='categoryDescription'
            control={control}
            render={({ field }) => <Select label='Brand' options={categoriesOptions} {...field} />}
          />
          {errors.categoryDescription && <small className='text-red-500'>{errors.categoryDescription.message}</small>}
        </div>
      )}

      {categoryDescription === 'other' && (
        <div>
          <CustomInput label='New Category Description' {...register('newCategoryDescription')} />
          {errors.newCategoryDescription && <small className='text-red-500'>{errors.newCategoryDescription.message}</small>}
        </div>
      )}

      <div>
        <label className='mb-1 font-semibold text-sm'>Image (optional)</label>
        <ImageUploader
          onSelect={(file: File) => {
            setValue('image', file);
          }}
        />
      </div>

      <CustomButton type='submit'>Save</CustomButton>
    </form>
  );
};
