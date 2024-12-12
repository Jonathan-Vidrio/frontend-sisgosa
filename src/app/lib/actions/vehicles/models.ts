'use server';

import { VehicleModel } from '@/interfaces';
import { getAccessSession } from '../auth/auth';
import { httpRequest } from '@/helpers';

export async function getVehicleModels(): Promise<{ vehicleModels: VehicleModel[] } | { error: string }> {
  try {
    const { user, accessToken } = await getAccessSession();

    const vehicleModels = await httpRequest({
      url: '/vehicle-models',
      headers: { Authorization: `Bearer ${accessToken}` },
      method: 'GET',
    });

    return { vehicleModels };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function getDeletedVehicleModels(): Promise<{ vehicleModels: VehicleModel[] } | { error: string }> {
  try {
    const { user, accessToken } = await getAccessSession();

    const vehicleModels = await httpRequest({
      url: '/vehicle-models/deleted',
      headers: { Authorization: `Bearer ${accessToken}` },
      method: 'GET',
    });

    return { vehicleModels };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function getVehicleModel(id: string): Promise<{ vehicleModel: VehicleModel } | { error: string }> {
  try {
    const { user, accessToken } = await getAccessSession();

    const vehicleModel = await httpRequest({
      url: `/vehicle-models/${id}`,
      headers: { Authorization: `Bearer ${accessToken}` },
      method: 'GET',
    });

    return { vehicleModel };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function createVehicleModel(data: VehicleModel): Promise<{ vehicleModel: VehicleModel } | { error: string }> {
  try {
    const { user, accessToken } = await getAccessSession();

    const vehicleModel = await httpRequest({
      url: '/vehicle-models',
      headers: { Authorization: `Bearer ${accessToken}` },
      method: 'POST',
      body: { ...data },
    });

    return { vehicleModel };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function updateVehicleModel(id: string, data: VehicleModel): Promise<{ vehicleModel: VehicleModel } | { error: string }> {
  try {
    const { user, accessToken } = await getAccessSession();

    const vehicleModel = await httpRequest({
      url: `/vehicle-models/${id}`,
      headers: { Authorization: `Bearer ${accessToken}` },
      method: 'PATCH',
      body: { ...data },
    });

    return { vehicleModel };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function deleteVehicleModel(id: string): Promise<{ message: string } | { error: string }> {
  try {
    const { user, accessToken } = await getAccessSession();

    const message = await httpRequest({
      url: `/vehicle-models/${id}`,
      headers: { Authorization: `Bearer ${accessToken}` },
      method: 'DELETE',
    });

    return { message };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function restoreVehicleModel(id: string): Promise<{ vehicleModel: VehicleModel } | { error: string }> {
  try {
    const { user, accessToken } = await getAccessSession();

    const vehicleModel = await httpRequest({
      url: `/vehicle-models/restore/${id}`,
      headers: { Authorization: `Bearer ${accessToken}` },
      method: 'PATCH',
    });

    return { vehicleModel };
  } catch (error: any) {
    return { error: error.message };
  }
}
