'use client';

import { useEffect, useRef, useState } from 'react';
import { convertToOptions } from '@/helpers/conver-to-options';
import { useProductsStore, useUiStore } from '@/store';
import { Product } from '@/interfaces';
import { ChevronRight, ListFilter } from 'lucide-react';
import Link from 'next/link';
import { fetchGetDeletedProducts, fetchGetProducts } from '../../fetching/products';
import { fetchGetCategories } from '../../fetching/categories';
import { CustomButton, Filters, Search, Select, Table } from '@/core';

export const ProductsTable = ({ className }: { className?: string }) => {
  const { showLoading, hideLoading } = useUiStore(state => state);
  const { products, categories } = useProductsStore(state => state);

  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [getDeleted, setGetDeleted] = useState<boolean>(false);
  const [showFilters, setShowFilters] = useState<boolean>(false);

  const [categoriesOptions, setCategoriesOptions] = useState<{ key: string; value: string }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const [searchTerm, setSearchTerm] = useState<string>('');

  const dropdownRef = useRef<HTMLDivElement>(null);

  const loadData = async () => {
    try {
      if (!products || !products.length) await fetchGetProducts();
      if (!categories || !categories.length) await fetchGetCategories();
    } catch {}
  };

  const loadDeletedData = async () => {
    try {
      if (getDeleted) await fetchGetDeletedProducts();
      else await fetchGetProducts();
    } catch {}
  };

  const getFilteredData = (term?: string) => {
    if (!products) return;

    let filtered = [...products];

    if (selectedCategory) filtered = filtered.filter(product => product.category?.description === selectedCategory);

    const searchValue = term?.toLowerCase() || searchTerm.toLowerCase();
    if (searchValue)
      filtered = filtered.filter(product => product.description?.toLowerCase().includes(searchValue) || product.id?.toString().includes(searchValue));

    setFilteredProducts(filtered);
  };

  const resetFilters = () => {
    setSelectedCategory('');
    setGetDeleted(false);
    setSearchTerm('');
    getFilteredData();
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
    if (products) setFilteredProducts(products);
  }, [products]);

  useEffect(() => {
    if (categories) setCategoriesOptions(convertToOptions({ data: categories, withAll: true }));
  }, [categories]);

  useEffect(() => {
    loadDeletedData();
  }, [getDeleted]);

  useEffect(() => {
    getFilteredData();
  }, [selectedCategory, searchTerm]);

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
    { key: 'category.description', value: 'Category' },
  ];

  const getNestedValue = (obj: any, path: string) => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  };

  if (!products || !categories) return null;

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

        <Link
          href='/products/categories'
          className='flex flex-row gap-x-2 text-white bg-blue-500 hover:bg-gray-400 p-3 rounded-md'
          onClick={showLoading}
        >
          Categories
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
                <button className='self-end font-bold hover:underline hover:text-blue-700' onClick={resetFilters}>
                  Clear Filters
                </button>

                <Select
                  label='Category'
                  options={categoriesOptions}
                  value={selectedCategory}
                  onChange={(event: any) => setSelectedCategory(event.target.value)}
                  withSelectAnOption={false}
                />

                <div className='flex flex-row gap-x-3 items-center'>
                  <input type='checkbox' id='getDeleted' name='getDeleted' checked={getDeleted} onChange={() => setGetDeleted(!getDeleted)} />
                  <label htmlFor='getDeleted'>Get Deleted</label>
                </div>
              </Filters>
            </div>
          )}
        </div>
      </div>

      <Table
        columns={columns}
        data={filteredProducts.map(product => {
          const row: any = {};
          columns.forEach(column => {
            row[column.key] = getNestedValue(product, column.key);
          });
          return row;
        })}
        details
        href='/products/details'
      />
    </div>
  );
};
