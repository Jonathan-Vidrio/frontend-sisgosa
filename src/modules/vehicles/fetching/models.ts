import { useModalStore, useUiStore, useVehiclesStore } from '@/store';
import { createError } from '@/helpers';
import { VehicleModel } from '@/interfaces';
import {
  createVehicleModel,
  deleteVehicleModel,
  getDeletedVehicleModels,
  getVehicleModel,
  getVehicleModels,
  restoreVehicleModel,
  updateVehicleModel,
} from '@/app/lib/actions/vehicles/models';

export async function fetchGetVehicleModels(): Promise<void> {
  const { showLoading, hideLoading } = useUiStore.getState();
  const { setModels } = useVehiclesStore.getState();

  try {
    showLoading();

    const response = await getVehicleModels();
    if (!response) return;
    if ('error' in response) throw new Error(response.error);

    const { vehicleModels } = response;

    setModels(vehicleModels);
  } catch (error: any) {
    throw createError(error.message);
  } finally {
    hideLoading();
  }
}

export async function fetchGetDeletedVehicleModels(): Promise<void> {
  const { showLoading, hideLoading } = useUiStore.getState();
  const { setModels } = useVehiclesStore.getState();

  try {
    showLoading();

    const response = await getDeletedVehicleModels();
    if (response && 'error' in response) throw new Error(response.error);

    const { vehicleModels } = response;

    setModels(vehicleModels);
  } catch (error: any) {
    throw createError(error.message);
  } finally {
    hideLoading();
  }
}

export async function fetchGetVehicleModel(id: string): Promise<VehicleModel> {
  const { showLoading, hideLoading } = useUiStore.getState();

  try {
    showLoading();

    const response = await getVehicleModel(id);
    if (response && 'error' in response) throw new Error(response.error);

    const { vehicleModel } = response;

    return vehicleModel;
  } catch (error: any) {
    throw createError(error.message);
  } finally {
    hideLoading();
  }
}

export async function fetchCreateVehicleModel(data: VehicleModel): Promise<VehicleModel> {
  const { showLoading, hideLoading } = useUiStore.getState();
  const { openModal, setChildren, setIsSuccess } = useModalStore.getState();

  try {
    showLoading();

    const response = await createVehicleModel({ ...data });
    if (response && 'error' in response) throw new Error(response.error);

    const { vehicleModel } = response;

    setIsSuccess();
    setChildren(`Vehicle model ${vehicleModel.description} has been created.`);
    openModal();

    await fetchGetVehicleModels();

    return vehicleModel;
  } catch (error: any) {
    throw createError(error.message);
  } finally {
    hideLoading();
  }
}

export async function fetchUpdateVehicleModel(id: string, data: VehicleModel): Promise<VehicleModel> {
  const { showLoading, hideLoading } = useUiStore.getState();
  const { openModal, setChildren, setIsSuccess } = useModalStore.getState();

  try {
    showLoading();

    const response = await updateVehicleModel(id, { ...data });
    if (response && 'error' in response) throw new Error(response.error);

    const { vehicleModel } = response;

    setIsSuccess();
    setChildren(`Vehicle model ${vehicleModel.description} has been updated.`);
    openModal();

    await fetchGetVehicleModels();

    return vehicleModel;
  } catch (error: any) {
    throw createError(error.message);
  } finally {
    hideLoading();
  }
}

export async function fetchDeleteVehicleModel(id: string): Promise<boolean> {
  const { showLoading, hideLoading } = useUiStore.getState();
  const { openModal, setChildren, setIsSuccess } = useModalStore.getState();

  try {
    showLoading();

    const response = await deleteVehicleModel(id);
    if (response && 'error' in response) throw new Error(response.error);

    const { message } = response;

    setIsSuccess();
    setChildren('Vehicle model has been deleted.');
    openModal();

    await fetchGetVehicleModels();

    return !!message;
  } catch (error: any) {
    throw createError(error.message);
  } finally {
    hideLoading();
  }
}

export async function fetchRestoreVehicleModel(id: string): Promise<boolean> {
  const { showLoading, hideLoading } = useUiStore.getState();
  const { openModal, setChildren, setIsSuccess } = useModalStore.getState();

  try {
    showLoading();

    const response = await restoreVehicleModel(id);
    if (response && 'error' in response) throw new Error(response.error);

    const { vehicleModel } = response;

    setIsSuccess();
    setChildren(`Vehicle model ${vehicleModel.description} has been restored.`);
    openModal();

    await fetchGetVehicleModels();

    return !!vehicleModel;
  } catch (error: any) {
    throw createError(error.message);
  } finally {
    hideLoading();
  }
}
