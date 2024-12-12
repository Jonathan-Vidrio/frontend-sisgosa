import {
  createServiceType,
  deleteServiceType,
  getDeletedServiceTypes,
  getServicesTypes,
  getServiceType,
  restoreServiceType,
  updateServiceType,
} from '@/app/lib/actions/services/services-types';
import { createError } from '@/helpers';
import { useModalStore, useServicesStore, useUiStore } from '@/store';
import { ServiceType } from '@/interfaces';

export async function fetchGetServicesTypes(): Promise<void> {
  const { showLoading, hideLoading } = useUiStore.getState();
  const { setServiceTypes } = useServicesStore.getState();

  try {
    showLoading();

    const response = await getServicesTypes();
    if (response && 'error' in response) throw new Error(response.error);

    const { serviceTypes } = response;

    setServiceTypes(serviceTypes);
  } catch (error: any) {
    throw createError(error.message);
  } finally {
    hideLoading();
  }
}

export async function fetchGetDeletedServicesTypes(): Promise<void> {
  const { showLoading, hideLoading } = useUiStore.getState();
  const { setServiceTypes } = useServicesStore.getState();

  try {
    showLoading();

    const response = await getDeletedServiceTypes();
    if (response && 'error' in response) throw new Error(response.error);

    const { serviceTypes } = response;

    setServiceTypes(serviceTypes);
  } catch (error: any) {
    throw createError(error.message);
  } finally {
    hideLoading();
  }
}

export async function fetchGetServiceType(id: string): Promise<ServiceType> {
  const { showLoading, hideLoading } = useUiStore.getState();

  try {
    showLoading();

    const response = await getServiceType(id);
    if (response && 'error' in response) throw new Error(response.error);

    const { serviceType } = response;

    return serviceType;
  } catch (error: any) {
    throw createError(error.message);
  } finally {
    hideLoading();
  }
}

export async function fetchCreateServiceType(data: ServiceType): Promise<ServiceType> {
  const { openModal, setChildren, setIsSuccess: setIsSucces } = useModalStore.getState();
  const { showLoading, hideLoading } = useUiStore.getState();

  try {
    showLoading();

    const response = await createServiceType({ ...data });
    if (response && 'error' in response) throw new Error(response.error);

    const { serviceType } = response;

    setIsSucces();
    setChildren(`Service type ${serviceType.description} has been created.`);
    openModal();

    await fetchGetServicesTypes();

    return serviceType;
  } catch (error: any) {
    throw createError(error.message);
  } finally {
    hideLoading();
  }
}

export async function fetchUpdateServiceType(id: string, data: ServiceType): Promise<ServiceType> {
  const { openModal, setChildren, setIsSuccess: setIsSucces } = useModalStore.getState();
  const { showLoading, hideLoading } = useUiStore.getState();

  try {
    showLoading();

    const response = await updateServiceType(id, { ...data });
    if (response && 'error' in response) throw new Error(response.error);

    const { serviceType } = response;

    setIsSucces();
    setChildren(`Service type ${serviceType.description} has been updated.`);
    openModal();

    await fetchGetServicesTypes();

    return serviceType;
  } catch (error: any) {
    throw createError(error.message);
  } finally {
    hideLoading();
  }
}

export async function fetchDeleteServiceType(id: string): Promise<boolean> {
  const { openModal, setChildren, setIsSuccess: setIsSucces } = useModalStore.getState();
  const { showLoading, hideLoading } = useUiStore.getState();

  try {
    showLoading();

    const response = await deleteServiceType(id);
    if (response && 'error' in response) throw new Error(response.error);

    const { message } = response;

    setIsSucces();
    setChildren(message);
    openModal();

    await fetchGetServicesTypes();

    return !!message;
  } catch (error: any) {
    throw createError(error.message);
  } finally {
    hideLoading();
  }
}

export async function fetchRestoreServiceType(id: string): Promise<boolean> {
  const { openModal, setChildren, setIsSuccess: setIsSucces } = useModalStore.getState();
  const { showLoading, hideLoading } = useUiStore.getState();

  try {
    showLoading();

    const response = await restoreServiceType(id);
    if (response && 'error' in response) throw new Error(response.error);

    const { serviceType } = response;

    setIsSucces();
    setChildren(`Service type ${serviceType.description} has been restored.`);
    openModal();

    await fetchGetServicesTypes();

    return !!serviceType;
  } catch (error: any) {
    throw createError(error.message);
  } finally {
    hideLoading();
  }
}
