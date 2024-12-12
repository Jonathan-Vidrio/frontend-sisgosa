import { useModalStore, useServicesStore, useUiStore } from '@/store';
import { createError } from '@/helpers';
import { Service } from '@/interfaces';
import {
  createService,
  deleteService,
  getDeletedServices,
  getDeletedServicesByClient,
  getDeletedServicesByWorker,
  getService,
  getServices,
  getServicesByClient,
  getServicesByWorker,
  getServicesHistory,
  getServicesHistoryByClient,
  getServicesHistoryByWorker,
  restoreService,
  updateService,
} from '@/app/lib/actions/services/services';

export async function fetchGetServices(): Promise<void> {
  const { showLoading, hideLoading } = useUiStore.getState();
  const { setServices } = useServicesStore.getState();

  try {
    showLoading();

    const response = await getServices();
    if (response && 'error' in response) throw new Error(response.error);

    const { services } = response;

    setServices(services);
  } catch (error: any) {
    throw createError(error.message);
  } finally {
    hideLoading();
  }
}

export async function fetchGetServicesHistory(): Promise<void> {
  const { showLoading, hideLoading } = useUiStore.getState();
  const { setHistory } = useServicesStore.getState();

  try {
    showLoading();

    const response = await getServicesHistory();
    if (response && 'error' in response) throw new Error(response.error);

    const { services } = response;

    setHistory(services);
  } catch (error: any) {
    throw createError(error.message);
  } finally {
    hideLoading();
  }
}

export async function fetchGetDeletedServices(): Promise<void> {
  const { showLoading, hideLoading } = useUiStore.getState();
  const { setHistory } = useServicesStore.getState();

  try {
    showLoading();

    const response = await getDeletedServices();
    if (response && 'error' in response) throw new Error(response.error);

    const { services } = response;

    setHistory(services);
  } catch (error: any) {
    throw createError(error.message);
  } finally {
    hideLoading();
  }
}

export async function fetchGetServicesByClient(clientId: string): Promise<Service[]> {
  const { showLoading, hideLoading } = useUiStore.getState();
  const { setServices } = useServicesStore.getState();

  try {
    showLoading();

    const response = await getServicesByClient(clientId);
    if (response && 'error' in response) throw new Error(response.error);

    const { services } = response;

    setServices(services);

    return services;
  } catch (error: any) {
    throw createError(error.message);
  } finally {
    hideLoading();
  }
}

export async function fetchGetServicesHistoryByClient(clientId: string): Promise<Service[]> {
  const { showLoading, hideLoading } = useUiStore.getState();
  const { setHistory } = useServicesStore.getState();

  try {
    showLoading();

    const response = await getServicesHistoryByClient(clientId);
    if (response && 'error' in response) throw new Error(response.error);

    const { services } = response;

    setHistory(services);

    return services;
  } catch (error: any) {
    throw createError(error.message);
  } finally {
    hideLoading();
  }
}

export async function fetchGetDeletedServicesByClient(clientId: string): Promise<void> {
  const { showLoading, hideLoading } = useUiStore.getState();
  const { setHistory } = useServicesStore.getState();

  try {
    showLoading();

    const response = await getDeletedServicesByClient(clientId);
    if (response && 'error' in response) throw new Error(response.error);

    const { services } = response;

    setHistory(services);
  } catch (error: any) {
    throw createError(error.message);
  } finally {
    hideLoading();
  }
}

export async function fetchGetServicesByWorker(workerId: string): Promise<Service[]> {
  const { showLoading, hideLoading } = useUiStore.getState();
  const { setServices } = useServicesStore.getState();

  try {
    showLoading();

    const response = await getServicesByWorker(workerId);
    if (response && 'error' in response) throw new Error(response.error);

    const { services } = response;

    setServices(services);

    return services;
  } catch (error: any) {
    throw createError(error.message);
  } finally {
    hideLoading();
  }
}

export async function fetchGetServicesHistoryByWorker(workerId: string): Promise<Service[]> {
  const { showLoading, hideLoading } = useUiStore.getState();
  const { setHistory } = useServicesStore.getState();

  try {
    showLoading();

    const response = await getServicesHistoryByWorker(workerId);
    if (response && 'error' in response) throw new Error(response.error);

    const { services } = response;

    setHistory(services);

    return services;
  } catch (error: any) {
    throw createError(error.message);
  } finally {
    hideLoading();
  }
}

export async function fetchGetDeletedServicesByWorker(workerId: string): Promise<void> {
  const { showLoading, hideLoading } = useUiStore.getState();
  const { setHistory } = useServicesStore.getState();

  try {
    showLoading();

    const response = await getDeletedServicesByWorker(workerId);
    if (response && 'error' in response) throw new Error(response.error);

    const { services } = response;

    setHistory(services);
  } catch (error: any) {
    throw createError(error.message);
  } finally {
    hideLoading();
  }
}

export async function fetchGetService(id: string): Promise<Service> {
  const { showLoading, hideLoading } = useUiStore.getState();

  try {
    showLoading();

    const response = await getService(id);
    if (response && 'error' in response) throw new Error(response.error);

    const { service } = response;

    return service;
  } catch (error: any) {
    throw createError(error.message);
  } finally {
    hideLoading();
  }
}

export async function fetchCreateService(data: Service): Promise<Service> {
  const { openModal, setChildren, setIsSuccess: setIsSucces } = useModalStore.getState();
  const { showLoading, hideLoading } = useUiStore.getState();

  try {
    showLoading();

    const response = await createService(data);
    if (response && 'error' in response) throw new Error(response.error);

    const { service } = response;

    setIsSucces();
    setChildren(`Service has been created.`);
    openModal();

    await fetchGetServices();

    return service;
  } catch (error: any) {
    throw createError(error.message);
  } finally {
    hideLoading();
  }
}

export async function fetchUpdateService(id: string, data: Service): Promise<Service> {
  const { openModal, setChildren, setIsSuccess: setIsSucces } = useModalStore.getState();
  const { showLoading, hideLoading } = useUiStore.getState();

  try {
    showLoading();

    const response = await updateService(id, { ...data });
    if (response && 'error' in response) throw new Error(response.error);

    const { service } = response;

    setIsSucces();
    setChildren(`Service has been updated.`);
    openModal();

    await fetchGetServices();

    return service;
  } catch (error: any) {
    throw createError(error.message);
  } finally {
    hideLoading();
  }
}

export async function fetchDeleteService(id: string): Promise<boolean> {
  const { openModal, setChildren, setIsSuccess: setIsSucces } = useModalStore.getState();
  const { showLoading, hideLoading } = useUiStore.getState();

  try {
    showLoading();

    const response = await deleteService(id);
    if (response && 'error' in response) throw new Error(response.error);

    const { message } = response;

    setIsSucces();
    setChildren(message);
    openModal();

    await fetchGetServices();

    return !!message;
  } catch (error: any) {
    throw createError(error.message);
  } finally {
    hideLoading();
  }
}

export async function fetchRestoreService(id: string): Promise<boolean> {
  const { openModal, setChildren, setIsSuccess: setIsSucces } = useModalStore.getState();
  const { showLoading, hideLoading } = useUiStore.getState();

  try {
    showLoading();

    const response = await restoreService(id);
    if (response && 'error' in response) throw new Error(response.error);

    const { service } = response;

    setIsSucces();
    setChildren(`Service has been restored.`);
    openModal();

    await fetchGetServices();

    return !!service;
  } catch (error: any) {
    throw createError(error.message);
  } finally {
    hideLoading();
  }
}
