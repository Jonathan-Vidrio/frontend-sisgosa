import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategory,
  getDeletedCategories,
  restoreCategory,
  updateCategory,
} from '@/app/lib/actions/products/categories';
import { createError } from '@/helpers';
import { useModalStore, useProductsStore, useUiStore } from '@/store';
import { ProductCategory } from '@/interfaces';

export async function fetchGetCategories(): Promise<void> {
  const { showLoading, hideLoading } = useUiStore.getState();
  const { setCategories } = useProductsStore.getState();

  try {
    showLoading();

    const response = await getCategories();
    if (response && 'error' in response) throw new Error(response.error);

    const { categories } = response;

    setCategories(categories);
  } catch (error: any) {
    throw createError(error.message);
  } finally {
    hideLoading();
  }
}

export async function fetchGetDeletedCategories(): Promise<void> {
  const { showLoading, hideLoading } = useUiStore.getState();
  const { setCategories } = useProductsStore.getState();

  try {
    showLoading();

    const response = await getDeletedCategories();
    if (response && 'error' in response) throw new Error(response.error);

    const { categories } = response;

    setCategories(categories);
  } catch (error: any) {
    throw createError(error.message);
  } finally {
    hideLoading();
  }
}

export async function fetchGetProductCategory(id: string): Promise<ProductCategory> {
  const { showLoading, hideLoading } = useUiStore.getState();

  try {
    showLoading();

    const response = await getCategory(id);
    if (response && 'error' in response) throw new Error(response.error);

    const { category } = response;

    return category;
  } catch (error: any) {
    throw createError(error.message);
  } finally {
    hideLoading();
  }
}

export async function fetchCreateCategory(data: ProductCategory): Promise<ProductCategory> {
  const { showLoading, hideLoading } = useUiStore.getState();
  const { openModal, setChildren, setIsSuccess: setIsSucces } = useModalStore.getState();

  try {
    showLoading();

    const response = await createCategory({ ...data });
    if (response && 'error' in response) throw new Error(response.error);

    const { category } = response;

    setIsSucces();
    setChildren(`Category ${category.description} has been created.`);
    openModal();

    await fetchGetCategories();

    return category;
  } catch (error: any) {
    throw createError(error.message);
  } finally {
    hideLoading();
  }
}

export async function fetchUpdateCategory(id: string, data: ProductCategory): Promise<ProductCategory> {
  const { showLoading, hideLoading } = useUiStore.getState();
  const { openModal, setChildren, setIsSuccess: setIsSucces } = useModalStore.getState();

  try {
    showLoading();

    const response = await updateCategory(id, { ...data });
    if (response && 'error' in response) throw new Error(response.error);

    const { category } = response;

    setIsSucces();
    setChildren(`Category ${category.description} has been updated.`);
    openModal();

    await fetchGetCategories();

    return category;
  } catch (error: any) {
    throw createError(error.message);
  } finally {
    hideLoading();
  }
}

export async function fetchDeleteCategory(id: string): Promise<boolean> {
  const { showLoading, hideLoading } = useUiStore.getState();
  const { openModal, setChildren, setIsSuccess: setIsSucces } = useModalStore.getState();

  try {
    showLoading();

    const response = await deleteCategory(id);
    if (response && 'error' in response) throw new Error(response.error);

    const { message } = response;

    setIsSucces();
    setChildren(message);
    openModal();

    await fetchGetCategories();

    return !!message;
  } catch (error: any) {
    throw createError(error.message);
  } finally {
    hideLoading();
  }
}

export async function fetchRestoreCategory(id: string): Promise<boolean> {
  const { showLoading, hideLoading } = useUiStore.getState();
  const { openModal, setChildren, setIsSuccess: setIsSucces } = useModalStore.getState();

  try {
    showLoading();

    const response = await restoreCategory(id);
    if (response && 'error' in response) throw new Error(response.error);

    const { category } = response;

    setIsSucces();
    setChildren(`Category ${category.description} has been restored.`);
    openModal();

    await fetchGetCategories();

    return !!category;
  } catch (error: any) {
    throw createError(error.message);
  } finally {
    hideLoading();
  }
}
