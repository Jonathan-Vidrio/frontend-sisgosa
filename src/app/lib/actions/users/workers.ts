'use server';

import { Worker } from '@/interfaces';
import { getAccessSession } from '../auth/auth';
import { httpRequest } from '@/helpers';

export async function getWorkers(): Promise<{ workers: Worker[] } | { error: string }> {
  try {
    const { user, accessToken } = await getAccessSession();

    const workers = await httpRequest({
      url: '/workers',
      headers: { Authorization: `Bearer ${accessToken}` },
      method: 'GET',
    });

    return { workers };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function getDeletedWorkers(): Promise<{ workers: Worker[] } | { error: string }> {
  try {
    const { user, accessToken } = await getAccessSession();

    const workers = await httpRequest({
      url: '/workers/deleted',
      headers: { Authorization: `Bearer ${accessToken}` },
      method: 'GET',
    });

    return { workers };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function getWorker(id: string): Promise<{ worker: Worker } | { error: string }> {
  try {
    const { user, accessToken } = await getAccessSession();

    const worker = await httpRequest({
      url: `/workers/${id}`,
      headers: { Authorization: `Bearer ${accessToken}` },
      method: 'GET',
    });

    return { worker };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function createWorker(data: Worker): Promise<{ worker: Worker } | { error: string }> {
  try {
    const { user, accessToken } = await getAccessSession();

    const worker = await httpRequest({
      url: '/workers',
      headers: { Authorization: `Bearer ${accessToken}` },
      method: 'POST',
      body: { ...data },
    });

    return { worker };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function updateWorker(id: string, data: Worker): Promise<{ worker: Worker } | { error: string }> {
  try {
    const { user, accessToken } = await getAccessSession();

    const worker = await httpRequest({
      url: `/workers/${id}`,
      headers: { Authorization: `Bearer ${accessToken}` },
      method: 'PATCH',
      body: { ...data },
    });

    return { worker };
  } catch (error: any) {
    return { error: error.message };
  }
}
