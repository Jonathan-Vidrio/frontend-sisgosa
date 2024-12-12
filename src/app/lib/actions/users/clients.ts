'use server';

import { Client } from '@/interfaces';
import { getAccessSession } from '../auth/auth';
import { httpRequest } from '@/helpers';
import { getUserByEmail } from './users';

export async function getClients(): Promise<{ clients: Client[] } | { error: string }> {
  try {
    const { user, accessToken } = await getAccessSession();

    const clients = await httpRequest({
      url: '/clients',
      headers: { Authorization: `Bearer ${accessToken}` },
      method: 'GET',
    });

    return { clients };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function getDeletedClients(): Promise<{ clients: Client[] } | { error: string }> {
  try {
    const { user, accessToken } = await getAccessSession();

    const clients = await httpRequest({
      url: '/clients/deleted',
      headers: { Authorization: `Bearer ${accessToken}` },
      method: 'GET',
    });

    return { clients };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function getClient(id: string): Promise<{ client: Client } | { error: string }> {
  try {
    const { user, accessToken } = await getAccessSession();

    const client = await httpRequest({
      url: `/clients/${id}`,
      headers: { Authorization: `Bearer ${accessToken}` },
      method: 'GET',
    });

    return { client };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function getClientByEmail(email: string): Promise<{ client: Client } | { error: string }> {
  try {
    const { user, accessToken } = await getAccessSession();

    const response = await getUserByEmail(email);
    if (response && 'error' in response) throw new Error(response.error);

    const { user: userResponse } = response;

    const client = await httpRequest({
      url: `/clients/user/${userResponse.id}`,
      headers: { Authorization: `Bearer ${accessToken}` },
      method: 'GET',
    });

    return { client };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function createClient(data: Client): Promise<{ client: Client } | { error: string }> {
  try {
    const { user, accessToken } = await getAccessSession();

    const client = await httpRequest({
      url: '/clients',
      headers: { Authorization: `Bearer ${accessToken}` },
      method: 'POST',
      body: { ...data },
    });

    return { client };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function updateClient(id: string, data: Client): Promise<{ client: Client } | { error: string }> {
  try {
    const { user, accessToken } = await getAccessSession();

    const client = await httpRequest({
      url: `/clients/${id}`,
      headers: { Authorization: `Bearer ${accessToken}` },
      method: 'PATCH',
      body: { ...data },
    });

    return { client };
  } catch (error: any) {
    return { error: error.message };
  }
}
