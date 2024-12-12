import { PageContent } from '@/core';
import { VehicleBrandDetails } from '@/modules/vehicles/components/details/vehicle-brand-details';

type Params = Promise<{ id: string }>;

/**
 * Renders the Vehicle Brand Details page.
 *
 * This page displays detailed information about a specific vehicle brand.
 *
 * @async
 * @component
 * @param {Object} params - The component parameters.
 * @param {string} params.id - The vehicle brand ID.
 * @returns {Promise<JSX.Element>} The vehicle brand details page component.
 */
export default async function DetailsVehicleBrandPage({ params }: { params: Params }) {
  const { id } = await params;

  return (
    <PageContent title='Vehicle Brand Details'>
      <VehicleBrandDetails id={id} />
    </PageContent>
  );
}
