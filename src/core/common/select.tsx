import React, { forwardRef } from 'react';

interface Props {
  label: string;
  value?: string;
  options: { key: string; value: string }[];
  color?: string;
  disabled?: boolean;
  className?: string;
  withSelectAnOption?: boolean;
  [key: string]: any;
}

/**
 * @function Select
 * @description Forwarded ref component that renders a custom select dropdown with a label
 * 
 * @param {Object} props - Component properties
 * @param {string} props.label - Label for the select dropdown
 * @param {string} [props.value] - Selected value of the dropdown
 * @param {Array<{key: string, value: string}>} props.options - Array of options for the dropdown
 * @param {string} [props.color] - Border color for the dropdown
 * @param {boolean} [props.disabled=false] - Flag indicating if the dropdown is disabled
 * @param {boolean} [props.withSelectAnOption=true] - Flag indicating if a "Select an option" placeholder should be included
 * @param {string} [props.className] - Additional CSS classes for the dropdown
 * @param {Object} [props.otherProps] - Additional properties for the dropdown
 * @param {React.Ref<HTMLSelectElement>} ref - Forwarded ref for the dropdown
 * @returns {JSX.Element} Rendered select dropdown
 */
export const Select = forwardRef<HTMLSelectElement, Props>(
  ({ label, value, options, color, disabled = false, withSelectAnOption = true, className, ...otherProps }, ref) => {
    return (
      <div className={`flex flex-col ${className}`}>
        <label className='mb-1 font-semibold text-sm'>{label}</label>
        <select
          ref={ref}
          disabled={disabled}
          value={value || ''}
          className={`h-[50px] border bg-white ${
            color ? `border-[${color}]` : 'border-gray-400'
          } focus:outline-none focus:ring-1 focus:ring-blue-500 rounded-md px-3`}
          {...otherProps}
        >
          {withSelectAnOption && (
            <option value='' disabled>
              Select an option
            </option>
          )}
          {options.map((option: { key: string; value: string }) => (
            <option key={option.key} value={option.key}>
              {option.value}
            </option>
          ))}
        </select>
      </div>
    );
  }
);

Select.displayName = 'Select';
