import { useUiStore } from '@/store';
import { ServiceDetail } from '@/interfaces';
import { createError } from '@/helpers';
import {
  createServiceDetail,
  deleteServiceDetail,
  getDeletedServicesDetailsByService,
  getServiceDetail,
  getServicesDetailsByService,
  restoreServiceDetail,
  updateServiceDetail,
} from '@/app/lib/actions/services/service-details';

export async function fetchGetServiceDetailsByService(serviceId: string): Promise<ServiceDetail[]> {
  const { showLoading, hideLoading } = useUiStore.getState();

  try {
    showLoading();

    const response = await getServicesDetailsByService(serviceId);
    if (response && 'error' in response) throw new Error(response.error);

    const { serviceDetails } = response;

    return serviceDetails;
  } catch (error: any) {
    throw createError(error.message);
  } finally {
    hideLoading();
  }
}

export async function fetchGetDeletedServiceDetailsByService(serviceId: string): Promise<ServiceDetail[]> {
  const { showLoading, hideLoading } = useUiStore.getState();

  try {
    showLoading();

    const response = await getDeletedServicesDetailsByService(serviceId);
    if (response && 'error' in response) throw new Error(response.error);

    const { serviceDetails } = response;

    return serviceDetails;
  } catch (error: any) {
    throw createError(error.message);
  } finally {
    hideLoading();
  }
}

export async function fetchGetServiceDetail(id: string): Promise<ServiceDetail> {
  const { showLoading, hideLoading } = useUiStore.getState();

  try {
    showLoading();

    const response = await getServiceDetail(id);
    if (response && 'error' in response) throw new Error(response.error);

    const { serviceDetail } = response;

    return serviceDetail;
  } catch (error: any) {
    throw createError(error.message);
  } finally {
    hideLoading();
  }
}

export async function fetchCreateServiceDetail(data: ServiceDetail): Promise<ServiceDetail> {
  const { showLoading, hideLoading } = useUiStore.getState();

  try {
    showLoading();

    const response = await createServiceDetail(data);
    if (response && 'error' in response) throw new Error(response.error);

    const { serviceDetail } = response;

    return serviceDetail;
  } catch (error: any) {
    throw createError(error.message);
  } finally {
    hideLoading();
  }
}

export async function fetchUpdateServiceDetail(id: string, data: ServiceDetail): Promise<ServiceDetail> {
  const { showLoading, hideLoading } = useUiStore.getState();

  try {
    showLoading();

    const response = await updateServiceDetail(id, { ...data });
    if (response && 'error' in response) throw new Error(response.error);

    const { serviceDetail } = response;

    return serviceDetail;
  } catch (error: any) {
    throw createError(error.message);
  } finally {
    hideLoading();
  }
}

export async function fetchDeleteServiceDetail(id: string): Promise<boolean> {
  const { showLoading, hideLoading } = useUiStore.getState();

  try {
    showLoading();

    const response = await deleteServiceDetail(id);
    if (response && 'error' in response) throw new Error(response.error);

    const { message } = response;

    return !!message;
  } catch (error: any) {
    throw createError(error.message);
  } finally {
    hideLoading();
  }
}

export async function fetchRestoreServiceDetail(id: string): Promise<boolean> {
  const { showLoading, hideLoading } = useUiStore.getState();

  try {
    showLoading();

    const response = await restoreServiceDetail(id);
    if (response && 'error' in response) throw new Error(response.error);

    const { serviceDetail } = response;

    return !!serviceDetail;
  } catch (error: any) {
    throw createError(error.message);
  } finally {
    hideLoading();
  }
}
