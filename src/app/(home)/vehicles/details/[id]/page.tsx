import { PageContent } from '@/core';
import { VehicleDetails } from '@/modules/vehicles/components/details/vehicle-details';

/**
 * Renders the Vehicle Details page.
 *
 * This page displays detailed information about a specific vehicle.
 *
 * @async
 * @component
 * @param {Object} props - The component props.
 * @param {Promise<{ id: string }>} props.params - A promise resolving to an object containing the vehicle ID.
 * @returns {Promise<JSX.Element>} The vehicle details page component.
 */
export default async function VehicleDetailsPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;

  return (
    <PageContent title='Vehicle Details'>
      <VehicleDetails id={id} />
    </PageContent>
  );
}
