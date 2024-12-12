import { PageContent } from '@/core';
import { UpdateVehicleModelForm } from '@/modules/vehicles/components/forms/update-vehicle-model-form';

type Params = Promise<{ id: string }>;

/**
 * Renders the Update Vehicle Model page.
 *
 * This page includes a form for updating an existing vehicle model.
 *
 * @async
 * @component
 * @param {Object} params - The component parameters.
 * @param {string} params.id - The vehicle model ID.
 * @returns {Promise<JSX.Element>} The update vehicle model page component.
 */
export default async function UpdateVehicleModelPage({ params }: { params: Params }) {
  const { id } = await params;

  return (
    <PageContent title='Update Vehicle Model' className='flex justify-center'>
      <UpdateVehicleModelForm id={id} className='w-1/2' />
    </PageContent>
  );
}
