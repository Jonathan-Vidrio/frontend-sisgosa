'use client';

import { Spinner } from '@/core';
import { useAuthStore, useUiStore } from '@/store';

/**
 * @function RootGuard
 * @description Component that provides a guard for the root of the application
 * Displays a loading spinner when the application is in a loading state
 *
 * @param {Object} props - Component properties
 * @param {React.ReactNode} props.children - Child components to render
 * @returns {JSX.Element} Guarded component with loading state handling
 *
 * @example
 * <RootGuard>
 *   <HomePage />
 * </RootGuard>
 */
export function RootGuard({ children }: { children: React.ReactNode }): JSX.Element {
  const { user } = useAuthStore(state => state);
  const { isLoading } = useUiStore(state => state);

  return (
    <section className='h-full w-full relative'>
      {isLoading && (
        <>
          <div className='absolute inset-0 z-20 bg-gray-50'></div>
          <div className='absolute inset-0 z-20 flex justify-center items-center'>
            <Spinner />
          </div>
        </>
      )}

      <div className={`${isLoading ? 'pointer-events-none' : ''} h-full`}>{children}</div>
    </section>
  );
}
