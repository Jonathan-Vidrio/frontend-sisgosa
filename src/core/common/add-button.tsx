'use client';

import { useAuthStore, useUiStore } from '@/store';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

/**
 * @function AddButton
 * @description Component that renders an "Add" button with a link to create a new item
 *
 * @param {Object} props - Component properties
 * @param {string} [props.href] - URL to navigate to for creating a new item
 * @param {string} props.className - Additional CSS classes for the button
 * @returns {JSX.Element | null} Rendered "Add" button or null if the user does not have permission
 */
export const AddButton = ({ href, className }: { href?: string; className: string }): JSX.Element | null => {
  const { showLoading } = useUiStore(state => state);
  const { permissions } = useAuthStore(state => state);

  const pathname = usePathname();
  const [path, setPath] = useState(pathname);

  useEffect(() => {
    if (pathname.includes('users')) setPath('/users');
    if (pathname.includes('worker-types')) setPath('/users/worker-types');

    if (pathname.includes('vehicles')) setPath('/vehicles');
    if (pathname.includes('brands')) setPath('/vehicles/brands');
    if (pathname.includes('models')) setPath('/vehicles/models');

    if (pathname.includes('products')) setPath('/products');
    if (pathname.includes('categories')) setPath('/products/categories');

    if (pathname.includes('appointments')) setPath('/appointments');

    if (pathname.includes('services')) setPath('/services');
    if (pathname.includes('services/types')) setPath('/services/types');
  }, [pathname]);

  const isVehicleOrAppointment = pathname.includes('vehicles') || pathname.includes('appointments');

  if (
    !(
      ['superAdmin', 'admin', 'receptionist'].some(role => permissions?.includes(role)) ||
      (permissions?.includes('client') && isVehicleOrAppointment)
    )
  )
    return null;

  return (
    <Link
      href={path + '/create'}
      className={`bg-blue-500 hover:bg-gray-500 text-white p-5 rounded-full ${['create', 'update', 'details'].some(path => pathname.includes(path)) ? 'hidden' : ''} ${className}`}
      onClick={showLoading}
    >
      <Plus size={30} />
    </Link>
  );
};
