'use client';

import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useAppointmentsStore, useAuthStore, useUiStore } from '@/store';
import { ChevronRight, ListFilter } from 'lucide-react';
import { Appointment } from '@/interfaces';
import {
  fetchGetAppointments,
  fetchGetAppointmentsByClient,
  fetchGetAppointmentsByWorker,
  fetchGetDeletedAppointments,
  fetchGetDeletedAppointmentsByClient,
  fetchGetDeletedAppointmentsByWorker,
} from '../../fetching/appointments';
import { Calendar, CustomButton, CustomInput, Filters, Search, Table } from '@/core';
import { convertUTCToLocal, convertUTCToLocalDate, formatDate } from '@/helpers';
import { permission } from 'process';
import Link from 'next/link';

export const AppointmentsTable = ({ className }: { className?: string }) => {
  const { user, permissions } = useAuthStore(state => state);
  const { hideLoading, showLoading } = useUiStore(state => state);
  const { appointments } = useAppointmentsStore(state => state);

  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [showFilters, setShowFilters] = useState<boolean>(false);

  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const dropdownRef = useRef<HTMLDivElement>(null);

  const loadData = async () => {
    try {
      if (!appointments || !appointments.length) {
        if (['superAdmin', 'admin', 'receptionist'].some(role => permissions?.includes(role))) await fetchGetAppointments();
        if (['worker'].some(role => permissions?.includes(role)) && user?.worker?.id) await fetchGetAppointmentsByWorker(user?.worker?.id);
        if (['client'].some(role => permissions?.includes(role)) && user?.client?.id) await fetchGetAppointmentsByClient(user?.client?.id);
      }
    } catch {}
  };

  const getFilteredData = (term?: string) => {
    if (!appointments) return;

    let filtered = [...appointments];

    const searchValue = term?.toLowerCase() || searchTerm.toLowerCase();
    if (searchValue) {
      filtered = filtered.filter((appointment: Appointment) => {
        const clientFullName = `${appointment.client?.user?.firstName} ${appointment.client?.user?.firstSurname} ${appointment.client?.user?.secondSurname}`;
        const workerFullName = `${appointment.worker?.user?.firstName} ${appointment.worker?.user?.firstSurname} ${appointment.worker?.user?.secondSurname}`;

        return (
          clientFullName.toLowerCase().includes(searchValue) ||
          workerFullName.toLowerCase().includes(searchValue) ||
          appointment.vehicle?.licensePlate?.toLowerCase().includes(searchValue)
        );
      });
    }

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      filtered = filtered.filter((appointment: Appointment) => {
        if (!appointment.scheduleDate) return false;
        const appointmentDate = new Date(appointment.scheduleDate);
        appointmentDate.setDate(appointmentDate.getDate() - 1);
        return appointmentDate.getDate() >= start.getDate() && appointmentDate.getDate() <= end.getDate();
      });
    }

    setFilteredAppointments(filtered);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setStartDate('');
    setEndDate('');
  };

  const handleShowFilters = () => {
    setShowFilters(prev => !prev);
  };

  // Handle clicks outside to close the filters
  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setShowFilters(false);
    }
  };

  useEffect(() => {
    hideLoading();
  }, [hideLoading]);

  useEffect(() => {
    if (permissions?.length && user) loadData();
  }, [permissions, user]);

  useEffect(() => {
    if (appointments) setFilteredAppointments(appointments);
    console.log(appointments);
  }, [appointments]);

  useEffect(() => {
    getFilteredData();
  }, [searchTerm, startDate, endDate, appointments]);

  useEffect(() => {
    if (showFilters) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showFilters]);

  const columns = [
    { key: 'id', value: 'ID' },
    { key: 'vehicle.licensePlate', value: 'Vehicle' },
    { key: 'scheduleDate', value: 'Date' },
    { key: 'scheduleTime', value: 'Time' },
    { key: 'status.description', value: 'Status' },
  ];
  if (['worker', 'admin', 'superAdmin', 'receptionist'].some(role => permissions?.includes(role)))
    columns.push({ key: 'client.user.firstName', value: 'Client' });
  if (['client', 'admin', 'superAdmin', 'receptionist'].some(role => permissions?.includes(role)))
    columns.push({ key: 'worker.user.firstName', value: 'Worker' });

  const getNestedValue = (obj: any, path: string) => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  };

  if (!appointments) return null;

  return (
    <div className={`space-y-10 ${className}`}>
      <div className='absolute flex flex-row gap-x-5'>
        <Search
          className='w-96'
          onSearch={(value: string) => {
            setSearchTerm(value);
            getFilteredData(value);
          }}
          onReset={() => {
            resetFilters();
            setSearchTerm('');
          }}
        />

        <>
          <div className='w-[3px] bg-gray-300' />

          <Link
            href='/appointments/history'
            className='flex flex-row gap-x-2 text-white bg-blue-500 hover:bg-gray-400 p-3 rounded-md'
            onClick={showLoading}
          >
            History
            <ChevronRight size={24} />
          </Link>
        </>
      </div>

      <div className='flex flex-row justify-end gap-x-5 items-end'>
        <div ref={dropdownRef}>
          <CustomButton className='w-auto' onClick={handleShowFilters}>
            <ListFilter size={24} />
          </CustomButton>

          {showFilters && (
            <div className='absolute bg-gray-200 right-[440px]'>
              <Filters className='flex flex-col gap-y-3'>
                <button className='self-end font-bold hover:underline hover:text-blue-700' onClick={resetFilters}>
                  Clear Filters
                </button>

                <CustomInput
                  label='Start Date'
                  type='date'
                  value={startDate}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    setStartDate(e.target.value);
                  }}
                />

                <CustomInput
                  label='End Date'
                  type='date'
                  value={endDate}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    setEndDate(e.target.value);
                  }}
                />
              </Filters>
            </div>
          )}
        </div>
      </div>

      <Table
        columns={columns}
        data={filteredAppointments.map(item => {
          const row: any = {};
          columns.forEach(column => {
            if (column.key === 'scheduleDate') {
              row[column.key] = item[column.key] ? formatDate(item[column.key] as Date) : '-';
            } else {
              row[column.key] = getNestedValue(item, column.key);
            }
          });
          return row;
        })}
        details
        href='/appointments/details'
      />
    </div>
  );
};
