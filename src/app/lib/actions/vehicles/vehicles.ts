'use server';

import { httpRequest } from '@/helpers';
import { getAccessSession } from '../auth/auth';
import { Vehicle } from '@/interfaces';

export async function getVehicles(): Promise<{ vehicles: Vehicle[] } | { error: string }> {
  try {
    const { user, accessToken } = await getAccessSession();

    const vehicles = await httpRequest({
      url: '/vehicles',
      headers: { Authorization: `Bearer ${accessToken}` },
      method: 'GET',
    });

    return { vehicles };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function getDeletedVehicles(): Promise<{ vehicles: Vehicle[] } | { error: string }> {
  try {
    const { user, accessToken } = await getAccessSession();

    const vehicles = await httpRequest({
      url: '/vehicles/deleted',
      headers: { Authorization: `Bearer ${accessToken}` },
      method: 'GET',
    });

    return { vehicles };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function getVehiclesByClient(clientId: string): Promise<{ vehicles: Vehicle[] } | { error: string }> {
  try {
    const { user, accessToken } = await getAccessSession();

    const vehicles = await httpRequest({
      url: `/vehicles/client/${clientId}`,
      headers: { Authorization: `Bearer ${accessToken}` },
      method: 'GET',
    });

    return { vehicles };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function getDeletedVehiclesByClient(clientId: string): Promise<{ vehicles: Vehicle[] } | { error: string }> {
  try {
    const { user, accessToken } = await getAccessSession();

    const vehicles = await httpRequest({
      url: `/vehicles/deleted/client/${clientId}`,
      headers: { Authorization: `Bearer ${accessToken}` },
      method: 'GET',
    });

    return { vehicles };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function getVehicle(vehicleId: string): Promise<{ vehicle: Vehicle } | { error: string }> {
  try {
    const { user, accessToken } = await getAccessSession();

    const vehicle = await httpRequest({
      url: `/vehicles/${vehicleId}`,
      headers: { Authorization: `Bearer ${accessToken}` },
      method: 'GET',
    });

    return { vehicle };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function getVehicleByLicensePlate(licensePlate: string): Promise<{ vehicle: Vehicle } | { error: string }> {
  try {
    const { user, accessToken } = await getAccessSession();

    const vehicle = await httpRequest({
      url: `/vehicles/license-plate/${licensePlate}`,
      headers: { Authorization: `Bearer ${accessToken}` },
      method: 'GET',
    });

    return { vehicle };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function createVehicle(data: Vehicle): Promise<{ vehicle: Vehicle } | { error: string }> {
  try {
    const { user, accessToken } = await getAccessSession();

    const vehicle = await httpRequest({
      url: '/vehicles',
      headers: { Authorization: `Bearer ${accessToken}` },
      method: 'POST',
      body: { ...data },
    });

    return { vehicle };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function updateVehicle(id: string, data: Vehicle): Promise<{ vehicle: Vehicle } | { error: string }> {
  try {
    const { user, accessToken } = await getAccessSession();

    const vehicle = await httpRequest({
      url: `/vehicles/${id}`,
      headers: { Authorization: `Bearer ${accessToken}` },
      method: 'PATCH',
      body: { ...data },
    });

    return { vehicle };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function deleteVehicle(id: string): Promise<{ message: string } | { error: string }> {
  try {
    const { user, accessToken } = await getAccessSession();

    const { message } = await httpRequest({
      url: `/vehicles/${id}`,
      headers: { Authorization: `Bearer ${accessToken}` },
      method: 'DELETE',
    });

    return { message };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function restoreVehicle(id: string): Promise<{ vehicle: Vehicle } | { error: string }> {
  try {
    const { user, accessToken } = await getAccessSession();

    const vehicle = await httpRequest({
      url: `/vehicles/restore/${id}`,
      headers: { Authorization: `Bearer ${accessToken}` },
      method: 'PATCH',
    });

    return { vehicle };
  } catch (error: any) {
    return { error: error.message };
  }
}
