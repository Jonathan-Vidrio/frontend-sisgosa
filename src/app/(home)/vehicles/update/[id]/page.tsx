import { PageContent } from '@/core';
import { UpdateVehicleForm } from '@/modules/vehicles/components/forms/update-vehicle-form';

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
export default async function UpdateVehiclePage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;

  return (
    <PageContent title='Update Vehicle' className='flex justify-center'>
      <UpdateVehicleForm id={id} className='w-1/2' />
    </PageContent>
  );
}
