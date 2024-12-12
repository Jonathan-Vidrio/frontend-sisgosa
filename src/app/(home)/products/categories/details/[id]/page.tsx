import { PageContent } from '@/core';
import { ProductCategoryDetails } from '@/modules/products/components/details/product-category-details';

/**
 * Renders the Product Category Details page.
 *
 * This page displays detailed information about a specific product category.
 *
 * @async
 * @component
 * @param {Object} props - The component props.
 * @param {Promise<{ id: string }>} props.params - A promise resolving to an object containing the product category ID.
 */
export default async function DetailsProductCategoryPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;

  return (
    <PageContent title='Product Category Details'>
      <ProductCategoryDetails id={id} />
    </PageContent>
  );
}
