import { PageContent } from '@/core';
import { CreateServiceDetailForm } from '@/modules/services/components/forms/create-service-detail-form';

/**
 * Renders the Create Service Details page.
 *
 * This page includes a form for creating service details.
 *
 * @component
 */
export default function CreateServiceDetailPage() {
  return (
    <PageContent title='Create Service Details' className='flex justify-center'>
      <CreateServiceDetailForm className='w-1/2' />
    </PageContent>
  );
}
