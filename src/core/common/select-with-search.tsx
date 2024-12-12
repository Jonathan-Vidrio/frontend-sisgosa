'use client';

import { useEffect, useState } from 'react';
import { Search } from './search';

interface Option {
  [key: string]: any;
}

interface Props {
  columns: string[];
  options: Option[];
  onSelect: (value: Option) => void;
  className?: string;
}

/**
 * @function SelectWithSearch
 * @description Component that renders a searchable select dropdown with a table of options
 *
 * @param {Object} props - Component properties
 * @param {string[]} props.columns - Array of column names for the table
 * @param {Array<Object>} props.options - Array of options for the table
 * @param {function} props.onSelect - Callback function to handle option selection
 * @param {string} [props.className] - Additional CSS classes for the component
 * @returns {JSX.Element} Rendered searchable select component
 */
export const SelectWithSearch = ({ columns, options, onSelect, className }: Props): JSX.Element => {
  const [search, setSearch] = useState<string>('');
  const [filteredOptions, setFilteredOptions] = useState<Option[]>(options);

  const filterOptions = () => {
    const filteredOptions = options?.filter(option =>
      Object.values(option).some(value => value.toString().toLowerCase().includes(search.toLowerCase()))
    );

    setFilteredOptions(filteredOptions);
  };

  useEffect(() => {
    filterOptions();
  }, [search]);

  return (
    <div className={`h-1/3 rounded-md z-10 shadow-lg p-4 bg-white flex flex-col gap-y-5 overflow-y-auto ${className}`}>
      <Search onSearch={setSearch} onReset={() => setSearch('')} className='w-full' withSearchButton={false} />

      <table className='w-full border-collapse'>
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={index} className='text-center px-4 py-2 border-b'>
                {column}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {filteredOptions?.map((option, index) => (
            <tr key={index} className='cursor-pointer hover:bg-gray-100 border-b text-center' onClick={() => onSelect(option)}>
              {Object.values(option).map((value, index) => (
                <td key={index} className='p-3'>
                  {value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
