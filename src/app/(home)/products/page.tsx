import { PageContent } from '@/core';
import { ProductsTable } from '@/modules/products/components/tables/products-table';

/**
 * Renders the Products page.
 *
 * This page displays a table listing all products.
 *
 * @component
 */
export default function ProductsPage() {
  return (
    <PageContent title='Products'>
      <ProductsTable />
    </PageContent>
  );
}
