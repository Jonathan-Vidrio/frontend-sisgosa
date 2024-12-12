import { PageContent } from '@/core';
import { WorkerTypesTable } from '@/modules/users/ components/tables/worker-types-table';

/**
 * Renders the Worker Types page.
 * 
 * This page displays a table listing all worker types.
 * 
 * @component
 * @returns {JSX.Element} The worker types page component.
 */
export default function WorkerTypesPage() {
  return (
    <PageContent title='Worker Types'>
      <WorkerTypesTable />
    </PageContent>
  );
}
