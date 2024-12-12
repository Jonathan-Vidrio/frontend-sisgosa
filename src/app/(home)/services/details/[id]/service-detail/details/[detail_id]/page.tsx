import { PageContent } from '@/core';
import { ServiceDetailDetails } from '@/modules/services/components/details/service-detail-details';

/**
 * Renders the Service Detail Details page.
 *
 * This page displays detailed information about a specific service detail.
 *
 * @async
 * @component
 * @param {Object} props - The component props.
 * @param {Promise<{ detail_id: string }>} props.params - A promise resolving to an object containing the service detail ID.
 */
export default async function DetailsServiceDetailPage(props: { params: Promise<{ detail_id: string }> }) {
  const params = await props.params;
  const { detail_id } = params;

  return (
    <PageContent title='Service Detail'>
      <ServiceDetailDetails id={detail_id} />
    </PageContent>
  );
}
