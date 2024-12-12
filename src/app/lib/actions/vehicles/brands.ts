'use server';

import { httpRequest } from '@/helpers';
import { getAccessSession } from '../auth/auth';
import { VehicleBrand } from '@/interfaces';

export async function getVehicleBrands(): Promise<{ vehicleBrands: VehicleBrand[] } | { error: string }> {
  try {
    const { user, accessToken } = await getAccessSession();

    const vehicleBrands = await httpRequest({
      url: '/vehicle-brands',
      headers: { Authorization: `Bearer ${accessToken}` },
      method: 'GET',
    });

    return { vehicleBrands };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function getDeletedVehicleBrands(): Promise<{ vehicleBrands: VehicleBrand[] } | { error: string }> {
  try {
    const { user, accessToken } = await getAccessSession();

    const vehicleBrands = await httpRequest({
      url: '/vehicle-brands/deleted',
      headers: { Authorization: `Bearer ${accessToken}` },
      method: 'GET',
    });

    return { vehicleBrands };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function getVehicleBrand(id: string): Promise<{ brand: VehicleBrand } | { error: string }> {
  try {
    const { user, accessToken } = await getAccessSession();

    const vehicleBrand = await httpRequest({
      url: `/vehicle-brands/${id}`,
      headers: { Authorization: `Bearer ${accessToken}` },
      method: 'GET',
    });

    return { brand: vehicleBrand };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function createVehicleBrand(data: VehicleBrand): Promise<{ brand: VehicleBrand } | { error: string }> {
  try {
    const { user, accessToken } = await getAccessSession();

    const vehicleBrand = await httpRequest({
      url: '/vehicle-brands',
      headers: { Authorization: `Bearer ${accessToken}` },
      method: 'POST',
      body: { ...data },
    });

    return { brand: vehicleBrand };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function updateVehicleBrand(id: string, data: VehicleBrand): Promise<{ brand: VehicleBrand } | { error: string }> {
  try {
    const { user, accessToken } = await getAccessSession();

    const vehicleBrand = await httpRequest({
      url: `/vehicle-brands/${id}`,
      headers: { Authorization: `Bearer ${accessToken}` },
      method: 'PATCH',
      body: { ...data },
    });

    return { brand: vehicleBrand };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function deleteVehicleBrand(id: string): Promise<{ message: string } | { error: string }> {
  try {
    const { user, accessToken } = await getAccessSession();

    const { message } = await httpRequest({
      url: `/vehicle-brands/${id}`,
      headers: { Authorization: `Bearer ${accessToken}` },
      method: 'DELETE',
    });

    return { message };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function restoreVehicleBrand(id: string): Promise<{ vehicleBrand: VehicleBrand } | { error: string }> {
  try {
    const { user, accessToken } = await getAccessSession();

    const vehicleBrand = await httpRequest({
      url: `/vehicle-brands/restore/${id}`,
      headers: { Authorization: `Bearer ${accessToken}` },
      method: 'PATCH',
    });

    return { vehicleBrand };
  } catch (error: any) {
    return { error: error.message };
  }
}
