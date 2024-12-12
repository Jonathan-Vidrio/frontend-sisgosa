import { PageContent } from '@/core';
import { ProductDetails } from '@/modules/products/components/details/product-details';

/**
 * Renders the Product Details page.
 * 
 * This page displays detailed information about a specific product.
 * 
 * @async
 * @component
 * @param {Object} props - The component props.
 * @param {Promise<{ id: string }>} props.params - A promise resolving to an object containing the product ID.
 */
export default async function DetailsProductPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;

  return (
    <PageContent title='Product Details'>
      <ProductDetails id={id} />
    </PageContent>
  );
}
