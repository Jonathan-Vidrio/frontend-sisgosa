import { PageContent } from '@/core';
import { ServiceDetails } from '@/modules/services/components/details/service-details';

/**
 * Renders the Service Details page.
 * 
 * This page displays detailed information about a specific service.
 * 
 * @async
 * @component
 * @param {Object} props - The component props.
 * @param {Promise<{ id: string }>} props.params - A promise resolving to an object containing the service ID.
 */
export default async function DetailsServicePage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;

  return (
    <PageContent title='Service Details'>
      <ServiceDetails id={id} />
    </PageContent>
  );
}
