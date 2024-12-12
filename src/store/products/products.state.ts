import { Product, ProductCategory } from '@/interfaces';

/**
 * @interface ProductsState
 * @description Defines the structure and actions for products state management
 *
 * @property {Product[]} [products] - Array of product objects
 * @property {ProductCategory[]} [categories] - Array of product category objects
 */
export interface ProductsState {
  /**
   * @property {Product[]} [products]
   * @description Optional array containing all available products
   * @default undefined
   */
  products?: Product[];

  /**
   * @property {ProductCategory[]} [categories]
   * @description Optional array containing all product categories
   * @default undefined
   */
  categories?: ProductCategory[];

  /**
   * @method setProducts
   * @description Updates the products array in the state
   * @param {Product[]} products - Array of products to set
   * @returns {void}
   */
  setProducts: (products: Product[]) => void;

  /**
   * @method resetProducts
   * @description Resets products array to undefined
   * @returns {void}
   */
  resetProducts: () => void;

  /**
   * @method setCategories
   * @description Updates the product categories array in the state
   * @param {ProductCategory[]} categories - Array of categories to set
   * @returns {void}
   */
  setCategories: (categories: ProductCategory[]) => void;

  /**
   * @method resetCategories
   * @description Resets categories array to undefined
   * @returns {void}
   */
  resetCategories: () => void;

  /**
   * @method reset
   * @description Resets entire products state to initial values
   * @returns {void}
   */
  reset: () => void;
}
