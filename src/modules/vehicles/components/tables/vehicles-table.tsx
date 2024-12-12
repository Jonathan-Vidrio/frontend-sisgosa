'use client';

import { convertToOptions } from '@/helpers/conver-to-options';
import { useAuthStore, useUiStore, useUsersStore, useVehiclesStore } from '@/store';
import { Vehicle } from '@/interfaces';
import { ChevronRight, ListFilter } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { fetchGetDeletedVehicles, fetchGetDeletedVehiclesByClient, fetchGetVehicles, fetchGetVehiclesByClient } from '../../fetching/vehicles';
import { fetchGetVehicleBrands } from '../../fetching/brands';
import { fetchGetVehicleModels } from '../../fetching/models';
import { CustomButton, Filters, Search, Select, Table } from '@/core';
import { fetchGetClients } from '@/modules/users/fetching/clients';

export const VehiclesTable = ({ className }: { className?: string }) => {
  const { user, permissions } = useAuthStore(state => state);
  const { vehicles, brands, models } = useVehiclesStore(state => state);
  const { showLoading, hideLoading } = useUiStore(state => state);
  const { clients } = useUsersStore(state => state);

  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);

  const [brandsOptions, setBrandsOptions] = useState<{ key: string; value: string }[]>([]);
  const [modelsOptions, setModelsOptions] = useState<{ key: string; value: string }[]>([]);

  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [getDeleted, setGetDeleted] = useState<boolean>(false);
  const [selectedBrandOption, setSelectedBrandOption] = useState<string>('');
  const [selectedModelOption, setSelectedModelOption] = useState<string>('');

  const [searchTerm, setSearchTerm] = useState<string>('');

  const dropdownRef = useRef<HTMLDivElement>(null);

  const loadData = async () => {
    try {
      if (!vehicles || !vehicles.length) {
        if (['superAdmin', 'admin', 'receptionist'].some(role => permissions?.includes(role))) await fetchGetVehicles();
        if (['client'].some(role => permissions?.includes(role)) && user?.client?.id) await fetchGetVehiclesByClient(user.client.id);
        if (!clients && ['superAdmin', 'admin', 'receptionist'].some(role => permissions?.includes(role))) await fetchGetClients();
      }

      if (!brands || !brands.length) await fetchGetVehicleBrands();
      if (!models || !brands?.length) await fetchGetVehicleModels();
    } catch {}
  };

  const loadDeletedData = async () => {
    try {
      if (getDeleted) {
        if (['superAdmin', 'admin', 'receptionist'].some(role => permissions?.includes(role))) await fetchGetDeletedVehicles();
        if (['client'].some(role => permissions?.includes(role)) && user?.client?.id) await fetchGetDeletedVehiclesByClient(user.client.id);
      } else {
        if (['superAdmin', 'admin', 'receptionist'].some(role => permissions?.includes(role))) await fetchGetVehicles();
        if (['client'].some(role => permissions?.includes(role)) && user?.client?.id) await fetchGetVehiclesByClient(user.client.id);
      }
    } catch {}
  };

  const getFilteredData = (term?: string) => {
    if (!vehicles) return;

    let filtered = [...vehicles];

    if (selectedBrandOption && filtered) filtered = filtered.filter((vehicle: Vehicle) => vehicle.model?.brand?.description === selectedBrandOption);

    if (selectedModelOption && filtered) filtered = filtered.filter((vehicle: Vehicle) => vehicle.model?.description === selectedModelOption);

    const searchValue = term?.toLowerCase() || searchTerm.toLowerCase();
    if (searchValue && filtered) {
      filtered = filtered.filter(vehicle => {
        const fullName =
          `${vehicle.client?.user?.firstName ?? ''} ${vehicle.client?.user?.firstSurname ?? ''} ${vehicle.client?.user?.secondSurname}`.toLowerCase();
        return fullName.includes(searchValue) || vehicle.licensePlate?.toLowerCase().includes(searchValue);
      });
    }

    setFilteredVehicles(filtered);
  };

  const resetFilters = () => {
    setSelectedBrandOption('');
    setSelectedModelOption('');
    setGetDeleted(false);
    setSearchTerm('');
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
    loadData();
  }, [permissions, user]);

  useEffect(() => {
    if (vehicles) setFilteredVehicles(vehicles);
  }, [vehicles]);

  useEffect(() => {
    if (brands) setBrandsOptions(convertToOptions({ data: brands }));
  }, [brands]);

  useEffect(() => {
    if (models && selectedBrandOption)
      setModelsOptions(convertToOptions({ data: models.filter(model => model.brand?.description === selectedBrandOption) }));
  }, [models, selectedBrandOption]);

  useEffect(() => {
    loadDeletedData();
  }, [getDeleted]);

  useEffect(() => {
    getFilteredData();
  }, [selectedBrandOption, selectedModelOption, searchTerm]);

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
    { key: 'licensePlate', value: 'License Plate' },
    { key: 'model.brand.description', value: 'Brand' },
    { key: 'model.description', value: 'Model' },
    { key: 'color', value: 'Color' },
  ];
  // Add columns based on user role
  if (['admin', 'superAdmin', 'receptionist'].some(role => permissions?.includes(role))) {
    columns.push({ key: 'client.user.firstName', value: 'Client' });
    columns.push({ key: 'client.user.firstSurname', value: 'Client Surname' });
  }

  const getNestedValue = (obj: any, path: string) => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  };

  if (!vehicles || !brands || !models) return null;

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

        {['superAdmin', 'admin', 'receptionist'].some(role => permissions?.includes(role)) && (
          <>
            <div className='w-[3px] bg-gray-300' />

            <Link
              href='/vehicles/brands'
              className='flex flex-row gap-x-2 text-white bg-blue-500 hover:bg-gray-400 p-3 rounded-md'
              onClick={showLoading}
            >
              Brands
              <ChevronRight size={24} />
            </Link>

            <Link
              href='/vehicles/models'
              className='flex flex-row gap-x-2 text-white bg-blue-500 hover:bg-gray-400 p-3 rounded-md'
              onClick={showLoading}
            >
              Models
              <ChevronRight size={24} />
            </Link>
          </>
        )}
      </div>

      <div className='flex flex-row justify-end gap-x-5 items-end'>
        <div ref={dropdownRef}>
          <CustomButton className='w-auto' onClick={handleShowFilters}>
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
                    label='Brand'
                    options={brandsOptions}
                    value={selectedBrandOption}
                    onChange={(e: any) => setSelectedBrandOption(e.target.value)}
                    withSelectAnOption={false}
                  />

                  {selectedBrandOption !== '' && selectedBrandOption !== 'All' && (
                    <Select
                      label='Model'
                      options={modelsOptions}
                      value={selectedModelOption}
                      onChange={(e: any) => setSelectedModelOption(e.target.value)}
                      withSelectAnOption={false}
                    />
                  )}

                  <div className='flex flex-row gap-x-3 items-center'>
                    <input type='checkbox' id='getDeleted' name='getDeleted' checked={getDeleted} onChange={() => setGetDeleted(!getDeleted)} />
                    <label htmlFor='getDeleted'>Get Deleted</label>
                  </div>
                </div>
              </Filters>
            </div>
          )}
        </div>
      </div>

      <Table
        columns={columns}
        data={filteredVehicles.map(vehicle => {
          const row: any = {};
          columns.forEach(column => {
            row[column.key] = getNestedValue(vehicle, column.key);
          });
          return row;
        })}
        details
        href='/vehicles/details'
      />
    </div>
  );
};
