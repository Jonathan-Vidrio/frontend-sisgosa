import { PageContent } from '@/core';
import { UpdateProductForm } from '@/modules/products/components/forms/update-product-form';

/**
 * Renders the Update Product page.
 *
 * This page provides a form to update the details of an existing product.
 *
 * @async
 * @component
 * @param {Object} props - The component props.
 * @param {Promise<{ id: string }>} props.params - A promise resolving to an object containing the product ID.
 */
export default async function UpdateProductPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;

  return (
    <PageContent title='Update Products' className='flex justify-center'>
      <UpdateProductForm id={id} className='w-1/2' />
    </PageContent>
  );
}
