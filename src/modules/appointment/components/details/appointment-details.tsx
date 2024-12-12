'use client';

import { useAuthStore, useModalStore, useStatusesStore, useUiStore } from '@/store';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { fetchDeleteAppointment, fetchGetAppointmentById, fetchRestoreAppointment, fetchUpdateAppointment } from '../../fetching/appointments';
import { ActionsDetails, CustomButton, RowDetail, Select } from '@/core';
import { Appointment } from '@/interfaces';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { fetchGetStatuses } from '@/modules/services/fetching/statuses/statutes';
import { convertToOptions, convertUTCToLocal, convertUTCToLocalDate, formatDate } from '@/helpers';

export const AppointmentDetails = ({ id }: { id: string }) => {
  const { permissions } = useAuthStore(state => state);
  const { hideLoading } = useUiStore(state => state);
  const { openModal, setIsConfirm, setChildren, functions } = useModalStore(state => state);
  const { statuses } = useStatusesStore(state => state);

  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [isActivated, setIsActivated] = useState<boolean>(false);
  const [statusesOptions, setStatusesOptions] = useState<{ key: string; value: string }[]>([]);

  const { setValue, control } = useForm<{ statusDescription: string }>();

  const statusDescription = useWatch({
    control,
    name: 'statusDescription',
  });

  const loadData = async () => {
    try {
      const fetchedAppointment = await fetchGetAppointmentById(id);
      setAppointment(fetchedAppointment);
      setIsActivated(!!fetchedAppointment.deletedAt);

      if (!statuses) await fetchGetStatuses();
    } catch {}
  };

  const deleteData = async () => {
    try {
      const deleted = await fetchDeleteAppointment(id);
      if (deleted) await loadData();
    } catch {}
  };

  const restoreData = async () => {
    try {
      const restored = await fetchRestoreAppointment(id);
      if (restored) await loadData();
    } catch {}
  };

  const changeStatus = async () => {
    setIsConfirm();
    setChildren('Are you sure you want to change this status?');
    openModal();
    functions.handleSubmit = async () => {
      try {
        const updated = await fetchUpdateAppointment(id, {
          status: {
            description: statusDescription,
          },
        });
      } catch {
      } finally {
        await loadData();
      }
    };
  };

  const handleDelete = async () => {
    if (isActivated) {
      try {
        await restoreData();
        return;
      } catch {}
    }

    setIsConfirm();
    setChildren('Are you sure you want to delete this appointment?');
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

  useEffect(() => {
    if (appointment) {
      setValue('statusDescription', appointment.status?.description || '');
    }
  }, [appointment]);

  useEffect(() => {
    if (statuses) setStatusesOptions(convertToOptions({ data: statuses, withAll: false }));
  }, [statuses]);

  useEffect(() => {
    if (statusDescription !== appointment?.status?.description) changeStatus();
  }, [statusDescription]);

  if (!appointment) return null;

  return (
    <div className='flex flex-row-reverse justify-between'>
      <ActionsDetails
        isActivated={isActivated}
        href={`/services/update/${id}`}
        canDelete={['superAdmin', 'admin', 'receptionist'].some(role => permissions?.includes(role))}
        handleDelete={handleDelete}
      />

      <div className='flex flex-col gap-y-5 w-1/2'>
        {['superAdmin', 'admin', 'receptionist'].some(role => permissions?.includes(role)) && statusesOptions.length > 0 ? (
          <div>
            <Controller
              name='statusDescription'
              control={control}
              render={({ field }) => <Select label='Status' options={statusesOptions} {...field} withSelectAnOption={false} disabled={isActivated} />}
            />
          </div>
        ) : (
          <RowDetail title='Status' value={appointment.status?.description || ''} />
        )}

        {appointment?.vehicle && ['superAdmin', 'admin', 'receptionist', 'worker', 'client'].some(role => permissions?.includes(role)) && (
          <RowDetail
            title='Vehicle'
            value={`${appointment.vehicle.licensePlate}`}
            href={`/vehicles/details/${appointment.vehicle.id}`}
            message={appointment.client?.user?.deletedAt ? 'This vehicle is deleted. Please, select another one or restore this one.' : ''}
            canAccess={['superAdmin', 'admin', 'receptionist', 'client'].some(role => permissions?.includes(role))}
          />
        )}

        {appointment?.client && ['superAdmin', 'admin', 'receptionist', 'worker'].some(role => permissions?.includes(role)) && (
          <RowDetail
            title='Client'
            value={`${appointment.client?.user?.firstName} ${appointment.client?.user?.firstSurname} ${appointment.client?.user?.secondSurname}`}
            href={`/users/details/${appointment.client?.user?.id}`}
            message={appointment.client?.user?.deletedAt ? 'This client is deleted. Please, select another one or restore this one.' : ''}
            canAccess={['superAdmin', 'admin', 'receptionist'].some(role => permissions?.includes(role))}
          />
        )}

        {appointment.scheduleDate && <RowDetail title='Schedule Date' value={formatDate(appointment.scheduleDate)} />}

        {appointment.scheduleTime && <RowDetail title='Schedule Time' value={appointment.scheduleTime} />}

        {appointment?.worker && ['superAdmin', 'admin', 'receptionist', 'client'].some(role => permissions?.includes(role)) && (
          <RowDetail
            title='Worker'
            value={`${appointment.worker?.user?.firstName} ${appointment.worker?.user?.firstSurname} ${appointment.worker?.user?.secondSurname}`}
            href={`/users/details/${appointment.worker?.user?.id}`}
            message={appointment.worker?.user?.deletedAt ? 'This worker is deleted. Please, select another one or restore this one.' : ''}
            canAccess={['superAdmin', 'admin', 'receptionist'].some(role => permissions?.includes(role))}
          />
        )}

        {appointment.createdAt && <RowDetail title='Created At' value={convertUTCToLocal(appointment.createdAt)} />}

        {appointment.updatedAt && <RowDetail title='Updated At' value={convertUTCToLocal(appointment.updatedAt)} />}

        {appointment?.deletedAt && (
          <RowDetail
            title='Deleted At'
            value={convertUTCToLocal(appointment.deletedAt)}
            canAccess={['superAdmin', 'admin', 'receptionist', 'worker'].some(role => permissions?.includes(role))}
          />
        )}
      </div>
    </div>
  );
};
