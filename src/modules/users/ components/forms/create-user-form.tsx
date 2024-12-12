'use client';

import { convertToOptions } from '@/helpers/conver-to-options';
import { useAuthStore, useUiStore, useUsersStore } from '@/store';
import { User } from '@/interfaces';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { UserFormValues } from '../../types/user-form-values';
import { userSchema } from '../../schemas/user.schema';
import { fetchGetUserTypes } from '../../fetching/user-types';
import { fetchGetWorkerTypes } from '../../fetching/worker-types';
import { fetchCreateUser } from '../../fetching/users';
import { CustomButton, CustomInput, Select } from '@/core';
import { permission } from 'node:process';

export const CreateUserForm = ({ className }: { className?: string }) => {
  const { permissions } = useAuthStore(state => state);
  const { userTypes, workerTypes } = useUsersStore(state => state);
  const { hideLoading } = useUiStore(state => state);

  const [userTypesOptions, setUserTypesOptions] = useState<{ key: string; value: string }[]>([]);
  const [workerTypesOptions, setWorkerTypesOptions] = useState<{ key: string; value: string }[]>([]);

  const [selectedUserType, setSelectedUserType] = useState<any | null>(null);
  const [selectedWorkerType, setSelectedWorkerType] = useState<any | null>(null);

  const router = useRouter();

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      phoneNumber: '+52',
    },
  });

  const userTypeDescription = useWatch({
    control,
    name: 'userTypeDescription',
  });

  const loadData = async () => {
    try {
      if (!userTypes) await fetchGetUserTypes();
      if (!workerTypes) await fetchGetWorkerTypes();
    } catch {}
  };

  const onSubmit = async (data: UserFormValues) => {
    let userData: User = {
      email: data.email,
      firstName: data.firstName,
      firstSurname: data.firstSurname,
      secondSurname: data.secondSurname,
      userType: {
        description: data.userTypeDescription,
      },
    };

    if (data.userTypeDescription === 'CLIENT') {
      userData.client = {
        street: data.street || undefined,
        number: Number(data.number) || undefined,
        phoneNumber: data.phoneNumber,
      };
    }

    if (data.userTypeDescription === 'WORKER') {
      userData.worker = {
        workerType: {
          description: data.workerTypeDescription,
        },
      };
    }

    try {
      const user = await fetchCreateUser({ ...userData });
      if (user) router.push(`/users/details/${user.id}`);
    } catch {}
  };

  useEffect(() => {
    hideLoading();
  }, [hideLoading]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (userTypes) {
      if (permissions?.includes('receptionist')) {
        setUserTypesOptions([
          { key: 'CLIENT', value: 'CLIENT' },
          { key: 'WORKER', value: 'WORKER' },
        ]);
      } else {
        setUserTypesOptions(convertToOptions({ data: userTypes, withAll: false }));
      }
    }
  }, [userTypes]);

  useEffect(() => {
    if (workerTypes) {
      if (permissions?.includes('receptionist')) {
        setWorkerTypesOptions([{ key: 'MECHANIC', value: 'MECHANIC' }]);
      } else {
        setWorkerTypesOptions(convertToOptions({ data: workerTypes, withAll: false }));
      }
    }
  }, [workerTypes]);

  if (!userTypes || !workerTypes) return null;

  return (
    <form className={`flex flex-col gap-y-5 ${className}`} onSubmit={handleSubmit(onSubmit)}>
      <div>
        <CustomInput label='Email' {...register('email')} />
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

      {userTypesOptions.length > 0 && (
        <div>
          <Controller
            control={control}
            name='userTypeDescription'
            render={({ field }) => <Select label='User Type' options={userTypesOptions} {...field} />}
          />
          {errors.userTypeDescription && <small className='text-red-500'>{errors.userTypeDescription.message}</small>}
        </div>
      )}

      {userTypeDescription === 'WORKER' && workerTypesOptions.length > 0 && (
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
