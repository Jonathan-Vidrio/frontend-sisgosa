'use client';

import { useProductsStore, useUiStore } from '@/store';
import { Product, Service, ServiceDetail } from '@/interfaces';
import { zodResolver } from '@hookform/resolvers/zod';
import { Search } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ServiceDetailFormValues } from '../../types/service-detail-form-values';
import { serviceDetailSchema } from '../../schemas/service-detail.schema';
import { fetchGetService } from '../../fetching/services';
import { fetchGetProducts } from '@/modules/products/fetching/products';
import { fetchCreateServiceDetail } from '../../fetching/service-details';
import { CustomButton, CustomInput, SelectWithSearch } from '@/core';
import Link from 'next/link';

export const CreateServiceDetailForm = ({ className }: { className: string }) => {
  const { hideLoading } = useUiStore(state => state);
  const { products } = useProductsStore(state => state);

  const [service, setService] = useState<Service | null>(null);
  const [productsOptions, setProductsOptions] = useState<{ key: string; value: string }[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showProducts, setShowProducts] = useState<boolean>(false);

  const router = useRouter();
  const pathname = usePathname();

  const dropdownRef = useRef<HTMLDivElement>(null);

  const {
    control,
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<ServiceDetailFormValues>({
    resolver: zodResolver(serviceDetailSchema),
  });

  const loadData = async () => {
    const serviceId = pathname.split('/')[3];
    const fetchedService = await fetchGetService(serviceId);
    if (fetchedService) setService(fetchedService);
    else router.push('/services');

    if (!products) await fetchGetProducts();
  };

  const onSubmit = async (data: ServiceDetailFormValues) => {
    const serviceDetailData: ServiceDetail = {
      service: {
        id: service?.id,
      },
      product: {
        id: selectedProduct?.id,
      },
      productsQuantity: Number(data.productsQuantity),
      notes: data.notes,
    };

    try {
      const serviceDetail = await fetchCreateServiceDetail({ ...serviceDetailData });
      if (serviceDetail) router.back();
    } catch {}
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setShowProducts(false);
    }
  };

  useEffect(() => {
    hideLoading();
  }, []);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (service) setValue('service', service.id || '');
  }, [service]);

  useEffect(() => {
    if (products) {
      setProductsOptions(
        products.map(product => ({
          key: product.description || '',
          value: product.category?.description || '',
        }))
      );
    }
  }, [products]);

  useEffect(() => {
    if (selectedProduct) setValue('product', selectedProduct.description || '');
  }, [selectedProduct]);

  useEffect(() => {
    if (showProducts) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', event => {
        if (event.key === 'Escape') setShowProducts(false);
      });
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProducts]);

  if (!service || !products) return null;
  if (!productsOptions.length) {
    return (
      <div>
        <span>Necesary to register a </span>
        <Link href='/products/create' className='text-blue-500 hover:underline'>
          product
        </Link>
        <span> first</span>
      </div>
    );
  }

  return (
    <form className={`flex flex-col gap-y-4 ${className}`} onSubmit={handleSubmit(onSubmit)}>
      <div>
        <CustomInput label='Service' {...register('service')} disabled />
        {errors.service && <small className='text-red-500'>{errors.service.message}</small>}
      </div>

      <div>
        <div className='flex flex-row items-end gap-x-5'>
          <CustomInput className='w-full' label='Product' {...register('product')} disabled />

          <div ref={dropdownRef}>
            <CustomButton onClick={() => setShowProducts(prev => !prev)}>
              <Search />
            </CustomButton>

            {showProducts && (
              <div className='absolute right-0 w-1/2 flex self-center px-10 mt-3'>
                <SelectWithSearch
                  className='w-full'
                  columns={['Description', 'Category']}
                  options={productsOptions}
                  onSelect={(option: any) => {
                    const product = products?.find(product => product.description === option.key);
                    setSelectedProduct(product || null);
                    setShowProducts(false);
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {errors.product && typeof errors.product.message === 'string' && <span className='text-red-500 text-sm'>{errors.product.message}</span>}
      </div>

      <div>
        <CustomInput label='Products Quantity' type='number' {...register('productsQuantity')} />
        {errors.productsQuantity && <small className='text-red-500'>{errors.productsQuantity.message}</small>}
      </div>

      <div>
        <CustomInput label='Notes (optional)' {...register('notes')} />
        {errors.notes && <small className='text-red-500'>{errors.notes.message}</small>}
      </div>

      <CustomButton type='submit'>Save</CustomButton>
    </form>
  );
};
