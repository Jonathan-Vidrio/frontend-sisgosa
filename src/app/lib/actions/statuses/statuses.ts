'use server';

import { Status } from '@/interfaces';
import { getAccessSession } from '../auth/auth';
import { httpRequest } from '@/helpers';

export async function getStatuses(): Promise<{ statuses: Status[] } | { error: string }> {
  try {
    const { user, accessToken } = await getAccessSession();

    const statuses = await httpRequest({
      url: '/statuses',
      headers: { Authorization: `Bearer ${accessToken}` },
      method: 'GET',
    });

    return { statuses };
  } catch (error: any) {
    return { error: error.message };
  }
}
