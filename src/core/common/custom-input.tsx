import React, { forwardRef } from 'react';

interface Props {
  label: string;
  placeholder?: string;
  color?: string;
  type?: string;
  disabled?: boolean;
  className?: string;
  [key: string]: any;
}

/**
 * @function CustomInput
 * @description Forwarded ref component that renders a custom input field with a label
 *
 * @param {Object} props - Component properties
 * @param {string} props.label - Label for the input field
 * @param {string} [props.placeholder] - Placeholder text for the input field
 * @param {string} [props.color] - Border color for the input field
 * @param {string} [props.type] - Type of the input field (e.g., text, password)
 * @param {boolean} [props.disabled=false] - Flag indicating if the input field is disabled
 * @param {string} [props.className] - Additional CSS classes for the input field
 * @param {Object} [props.otherProps] - Additional properties for the input field
 * @param {React.Ref<HTMLInputElement>} ref - Forwarded ref for the input field
 * @returns {JSX.Element} Rendered custom input field
 */
export const CustomInput = forwardRef<HTMLInputElement, Props>(
  ({ className, label, placeholder, color, type, disabled = false, ...otherProps }, ref): JSX.Element => {
    return (
      <div className={`flex flex-col ${className}`}>
        {label && <label className='mb-1 font-semibold text-sm'>{label}</label>}

        <input
          ref={ref}
          className={`h-[50px] border ${color ? `border-[${color}]` : 'border-gray-400'} focus:outline-none focus:ring-1 focus:ring-blue-500 rounded-md px-3`}
          placeholder={placeholder}
          type={type || 'text'}
          disabled={disabled}
          {...otherProps}
        />
      </div>
    );
  }
);

CustomInput.displayName = 'CustomInput';
