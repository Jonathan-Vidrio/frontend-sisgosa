'use client';

import { useUiStore } from '@/store';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

/**
 * @function BackButton
 * @description Component that renders a "Back" button to navigate to the previous page
 *
 * @returns {JSX.Element} Rendered "Back" button
 */
export const BackButton = (): JSX.Element => {
  const { showLoading } = useUiStore(state => state);

  const router = useRouter();

  const handleBack = () => {
    showLoading();
    router.back();
  };

  return (
    <button className='hover:bg-gray-300 p-1 rounded-md' onClick={handleBack}>
      <ChevronLeft size={30} />
    </button>
  );
};
