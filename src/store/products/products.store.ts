import { create } from 'zustand';
import { ProductsState } from './products.state';

/**
 * @constant useProductsStore
 * @description Custom hook for managing products state using Zustand
 *
 * @example
 * // Access and update products
 * const { products, setProducts } = useProductsStore();
 * setProducts(newProducts);
 *
 * // Access and update categories
 * const { categories, setCategories } = useProductsStore();
 * setCategories(newCategories);
 *
 * // Reset specific state
 * const { resetProducts, resetCategories } = useProductsStore();
 * resetProducts();
 *
 * // Reset entire state
 * const { reset } = useProductsStore();
 * reset();
 *
 * @returns {ProductsState} Products state and mutation methods
 */
export const useProductsStore = create<ProductsState>((set, get) => ({
  products: undefined,
  categories: undefined,

  setProducts: products => set({ products }),
  resetProducts: () => set({ products: undefined }),

  setCategories: categories => set({ categories }),
  resetCategories: () => set({ categories: undefined }),

  reset: () => {
    get().resetProducts();
    get().resetCategories();
  },
}));
