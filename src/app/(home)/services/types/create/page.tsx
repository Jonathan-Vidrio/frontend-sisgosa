import { PageContent } from '@/core';
import { CreateServiceTypeForm } from '@/modules/services/components/forms/create-service-type-form';

/**
 * Renders the Create Service Type page.
 *
 * This page includes a form for creating a new service type.
 *
 * @component
 */
export default function CreateServiceType() {
  return (
    <PageContent title='Create Service Type' className='flex justify-center'>
      <CreateServiceTypeForm className='w-1/2' />
    </PageContent>
  );
}
