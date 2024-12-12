'use server';

import { ServiceType } from '@/interfaces';
import { getAccessSession } from '../auth/auth';
import { httpRequest } from '@/helpers';

export async function getServicesTypes(): Promise<{ serviceTypes: ServiceType[] } | { error: string }> {
  try {
    const { user, accessToken } = await getAccessSession();

    const serviceTypes = await httpRequest({
      url: '/service-types',
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return { serviceTypes };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function getDeletedServiceTypes(): Promise<{ serviceTypes: ServiceType[] } | { error: string }> {
  try {
    const { user, accessToken } = await getAccessSession();

    const serviceTypes = await httpRequest({
      url: '/service-types/deleted',
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return { serviceTypes };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function getServiceType(id: string): Promise<{ serviceType: ServiceType } | { error: string }> {
  try {
    const { user, accessToken } = await getAccessSession();

    const serviceType = await httpRequest({
      url: `/service-types/${id}`,
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return { serviceType };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function createServiceType(data: ServiceType): Promise<{ serviceType: ServiceType } | { error: string }> {
  try {
    const { user, accessToken } = await getAccessSession();

    const serviceType = await httpRequest({
      url: '/service-types',
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}` },
      body: { ...data },
    });

    return { serviceType };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function updateServiceType(id: string, data: ServiceType): Promise<{ serviceType: ServiceType } | { error: string }> {
  try {
    const { user, accessToken } = await getAccessSession();

    const serviceType = await httpRequest({
      url: `/service-types/${id}`,
      method: 'PATCH',
      headers: { Authorization: `Bearer ${accessToken}` },
      body: { ...data },
    });

    return { serviceType };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function deleteServiceType(id: string): Promise<{ message: string } | { error: string }> {
  try {
    const { user, accessToken } = await getAccessSession();

    const { message } = await httpRequest({
      url: `/service-types/${id}`,
      method: 'DELETE',
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return { message };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function restoreServiceType(id: string): Promise<{ serviceType: ServiceType } | { error: string }> {
  try {
    const { user, accessToken } = await getAccessSession();

    const serviceType = await httpRequest({
      url: `/service-types/${id}/restore`,
      method: 'PUT',
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return { serviceType };
  } catch (error: any) {
    return { error: error.message };
  }
}
