'use client';

import { useState } from 'react';
import { CustomInput } from './custom-input';
import { SearchIcon } from 'lucide-react';
import { CustomButton } from './custom-button';

interface Props {
  withSearchButton?: boolean;
  className?: string;
  onSearch: (value: string) => void;
  onReset: () => void;
}

/**
 * @function Search
 * @description Component that renders a search input with optional search button
 *
 * @param {Object} props - Component properties
 * @param {boolean} [props.withSearchButton=true] - Flag indicating if the search button should be displayed
 * @param {string} [props.className] - Additional CSS classes for the search input
 * @param {function} props.onSearch - Callback function to handle search input changes
 * @param {function} props.onReset - Callback function to handle search reset
 * @returns {JSX.Element} Rendered search component
 */
export const Search = ({ withSearchButton = true, className, onSearch, onReset }: Props): JSX.Element => {
  const [search, setSearch] = useState<string>('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearch(value);
    onSearch(value); // Llamar a onSearch mientras el usuario escribe
  };

  const handleReset = () => {
    setSearch('');
    onReset();
  };

  return (
    <div className='flex gap-x-2'>
      <CustomInput className={className} value={search} onChange={handleChange} />

      {withSearchButton && (
        <div style={{ width: 'auto' }}>
          <CustomButton>
            <SearchIcon />
          </CustomButton>
        </div>
      )}
    </div>
  );
};
