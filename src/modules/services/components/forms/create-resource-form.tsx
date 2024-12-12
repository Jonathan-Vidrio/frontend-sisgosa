'use client';

import { useUiStore } from '@/store';
import { Resource, Service } from '@/interfaces';
import { zodResolver } from '@hookform/resolvers/zod';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { resourceSchema } from '../../schemas/resurce.schema';
import { fetchGetService } from '../../fetching/services';
import { fetchCreateResource } from '../../fetching/resources';
import { CustomButton, CustomInput, ImageUploader } from '@/core';
import { ResourceFormValues } from '../../types/resource-form-values';

export const CreateResourceForm = ({ className }: { className?: string }) => {
  const { hideLoading } = useUiStore(state => state);

  const [service, setService] = useState<Service | null>(null);

  const router = useRouter();
  const pathname = usePathname();

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<ResourceFormValues>({
    resolver: zodResolver(resourceSchema),
  });

  const loadData = async () => {
    const serviceId = pathname.split('/')[3];
    const fetchedService = await fetchGetService(serviceId);
    if (fetchedService) setService(fetchedService);
    else router.push('/services');
  };

  const onSubmit = async (data: ResourceFormValues) => {
    if (!service) return;

    const resourceData: Resource = {
      service: {
        id: service.id,
      },
      description: data.description,
      image: data.image,
    };

    try {
      const resource = await fetchCreateResource({ ...resourceData });
      if (resource) router.back();
    } catch {}
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

  if (!service) return null;

  return (
    <form className={`flex flex-col gap-y-4 ${className}`} onSubmit={handleSubmit(onSubmit)}>
      <div>
        <CustomInput label='Service' {...register('service')} disabled />
        {errors.service && <small className='text-red-500'>{errors.service.message}</small>}
      </div>

      <div>
        <CustomInput label='Description' {...register('description')} />
        {errors.description && <small className='text-red-500'>{errors.description.message}</small>}
      </div>

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
