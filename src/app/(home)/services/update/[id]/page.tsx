import { PageContent } from '@/core';
import { UpdateServiceForm } from '@/modules/services/components/forms/update-service-form';

/**
 * Renders the Update Service page.
 * 
 * This page includes a form to update an existing service.
 * 
 * @async
 * @component
 * @param {Object} props - The component props.
 * @param {Promise<{ id: string }>} props.params - A promise resolving to an object containing the service ID.
 * @returns {Promise<JSX.Element>} The update service page component.
 */
export default async function UpdateServicePage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;

  return (
    <PageContent title='Update Service' className='flex justify-center'>
      <UpdateServiceForm id={id} className='w-1/2' />
    </PageContent>
  );
}
