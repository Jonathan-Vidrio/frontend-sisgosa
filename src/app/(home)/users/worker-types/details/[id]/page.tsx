import { PageContent } from '@/core';
import { WorkerTypeDetails } from '@/modules/users/ components/details/worker-type-details';

/**
 * Renders the Worker Type Details page.
 * 
 * This page displays detailed information about a specific worker type.
 * 
 * @async
 * @component
 * @param {Object} props - The component props.
 * @param {Promise<{ id: string }>} props.params - A promise resolving to an object containing the worker type ID.
 * @returns {Promise<JSX.Element>} The worker type details page component.
 */
export default async function DetailsWorkerTypePage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;

  return (
    <PageContent title='Worker Type Details'>
      <WorkerTypeDetails id={id} />
    </PageContent>
  );
}
