import { getWorker, getWorkers } from '@/app/lib/actions/users/workers';
import { createError } from '@/helpers';
import { Worker } from '@/interfaces';
import { useUiStore, useUsersStore } from '@/store';

export async function fetchGetWorkers(): Promise<void> {
  const { showLoading, hideLoading } = useUiStore.getState();
  const { setWorkers } = useUsersStore.getState();

  try {
    showLoading();

    const response = await getWorkers();
    if (response && 'error' in response) throw new Error(response.error);

    const { workers } = response;

    setWorkers(workers);
  } catch (error: any) {
    throw createError(error.message);
  } finally {
    hideLoading();
  }
}

export async function fetchGetWorker(id: string): Promise<Worker> {
  const { showLoading, hideLoading } = useUiStore.getState();

  try {
    showLoading();

    const response = await getWorker(id);
    if (response && 'error' in response) throw new Error(response.error);

    const { worker } = response;

    return worker;
  } catch (error: any) {
    throw createError(error.message);
  } finally {
    hideLoading();
  }
}
