import { PageContent } from '@/core';
import { CreateVehicleForm } from '@/modules/vehicles/components/forms/create-vehicle-form';

/**
 * Renders the Create Vehicle page.
 *
 * This page includes a form for creating a new vehicle.
 *
 * @component
 * @returns {JSX.Element} The create vehicle page component.
 */
export default function CreateVehiclePage() {
  return (
    <PageContent title='Create Vehicle' className='flex justify-center'>
      <CreateVehicleForm className='w-1/2' />
    </PageContent>
  );
}
