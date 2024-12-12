'use server';

import { ProductCategory } from '@/interfaces';
import { getAccessSession } from '../auth/auth';
import { httpRequest } from '@/helpers';

export async function getCategories(): Promise<{ categories: ProductCategory[] } | { error: string }> {
  try {
    const { user, accessToken } = await getAccessSession();

    const categories = await httpRequest({
      url: '/product-categories',
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return { categories };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function getDeletedCategories(): Promise<{ categories: ProductCategory[] } | { error: string }> {
  try {
    const { user, accessToken } = await getAccessSession();

    const categories = await httpRequest({
      url: '/product-categories/deleted',
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return { categories };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function getCategory(id: string): Promise<{ category: ProductCategory } | { error: string }> {
  try {
    const { user, accessToken } = await getAccessSession();

    const category = await httpRequest({
      url: `/product-categories/${id}`,
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return { category };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function createCategory(data: ProductCategory): Promise<{ category: ProductCategory } | { error: string }> {
  try {
    const { user, accessToken } = await getAccessSession();

    const category = await httpRequest({
      url: '/product-categories',
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}` },
      body: { ...data },
    });

    return { category };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function updateCategory(id: string, data: ProductCategory): Promise<{ category: ProductCategory } | { error: string }> {
  try {
    const { user, accessToken } = await getAccessSession();

    const category = await httpRequest({
      url: `/product-categories/${id}`,
      method: 'PATCH',
      headers: { Authorization: `Bearer ${accessToken}` },
      body: { ...data },
    });

    return { category };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function deleteCategory(id: string): Promise<{ message: string } | { error: string }> {
  try {
    const { user, accessToken } = await getAccessSession();

    const { message } = await httpRequest({
      url: `/product-categories/${id}`,
      method: 'DELETE',
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return { message };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function restoreCategory(categoryId: string): Promise<{ category: ProductCategory } | { error: string }> {
  try {
    const { user, accessToken } = await getAccessSession();

    const category = await httpRequest({
      url: `/product-categories/restore/${categoryId}`,
      method: 'PATCH',
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return { category };
  } catch (error: any) {
    return { error: error.message };
  }
}
