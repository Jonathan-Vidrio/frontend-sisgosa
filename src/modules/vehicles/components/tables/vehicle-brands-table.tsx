'use client';

import { VehicleBrand } from '@/interfaces';
import { ListFilter } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useVehiclesStore } from '@/store/vehicles/vehicles.store';
import { useUiStore } from '@/store';
import { fetchGetDeletedVehicleBrands, fetchGetVehicleBrands } from '../../fetching/brands';
import { CustomButton, Filters, Search, Table } from '@/core';

export const VehicleBrandsTable = ({ className }: { className?: string }) => {
  const { brands } = useVehiclesStore();
  const { hideLoading } = useUiStore(state => state);

  const [filteredBrands, setFilteredBrands] = useState<VehicleBrand[]>([]);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [getDeleted, setGetDeleted] = useState<boolean>(false);

  const [searchTerm, setSearchTerm] = useState<string>('');

  const dropdownRef = useRef<HTMLDivElement>(null);

  const loadData = async () => {
    try {
      if (!brands) await fetchGetVehicleBrands();
    } catch {}
  };

  const loadDeletedData = async (term?: string) => {
    try {
      if (getDeleted) await fetchGetDeletedVehicleBrands();
      else await fetchGetVehicleBrands();
    } catch {}
  };

  const getFilteredData = (term?: string) => {
    if (!brands) return;

    let filtered = [...brands];

    const searchValue = term?.toLowerCase() || searchTerm.toLowerCase();
    if (searchValue)
      filtered = filtered.filter(brand => brand.description?.toLowerCase().includes(searchValue) || brand.id?.toString().includes(searchValue));

    setFilteredBrands(filtered);
  };

  const resetFilters = () => {
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
    if (brands) setFilteredBrands(brands);
  }, [brands]);

  useEffect(() => {
    loadDeletedData();
  }, [getDeleted]);

  useEffect(() => {
    getFilteredData();
  }, [searchTerm]);

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
    { key: 'description', value: 'Description' },
  ];

  const getNestedValue = (obj: any, path: string) => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  };

  if (!brands) return null;

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
      </div>

      <div className='flex justify-end'>
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

                  <div className='flex flex-row gap-x-3'>
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
        data={filteredBrands.map((brand: VehicleBrand) => {
          const row: any = {};
          columns.forEach(column => {
            row[column.key] = getNestedValue(brand, column.key);
          });
          return row;
        })}
        details
        href='/vehicles/brands/details'
      />
    </div>
  );
};
