'use client';

import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useAuthStore, useServicesStore, useStatusesStore, useUiStore } from '@/store';
import { Service } from '@/interfaces';
import { convertToOptions } from '@/helpers/conver-to-options';
import Link from 'next/link';
import { ChevronRight, ListFilter } from 'lucide-react';
import { fetchGetDeletedServices, fetchGetServices, fetchGetServicesByClient, fetchGetServicesByWorker } from '../../fetching/services';
import { fetchGetServicesTypes } from '../../fetching/services-types';
import { fetchGetStatuses } from '../../fetching/statuses/statutes';
import { CustomButton, CustomInput, Filters, Search, Select, Table } from '@/core';
import { convertUTCToLocalDate } from '@/helpers';

export const ServicesTable = ({ className }: { className?: string }) => {
  const { user, permissions } = useAuthStore(state => state);
  const { services, serviceTypes } = useServicesStore(state => state);
  const { statuses } = useStatusesStore(state => state);
  const { showLoading, hideLoading } = useUiStore(state => state);

  const [filteredServices, setFilteredServices] = useState<Service[]>([]);

  const [serviceTypesOptions, setServiceTypesOptions] = useState<{ key: String; value: string }[]>([]);
  const [statusOptions, setStatusOptions] = useState<{ key: String; value: string }[]>([]);

  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [selectedServiceTypeOption, setSelectedServiceTypeOption] = useState<string>('');
  const [selectedStatusOption, setSelectedStatusOption] = useState<string>('');

  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const dropdownRef = useRef<HTMLDivElement>(null);

  const loadData = async () => {
    try {
      if (!services) {
        if (['superAdmin', 'admin', 'receptionist'].some(role => permissions?.includes(role))) await fetchGetServices();
        if (['worker'].some(role => permissions?.includes(role)) && user?.worker?.id) await fetchGetServicesByWorker(user?.worker?.id);
        if (['client'].some(role => permissions?.includes(role)) && user?.client?.id) await fetchGetServicesByClient(user?.client?.id);
      }
      if (!serviceTypes) await fetchGetServicesTypes();
      if (!statuses) await fetchGetStatuses();
    } catch {}
  };

  const getFilteredData = (term?: string) => {
    if (!services) return;

    let filtered: Service[] = [...services];

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
    if (services) setFilteredServices(services);
  }, [services]);

  useEffect(() => {
    if (serviceTypes) setServiceTypesOptions(convertToOptions({ data: serviceTypes }));
  }, [serviceTypes]);

  useEffect(() => {
    if (statuses) setStatusOptions(convertToOptions({ data: statuses }));
  }, [statuses]);

  useEffect(() => {
    getFilteredData();
  }, [services, selectedServiceTypeOption, selectedStatusOption, searchTerm, startDate, endDate]);

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

  if (!services || !serviceTypes || !statuses) return null;

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
            href='/services/history'
            className='flex flex-row gap-x-2 text-white bg-blue-500 hover:bg-gray-400 p-3 rounded-md'
            onClick={showLoading}
          >
            History
            <ChevronRight size={24} />
          </Link>

          {['superAdmin', 'admin', 'receptionist'].some(role => permissions?.includes(role)) && (
            <Link
              href='/services/types'
              className='flex flex-row gap-x-2 text-white bg-blue-500 hover:bg-gray-400 p-3 rounded-md'
              onClick={showLoading}
            >
              Service Types
              <ChevronRight size={24} />
            </Link>
          )}
        </>
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
