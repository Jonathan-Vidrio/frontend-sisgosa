'use client';

import { useProductsStore, useUiStore } from '@/store';
import { ProductCategory } from '@/interfaces';
import { ListFilter } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { set } from 'react-hook-form';
import { fetchGetCategories, fetchGetDeletedCategories } from '../../fetching/categories';
import { CustomButton, Filters, Search, Table } from '@/core';

export const ProductCategoriesTable = ({ className }: { className?: string }) => {
  const { hideLoading } = useUiStore(state => state);
  const { categories } = useProductsStore(state => state);

  const [filteredCategories, setFilteredCategories] = useState<ProductCategory[]>([]);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [getDeleted, setGetDeleted] = useState<boolean>(false);

  const [searchTerm, setSearchTerm] = useState<string>('');

  const dropdownRef = useRef<HTMLDivElement>(null);

  const loadData = async () => {
    try {
      if (!categories) await fetchGetCategories();
    } catch {}
  };

  const loadDeletedData = async () => {
    try {
      if (getDeleted) await fetchGetDeletedCategories();
      else await fetchGetCategories();
    } catch {}
  };

  const getFilteredData = (term?: string) => {
    if (!categories) return;

    let filtered = [...categories];

    const searchValue = term?.toLowerCase() || searchTerm.toLowerCase();
    if (searchValue)
      filtered = filtered.filter(
        category => category.description?.toLowerCase().includes(searchValue) || category.id?.toString().includes(searchValue)
      );

    setFilteredCategories(filtered);
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
    if (categories) setFilteredCategories(categories);
  }, [categories]);

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

  if (!categories) return null;

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

        {/* <div className='w-[3px] bg-gray-300' /> */}
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
        data={filteredCategories.map((category: ProductCategory) => {
          const row: any = {};
          columns.forEach(column => {
            row[column.key] = getNestedValue(category, column.key);
          });
          return row;
        })}
        details
        href='/products/categories/details'
      />
    </div>
  );
};
