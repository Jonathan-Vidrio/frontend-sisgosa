import { useUiStore, useUsersStore } from '@/store';
import { createError } from '@/helpers';
import { Client } from '@/interfaces';
import { getClient, getClients } from '@/app/lib/actions/users/clients';

export async function fetchGetClients(): Promise<void> {
  const { showLoading, hideLoading } = useUiStore.getState();
  const { setClients } = useUsersStore.getState();

  try {
    showLoading();

    const response = await getClients();
    if (response && 'error' in response) throw new Error(response.error);

    const { clients } = response;

    setClients(clients);
  } catch (error: any) {
    throw createError(error.message);
  } finally {
    hideLoading();
  }
}

export async function fetchGetClient(id: string): Promise<Client> {
  const { showLoading, hideLoading } = useUiStore.getState();

  try {
    showLoading();

    const response = await getClient(id);
    if (response && 'error' in response) throw new Error(response.error);

    const { client } = response;

    return client;
  } catch (error: any) {
    throw createError(error.message);
  } finally {
    hideLoading();
  }
}
