import { PageContent } from '@/core';
import { ServiceTypesTable } from '@/modules/services/components/tables/service-types-table';

/**
 * Renders the Service Types page.
 * 
 * This page displays a table listing all service types.
 * 
 * @component
 */
export default function ServiceTypesPage() {
  return (
    <PageContent title='Service Types'>
      <ServiceTypesTable />
    </PageContent>
  );
}
