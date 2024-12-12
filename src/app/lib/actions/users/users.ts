'use server';

import { httpRequest } from '@/helpers';
import { getAccessSession } from '../auth/auth';
import { User } from '@/interfaces';
import { updateClient } from './clients';
import { updateWorker } from './workers';
import { permission } from 'process';

export async function getUsers(): Promise<{ users: User[] } | { error: string }> {
  try {
    const { user, accessToken, permissions } = await getAccessSession();

    let url: string = '/users';
    if (permissions?.includes('superAdmin')) url = '/users';
    if (permissions?.includes('admin')) url = '/users?exclude=SUPERADMIN';
    if (permissions?.includes('receptionist')) url = '/users?exclude=SUPERADMIN&exclude=ADMIN';
    if (permissions?.includes('client')) url = '/users?exclude=SUPERADMIN&exclude=ADMIN&exclude=WORKER';

    const users = await httpRequest({
      url,
      headers: { Authorization: `Bearer ${accessToken}` },
      method: 'GET',
    });

    return { users: users.filter((u: User) => u.email !== user.email) };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function getDeletedUsers(): Promise<{ users: User[] } | { error: string }> {
  try {
    const { user, accessToken } = await getAccessSession();

    const users = await httpRequest({
      url: '/users/deleted',
      headers: { Authorization: `Bearer ${accessToken}` },
      method: 'GET',
    });

    return { users };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function getUser(id: string): Promise<{ user: User } | { error: string }> {
  try {
    const { user, accessToken } = await getAccessSession();

    const userResponse = await httpRequest({
      url: `/users/${id}`,
      headers: { Authorization: `Bearer ${accessToken}` },
      method: 'GET',
    });

    return { user: userResponse };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function getUserByEmail(email: string): Promise<{ user: User } | { error: string }> {
  try {
    const { user, accessToken } = await getAccessSession();

    const userResponse = await httpRequest({
      url: `/users/email/${email}`,
      headers: { Authorization: `Bearer ${accessToken}` },
      method: 'GET',
    });

    return { user: userResponse };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function createUser(data: User): Promise<{ user: User } | { error: string }> {
  try {
    const { user, accessToken } = await getAccessSession();

    const userResponse = await httpRequest({
      url: '/users',
      headers: { Authorization: `Bearer ${accessToken}` },
      method: 'POST',
      body: { ...data },
    });

    return { user: { ...userResponse } };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function updateUser(id: string, data: User): Promise<{ user: User } | { error: string }> {
  try {
    console.log(data);

    const { user, accessToken } = await getAccessSession();

    const userData = {
      firstName: data.firstName,
      firstSurname: data.firstSurname,
      secondSurname: data.secondSurname,
    };

    if (data.userType?.description === 'CLIENT' && data.client && data.client.id) {
      const response = await updateClient(data.client.id, data.client);
      if (response && 'error' in response) throw new Error(response.error);
    }

    if (data.userType?.description === 'WORKER' && data.worker && data.worker.id) {
      const response = await updateWorker(data.worker.id, data.worker);
      if (response && 'error' in response) throw new Error(response.error);
    }

    const userResponse = await httpRequest({
      url: `/users/${id}`,
      headers: { Authorization: `Bearer ${accessToken}` },
      method: 'PATCH',
      body: { ...userData },
    });

    return { user: userResponse };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function deleteUser(id: string): Promise<{ message: string } | { error: string }> {
  try {
    const { user, accessToken } = await getAccessSession();

    const { message } = await httpRequest({
      url: `/users/${id}`,
      headers: { Authorization: `Bearer ${accessToken}` },
      method: 'DELETE',
    });

    return { message };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function restoreUser(id: string): Promise<{ user: User } | { error: string }> {
  try {
    const { user, accessToken } = await getAccessSession();

    const userResponse = await httpRequest({
      url: `/users/restore/${id}`,
      headers: { Authorization: `Bearer ${accessToken}` },
      method: 'PATCH',
    });

    return { user: userResponse };
  } catch (error: any) {
    return { error: error.message };
  }
}
