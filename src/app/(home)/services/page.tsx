import { PageContent } from '@/core';
import { ServicesTable } from '@/modules/services/components/tables/services-table';

/**
 * Renders the Services page.
 *
 * This page displays a table listing all services.
 *
 * @component
 */
export default function ServicesPage() {
  return (
    <PageContent title='Services'>
      <ServicesTable />
    </PageContent>
  );
}
