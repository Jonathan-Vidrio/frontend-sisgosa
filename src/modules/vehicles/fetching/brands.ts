import { VehicleBrand } from '@/interfaces';
import { useModalStore, useUiStore, useVehiclesStore } from '@/store';
import { createError } from '@/helpers';
import {
  createVehicleBrand,
  deleteVehicleBrand,
  getDeletedVehicleBrands,
  getVehicleBrand,
  getVehicleBrands,
  restoreVehicleBrand,
  updateVehicleBrand,
} from '@/app/lib/actions/vehicles/brands';

export async function fetchGetVehicleBrands(): Promise<void> {
  const { showLoading, hideLoading } = useUiStore.getState();
  const { setBrands } = useVehiclesStore.getState();

  try {
    showLoading();

    const response = await getVehicleBrands();
    if (!response) return;
    if ('error' in response) throw new Error(response.error);

    const { vehicleBrands } = response;

    setBrands(vehicleBrands);
  } catch (error: any) {
    throw createError(error.message);
  } finally {
    hideLoading();
  }
}

export async function fetchGetDeletedVehicleBrands(): Promise<void> {
  const { showLoading, hideLoading } = useUiStore.getState();
  const { setBrands } = useVehiclesStore.getState();

  try {
    showLoading();

    const response = await getDeletedVehicleBrands();
    if (response && 'error' in response) throw new Error(response.error);

    const { vehicleBrands } = response;

    setBrands(vehicleBrands);
  } catch (error: any) {
    throw createError(error.message);
  } finally {
    hideLoading();
  }
}

export async function fetchGetVehicleBrand(id: string): Promise<VehicleBrand> {
  const { showLoading, hideLoading } = useUiStore.getState();

  try {
    showLoading();

    const response = await getVehicleBrand(id);
    if (response && 'error' in response) throw new Error(response.error);

    const { brand } = response;

    return brand;
  } catch (error: any) {
    throw createError(error.message);
  } finally {
    hideLoading();
  }
}

export async function fetchCreateVehicleBrand(data: VehicleBrand): Promise<VehicleBrand> {
  const { showLoading, hideLoading } = useUiStore.getState();
  const { openModal, setChildren, setIsSuccess } = useModalStore.getState();

  try {
    showLoading();

    const response = await createVehicleBrand(data);
    if (response && 'error' in response) throw new Error(response.error);

    const { brand } = response;

    setIsSuccess();
    setChildren(`Brand ${brand.description} has been created.`);
    openModal();

    await fetchGetVehicleBrands();

    return brand;
  } catch (error: any) {
    throw createError(error.message);
  } finally {
    hideLoading();
  }
}

export async function fetchUpdateVehicleBrand(id: string, data: VehicleBrand): Promise<VehicleBrand> {
  const { showLoading, hideLoading } = useUiStore.getState();
  const { openModal, setChildren, setIsSuccess } = useModalStore.getState();

  try {
    showLoading();

    const response = await updateVehicleBrand(id, { ...data });
    if (response && 'error' in response) throw new Error(response.error);

    const { brand } = response;

    setIsSuccess();
    setChildren(`Brand ${brand.description} has been updated.`);
    openModal();

    await fetchGetVehicleBrands();

    return brand;
  } catch (error: any) {
    throw createError(error.message);
  } finally {
    hideLoading();
  }
}

export async function fetchDeleteVehicleBrand(id: string): Promise<boolean> {
  const { showLoading, hideLoading } = useUiStore.getState();
  const { openModal, setChildren, setIsSuccess } = useModalStore.getState();

  try {
    showLoading();

    const response = await deleteVehicleBrand(id);
    if (response && 'error' in response) throw new Error(response.error);

    const { message } = response;

    setIsSuccess();
    setChildren(message);
    openModal();

    await fetchGetVehicleBrands();

    return !!message;
  } catch (error: any) {
    throw createError(error.message);
  } finally {
    hideLoading();
  }
}

export async function fetchRestoreVehicleBrand(id: string): Promise<boolean> {
  const { showLoading, hideLoading } = useUiStore.getState();
  const { openModal, setChildren, setIsSuccess } = useModalStore.getState();

  try {
    showLoading();

    const response = await restoreVehicleBrand(id);
    if (response && 'error' in response) throw new Error(response.error);

    const { vehicleBrand } = response;

    setIsSuccess();
    setChildren(`Brand ${vehicleBrand.description} has been restored.`);
    openModal();

    await fetchGetVehicleBrands();

    return !!vehicleBrand;
  } catch (error: any) {
    throw createError(error.message);
  } finally {
    hideLoading();
  }
}
