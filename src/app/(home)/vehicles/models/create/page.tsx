import { PageContent } from '@/core';
import { CreateVehicleModelForm } from '@/modules/vehicles/components/forms/create-vehicle-model-form';

/**
 * Renders the Create Vehicle Model page.
 *
 * This page includes a form for creating a new vehicle model.
 *
 * @component
 * @returns {JSX.Element} The create vehicle model page component.
 */
export default function CreateVehicleModelPage() {
  return (
    <PageContent title='Create Vehicle Model' className='flex justify-center'>
      <CreateVehicleModelForm className='w-1/2' />
    </PageContent>
  );
}
