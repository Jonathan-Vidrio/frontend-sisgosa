import { PageContent } from '@/core';
import { UpdateProductCategoryForm } from '@/modules/products/components/forms/update-product-category-form';

/**
 * Renders the Update Product Category page.
 *
 * This page provides a form to update the details of an existing product category.
 *
 * @async
 * @component
 * @param {Object} props - The component props.
 * @param {Promise<{ id: string }>} props.params - A promise resolving to an object containing the product category ID.
 */
export default async function UpdateProductCategoryPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;

  return (
    <PageContent title='Update Product Category' className='flex justify-center'>
      <UpdateProductCategoryForm id={id} className='w-1/2' />
    </PageContent>
  );
}
