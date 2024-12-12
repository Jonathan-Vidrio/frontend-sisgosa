'use server';

import { httpRequest } from '@/helpers';
import { getAccessSession } from '../auth/auth';
import { Resource } from '@/interfaces';

export async function getResourcesByService(serviceId: string): Promise<{ resources: Resource[] } | { error: string }> {
  try {
    const { user, accessToken } = await getAccessSession();

    const resources = await httpRequest({
      url: `/resources/service/${serviceId}`,
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return { resources };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function getDeletedResourcesByService(serviceId: string): Promise<{ resources: Resource[] } | { error: string }> {
  try {
    const { user, accessToken } = await getAccessSession();

    const resources = await httpRequest({
      url: `/resources/service/deleted/${serviceId}`,
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return { resources };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function getResource(id: string): Promise<{ resource: Resource } | { error: string }> {
  try {
    const { user, accessToken } = await getAccessSession();

    const resource = await httpRequest({
      url: `/resources/${id}`,
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return { resource };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function createResource(data: Resource): Promise<{ resource: Resource } | { error: string }> {
  try {
    const { user, accessToken } = await getAccessSession();

    const resource = await httpRequest({
      url: '/resources',
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}` },
      body: { ...data },
    });

    return { resource };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function updateResource(id: string, data: Resource): Promise<{ resource: Resource } | { error: string }> {
  try {
    const { user, accessToken } = await getAccessSession();

    const resource = await httpRequest({
      url: `/resources/${id}`,
      method: 'PATCH',
      headers: { Authorization: `Bearer ${accessToken}` },
      body: { ...data },
    });

    return { resource };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function deleteResource(id: string): Promise<{ message: string } | { error: string }> {
  try {
    const { user, accessToken } = await getAccessSession();

    const { message } = await httpRequest({
      url: `/resources/${id}`,
      method: 'DELETE',
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return { message };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function restoreResource(id: string): Promise<{ resource: Resource } | { error: string }> {
  try {
    const { user, accessToken } = await getAccessSession();

    const resource = await httpRequest({
      url: `/resources/restore/${id}`,
      method: 'PATCH',
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return { resource };
  } catch (error: any) {
    return { error: error.message };
  }
}
