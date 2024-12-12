import { PageContent } from '@/core';
import { VehicleBrandsTable } from '@/modules/vehicles/components/tables/vehicle-brands-table';

/**
 * Renders the Vehicle Brands page.
 *
 * This page displays a table listing all vehicle brands.
 *
 * @component
 * @returns {JSX.Element} The vehicle brands page component.
 */
export default function VehicleBrandsPage() {
  return (
    <PageContent title='Vehicle Brands'>
      <VehicleBrandsTable />
    </PageContent>
  );
}
