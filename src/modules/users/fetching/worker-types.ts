import {
  createWorkerType,
  deleteWorkerType,
  getDeletedWorkerTypes,
  getWorkerType,
  getWorkerTypes,
  restoreWorkerType,
  updateWorkerType,
} from '@/app/lib/actions/users/worker-types';
import { createError } from '@/helpers';
import { useModalStore, useUiStore, useUsersStore } from '@/store';
import { WorkerType } from '@/interfaces';

export async function fetchGetWorkerTypes(): Promise<void> {
  const { showLoading, hideLoading } = useUiStore.getState();
  const { setWorkerTypes } = useUsersStore.getState();

  try {
    showLoading();

    const response = await getWorkerTypes();
    if (response && 'error' in response) throw new Error(response.error);

    const { workerTypes } = response;

    setWorkerTypes(workerTypes);
  } catch (error: any) {
    throw createError(error.message);
  } finally {
    hideLoading();
  }
}

export async function fetchGetDeletedWorkerTypes(): Promise<void> {
  const { showLoading, hideLoading } = useUiStore.getState();
  const { setWorkerTypes } = useUsersStore.getState();

  try {
    showLoading();

    const response = await getDeletedWorkerTypes();
    if (response && 'error' in response) throw new Error(response.error);

    const { workerTypes } = response;

    setWorkerTypes(workerTypes);
  } catch (error: any) {
    throw createError(error.message);
  } finally {
    hideLoading();
  }
}

export async function fetchGetWorkerType(id: string): Promise<WorkerType> {
  const { showLoading, hideLoading } = useUiStore.getState();

  try {
    showLoading();

    const response = await getWorkerType(id);
    if (response && 'error' in response) throw new Error(response.error);

    const { workerType } = response;

    return workerType;
  } catch (error: any) {
    throw createError(error.message);
  } finally {
    hideLoading();
  }
}

export async function fetchCreateWorkerType(data: WorkerType): Promise<WorkerType> {
  const { openModal, setChildren, setIsSuccess: setIsSucces } = useModalStore.getState();
  const { showLoading, hideLoading } = useUiStore.getState();

  try {
    showLoading();

    const response = await createWorkerType({ ...data });
    if (response && 'error' in response) throw new Error(response.error);

    const { workerType } = response;

    setIsSucces();
    setChildren(`Worker type ${workerType.description} has been created.`);
    openModal();

    await fetchGetWorkerTypes();

    return workerType;
  } catch (error: any) {
    throw createError(error.message);
  } finally {
    hideLoading();
  }
}

// show modal with success message
export async function fetchUpdateWorkerType(id: string, data: WorkerType): Promise<WorkerType> {
  const { showLoading, hideLoading } = useUiStore.getState();
  const { openModal, setChildren, setIsSuccess: setIsSucces } = useModalStore.getState();

  try {
    showLoading();

    const response = await updateWorkerType(id, { ...data });
    if (response && 'error' in response) throw new Error(response.error);

    const { workerType } = response;

    setIsSucces();
    setChildren(`Worker type ${workerType.description} has been updated.`);
    openModal();

    await fetchGetWorkerTypes();

    return workerType;
  } catch (error: any) {
    throw createError(error.message);
  } finally {
    hideLoading();
  }
}

// show modal with success message
export async function fetchDeleteWorkerType(id: string): Promise<boolean> {
  const { showLoading, hideLoading } = useUiStore.getState();
  const { openModal, setChildren, setIsSuccess: setIsSucces } = useModalStore.getState();

  try {
    showLoading();

    const response = await deleteWorkerType(id);
    if (response && 'error' in response) throw new Error(response.error);

    const { message } = response;

    setIsSucces();
    setChildren(message);
    openModal();

    await fetchGetWorkerTypes();

    return !!message;
  } catch (error: any) {
    throw createError(error.message);
  } finally {
    hideLoading();
  }
}

// show modal with success message
export async function fetchRestoreWorkerType(id: string): Promise<boolean> {
  const { showLoading, hideLoading } = useUiStore.getState();
  const { openModal, setChildren, setIsSuccess: setIsSucces } = useModalStore.getState();

  try {
    showLoading();

    const response = await restoreWorkerType(id);
    if (response && 'error' in response) throw new Error(response.error);

    const { workerType } = response;

    setIsSucces();
    setChildren(`Worker type ${workerType.description} has been restored.`);
    openModal();

    await fetchGetWorkerTypes();

    return !!workerType;
  } catch (error: any) {
    throw createError(error.message);
  } finally {
    hideLoading();
  }
}
