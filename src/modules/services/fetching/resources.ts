import { useUiStore } from '@/store';
import { createError } from '@/helpers';
import { Resource } from '@/interfaces';
import {
  createResource,
  deleteResource,
  getResource,
  getResourcesByService,
  restoreResource,
  updateResource,
} from '@/app/lib/actions/services/resources';
import { uploadImage } from '@/app/lib/actions/image/image';

export async function fetchGetResourcesByService(serviceId: string): Promise<Resource[]> {
  const { showLoading, hideLoading } = useUiStore.getState();

  try {
    showLoading();

    const response = await getResourcesByService(serviceId);
    if (response && 'error' in response) throw new Error(response.error);

    const { resources } = response;

    return resources;
  } catch (error: any) {
    throw createError(error.message);
  } finally {
    hideLoading();
  }
}

export async function fetchGetResource(id: string): Promise<Resource> {
  const { showLoading, hideLoading } = useUiStore.getState();

  try {
    showLoading();

    const response = await getResource(id);
    if (response && 'error' in response) throw new Error(response.error);

    const { resource } = response;

    return resource;
  } catch (error: any) {
    throw createError(error.message);
  } finally {
    hideLoading();
  }
}

export async function fetchCreateResource(data: Resource): Promise<Resource> {
  const { showLoading, hideLoading } = useUiStore.getState();

  try {
    showLoading();

    const image = data.image ? await uploadImage(data.image as File, 'resources') : undefined;
    console.log({ ...data, image });

    const response = await createResource({ ...data, image });
    if (response && 'error' in response) throw new Error(response.error);

    const { resource } = response;

    return resource;
  } catch (error: any) {
    throw createError(error.message);
  } finally {
    hideLoading();
  }
}

export async function fetchUpdateResource(id: string, data: Resource): Promise<Resource> {
  const { showLoading, hideLoading } = useUiStore.getState();

  try {
    showLoading();

    const image = data.image ? await uploadImage(data.image as File, 'resources') : undefined;

    const response = await updateResource(id, { ...data, image });
    if (response && 'error' in response) throw new Error(response.error);

    const { resource } = response;

    return resource;
  } catch (error: any) {
    throw createError(error.message);
  } finally {
    hideLoading();
  }
}

export async function fetchDeleteResource(id: string): Promise<boolean> {
  const { showLoading, hideLoading } = useUiStore.getState();

  try {
    showLoading();

    const response = await deleteResource(id);
    if (response && 'error' in response) throw new Error(response.error);

    const { message } = response;

    return !!message;
  } catch (error: any) {
    throw createError(error.message);
  } finally {
    hideLoading();
  }
}

export async function fetchRestoreResource(id: string): Promise<boolean> {
  const { showLoading, hideLoading } = useUiStore.getState();

  try {
    showLoading();

    const response = await restoreResource(id);
    if (response && 'error' in response) throw new Error(response.error);

    const { resource } = response;

    return !!resource;
  } catch (error: any) {
    throw createError(error.message);
  } finally {
    hideLoading();
  }
}
