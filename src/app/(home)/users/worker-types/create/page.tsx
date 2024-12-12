import { PageContent } from '@/core';
import { CreateWorkerTypeForm } from '@/modules/users/ components/forms/create-worker-type-form';

/**
 * Renders the Create Worker Type page.
 * 
 * This page includes a form for creating a new worker type.
 * 
 * @component
 * @returns {JSX.Element} The create worker type page component.
 */
export default function CreateWorkerTypePage() {
  return (
    <PageContent title='Create Worker Type' className='w-full flex flex-col justify-center items-center gap-y-20'>
      <CreateWorkerTypeForm className='w-1/2' />
    </PageContent>
  );
}
