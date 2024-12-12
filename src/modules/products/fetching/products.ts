import { useModalStore, useProductsStore, useUiStore } from '@/store';
import {
  createProduct,
  deleteProduct,
  getDeletedProducts,
  getProduct,
  getProducts,
  restoreProduct,
  updateProduct,
} from '@/app/lib/actions/products/products';
import { createError } from '@/helpers';
import { Product } from '@/interfaces';
import { uploadImage } from '@/app/lib/actions/image/image';

export async function fetchGetProducts(): Promise<void> {
  const { showLoading, hideLoading } = useUiStore.getState();
  const { setProducts } = useProductsStore.getState();

  try {
    showLoading();

    const response = await getProducts();
    if (response && 'error' in response) throw new Error(response.error);

    const { products } = response;

    setProducts(products);
  } catch (error: any) {
    throw createError(error.message);
  } finally {
    hideLoading();
  }
}

export async function fetchGetDeletedProducts(): Promise<void> {
  const { showLoading, hideLoading } = useUiStore.getState();
  const { setProducts } = useProductsStore.getState();

  try {
    showLoading();

    const response = await getDeletedProducts();
    if (response && 'error' in response) throw new Error(response.error);

    const { products } = response;

    setProducts(products);
  } catch (error: any) {
    throw createError(error.message);
  } finally {
    hideLoading();
  }
}

export async function fetchGetProduct(id: string): Promise<Product> {
  const { showLoading, hideLoading } = useUiStore.getState();

  try {
    showLoading();

    const response = await getProduct(id);
    if (response && 'error' in response) throw new Error(response.error);

    const { product } = response;

    return product;
  } catch (error: any) {
    throw createError(error.message);
  } finally {
    hideLoading();
  }
}

export async function fetchCreateProduct(data: Product): Promise<Product> {
  const { showLoading, hideLoading } = useUiStore.getState();
  const { openModal, setIsSuccess: setIsSucces, setChildren } = useModalStore.getState();

  try {
    showLoading();

    const image = data.image ? await uploadImage(data.image as File, 'products') : undefined;

    const response = await createProduct({ ...data, image });
    if (response && 'error' in response) throw new Error(response.error);

    const { product } = response;

    setIsSucces();
    setChildren(`Product ${product.description} has been created.`);
    openModal();

    await fetchGetProducts();

    return product;
  } catch (error: any) {
    throw createError(error.message);
  } finally {
    hideLoading();
  }
}

export async function fetchUpdateProduct(id: string, data: Product): Promise<Product> {
  const { showLoading, hideLoading } = useUiStore.getState();
  const { openModal, setIsSuccess: setIsSucces, setChildren } = useModalStore.getState();

  try {
    showLoading();

    const image = data.image ? await uploadImage(data.image as File, 'products') : undefined;

    const response = await updateProduct(id, { ...data, image });
    if (response && 'error' in response) throw new Error(response.error);

    const { product } = response;

    setIsSucces();
    setChildren(`Product ${product.description} has been updated.`);
    openModal();

    await fetchGetProducts();

    return product;
  } catch (error: any) {
    throw createError(error.message);
  } finally {
    hideLoading();
  }
}

export async function fetchDeleteProduct(id: string): Promise<boolean> {
  const { showLoading, hideLoading } = useUiStore.getState();
  const { openModal, setIsSuccess: setIsSucces, setChildren } = useModalStore.getState();

  try {
    showLoading();

    const response = await deleteProduct(id);
    if (response && 'error' in response) throw new Error(response.error);

    const { message } = response;

    setIsSucces();
    setChildren(message);
    openModal();

    await fetchGetProducts();

    return !!message;
  } catch (error: any) {
    throw createError(error.message);
  } finally {
    hideLoading();
  }
}

export async function fetchRestoreProduct(id: string): Promise<boolean> {
  const { showLoading, hideLoading } = useUiStore.getState();
  const { openModal, setIsSuccess: setIsSucces, setChildren } = useModalStore.getState();

  try {
    showLoading();

    const response = await restoreProduct(id);
    if (response && 'error' in response) throw new Error(response.error);

    const { product } = response;

    setIsSucces();
    setChildren(`Product ${product.description} has been restored.`);
    openModal();

    await fetchGetDeletedProducts();

    return !!product;
  } catch (error: any) {
    throw createError(error.message);
  } finally {
    hideLoading();
  }
}
