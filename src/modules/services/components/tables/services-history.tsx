'use client';

import { Service } from '@/interfaces';
import { useAuthStore, useServicesStore, useStatusesStore, useUiStore } from '@/store';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { fetchGetServicesTypes } from '../../fetching/services-types';
import { fetchGetStatuses } from '../../fetching/statuses/statutes';
import { convertToOptions, convertUTCToLocalDate } from '@/helpers';
import { CustomButton, CustomInput, Filters, Search, Select, Table } from '@/core';
import Link from 'next/link';
import { ChevronRight, ListFilter } from 'lucide-react';
import {
  fetchGetDeletedServices,
  fetchGetDeletedServicesByClient,
  fetchGetDeletedServicesByWorker,
  fetchGetServicesHistory,
  fetchGetServicesHistoryByClient,
  fetchGetServicesHistoryByWorker,
} from '../../fetching/services';

export const ServicesHistory = () => {
  const { user, permissions } = useAuthStore(state => state);
  const { history, serviceTypes } = useServicesStore(state => state);
  const { statuses } = useStatusesStore(state => state);
  const { hideLoading } = useUiStore(state => state);

  const [filteredServices, setFilteredServices] = useState<Service[]>([]);

  const [serviceTypesOptions, setServiceTypesOptions] = useState<{ key: String; value: string }[]>([]);
  const [statusOptions, setStatusOptions] = useState<{ key: String; value: string }[]>([]);

  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [getDeleted, setGetDeleted] = useState<boolean>(false);
  const [selectedServiceTypeOption, setSelectedServiceTypeOption] = useState<string>('');
  const [selectedStatusOption, setSelectedStatusOption] = useState<string>('');

  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const dropdownRef = useRef<HTMLDivElement>(null);

  const loadData = async () => {
    try {
      if (!history) {
        if (['superAdmin', 'admin', 'receptionist'].some(role => permissions?.includes(role))) await fetchGetServicesHistory();
        if (['worker'].some(role => permissions?.includes(role)) && user?.worker?.id) await fetchGetServicesHistoryByWorker(user?.worker?.id);
        if (['client'].some(role => permissions?.includes(role)) && user?.client?.id) await fetchGetServicesHistoryByClient(user?.client?.id);
      }

      if (!serviceTypes) await fetchGetServicesTypes();
      if (!statuses) await fetchGetStatuses();
    } catch {}
  };

  const loadDeletedData = async () => {
    try {
      if (getDeleted) {
        if (['superAdmin', 'admin', 'receptionist'].some(role => permissions?.includes(role))) await fetchGetDeletedServices();
        if (['worker'].some(role => permissions?.includes(role)) && user?.worker?.id) await fetchGetDeletedServicesByWorker(user?.worker?.id);
        if (['client'].some(role => permissions?.includes(role)) && user?.client?.id) await fetchGetDeletedServicesByClient(user?.client?.id);
      } else {
        if (['superAdmin', 'admin', 'receptionist'].some(role => permissions?.includes(role))) await fetchGetServicesHistory();
        if (['worker'].some(role => permissions?.includes(role)) && user?.worker?.id) await fetchGetServicesHistoryByWorker(user?.worker?.id);
        if (['client'].some(role => permissions?.includes(role)) && user?.client?.id) await fetchGetServicesHistoryByClient(user?.client?.id);
      }
    } catch {}
  };

  const getFilteredData = (term?: string) => {
    if (!history) return;

    let filtered: Service[] = [...history];

    if (selectedServiceTypeOption && filtered) filtered = filtered.filter(service => service.serviceType?.description === selectedServiceTypeOption);

    if (selectedStatusOption && filtered) filtered = filtered.filter(service => service.status?.description === selectedStatusOption);

    const searchValue = term?.toLowerCase() || searchTerm.toLowerCase();
    if (searchValue && filtered) {
      filtered = filtered.filter(service => {
        const fullName = `${service.client?.user?.firstName || service.worker?.user?.firstName} ${service.client?.user?.firstSurname || service.worker?.user?.firstSurname} ${service.client?.user?.secondSurname || service.worker?.user?.secondSurname}`;
        return fullName.toLowerCase().includes(searchValue) || service.vehicle?.licensePlate?.toLowerCase().includes(searchValue);
      });
    }

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      filtered = filtered.filter((service: Service) => {
        if (!service.createdAt) return false;
        const appointmentDate = new Date(service.createdAt);
        appointmentDate.setDate(appointmentDate.getDate() - 2);
        return appointmentDate >= start && appointmentDate <= end;
      });
    }

    setFilteredServices(filtered);
  };

  const resetFilters = () => {
    setSelectedServiceTypeOption('');
    setSelectedStatusOption('');
    setSearchTerm('');
    setStartDate('');
    setEndDate('');
    setGetDeleted(false);
  };

  const handleFilterChange = () => {
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
    if (history) setFilteredServices(history);
  }, [history]);

  useEffect(() => {
    if (serviceTypes) setServiceTypesOptions(convertToOptions({ data: serviceTypes }));
  }, [serviceTypes]);

  useEffect(() => {
    if (statuses) setStatusOptions(convertToOptions({ data: statuses }));
  }, [statuses]);

  useEffect(() => {
    loadDeletedData();
  }, [getDeleted]);

  useEffect(() => {
    getFilteredData();
  }, [history, selectedServiceTypeOption, selectedStatusOption, searchTerm, startDate, endDate]);

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
    { key: 'vehicle.licensePlate', value: 'Vehicle Plates' },
    { key: 'updatedAt', value: 'Last Updated' },
    { key: 'serviceType.description', value: 'Service Type' },
    { key: 'status.description', value: 'Status' },
  ];
  // Add columns based on user role
  if (['worker', 'admin', 'superAdmin', 'receptionist'].some(role => permissions?.includes(role)))
    columns.push({ key: 'client.user.firstName', value: 'Client' });
  if (['client', 'admin', 'superAdmin', 'receptionist'].some(role => permissions?.includes(role)))
    columns.push({ key: 'worker.user.firstName', value: 'Worker' });

  const getNestedValue = (obj: any, path: string) => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  };

  if (!history || !serviceTypes || !statuses) return null;

  return (
    <div className={`space-y-10`}>
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
      </div>

      <div className='flex flex-row justify-end gap-x-5 items-end'>
        <div ref={dropdownRef}>
          <CustomButton className='w-auto' onClick={handleFilterChange}>
            <ListFilter size={24} />
          </CustomButton>

          {showFilters && (
            <div className='absolute bg-gray-200 right-[440px]'>
              <Filters className='flex flex-col gap-y-3'>
                <div className='flex flex-col gap-y-3'>
                  <button className='self-end font-bold hover:underline hover:text-blue-700' onClick={resetFilters}>
                    Clear Filters
                  </button>

                  <Select
                    label='Service Type'
                    options={serviceTypesOptions}
                    value={selectedServiceTypeOption}
                    onChange={(e: any) => setSelectedServiceTypeOption(e.target.value)}
                    withSelectAnOption={false}
                  />

                  <Select
                    label='Status'
                    options={statusOptions}
                    value={selectedStatusOption}
                    onChange={(e: any) => setSelectedStatusOption(e.target.value)}
                    withSelectAnOption={false}
                  />

                  <div className='w-[100%] h-[3px] bg-gray-300 my-3' />

                  <>
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
                  </>

                  {!['client', 'worker'].some(role => permissions?.includes(role)) && (
                    <div className='flex flex-row gap-x-3 items-center'>
                      <input type='checkbox' id='getDeleted' name='getDeleted' checked={getDeleted} onChange={() => setGetDeleted(!getDeleted)} />
                      <label htmlFor='getDeleted'>Get Deleted</label>
                    </div>
                  )}
                </div>
              </Filters>
            </div>
          )}
        </div>
      </div>

      <Table
        columns={columns}
        data={filteredServices.map(item => {
          const row: any = {};
          columns.forEach(column => {
            if (column.key === 'createdAt' || column.key === 'updatedAt') {
              row[column.key] = item[column.key] ? convertUTCToLocalDate(item[column.key] as Date) : '-';
            } else {
              row[column.key] = getNestedValue(item, column.key);
            }
          });
          return row;
        })}
        details
        href='/services/details'
      />
    </div>
  );
};
