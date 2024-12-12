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
import { fetchGetProduct, fetchUpdateProduct } from '../../fetching/products';
import { fetchCreateCategory, fetchGetCategories } from '../../fetching/categories';
import { CustomButton, CustomInput, ImageUploader, Select } from '@/core';

export const UpdateProductForm = ({ id, className }: { id: string; className?: string }) => {
  const { hideLoading } = useUiStore(state => state);
  const { categories } = useProductsStore(state => state);

  const [product, setProduct] = useState<Product | null>(null);
  const [categoriesOptions, setCategoriesOptions] = useState<{ key: string; value: string }[]>([]);

  const router = useRouter();

  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
    getValues,
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
  });

  const categoryDescription = useWatch({
    control,
    name: 'categoryDescription',
  });

  const loadData = async () => {
    try {
      const fetchedProduct = await fetchGetProduct(id);
      setProduct(fetchedProduct);

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
      image: typeof data.image === 'string' ? undefined : data.image,
      description: data.description,
      category: {
        description: categoryDescription,
      },
    };

    try {
      const product = await fetchUpdateProduct(id, { ...productData });
      if (product) router.back();
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

  useEffect(() => {
    if (product) {
      reset({
        description: product.description || '',
        categoryDescription: product.category?.description || '',
        image: product.image || '',
      });
      if (!getValues('image')) {
        register('image');
      }
    }
  }, [product, reset, register, getValues]);

  if (!categories || !product) return null;

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
            render={({ field }) => <Select label='Category' options={categoriesOptions} {...field} />}
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
          imageUrl={product.image as string}
        />
      </div>

      <CustomButton type='submit'>Save</CustomButton>
    </form>
  );
};
