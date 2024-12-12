import { PageContent } from '@/core';
import { VehicleModelsTable } from '@/modules/vehicles/components/tables/vehicle-models-table';

/**
 * Renders the Vehicle Models page.
 *
 * This page displays a table listing all vehicle models.
 *
 * @component
 * @returns {JSX.Element} The vehicle models page component.
 */
export default function VehicleModelsPage() {
  return (
    <PageContent title='Vehicle Models'>
      <VehicleModelsTable />
    </PageContent>
  );
}
