import { PageContent } from '@/core';
import { UpdateWorkerTypeForm } from '@/modules/users/ components/forms/update-worker-type-form';

/**
 * Renders the Update Worker Type page.
 * 
 * This page provides a form to update an existing worker type.
 * 
 * @async
 * @component
 * @param {Object} props - The component props.
 * @param {Promise<{ id: string }>} props.params - A promise resolving to an object containing the worker type ID.
 * @returns {Promise<JSX.Element>} The update worker type page component.
 */
export default async function UpdateWorkerTypePage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;

  return (
    <PageContent title='Update Worker Type' className='w-full flex flex-col justify-center items-center'>
      <UpdateWorkerTypeForm id={id} className='w-1/2' />
    </PageContent>
  );
}
