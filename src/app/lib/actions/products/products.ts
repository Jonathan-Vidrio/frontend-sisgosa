'use server';

import { httpRequest } from '@/helpers';
import { getAccessSession } from '../auth/auth';
import { Product } from '@/interfaces';

export async function getProducts(): Promise<{ products: Product[] } | { error: string }> {
  try {
    const { user, accessToken } = await getAccessSession();

    const products = await httpRequest({
      url: '/products',
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return { products };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function getDeletedProducts(): Promise<{ products: Product[] } | { error: string }> {
  try {
    const { user, accessToken } = await getAccessSession();

    const products = await httpRequest({
      url: '/products/deleted',
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return { products };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function getProduct(id: string): Promise<{ product: Product } | { error: string }> {
  try {
    const { user, accessToken } = await getAccessSession();

    const product = await httpRequest({
      url: `/products/${id}`,
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return { product };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function createProduct(data: Product): Promise<{ product: Product } | { error: string }> {
  try {
    const { user, accessToken } = await getAccessSession();

    const product = await httpRequest({
      url: '/products',
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}` },
      body: { ...data },
    });

    return { product };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function updateProduct(id: string, data: Product): Promise<{ product: Product } | { error: string }> {
  try {
    const { user, accessToken } = await getAccessSession();

    const product = await httpRequest({
      url: `/products/${id}`,
      method: 'PATCH',
      headers: { Authorization: `Bearer ${accessToken}` },
      body: { ...data },
    });

    return { product };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function deleteProduct(id: string): Promise<{ message: string } | { error: string }> {
  try {
    const { user, accessToken } = await getAccessSession();

    const { message } = await httpRequest({
      url: `/products/${id}`,
      method: 'DELETE',
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return { message };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function restoreProduct(productId: string): Promise<{ product: Product } | { error: string }> {
  try {
    const { user, accessToken } = await getAccessSession();

    const product = await httpRequest({
      url: `/products/restore/${productId}`,
      method: 'PATCH',
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return { product };
  } catch (error: any) {
    return { error: error.message };
  }
}
