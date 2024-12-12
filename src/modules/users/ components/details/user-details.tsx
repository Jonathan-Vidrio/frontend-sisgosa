'use client';

import { useAppointmentsStore, useAuthStore, useModalStore, useServicesStore, useUiStore } from '@/store';
import { Service, User } from '@/interfaces';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { fetchDeleteUser, fetchGetUser, fetchRestoreUser } from '../../fetching/users';
import {
  fetchGetServicesByClient,
  fetchGetServicesByWorker,
  fetchGetServicesHistoryByClient,
  fetchGetServicesHistoryByWorker,
} from '@/modules/services/fetching/services';
import { ActionsDetails, CustomButton, RowDetail, Table } from '@/core';
import { convertUTCToLocal, convertUTCToLocalDate } from '@/helpers';
import {
  fetchGetAppointmentsByClient,
  fetchGetAppointmentsByWorker,
  fetchGetAppointmentsHistoryByClient,
  fetchGetAppointmentsHistoryByWorker,
} from '@/modules/appointment/fetching/appointments';

export const UserDetails = ({ id }: { id: string }) => {
  const { user, permissions } = useAuthStore(state => state);
  const { hideLoading } = useUiStore(state => state);
  const { openModal, setIsConfirm, setChildren, functions } = useModalStore(state => state);

  const [userDetails, setUserDetails] = useState<User | null>(null);
  const [isActivated, setIsActivated] = useState<boolean>(false);

  const [services, setServices] = useState<Service[]>([]);
  const [servicesHistory, setServicesHistory] = useState<Service[]>([]);

  const [appointments, setAppointments] = useState<Service[]>([]);
  const [appointmentsHistory, setAppointmentsHistory] = useState<Service[]>([]);

  const router = useRouter();

  const loadData = async () => {
    try {
      const fetchedUser = await fetchGetUser(id);
      setUserDetails(fetchedUser);
      setIsActivated(!!fetchedUser.deletedAt);

      if (fetchedUser.client && fetchedUser.client.id) {
        setServices(await fetchGetServicesByClient(fetchedUser.client.id));
        setServicesHistory(await fetchGetServicesHistoryByClient(fetchedUser.client.id));
        setAppointments(await fetchGetAppointmentsByClient(fetchedUser.client.id));
        setAppointmentsHistory(await fetchGetAppointmentsHistoryByClient(fetchedUser.client.id));
      }

      if (fetchedUser.worker && fetchedUser.worker.id && fetchedUser.worker.workerType?.description !== 'receptionist') {
        setServices(await fetchGetServicesByWorker(fetchedUser.worker.id));
        setServicesHistory(await fetchGetServicesHistoryByWorker(fetchedUser.worker.id));
        setAppointments(await fetchGetAppointmentsByWorker(fetchedUser.worker.id));
        setAppointmentsHistory(await fetchGetAppointmentsHistoryByWorker(fetchedUser.worker.id));
      }
    } catch (error) {}
  };

  const deleteData = async () => {
    try {
      const deleted = await fetchDeleteUser(id);
      if (deleted) await loadData();
    } catch {}
  };

  const restoreData = async () => {
    try {
      const restored = await fetchRestoreUser(id);
      if (restored) loadData();
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
    setChildren('Are you sure you want to delete this user?');
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
    if (permissions?.length && user) {
      loadData();
    }
  }, [permissions, user]);

  const servicesColumns = [
    { key: 'id', value: 'ID' },
    { key: 'updatedAt', value: 'Last Update' },
    { key: 'serviceType.description', value: 'Service Type' },
    { key: 'status.description', value: 'Status' },
  ];

  const appointmentsColumns = [
    { key: 'id', value: 'ID' },
    { key: 'updatedAt', value: 'Last Update' },
    { key: 'status.description', value: 'Status' },
  ];

  const getNestedValue = (obj: any, path: string) => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  };

  if (!userDetails) return null;

  return (
    <>
      <div className='flex flex-row-reverse justify-between'>
        <ActionsDetails
          isActivated={isActivated}
          href={`/users/update/${id}`}
          canDelete={['superAdmin', 'admin', 'receptionist'].some(role => permissions?.includes(role))}
          canUpdate={['superAdmin', 'admin', 'receptionist'].some(role => permissions?.includes(role))}
          handleDelete={handleDelete}
        />

        <div className='space-y-5'>
          {userDetails.firstName && <RowDetail title='First Name' value={userDetails.firstName} />}

          {userDetails.firstSurname && <RowDetail title='First Surname' value={userDetails.firstSurname} />}

          {userDetails?.secondSurname && <RowDetail title='Second Surname' value={userDetails.secondSurname} />}

          {userDetails?.email && <RowDetail title='Email' value={userDetails.email} />}

          {userDetails?.userType?.description && <RowDetail title='User Type' value={userDetails?.userType?.description} />}

          {userDetails?.worker?.workerType?.description && <RowDetail title='Worker Type' value={userDetails?.worker?.workerType?.description} />}

          {userDetails.client?.phoneNumber && <RowDetail title='Phone Number' value={userDetails.client.phoneNumber} />}

          {userDetails.client?.street && userDetails.client?.number && (
            <RowDetail title='Address' value={`${userDetails.client.street} #${userDetails.client.number}`} />
          )}

          {userDetails?.status?.description && <RowDetail title='Status' value={userDetails?.status?.description} />}

          {userDetails?.createdAt && <RowDetail title='Created At' value={convertUTCToLocalDate(userDetails?.createdAt)} />}

          {userDetails?.updatedAt && <RowDetail title='Updated At' value={convertUTCToLocalDate(userDetails?.updatedAt)} />}

          {userDetails?.deletedAt && (
            <RowDetail
              title='Deleted At'
              value={convertUTCToLocalDate(userDetails?.deletedAt)}
              canAccess={['superAdmin', 'admin', 'receptionist', 'worker'].some(role => permissions?.includes(role))}
            />
          )}
        </div>
      </div>

      <div className='flex flex-col gap-y-5 mt-10'>
        {services && services?.length > 0 && (
          <div>
            <h1 className='text-xl font-bold'>Services</h1>
            <div className='border-b border-gray-200 mt-2'></div>

            <Table
              columns={servicesColumns}
              data={(services || [])?.map(item => {
                const row: any = {};
                servicesColumns.forEach(column => {
                  if (column.key === 'createdAt' || column.key === 'updatedAt' || column.key === 'deletedAt') {
                    row[column.key] = item[column.key] ? convertUTCToLocal(item[column.key] as Date) : '-';
                  } else {
                    row[column.key] = getNestedValue(item, column.key);
                  }
                });
                return row;
              })}
              details
              href='/services/details/'
            />
          </div>
        )}

        {servicesHistory && servicesHistory?.length > 0 && (
          <div>
            <h1 className='text-xl font-bold'>Services History</h1>
            <div className='border-b border-gray-200 mt-2'></div>

            <Table
              columns={servicesColumns}
              data={(servicesHistory || [])?.map(item => {
                const row: any = {};
                servicesColumns.forEach(column => {
                  if (column.key === 'createdAt' || column.key === 'updatedAt' || column.key === 'deletedAt') {
                    row[column.key] = item[column.key] ? convertUTCToLocal(item[column.key] as Date) : '-';
                  } else {
                    row[column.key] = getNestedValue(item, column.key);
                  }
                });
                return row;
              })}
              details
              href='/services/details/'
            />
          </div>
        )}

        {appointments && appointments?.length > 0 && (
          <div>
            <h1 className='text-xl font-bold'>Appointments</h1>
            <div className='border-b border-gray-200 mt-2'></div>

            <Table
              columns={appointmentsColumns}
              data={(appointments || [])?.map(item => {
                const row: any = {};
                appointmentsColumns.forEach(column => {
                  if (column.key === 'createdAt' || column.key === 'updatedAt' || column.key === 'deletedAt') {
                    row[column.key] = item[column.key] ? convertUTCToLocal(item[column.key] as Date) : '-';
                  } else {
                    row[column.key] = getNestedValue(item, column.key);
                  }
                });
                return row;
              })}
              details
              href='/services/details/'
            />
          </div>
        )}

        {appointmentsHistory && appointmentsHistory?.length > 0 && (
          <div>
            <h1 className='text-xl font-bold'>Appointments History</h1>
            <div className='border-b border-gray-200 mt-2'></div>

            <Table
              columns={appointmentsColumns}
              data={(appointmentsHistory || [])?.map(item => {
                const row: any = {};
                appointmentsColumns.forEach(column => {
                  if (column.key === 'createdAt' || column.key === 'updatedAt' || column.key === 'deletedAt') {
                    row[column.key] = item[column.key] ? convertUTCToLocal(item[column.key] as Date) : '-';
                  } else {
                    row[column.key] = getNestedValue(item, column.key);
                  }
                });
                return row;
              })}
              details
              href='/services/details/'
            />
          </div>
        )}
      </div>
    </>
  );
};
