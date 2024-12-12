import { PageContent } from '@/core';
import { VehiclesTable } from '@/modules/vehicles/components/tables/vehicles-table';

/**
 * Renders the Vehicles page.
 *
 * This page displays a table listing all vehicles.
 *
 * @component
 * @returns {JSX.Element} The vehicles page component.
 */
export default function VehiclesPage() {
  return (
    <PageContent title='Vehicles'>
      <VehiclesTable />
    </PageContent>
  );
}
