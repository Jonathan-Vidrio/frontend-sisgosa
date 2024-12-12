'use client';

import { convertToOptions } from '@/helpers/conver-to-options';
import { User } from '@/interfaces';
import { ChevronRight, ListFilter } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useStatusesStore, useUiStore, useUsersStore } from '@/store';
import { fetchGetDeletedUsers, fetchGetUsers } from '../../fetching/users';
import { fetchGetUserTypes } from '../../fetching/user-types';
import { fetchGetWorkerTypes } from '../../fetching/worker-types';
import { fetchGetStatuses } from '@/modules/services/fetching/statuses/statutes';
import { CustomButton, Filters, Search, Select, Table } from '@/core';

export const UsersTable = () => {
  const { users, userTypes, workerTypes } = useUsersStore(state => state);
  const { statuses } = useStatusesStore(state => state);
  const { hideLoading } = useUiStore(state => state);

  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [getDeleted, setGetDeleted] = useState<boolean>(false);

  const [userTypesOptions, setUserTypesOptions] = useState<{ key: string; value: string }[]>([]);
  const [workerTypesOptions, setWorkerTypesOptions] = useState<{ key: string; value: string }[]>([]);
  const [statusesOptions, setStatusesOptions] = useState<{ key: string; value: string }[]>([]);

  // filters
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [selectedUserTypeOption, setSelectedUserType] = useState<string>('');
  const [selectedWorkerTypeOption, setSelectedWorkerType] = useState<string>('');
  const [selectedStatusOption, setSelectedStatus] = useState<string>('');

  const [searchTerm, setSearchTerm] = useState<string>('');

  const dropdownRef = useRef<HTMLDivElement>(null);

  const loadData = async () => {
    try {
      if (!statuses) await fetchGetStatuses();
      if (!userTypes) await fetchGetUserTypes();
      if (!workerTypes) await fetchGetWorkerTypes();
      if (!users) await fetchGetUsers();
    } catch {}
  };

  const loadDeletedData = async () => {
    try {
      if (getDeleted) await fetchGetDeletedUsers();
      else await fetchGetUsers();
    } catch {}
  };

  const getFilteredData = (term?: string) => {
    if (!users) return;

    let filtered = [...users];

    if (selectedUserTypeOption && filtered) filtered = filtered.filter((user: User) => user.userType?.description === selectedUserTypeOption);

    if (selectedWorkerTypeOption && filtered && selectedUserTypeOption === 'WORKER')
      filtered = filtered.filter((user: User) => user.worker?.workerType?.description === selectedWorkerTypeOption);

    if (selectedStatusOption && filtered) filtered = filtered.filter((user: User) => user.status?.description === selectedStatusOption);

    const searchValue = term?.toLowerCase() || searchTerm.toLowerCase();
    if (searchValue)
      filtered = filtered.filter((user: User) => {
        const fullName = `${user.firstName ?? ''} ${user.firstSurname ?? ''} ${user.secondSurname ?? ''}`.toLowerCase();
        return fullName.includes(searchValue.toLowerCase()) || user.email?.toLowerCase().includes(searchValue);
      });

    setFilteredUsers(filtered);
  };

  const resetFilters = () => {
    setSelectedUserType('');
    setSelectedWorkerType('');
    setSelectedStatus('');
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
    if (users) setFilteredUsers(users);
  }, [users]);

  useEffect(() => {
    if (userTypes) setUserTypesOptions(convertToOptions({ data: userTypes }));
  }, [userTypes]);

  useEffect(() => {
    if (workerTypes) setWorkerTypesOptions(convertToOptions({ data: workerTypes }));
  }, [workerTypes]);

  useEffect(() => {
    if (statuses) setStatusesOptions(convertToOptions({ data: statuses }));
  }, [statuses]);

  useEffect(() => {
    loadDeletedData();
  }, [getDeleted]);

  useEffect(() => {
    getFilteredData();
  }, [selectedUserTypeOption, selectedWorkerTypeOption, selectedStatusOption, searchTerm]);

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
  ``;
  const columns = [
    { key: 'id', value: 'ID' },
    { key: 'firstName', value: 'Name' },
    { key: 'firstSurname', value: 'Surname' },
    { key: 'secondSurname', value: 'Second Surname' },
    { key: 'email', value: 'Email' },
    { key: 'userType.description', value: 'User Type' },
  ];

  const getNestedValue = (obj: any, path: string) => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  };

  if (!users || !userTypes || !statuses) return null;

  return (
    <div className='space-y-10'>
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
          <CustomButton onClick={handleShowFilters}>
            <ListFilter size={24} />
          </CustomButton>

          {showFilters && (
            <div className='absolute bg-gray-200 right-[440px]'>
              <Filters className='flex flex-col gap-y-3'>
                <button className='self-end font-bold hover:underline hover:text-blue-700' onClick={resetFilters}>
                  Clear Filters
                </button>

                <Select
                  label='User Type'
                  value={selectedUserTypeOption}
                  options={userTypesOptions}
                  onChange={(e: any) => setSelectedUserType(e.target.value)}
                  className='w-full'
                  withSelectAnOption={false}
                />

                {selectedUserTypeOption === 'WORKER' && (
                  <Select
                    label='Worker Type'
                    value={selectedWorkerTypeOption}
                    options={workerTypesOptions}
                    onChange={(e: any) => setSelectedWorkerType(e.target.value)}
                    className='w-full'
                    withSelectAnOption={false}
                  />
                )}

                <Select
                  label='Status'
                  value={selectedStatusOption}
                  options={statusesOptions}
                  onChange={(e: any) => setSelectedStatus(e.target.value)}
                  className='w-full'
                  withSelectAnOption={false}
                />

                <div className='flex flex-row gap-x-3'>
                  <input type='checkbox' id='getDeleted' name='getDeleted' checked={getDeleted} onChange={() => setGetDeleted(!getDeleted)} />
                  <label htmlFor='getDeleted'>Get Deleted</label>
                </div>
              </Filters>
            </div>
          )}
        </div>
      </div>

      <Table
        columns={selectedUserTypeOption === 'WORKER' ? [...columns, { key: 'worker.workerType.description', value: 'Worker Type' }] : columns}
        data={filteredUsers?.map(user => {
          const row: any = {};
          columns.forEach(column => {
            row[column.key] = getNestedValue(user, column.key);
          });
          if (selectedUserTypeOption === 'WORKER') {
            row['worker.workerType.description'] = getNestedValue(user, 'worker.workerType.description');
          }
          return row;
        })}
        details
        href='/users/details'
      />
    </div>
  );
};
