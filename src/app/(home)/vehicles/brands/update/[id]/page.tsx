import { PageContent } from '@/core';
import { UpdateVehicleBrandForm } from '@/modules/vehicles/components/forms/update-vehicle-brand-form';

type Params = Promise<{ id: string }>;

/**
 * Renders the Update Vehicle Brand page.
 *
 * This page includes a form for updating an existing vehicle brand.
 *
 * @async
 * @component
 * @param {Object} params - The component parameters.
 * @param {string} params.id - The vehicle brand ID.
 * @returns {Promise<JSX.Element>} The update vehicle brand page component.
 */
export default async function UpdateVehicleBrandPage({ params }: { params: Params }) {
  const { id } = await params;

  return (
    <PageContent title='Update Vehicle Brand' className='flex justify-center'>
      <UpdateVehicleBrandForm id={id} className='w-1/2' />
    </PageContent>
  );
}
