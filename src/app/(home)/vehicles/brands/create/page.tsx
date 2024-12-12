import { PageContent } from '@/core';
import { CreateVehicleBrandForm } from '@/modules/vehicles/components/forms/create-vehicle-brand-form';

/**
 * Renders the Create Vehicle Brand page.
 * 
 * This page includes a form for creating a new vehicle brand.
 * 
 * @component
 * @returns {JSX.Element} The create vehicle brand page component.
 */
export default function CreateVehicleBrandPage() {
  return (
    <PageContent title='Create Vehicle Brand' className='w-full flex flex-col justify-center items-center gap-y-20'>
      <CreateVehicleBrandForm className='w-1/2' />
    </PageContent>
  );
}
