import { PageContent } from '@/core';
import { ResourceDetails } from '@/modules/services/components/details/resource-details';

/**
 * Renders the Resource Details page.
 *
 * This page displays detailed information about a specific resource.
 *
 * @async
 * @component
 * @param {Object} props - The component props.
 * @param {Promise<{ resource_id: string }>} props.params - A promise resolving to an object containing the resource ID.
 */
export default async function DetailsResourcePage(props: { params: Promise<{ resource_id: string }> }) {
  const params = await props.params;
  const { resource_id } = params;

  return (
    <PageContent title='Service Details'>
      <ResourceDetails id={resource_id} />
    </PageContent>
  );
}
