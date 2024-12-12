'use client';

import { convertToOptions } from '@/helpers/conver-to-options';
import { useUiStore, useVehiclesStore } from '@/store';
import { ChevronRight, ListFilter } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { fetchGetDeletedVehicleModels, fetchGetVehicleModels } from '../../fetching/models';
import { fetchGetVehicleBrands } from '../../fetching/brands';
import { CustomButton, Filters, Search, Select, Table } from '@/core';

export const VehicleModelsTable = ({ className }: { className?: string }) => {
  const { models, brands } = useVehiclesStore(state => state);
  const { showLoading, hideLoading } = useUiStore(state => state);

  const [filteredModels, setFilteredModels] = useState(models);
  const [getDeleted, setGetDeleted] = useState<boolean>(false);
  const [showFilters, setShowFilters] = useState<boolean>(false);

  const [brandsOptions, setBrandsOptions] = useState<{ key: string; value: string }[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<string>('');

  const [searchTerm, setSearchTerm] = useState<string>('');

  const dropdownRef = useRef<HTMLDivElement>(null);

  const loadData = async () => {
    try {
      if (!models) await fetchGetVehicleModels();
      if (!brands) await fetchGetVehicleBrands();
    } catch {}
  };

  const loadDeletedData = async () => {
    try {
      if (getDeleted) await fetchGetDeletedVehicleModels();
      else await fetchGetVehicleModels();
    } catch {}
  };

  const getFilteredData = (term?: string) => {
    if (!models) return;

    let filtered = [...models];

    if (selectedBrand && models) filtered = filtered.filter(model => model.brand?.description === selectedBrand);

    const searchValue = term?.toLowerCase() || searchTerm.toLowerCase();
    if (searchValue)
      filtered = filtered.filter(model => model.description?.toLowerCase().includes(searchValue) || model.id?.toString().includes(searchValue));

    setFilteredModels(filtered);
  };

  const resetFilters = () => {
    setSelectedBrand('');
    setGetDeleted(false);
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
  }, []);

  useEffect(() => {
    if (models) setFilteredModels(models);
  }, [models]);

  useEffect(() => {
    if (brands) setBrandsOptions(convertToOptions({ data: brands }));
  }, [brands]);

  useEffect(() => {
    loadDeletedData();
  }, [getDeleted]);

  useEffect(() => {
    getFilteredData();
  }, [selectedBrand, searchTerm]);

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
    { key: 'description', value: 'Model Description' },
    { key: 'brand.description', value: 'Brand' },
  ];

  const getNestedValue = (obj: any, path: string) => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  };

  if (!models || !brands) return null;

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

        <div className='w-[3px] bg-gray-300' />

        <Link href='/vehicles/brands' className='flex flex-row gap-x-2 text-white bg-blue-500 hover:bg-gray-400 p-3 rounded-md' onClick={showLoading}>
          Brands
          <ChevronRight size={24} />
        </Link>
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
                    value={selectedBrand}
                    onChange={(e: any) => setSelectedBrand(e.target.value)}
                    withSelectAnOption={false}
                  />

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
        data={(filteredModels || []).map(model => {
          const row: any = {};
          columns.forEach(column => {
            row[column.key] = getNestedValue(model, column.key);
          });
          return row;
        })}
        details
        href='/vehicles/models/details'
      />
    </div>
  );
};
