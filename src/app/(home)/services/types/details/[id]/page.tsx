import { PageContent } from '@/core';
import { ServiceTypeDetails } from '@/modules/services/components/details/service-type-details';

/**
 * Renders the Service Type Details page.
 *
 * This page displays detailed information about a specific service type.
 *
 * @async
 * @component
 * @param {Object} props - The component props.
 * @param {Promise<{ id: string }>} props.params - A promise resolving to an object containing the service type ID.
 */
export default async function DetailsServiceTypePage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;

  return (
    <PageContent title='Service Type Details'>
      <ServiceTypeDetails id={id} />
    </PageContent>
  );
}
