import { PageContent } from '@/core';
import { CreateProductCategoryForm } from '@/modules/products/components/forms/create-product-category-form';

/**
 * Renders the Create Product Category page.
 *
 * This page includes a form for creating a new product category.
 *
 * @component
 */
export default function CreateProductCategoryPage() {
  return (
    <PageContent title='Create Product Category' className='flex justify-center'>
      <CreateProductCategoryForm className='w-1/2' />
    </PageContent>
  );
}
