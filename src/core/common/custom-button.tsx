'use client';

import { on } from 'events';

interface Props {
  className?: string;
  children?: string | React.ReactNode;
  color?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
}

/**
 * @function CustomButton
 * @description Component that renders a customizable button
 *
 * @param {Object} props - Component properties
 * @param {string} [props.className] - Additional CSS classes for the button
 * @param {string | React.ReactNode} [props.children] - Button content
 * @param {string} [props.color] - Button color
 * @param {boolean} [props.disabled] - Flag indicating if the button is disabled
 * @param {'button' | 'submit' | 'reset'} [props.type] - Button type
 * @param {function} [props.onClick] - Callback function to handle button click
 * @returns {JSX.Element} Rendered button component
 */
export const CustomButton = ({ className, children, color, disabled: disable, type, onClick }: Props): JSX.Element => {
  return (
    <button
      className={`w-full h-[50px] ${color ? `bg-${color}-500` : 'bg-blue-500'} hover:bg-gray-400 rounded-md px-3 text-white font-semibold flex justify-center items-center ${className}`}
      type={type || 'button'}
      disabled={!!disable}
      onClick={disable && onClick ? undefined : onClick}
    >
      {children}
    </button>
  );
};
