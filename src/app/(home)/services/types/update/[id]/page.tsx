import { PageContent } from '@/core';
import { UpdateServiceTypeForm } from '@/modules/services/components/forms/update-service-type-form';

/**
 * Renders the Update Service Type page.
 *
 * This page includes a form to update an existing service type.
 *
 * @async
 * @component
 * @param {Object} props - The component props.
 * @param {Promise<{ id: string }>} props.params - A promise resolving to an object containing the service type ID.
 */
export default async function UpdateServiceTypePage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;

  return (
    <PageContent title='Update Service Type' className='flex justify-center'>
      <UpdateServiceTypeForm id={id} className='w-1/2' />
    </PageContent>
  );
}
