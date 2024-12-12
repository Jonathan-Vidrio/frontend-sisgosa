import { PageContent } from '@/core';
import { VehicleModelDetails } from '@/modules/vehicles/components/details/vehicle-models-details';

type Params = Promise<{ id: string }>;

/**
 * Renders the Vehicle Model Details page.
 *
 * This page displays detailed information about a specific vehicle model.
 *
 * @async
 * @component
 * @param {Object} params - The component parameters.
 * @param {string} params.id - The vehicle model ID.
 * @returns {Promise<JSX.Element>} The vehicle model details page component.
 */
export default async function DetailsVehicleModelPage({ params }: { params: Params }) {
  const { id } = await params;

  return (
    <PageContent title='Vehicle Model Details'>
      <VehicleModelDetails id={id} />
    </PageContent>
  );
}
