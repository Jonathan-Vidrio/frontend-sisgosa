'use client';

import { useUiStore } from '@/store';
import Link from 'next/link';

interface Props {
  title: string;
  value: string;
  href?: string;
  message?: string;
  canAccess?: boolean;
}

/**
 * @function RowDetail
 * @description Component that renders a row with a title and value, optionally as a link
 *
 * @param {Object} props - Component properties
 * @param {string} props.title - Title of the row
 * @param {string} props.value - Value of the row
 * @param {string} [props.href] - URL to navigate to if the row is clickable
 * @param {string} [props.message] - Message to display below the value
 * @param {boolean} [props.canAccess] - Flag indicating if the row is clickable
 * @returns {JSX.Element} Rendered row detail component
 */
export const RowDetail = ({ title, value, href, message, canAccess }: Props): JSX.Element => {
  const { showLoading } = useUiStore(state => state);

  return (
    <div className='flex flex-col'>
      <>
        <strong>{title}</strong>

        {href && canAccess ? (
          <Link href={href} className={`w-auto hover:underline ${message ? 'text-red-500' : 'text-blue-500'}`} onClick={showLoading}>
            {value}
          </Link>
        ) : (
          <span>{value}</span>
        )}

        {message && <small className='text-red-500'>{message}</small>}
      </>
    </div>
  );
};
