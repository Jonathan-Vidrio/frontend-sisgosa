'use server';

import { httpRequest } from '@/helpers';
import { getAccessSession } from '../auth/auth';
import { Service } from '@/interfaces';

export async function getServices(): Promise<{ services: Service[] } | { error: string }> {
  try {
    const { user, accessToken } = await getAccessSession();

    const services: Service[] = await httpRequest({
      url: '/services',
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return { services };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function getServicesHistory(): Promise<{ services: Service[] } | { error: string }> {
  try {
    const { user, accessToken } = await getAccessSession();

    const services: Service[] = await httpRequest({
      url: '/services/history',
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return { services };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function getDeletedServices(): Promise<{ services: Service[] } | { error: string }> {
  try {
    const { user, accessToken } = await getAccessSession();

    const services: Service[] = await httpRequest({
      url: '/services/deleted',
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return { services };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function getServicesByClient(clientId: string): Promise<{ services: Service[] } | { error: string }> {
  try {
    const { user, accessToken } = await getAccessSession();

    const services: Service[] = await httpRequest({
      url: `/services/client/${clientId}`,
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return { services };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function getServicesHistoryByClient(clientId: string): Promise<{ services: Service[] } | { error: string }> {
  try {
    const { user, accessToken } = await getAccessSession();

    const services: Service[] = await httpRequest({
      url: `/services/history/client/${clientId}`,
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return { services };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function getDeletedServicesByClient(clientId: string): Promise<{ services: Service[] } | { error: string }> {
  try {
    const { user, accessToken } = await getAccessSession();

    const services: Service[] = await httpRequest({
      url: `/services/deleted/client/${clientId}`,
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return { services };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function getServicesByWorker(workerId: string): Promise<{ services: Service[] } | { error: string }> {
  try {
    const { user, accessToken } = await getAccessSession();

    const services: Service[] = await httpRequest({
      url: `/services/worker/${workerId}`,
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return { services };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function getServicesHistoryByWorker(workerId: string): Promise<{ services: Service[] } | { error: string }> {
  try {
    const { user, accessToken } = await getAccessSession();

    const services: Service[] = await httpRequest({
      url: `/services/history/worker/${workerId}`,
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return { services };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function getDeletedServicesByWorker(workerId: string): Promise<{ services: Service[] } | { error: string }> {
  try {
    const { user, accessToken } = await getAccessSession();

    const services: Service[] = await httpRequest({
      url: `/services/deleted/worker/${workerId}`,
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return { services };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function getService(id: string): Promise<{ service: Service } | { error: string }> {
  try {
    const { user, accessToken } = await getAccessSession();

    const service: Service = await httpRequest({
      url: `/services/${id}`,
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return { service };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function createService(data: Service): Promise<{ service: Service } | { error: string }> {
  try {
    const { user, accessToken } = await getAccessSession();

    const service = await httpRequest({
      url: '/services',
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}` },
      body: { ...data },
    });

    return { service };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function updateService(id: string, data: Service): Promise<{ service: Service } | { error: string }> {
  try {
    const { user, accessToken } = await getAccessSession();

    const service = await httpRequest({
      url: `/services/${id}`,
      method: 'PATCH',
      headers: { Authorization: `Bearer ${accessToken}` },
      body: { ...data },
    });

    return { service };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function deleteService(id: string): Promise<{ message: string } | { error: string }> {
  try {
    const { user, accessToken } = await getAccessSession();

    const { message } = await httpRequest({
      url: `/services/${id}`,
      method: 'DELETE',
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return { message };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function restoreService(id: string): Promise<{ service: Service } | { error: string }> {
  try {
    const { user, accessToken } = await getAccessSession();

    const service = await httpRequest({
      url: `/services/restore/${id}`,
      method: 'PATCH',
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return { service };
  } catch (error: any) {
    return { error: error.message };
  }
}
