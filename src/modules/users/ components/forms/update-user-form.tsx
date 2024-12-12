'use client';

import { convertToOptions } from '@/helpers/conver-to-options';
import { useUiStore, useUsersStore } from '@/store';
import { User } from '@/interfaces';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { UserFormValues } from '../../types/user-form-values';
import { userSchema } from '../../schemas/user.schema';
import { fetchGetUser, fetchUpdateUser } from '../../fetching/users';
import { fetchGetUserTypes } from '../../fetching/user-types';
import { fetchGetWorkerTypes } from '../../fetching/worker-types';
import { CustomButton, CustomInput, Select } from '@/core';

export const UpdateUserForm = ({ id, className }: { className?: string; id: string }) => {
  const { userTypes = [], workerTypes = [] } = useUsersStore(state => state);
  const { hideLoading } = useUiStore(state => state);

  const [user, setUser] = useState<User | null>(null);
  const [userTypesOptions, setUserTypesOptions] = useState<{ key: string; value: string }[]>([]);
  const [workerTypesOptions, setWorkerTypesOptions] = useState<{ key: string; value: string }[]>([]);

  const router = useRouter();

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm<UserFormValues>({ resolver: zodResolver(userSchema) });

  const userTypeDescription = watch('userTypeDescription');

  const loadData = async () => {
    try {
      const fetchedUser = await fetchGetUser(id);
      setUser(fetchedUser);

      if (!userTypes.length) await fetchGetUserTypes();
      if (!workerTypes.length) await fetchGetWorkerTypes();
    } catch (error) {
      console.error(error);
    }
  };

  const onSubmit = async (data: UserFormValues) => {
    console.log(data.userTypeDescription);

    const userData: User = {
      firstName: data.firstName,
      firstSurname: data.firstSurname,
      secondSurname: data.secondSurname ? data.secondSurname : undefined,
      userType: {
        description: data.userTypeDescription,
      },
    };

    if (data.userTypeDescription === 'WORKER') {
      userData.worker = {
        id: user?.worker?.id,
        workerType: {
          description: data.workerTypeDescription,
        },
      };
    }

    if (data.userTypeDescription === 'CLIENT') {
      userData.client = {
        id: user?.client?.id,
        street: data.street ? data.street : undefined,
        number: data.number ? parseInt(data.number) : undefined,
        phoneNumber: data.phoneNumber,
      };
    }

    try {
      const updatedUser = await fetchUpdateUser(id, { ...userData });
      if (updatedUser) router.push(`/users/details/${id}`);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    hideLoading();
  }, [hideLoading]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (userTypes.length) setUserTypesOptions(convertToOptions({ data: userTypes, withAll: false }));
  }, [userTypes]);

  useEffect(() => {
    if (workerTypes.length) setWorkerTypesOptions(convertToOptions({ data: workerTypes, withAll: false }));
  }, [workerTypes]);

  useEffect(() => {
    if (user) {
      reset({
        email: user.email || '',
        firstName: user.firstName || '',
        firstSurname: user.firstSurname || '',
        secondSurname: user.secondSurname ?? '',
        userTypeDescription: user.userType?.description || '',
        workerTypeDescription: user.worker?.workerType?.description || '',
        street: user.client?.street ?? '',
        number: user.client?.number?.toString() ?? '',
        phoneNumber: user.client?.phoneNumber ?? '',
      });
    }
  }, [user, reset]);

  if (!user || !userTypesOptions.length || !workerTypesOptions.length) return null;

  return (
    <form className={`flex flex-col gap-y-5 ${className}`} onSubmit={handleSubmit(onSubmit)}>
      <div>
        <CustomInput label='Email' {...register('email')} disabled />
        {errors.email && <small className='text-red-500'>{errors.email.message}</small>}
      </div>

      <div>
        <CustomInput label='First Name' {...register('firstName')} />
        {errors.firstName && <small className='text-red-500'>{errors.firstName.message}</small>}
      </div>

      <div>
        <CustomInput label='First Surname' {...register('firstSurname')} />
        {errors.firstSurname && <small className='text-red-500'>{errors.firstSurname.message}</small>}
      </div>

      <div>
        <CustomInput label='Second Surname' {...register('secondSurname')} />
        {errors.secondSurname && <small className='text-red-500'>{errors.secondSurname.message}</small>}
      </div>

      {userTypes.length > 0 && (
        <div>
          <Controller
            control={control}
            name='userTypeDescription'
            render={({ field }) => <Select label='User Type' options={userTypesOptions} {...field} disabled />}
          />
          {errors.userTypeDescription && <small className='text-red-500'>{errors.userTypeDescription.message}</small>}
        </div>
      )}

      {userTypeDescription === 'WORKER' && workerTypes.length > 0 && (
        <div>
          <Controller
            control={control}
            name='workerTypeDescription'
            render={({ field }) => <Select label='Worker Type' options={workerTypesOptions} {...field} />}
          />
          {errors.workerTypeDescription && <small className='text-red-500'>{errors.workerTypeDescription.message}</small>}
        </div>
      )}

      {userTypeDescription === 'CLIENT' && (
        <>
          <div>
            <CustomInput label='Street' {...register('street')} />
            {errors.street && <small className='text-red-500'>{errors.street.message}</small>}
          </div>

          <div>
            <CustomInput label='Number' type='number' {...register('number')} />
            {errors.number && <small className='text-red-500'>{errors.number.message}</small>}
          </div>

          <div>
            <CustomInput label='Phone Number' {...register('phoneNumber')} />
            {errors.phoneNumber && <small className='text-red-500'>{errors.phoneNumber.message}</small>}
          </div>
        </>
      )}

      <CustomButton type='submit'>Save</CustomButton>
    </form>
  );
};
