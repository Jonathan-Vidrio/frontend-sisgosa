'use client';

import { useAuthStore, useUiStore } from '@/store';
import { User as UserDetails } from '@/interfaces';
import { Calendar, Car, LogOut, PackageOpen, Settings, User, Wrench } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { fetchSignOut } from '@/modules/auth/fetching/auth';

/**
 * @function VerticalNavbar
 * @description Component that renders a vertical navigation bar with links and user details
 *
 * @param {Object} props - Component properties
 * @param {UserDetails} props.userDetails - User details to display in the navbar
 * @param {string[]} props.permissions - Array of user permissions
 * @param {string} [props.className] - Additional CSS classes for the navbar
 * @returns {JSX.Element} Rendered vertical navigation bar
 */
export const VerticalNavbar = ({
  userDetails,
  permissions,
  className,
}: {
  userDetails: UserDetails;
  permissions: string[];
  className?: string;
}): JSX.Element => {
  const { setPermissions, setUser } = useAuthStore(state => state);
  const { showLoading } = useUiStore(state => state);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      setIsSubmitting(true);
      await fetchSignOut();
    } catch {
    } finally {
      router.refresh();
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    setPermissions(permissions);
  }, [permissions, setPermissions]);

  useEffect(() => {
    setUser(userDetails);
  }, [userDetails, setUser]);

  return (
    <div className={`min-w-[300px] shadow-lg z-50 flex flex-col justify-between ${className}`}>
      <div className='px-10 pt-10'>
        <label className='text-2xl font-bold text-blue-500'>SisGOSA</label>
      </div>

      <div className='my-5 flex flex-col w-full'>
        <Link
          href='/appointments'
          className={`${pathname.includes('appointments') ? 'bg-gray-100 border-r-[6px] border-blue-500' : ''} flex flex-row gap-x-2 hover:bg-gray-200 px-10 py-4`}
          onClick={() => {
            if (!pathname.includes('appointments')) showLoading();
          }}
        >
          <Calendar size={24} className='mr-2' />
          Appointments
        </Link>

        <Link
          href='/services'
          className={`${pathname.includes('services') ? 'bg-gray-100 border-r-[6px] border-blue-500' : ''} flex flex-row gap-x-2 hover:bg-gray-200 px-10 py-4`}
          onClick={() => {
            if (!pathname.includes('services')) showLoading();
          }}
        >
          <Wrench size={24} className='mr-2' />
          Services
        </Link>

        {permissions.some(permission => ['superAdmin', 'admin', 'receptionist', 'client'].includes(permission)) && (
          <Link
            href='/vehicles'
            className={`${pathname.includes('vehicles') ? 'bg-gray-100 border-r-[6px] border-blue-500' : ''} flex flex-row gap-x-2 hover:bg-gray-200 px-10 py-4`}
            onClick={() => {
              if (!pathname.includes('vehicles')) showLoading();
            }}
          >
            <Car size={24} className='mr-2' />
            Vehicles
          </Link>
        )}

        {permissions.some(permission => ['superAdmin', 'admin', 'receptionist'].includes(permission)) && (
          <>
            <Link
              href='/users'
              className={`${pathname.includes('users') ? 'bg-gray-100 border-r-[6px] border-blue-500' : ''} flex flex-row gap-x-2 hover:bg-gray-200 px-10 py-4`}
              onClick={() => {
                if (!pathname.includes('users')) showLoading();
              }}
            >
              <User size={24} className='mr-2' />
              Users
            </Link>

            <Link
              href='/products'
              className={`${pathname.includes('products') ? 'bg-gray-100 border-r-[6px] border-blue-500' : ''} flex flex-row gap-x-2 hover:bg-gray-200 px-10 py-4`}
              onClick={() => {
                if (!pathname.includes('products')) showLoading();
              }}
            >
              <PackageOpen size={24} className='mr-2' />
              Products
            </Link>
          </>
        )}
      </div>

      <div className='border mx-10' />

      <div className='my-5 flex flex-col w-full'>
        {/* <Link
          href='/settings'
          className={`${pathname.includes('settings') ? 'bg-gray-100 border-r-[6px] border-blue-500' : ''} flex flex-row gap-x-2 hover:bg-gray-200 px-10 py-4`}
          onClick={() => {
            if (!pathname.includes('settings')) showLoading();
          }}
        >
          <Settings size={24} className='mr-2' />
          Settings
        </Link> */}

        <button className='flex flex-row gap-x-2 hover:bg-gray-200 px-10 py-4 text-start' onClick={handleSignOut} disabled={isSubmitting}>
          <LogOut size={24} className='mr-2' />
          Logout
        </button>
      </div>

      <div className='px-10 py-4 flex flex-col gap-y-2 mt-auto'>
        <div className='flex flex-col'>
          <label className='font-bold'>{`${userDetails.firstName}`}</label>
          <label className='font-bold'>{`${userDetails.firstSurname} ${userDetails.secondSurname}`}</label>
        </div>
        <label className='text-sm text-gray-400 truncate'>{`${userDetails.email}`}</label>
        <strong className='px-2 p-1 bg-blue-500 text-xs text-white rounded-full mr-auto'>{`${userDetails.userType?.description?.toUpperCase()}`}</strong>
      </div>
    </div>
  );
};
