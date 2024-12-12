import { PageContent } from '@/core';
import { CreateProductForm } from '@/modules/products/components/forms/create-product-form';

/**
 * Renders the Create Product page.
 *
 * This page includes a form for creating a new product.
 *
 * @component
 */
export default function CreateProductPage() {
  return (
    <PageContent title='Create Product' className='flex justify-center'>
      <CreateProductForm className='w-1/2' />
    </PageContent>
  );
}
