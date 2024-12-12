'use server';

import { WorkerType } from '@/interfaces';
import { httpRequest } from '@/helpers';
import { getAccessSession } from '../auth/auth';

export async function getWorkerTypes(): Promise<{ workerTypes: WorkerType[] } | { error: string }> {
  try {
    const { user, accessToken } = await getAccessSession();

    const workerTypes = await httpRequest({
      url: '/worker-types',
      headers: { Authorization: `Bearer ${accessToken}` },
      method: 'GET',
    });

    return { workerTypes };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function getDeletedWorkerTypes(): Promise<{ workerTypes: WorkerType[] } | { error: string }> {
  try {
    const { user, accessToken } = await getAccessSession();

    const workerTypes = await httpRequest({
      url: '/worker-types/deleted',
      headers: { Authorization: `Bearer ${accessToken}` },
      method: 'GET',
    });

    return { workerTypes };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function getWorkerType(id: string): Promise<{ workerType: WorkerType } | { error: string }> {
  try {
    const { user, accessToken } = await getAccessSession();

    const workerType = await httpRequest({
      url: `/worker-types/${id}`,
      headers: { Authorization: `Bearer ${accessToken}` },
      method: 'GET',
    });

    return { workerType };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function createWorkerType(data: WorkerType): Promise<{ workerType: WorkerType } | { error: string }> {
  try {
    const { user, accessToken } = await getAccessSession();

    const newWorkerType = await httpRequest({
      url: '/worker-types',
      headers: { Authorization: `Bearer ${accessToken}` },
      method: 'POST',
      body: { ...data },
    });

    return { workerType: newWorkerType };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function updateWorkerType(id: string, data: WorkerType): Promise<{ workerType: WorkerType } | { error: string }> {
  try {
    const { user, accessToken } = await getAccessSession();

    const updatedWorkerType = await httpRequest({
      url: `/worker-types/${id}`,
      headers: { Authorization: `Bearer ${accessToken}` },
      method: 'PATCH',
      body: { ...data },
    });

    return { workerType: updatedWorkerType };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function deleteWorkerType(id: string): Promise<{ message: string } | { error: string }> {
  try {
    const { user, accessToken } = await getAccessSession();

    const { message } = await httpRequest({
      url: `/worker-types/${id}`,
      headers: { Authorization: `Bearer ${accessToken}` },
      method: 'DELETE',
    });

    return { message };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function restoreWorkerType(id: string): Promise<{ workerType: WorkerType } | { error: string }> {
  try {
    const { user, accessToken } = await getAccessSession();

    const workerType = await httpRequest({
      url: `/worker-types/restore/${id}`,
      headers: { Authorization: `Bearer ${accessToken}` },
      method: 'PATCH',
    });

    return { workerType };
  } catch (error: any) {
    return { error: error.message };
  }
}
