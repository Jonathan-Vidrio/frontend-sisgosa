'use server';

import { UserType } from '@/interfaces';
import { getAccessSession } from '../auth/auth';
import { httpRequest } from '@/helpers';

export async function getUserTypes(): Promise<{ userTypes: UserType[] } | { error: string }> {
  try {
    const { user, accessToken } = await getAccessSession();

    const userTypes = await httpRequest({
      url: '/user-types',
      headers: { Authorization: `Bearer ${accessToken}` },
      method: 'GET',
    });

    let filteredUserTypes: UserType[] = [...userTypes];

    if (
      user.userType &&
      (user.userType.description === 'admin' || (user.userType.description === 'worker' && user.worker?.workerType?.description === 'receptionist'))
    ) {
      filteredUserTypes = userTypes.filter((userType: UserType) => userType.description !== 'admin' && userType.description !== 'superAdmin');
    }

    return { userTypes: filteredUserTypes };
  } catch (error: any) {
    return { error: error.message };
  }
}
