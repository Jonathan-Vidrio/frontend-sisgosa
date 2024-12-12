import { useUiStore, useUsersStore } from '@/store';
import { createError } from '@/helpers';
import { getUserTypes } from '@/app/lib/actions/users/user-types';

export async function fetchGetUserTypes(): Promise<void> {
  const { showLoading, hideLoading } = useUiStore.getState();
  const { setUserTypes } = useUsersStore.getState();

  try {
    showLoading();

    const response = await getUserTypes();
    if (response && 'error' in response) throw new Error(response.error);

    const { userTypes } = response;

    setUserTypes(userTypes);
  } catch (error: any) {
    throw createError(error.message);
  } finally {
    hideLoading();
  }
}
